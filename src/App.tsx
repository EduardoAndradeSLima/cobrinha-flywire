import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  FlyWireLIFEngine,
  type ActiveSynapsePulse,
  type NeuronDynamicState,
} from './bio/lifEngine'
import {
  advanceSnakeGame,
  computeConventionalAIMove,
  createInitialGameState,
  rotateLeft,
  rotateRight,
  type SnakeGameState,
} from './game/snakeEngine'
import type {
  ControllerComparisonMetrics,
  Direction,
  SimulationConfig,
} from './game/types'
import { SnakeCanvas } from './components/SnakeCanvas'
import { ConnectomeVisualizer } from './components/ConnectomeVisualizer'
import { SimpleCardsPanel } from './components/SimpleCardsPanel'
import { ScientificArticlePtBr } from './components/ScientificArticlePtBr'

const GRID_COLS = 17
const GRID_ROWS = 15

interface BioSnapshot {
  states: Record<string, NeuronDynamicState>
  activePulses: ActiveSynapsePulse[]
}

function cloneNeuronStates(
  source: Record<string, NeuronDynamicState>
): Record<string, NeuronDynamicState> {
  const copy: Record<string, NeuronDynamicState> = {}
  for (const key of Object.keys(source)) {
    const item = source[key]
    copy[key] = {
      ...item,
      historyV: [...item.historyV],
    }
  }
  return copy
}

function playEatSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.09)
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.1)
  } catch {
    // Ignore audio context restrictions
  }
}

export function App() {
  const lifEngineRef = useRef<FlyWireLIFEngine>(new FlyWireLIFEngine())

  useEffect(() => {
    void lifEngineRef.current.init()
  }, [])

  const [gameState, setGameState] = useState<SnakeGameState>(() =>
    createInitialGameState(GRID_COLS, GRID_ROWS, 6, 1)
  )
  const gameStateRef = useRef<SnakeGameState>(gameState)
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  const [isRunning, setIsRunning] = useState<boolean>(true)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [selectedNeuronId, setSelectedNeuronId] = useState<string>('DNa02_L')

  const [bioSnapshot, setBioSnapshot] = useState<BioSnapshot>(() => {
    const initialEngine = new FlyWireLIFEngine()
    return {
      states: cloneNeuronStates(initialEngine.states),
      activePulses: [],
    }
  })

  const [config, setConfig] = useState<SimulationConfig>({
    mode: 'BIO_PILOT',
    speedMs: 80,
    giantFiberEnabled: true,
    gabaInhibitionGain: 1.0,
    synapticNoise: 0.3,
    olfactorySensitivity: 1.2,
  })

  const [neuralMetrics, setNeuralMetrics] = useState<ControllerComparisonMetrics>({
    episodes: 0,
    totalScore: 0,
    bestScore: 0,
    totalSteps: 0,
    collisions: 0,
    lastDecisionMs: 0.25,
  })

  const [conventionalMetrics, setConventionalMetrics] =
    useState<ControllerComparisonMetrics>({
      episodes: 0,
      totalScore: 0,
      bestScore: 0,
      totalSteps: 0,
      collisions: 0,
      lastDecisionMs: 0.05,
    })

  const manualDirectionQueueRef = useRef<Direction | null>(null)

  const updateConfig = useCallback((partial: Partial<SimulationConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }))
  }, [])

  const executeStep = useCallback(() => {
    const currentGame = gameStateRef.current
    if (currentGame.isGameOver) {
      return
    }

    const t0 = performance.now()
    const engine = lifEngineRef.current
    const head = currentGame.snake[0]

    // 1. Tradução sensorial retinotópica (LC10a / LC4 / LPLC2) e integração neural de 3.189 neurônios
    const readout = engine.stepConnectome(
      head,
      currentGame.direction,
      currentGame.food,
      currentGame.snake,
      currentGame.gridCols,
      currentGame.gridRows,
      config
    )

    setBioSnapshot({
      states: cloneNeuronStates(engine.states),
      activePulses: [...engine.activePulses],
    })

    // 2. Escolha de movimento conforme o controlador ativo
    let nextDir: Direction = currentGame.direction

    if (config.mode === 'MANUAL' && manualDirectionQueueRef.current) {
      const requested = manualDirectionQueueRef.current
      manualDirectionQueueRef.current = null
      const isOpposite =
        (currentGame.direction === 'UP' && requested === 'DOWN') ||
        (currentGame.direction === 'DOWN' && requested === 'UP') ||
        (currentGame.direction === 'LEFT' && requested === 'RIGHT') ||
        (currentGame.direction === 'RIGHT' && requested === 'LEFT')
      if (!isOpposite) {
        nextDir = requested
      }
    } else if (config.mode === 'CONVENTIONAL_AI') {
      nextDir = computeConventionalAIMove(currentGame)
    } else if (config.mode === 'BIO_PILOT') {
      if (readout.motorCommand === 'TURN_LEFT') {
        nextDir = rotateLeft(currentGame.direction)
      } else if (readout.motorCommand === 'TURN_RIGHT') {
        nextDir = rotateRight(currentGame.direction)
      }
    }

    const decisionTimeMs = Math.max(0.02, performance.now() - t0)

    // 3. Avança a Cobrinha
    const { nextState, ateFood, died } = advanceSnakeGame(currentGame, nextDir)
    gameStateRef.current = nextState
    setGameState(nextState)

    // 4. Atualiza métricas do controlador ativo
    if (config.mode === 'CONVENTIONAL_AI') {
      setConventionalMetrics((prev) => ({
        episodes: died ? prev.episodes + 1 : prev.episodes,
        totalScore: died ? prev.totalScore + nextState.score : prev.totalScore,
        bestScore: Math.max(prev.bestScore, nextState.score),
        totalSteps: prev.totalSteps + 1,
        collisions: died ? prev.collisions + 1 : prev.collisions,
        lastDecisionMs: decisionTimeMs,
      }))
    } else if (config.mode === 'BIO_PILOT') {
      setNeuralMetrics((prev) => ({
        episodes: died ? prev.episodes + 1 : prev.episodes,
        totalScore: died ? prev.totalScore + nextState.score : prev.totalScore,
        bestScore: Math.max(prev.bestScore, nextState.score),
        totalSteps: prev.totalSteps + 1,
        collisions: died ? prev.collisions + 1 : prev.collisions,
        lastDecisionMs: decisionTimeMs,
      }))
    }

    if (ateFood) {
      if (soundEnabled) {
        playEatSound()
      }
      if (nextState.score > 0 && nextState.score % 10 === 0) {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.7 },
        })
      }
    }
  }, [config, soundEnabled])

  // Loop de Simulação
  useEffect(() => {
    if (!isRunning || gameState.isGameOver) return

    const timer = window.setInterval(() => {
      executeStep()
    }, config.speedMs)

    return () => window.clearInterval(timer)
  }, [isRunning, gameState.isGameOver, config.speedMs, executeStep])

  // Reinício automático após colisão
  useEffect(() => {
    if (!gameState.isGameOver || !isRunning) return

    const restartTimer = window.setTimeout(() => {
      lifEngineRef.current.reset()
      const freshGame = createInitialGameState(
        GRID_COLS,
        GRID_ROWS,
        gameStateRef.current.highScore,
        gameStateRef.current.episodes + 1
      )
      gameStateRef.current = freshGame
      setGameState(freshGame)
      setBioSnapshot({
        states: cloneNeuronStates(lifEngineRef.current.states),
        activePulses: [],
      })
    }, 1100)

    return () => window.clearTimeout(restartTimer)
  }, [gameState.isGameOver, isRunning])

  // Controle por teclado no modo manual
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        manualDirectionQueueRef.current = 'UP'
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        manualDirectionQueueRef.current = 'RIGHT'
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault()
        manualDirectionQueueRef.current = 'DOWN'
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        manualDirectionQueueRef.current = 'LEFT'
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleReset = () => {
    lifEngineRef.current.reset()
    const freshGame = createInitialGameState(
      GRID_COLS,
      GRID_ROWS,
      gameStateRef.current.highScore,
      gameStateRef.current.episodes + 1
    )
    gameStateRef.current = freshGame
    setGameState(freshGame)
    setBioSnapshot({
      states: cloneNeuronStates(lifEngineRef.current.states),
      activePulses: [],
    })
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#3a5f22] text-white grid grid-cols-1 lg:grid-cols-12">
      {/* LADO ESQUERDO: Apenas o Jogo Google Snake */}
      <div className="lg:col-span-6 h-full overflow-y-auto px-4 py-6 sm:px-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#2c471a]">
        <div className="w-full max-w-[640px] my-auto">
          <SnakeCanvas
            gameState={gameState}
            isRunning={isRunning}
            onToggleRun={() => setIsRunning((r) => !r)}
            onReset={handleReset}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((s) => !s)}
          />
        </div>
      </div>

      {/* LADO DIREITO: Os 4 Cards + Artigo do Eduardo */}
      <div className="lg:col-span-6 h-full overflow-y-auto bg-[#33541d] px-4 py-6 sm:px-6 space-y-5">
        {/* Card 1: Visualização neural */}
        <ConnectomeVisualizer
          states={bioSnapshot.states}
          activePulses={bioSnapshot.activePulses}
          selectedNeuronId={selectedNeuronId}
          onSelectNeuron={setSelectedNeuronId}
          giantFiberEnabled={config.giantFiberEnabled}
        />

        {/* Cards 2, 3 e 4: Comparação de controladores, Experimentos e Métricas */}
        <SimpleCardsPanel
          gameState={gameState}
          isRunning={isRunning}
          onToggleRun={() => setIsRunning((r) => !r)}
          onStepOnce={executeStep}
          onReset={handleReset}
          config={config}
          onUpdateConfig={updateConfig}
          neuralMetrics={neuralMetrics}
          conventionalMetrics={conventionalMetrics}
        />

        {/* Artigo do projeto no final */}
        <ScientificArticlePtBr />
      </div>
    </div>
  )
}

export default App
