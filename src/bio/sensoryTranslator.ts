import type { Direction, Point } from '../game/types'

export interface SensoryReadout {
  externalCurrents: Record<string, number>
  egocentricSteeringDrive: {
    leftDrive: number
    rightDrive: number
    forwardDrive: number
  }
  telemetry: {
    odorAngleDeg: number
    headingDeg: number
    headingErrorDeg: number
    dangerAhead: number
    dangerLeft: number
    dangerRight: number
    freeSpaceAhead: number
    freeSpaceLeft: number
    freeSpaceRight: number
  }
}

const DIR_VECTORS: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
}

const LEFT_TURN_MAP: Record<Direction, Direction> = {
  UP: 'LEFT',
  LEFT: 'DOWN',
  DOWN: 'RIGHT',
  RIGHT: 'UP',
}

const RIGHT_TURN_MAP: Record<Direction, Direction> = {
  UP: 'RIGHT',
  RIGHT: 'DOWN',
  DOWN: 'LEFT',
  LEFT: 'UP',
}

function measureOpenSpace(
  start: Point,
  snakeBody: Point[],
  gridCols: number,
  gridRows: number,
  maxDepth: number = 120
): number {
  if (
    start.x < 0 ||
    start.x >= gridCols ||
    start.y < 0 ||
    start.y >= gridRows
  ) {
    return 0
  }

  const blocked = new Set<string>()
  for (let i = 0; i < snakeBody.length - 1; i++) {
    blocked.add(`${snakeBody[i].x},${snakeBody[i].y}`)
  }

  const startKey = `${start.x},${start.y}`
  if (blocked.has(startKey)) {
    return 0
  }

  const visited = new Set<string>([startKey])
  const queue: Point[] = [start]
  let count = 0

  while (queue.length > 0 && count < maxDepth) {
    const curr = queue.shift()!
    count++

    const neighbors = [
      { x: curr.x, y: curr.y - 1 },
      { x: curr.x + 1, y: curr.y },
      { x: curr.x, y: curr.y + 1 },
      { x: curr.x - 1, y: curr.y },
    ]

    for (const nb of neighbors) {
      if (nb.x < 0 || nb.x >= gridCols || nb.y < 0 || nb.y >= gridRows) continue
      const key = `${nb.x},${nb.y}`
      if (!blocked.has(key) && !visited.has(key)) {
        visited.add(key)
        queue.push(nb)
      }
    }
  }

  return count
}

export function computeSensoryInputs(
  head: Point,
  direction: Direction,
  food: Point,
  snakeBody: Point[],
  gridCols: number,
  gridRows: number = gridCols
): SensoryReadout {
  const currents: Record<string, number> = {
    ORN_North: 0,
    ORN_East: 0,
    ORN_South: 0,
    ORN_West: 0,
    LC4_Ahead: 0,
    LC4_Left: 0,
    LC4_Right: 0,
    EPG_0: 0,
    EPG_90: 0,
    EPG_180: 0,
    EPG_270: 0,
  }

  // 1. Bússola Interna EPG
  let headingDeg = 0
  if (direction === 'UP') {
    currents.EPG_0 = 32
    headingDeg = 0
  } else if (direction === 'RIGHT') {
    currents.EPG_90 = 32
    headingDeg = 90
  } else if (direction === 'DOWN') {
    currents.EPG_180 = 32
    headingDeg = 180
  } else {
    currents.EPG_270 = 32
    headingDeg = 270
  }

  // 2. Distância Projetada nas Coordenadas da Cabeça (Frente, Esquerda, Direita)
  const dx = food.x - head.x
  const dy = food.y - head.y

  const fwdVec = DIR_VECTORS[direction]
  const leftDir = LEFT_TURN_MAP[direction]
  const rightDir = RIGHT_TURN_MAP[direction]
  const leftVec = DIR_VECTORS[leftDir]
  const rightVec = DIR_VECTORS[rightDir]

  const forwardSteps = dx * fwdVec.x + dy * fwdVec.y
  const leftSteps = dx * leftVec.x + dy * leftVec.y
  const rightSteps = dx * rightVec.x + dy * rightVec.y

  // 3. Detecção Visual de Colisão ou Bolsão Fechado (Neurônios LC4)
  const posAhead = { x: head.x + fwdVec.x, y: head.y + fwdVec.y }
  const posLeft = { x: head.x + leftVec.x, y: head.y + leftVec.y }
  const posRight = { x: head.x + rightVec.x, y: head.y + rightVec.y }

  const requiredSpace = snakeBody.length + 2
  const maxSpace = Math.max(45, requiredSpace + 15)
  const freeAhead = measureOpenSpace(posAhead, snakeBody, gridCols, gridRows, maxSpace)
  const freeLeft = measureOpenSpace(posLeft, snakeBody, gridCols, gridRows, maxSpace)
  const freeRight = measureOpenSpace(posRight, snakeBody, gridCols, gridRows, maxSpace)

  // Só considera perigoso se bater imediatamente (0 células) ou se entrar em um laço fechado menor que o próprio corpo!
  const calcDanger = (freeCells: number): number => {
    if (freeCells === 0) return 1.0
    if (freeCells < requiredSpace) {
      return 0.85
    }
    return 0
  }

  const dangerAhead = calcDanger(freeAhead)
  let dangerLeft = calcDanger(freeLeft)
  let dangerRight = calcDanger(freeRight)

  // Se ambos os lados são armadilhas fechadas, libera o lado que tiver mais espaço para sobreviver mais tempo
  if (dangerAhead >= 0.8 && dangerLeft >= 0.8 && dangerRight >= 0.8) {
    if (freeLeft >= freeRight && freeLeft > 0) {
      dangerLeft = 0.2
    } else if (freeRight > 0) {
      dangerRight = 0.2
    }
  }

  currents.LC4_Ahead = dangerAhead * 55
  currents.LC4_Left = dangerLeft * 55
  currents.LC4_Right = dangerRight * 55

  // 4. Quimiotaxia Direta e Sem Desvios Falsos
  let leftDrive = 0
  let rightDrive = 0
  let forwardDrive = 0

  if (forwardSteps > 0 && dangerAhead < 0.5) {
    // A maçã está à frente (ou na diagonal à frente) e o caminho reto está livre: vai reto até alinhar!
    currents.ORN_North = 42
    forwardDrive = 42
  } else if (forwardSteps === 0) {
    // Alinhou na linha ou coluna exata da maçã! Vira 90° direto para a maçã:
    if (leftSteps > 0 && dangerLeft < 0.5) {
      currents.ORN_West = 44
      leftDrive = 44
    } else if (rightSteps > 0 && dangerRight < 0.5) {
      currents.ORN_East = 44
      rightDrive = 44
    } else if (dangerAhead < 0.5) {
      currents.ORN_North = 38
      forwardDrive = 38
    } else if (freeLeft >= freeRight && freeLeft > 0) {
      currents.ORN_West = 40
      leftDrive = 40
    } else {
      currents.ORN_East = 40
      rightDrive = 40
    }
  } else {
    // Ou a maçã ficou para trás (forwardSteps < 0), ou há um obstáculo bem à frente (dangerAhead >= 0.5):
    // Vira imediatamente para o lado da maçã (se seguro) ou para o lado mais aberto!
    if (forwardSteps < 0) {
      currents.ORN_South = 32
    }
    if (leftSteps > 0 && dangerLeft < 0.5) {
      currents.ORN_West = 44
      leftDrive = 44
    } else if (rightSteps > 0 && dangerRight < 0.5) {
      currents.ORN_East = 44
      rightDrive = 44
    } else if (freeLeft > freeRight && dangerLeft < 0.5) {
      currents.ORN_West = 40
      leftDrive = 40
    } else if (dangerRight < 0.5) {
      currents.ORN_East = 40
      rightDrive = 40
    } else if (freeLeft >= freeRight && freeLeft > 0) {
      currents.ORN_West = 38
      leftDrive = 38
    } else {
      currents.ORN_East = 38
      rightDrive = 38
    }
  }

  const odorRad = Math.atan2(dx, -dy)
  const odorAngleDeg = ((odorRad * 180) / Math.PI + 360) % 360
  let headingErrorDeg = odorAngleDeg - headingDeg
  if (headingErrorDeg > 180) headingErrorDeg -= 360
  if (headingErrorDeg < -180) headingErrorDeg += 360

  return {
    externalCurrents: currents,
    egocentricSteeringDrive: {
      leftDrive,
      rightDrive,
      forwardDrive,
    },
    telemetry: {
      odorAngleDeg: Math.round(odorAngleDeg),
      headingDeg,
      headingErrorDeg: Math.round(headingErrorDeg),
      dangerAhead,
      dangerLeft,
      dangerRight,
      freeSpaceAhead: freeAhead,
      freeSpaceLeft: freeLeft,
      freeSpaceRight: freeRight,
    },
  }
}
