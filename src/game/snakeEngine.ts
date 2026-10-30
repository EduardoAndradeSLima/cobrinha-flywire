import type { Direction, Point } from './types'

export interface SnakeGameState {
  gridCols: number
  gridRows: number
  snake: Point[]
  direction: Direction
  food: Point
  score: number
  highScore: number
  episodes: number
  stepsThisEpisode: number
  stepsSinceLastFood: number
  isGameOver: boolean
  deathReason: string | null
}

const DIR_DELTAS: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
}

export function rotateLeft(dir: Direction): Direction {
  switch (dir) {
    case 'UP':
      return 'LEFT'
    case 'LEFT':
      return 'DOWN'
    case 'DOWN':
      return 'RIGHT'
    case 'RIGHT':
      return 'UP'
  }
}

export function rotateRight(dir: Direction): Direction {
  switch (dir) {
    case 'UP':
      return 'RIGHT'
    case 'RIGHT':
      return 'DOWN'
    case 'DOWN':
      return 'LEFT'
    case 'LEFT':
      return 'UP'
  }
}

/**
 * IA Convencional baseada em BFS + área alcançável (GreedyAgent de bugrax/flybrain-snake/flysnake/baselines.py)
 * para comparação direta com o modelo neural FlyWire.
 */
export function computeConventionalAIMove(state: SnakeGameState): Direction {
  const head = state.snake[0]
  const cols = state.gridCols
  const rows = state.gridRows
  const foodKey = `${state.food.x},${state.food.y}`

  const blocked = new Set<string>()
  for (let i = 0; i < state.snake.length - 1; i++) {
    blocked.add(`${state.snake[i].x},${state.snake[i].y}`)
  }

  const reachableArea = (start: Point, customBlocked: Set<string>, limit: number): number => {
    const startKey = `${start.x},${start.y}`
    if (customBlocked.has(startKey)) return 0
    const seen = new Set<string>([startKey])
    const queue: Point[] = [start]
    while (queue.length > 0 && seen.size < limit) {
      const cur = queue.shift()!
      for (const dir of ['UP', 'RIGHT', 'DOWN', 'LEFT'] as Direction[]) {
        const d = DIR_DELTAS[dir]
        const nx = cur.x + d.x
        const ny = cur.y + d.y
        const k = `${nx},${ny}`
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !customBlocked.has(k) && !seen.has(k)) {
          seen.add(k)
          queue.push({ x: nx, y: ny })
        }
      }
    }
    return seen.size
  }

  // 1. BFS para encontrar o menor caminho até a maçã
  const prev = new Map<string, Point | null>()
  const headKey = `${head.x},${head.y}`
  prev.set(headKey, null)
  const q: Point[] = [head]

  while (q.length > 0) {
    const cur = q.shift()!
    const curKey = `${cur.x},${cur.y}`
    if (curKey === foodKey) break
    for (const dir of ['UP', 'RIGHT', 'DOWN', 'LEFT'] as Direction[]) {
      const d = DIR_DELTAS[dir]
      const nx = cur.x + d.x
      const ny = cur.y + d.y
      const k = `${nx},${ny}`
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !blocked.has(k) && !prev.has(k)) {
        prev.set(k, cur)
        q.push({ x: nx, y: ny })
      }
    }
  }

  const possibleDirs: Direction[] = [
    state.direction,
    rotateLeft(state.direction),
    rotateRight(state.direction),
  ]

  if (prev.has(foodKey)) {
    let cur: Point = state.food
    while (true) {
      const p = prev.get(`${cur.x},${cur.y}`)
      if (!p || (p.x === head.x && p.y === head.y)) break
      cur = p
    }
    const afterBlocked = new Set<string>(blocked)
    afterBlocked.add(`${head.x},${head.y}`)
    const area = reachableArea(cur, afterBlocked, state.snake.length + 6)
    if (area >= state.snake.length) {
      for (const dir of possibleDirs) {
        const d = DIR_DELTAS[dir]
        if (head.x + d.x === cur.x && head.y + d.y === cur.y) {
          return dir
        }
      }
    }
  }

  // 2. Fallback: escolhe o movimento seguro com maior área livre alcançável
  let bestDir = state.direction
  let bestScore = -Infinity

  for (const dir of possibleDirs) {
    const delta = DIR_DELTAS[dir]
    const nx = head.x + delta.x
    const ny = head.y + delta.y
    const k = `${nx},${ny}`

    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows || blocked.has(k)) {
      continue
    }

    const afterBlocked = new Set<string>(blocked)
    afterBlocked.add(`${head.x},${head.y}`)
    const area = reachableArea({ x: nx, y: ny }, afterBlocked, cols * rows)
    const manhattan = Math.abs(state.food.x - nx) + Math.abs(state.food.y - ny)
    const score = area * 100 - manhattan
    if (score > bestScore) {
      bestScore = score
      bestDir = dir
    }
  }

  return bestDir
}

export function spawnFood(
  snake: Point[],
  gridCols: number,
  gridRows: number
): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`))
  const candidates: Point[] = []

  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      if (!occupied.has(`${x},${y}`)) {
        candidates.push({ x, y })
      }
    }
  }

  if (candidates.length === 0) {
    return { x: 0, y: 0 }
  }
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function createInitialGameState(
  gridCols: number = 17,
  gridRows: number = 15,
  highScore: number = 6,
  episodes: number = 1
): SnakeGameState {
  const cy = Math.floor(gridRows / 2)
  const initialSnake: Point[] = [
    { x: 4, y: cy },
    { x: 3, y: cy },
    { x: 2, y: cy },
  ]

  return {
    gridCols,
    gridRows,
    snake: initialSnake,
    direction: 'RIGHT',
    food: { x: 12, y: cy },
    score: 0,
    highScore,
    episodes,
    stepsThisEpisode: 0,
    stepsSinceLastFood: 0,
    isGameOver: false,
    deathReason: null,
  }
}

export function advanceSnakeGame(
  state: SnakeGameState,
  nextDir: Direction
): {
  nextState: SnakeGameState
  ateFood: boolean
  died: boolean
} {
  if (state.isGameOver) {
    return { nextState: state, ateFood: false, died: false }
  }

  const head = state.snake[0]
  const delta = DIR_DELTAS[nextDir]
  const nextHead: Point = {
    x: head.x + delta.x,
    y: head.y + delta.y,
  }

  if (
    nextHead.x < 0 ||
    nextHead.x >= state.gridCols ||
    nextHead.y < 0 ||
    nextHead.y >= state.gridRows
  ) {
    return {
      nextState: {
        ...state,
        direction: nextDir,
        isGameOver: true,
        deathReason: 'Colisão com a borda',
      },
      ateFood: false,
      died: true,
    }
  }

  const eating = nextHead.x === state.food.x && nextHead.y === state.food.y

  const checkLength = eating ? state.snake.length : state.snake.length - 1
  for (let i = 0; i < checkLength; i++) {
    if (state.snake[i].x === nextHead.x && state.snake[i].y === nextHead.y) {
      return {
        nextState: {
          ...state,
          direction: nextDir,
          isGameOver: true,
          deathReason: 'Colisão com o próprio corpo',
        },
        ateFood: false,
        died: true,
      }
    }
  }

  const newSnake = [nextHead, ...state.snake]
  if (!eating) {
    newSnake.pop()
  }

  const newScore = eating ? state.score + 1 : state.score
  const newHighScore = Math.max(state.highScore, newScore)
  const nextFood = eating
    ? spawnFood(newSnake, state.gridCols, state.gridRows)
    : state.food

  return {
    nextState: {
      ...state,
      snake: newSnake,
      direction: nextDir,
      food: nextFood,
      score: newScore,
      highScore: newHighScore,
      stepsThisEpisode: state.stepsThisEpisode + 1,
      stepsSinceLastFood: eating ? 0 : state.stepsSinceLastFood + 1,
    },
    ateFood: eating,
    died: false,
  }
}
