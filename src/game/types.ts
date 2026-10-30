export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'

export interface Point {
  x: number
  y: number
}

export type ControlMode = 'BIO_PILOT' | 'CONVENTIONAL_AI' | 'MANUAL'

export interface SimulationConfig {
  mode: ControlMode
  speedMs: number
  giantFiberEnabled: boolean
  gabaInhibitionGain: number
  synapticNoise: number
  olfactorySensitivity: number
}

export interface ControllerComparisonMetrics {
  episodes: number
  totalScore: number
  bestScore: number
  totalSteps: number
  collisions: number
  lastDecisionMs: number
}

export interface DecisionLogEntry {
  tick: number
  timestamp: string
  action: 'STRAIGHT' | 'TURN_LEFT' | 'TURN_RIGHT'
  direction: Direction
  dominantNeuron: string
  reason: string
  vLeft: number
  vRight: number
  vForward: number
  reflexTriggered: boolean
}
