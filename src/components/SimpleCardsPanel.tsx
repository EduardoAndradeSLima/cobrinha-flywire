import React from 'react'
import { Play, Pause, RotateCcw, StepForward } from 'lucide-react'
import type { ControllerComparisonMetrics, SimulationConfig } from '../game/types'
import type { SnakeGameState } from '../game/snakeEngine'

interface SimpleCardsPanelProps {
  gameState: SnakeGameState
  isRunning: boolean
  onToggleRun: () => void
  onStepOnce: () => void
  onReset: () => void
  config: SimulationConfig
  onUpdateConfig: (partial: Partial<SimulationConfig>) => void
  neuralMetrics: ControllerComparisonMetrics
  conventionalMetrics: ControllerComparisonMetrics
}

export const SimpleCardsPanel: React.FC<SimpleCardsPanelProps> = ({
  gameState,
  isRunning,
  onToggleRun,
  onStepOnce,
  onReset,
  config,
  onUpdateConfig,
  neuralMetrics,
  conventionalMetrics,
}) => {
  const activeMetrics =
    config.mode === 'CONVENTIONAL_AI' ? conventionalMetrics : neuralMetrics

  const avgScore =
    activeMetrics.episodes > 0
      ? (activeMetrics.totalScore / activeMetrics.episodes).toFixed(1)
      : gameState.score.toFixed(1)

  const neuralAvg =
    neuralMetrics.episodes > 0
      ? (neuralMetrics.totalScore / neuralMetrics.episodes).toFixed(1)
      : '0.0'

  const convAvg =
    conventionalMetrics.episodes > 0
      ? (conventionalMetrics.totalScore / conventionalMetrics.episodes).toFixed(1)
      : '0.0'

  return (
    <div className="space-y-5">
      {/* CARD 2: Comparação de controladores */}
      <section className="bg-[#2c471a] border-2 border-[#4a752c] rounded-sm overflow-hidden shadow-lg">
        <div className="bg-[#4a752c] px-4 py-3 text-white">
          <h2 className="font-display font-semibold text-base">
            Comparação de controladores
          </h2>
          <p className="text-xs text-[#e3f2c9] mt-0.5">
            Colocar lado a lado uma IA convencional e o modelo neural.
          </p>
        </div>

        <div className="p-4 space-y-3">
          {/* Seletor lado a lado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => onUpdateConfig({ mode: 'BIO_PILOT' })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onUpdateConfig({ mode: 'BIO_PILOT' })
                }
              }}
              className={`p-3.5 rounded-sm border-2 transition-colors cursor-pointer ${
                config.mode === 'BIO_PILOT'
                  ? 'bg-[#203612] border-[#aad751]'
                  : 'bg-[#203612]/60 border-[#4a752c] hover:border-white/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-semibold text-sm text-[#aad751]">
                  Modelo Neural (FlyWire)
                </span>
                {config.mode === 'BIO_PILOT' && (
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-[#aad751] text-[#1f3311] font-bold rounded-sm">
                    ATIVO
                  </span>
                )}
              </div>
              <p className="text-xs text-[#d7ecb8] mb-3">
                Decide pelos disparos sinápticos dos 21 neurônios da mosca.
              </p>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-2 border-t border-white/10">
                <div>
                  <span className="text-[10px] text-[#c7e596] block">Recorde</span>
                  <span className="text-white font-semibold">{neuralMetrics.bestScore}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#c7e596] block">Média</span>
                  <span className="text-white font-semibold">{neuralAvg}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#c7e596] block">Colisões</span>
                  <span className="text-white font-semibold">{neuralMetrics.collisions}</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => onUpdateConfig({ mode: 'CONVENTIONAL_AI' })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onUpdateConfig({ mode: 'CONVENTIONAL_AI' })
                }
              }}
              className={`p-3.5 rounded-sm border-2 transition-colors cursor-pointer ${
                config.mode === 'CONVENTIONAL_AI'
                  ? 'bg-[#203612] border-[#fbbc04]'
                  : 'bg-[#203612]/60 border-[#4a752c] hover:border-white/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-semibold text-sm text-[#fbbc04]">
                  IA Convencional
                </span>
                {config.mode === 'CONVENTIONAL_AI' && (
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-[#fbbc04] text-[#1f3311] font-bold rounded-sm">
                    ATIVO
                  </span>
                )}
              </div>
              <p className="text-xs text-[#d7ecb8] mb-3">
                Algoritmo clássico baseado em distância Manhattan direta.
              </p>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-2 border-t border-white/10">
                <div>
                  <span className="text-[10px] text-[#c7e596] block">Recorde</span>
                  <span className="text-white font-semibold">{conventionalMetrics.bestScore}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#c7e596] block">Média</span>
                  <span className="text-white font-semibold">{convAvg}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#c7e596] block">Colisões</span>
                  <span className="text-white font-semibold">{conventionalMetrics.collisions}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                onUpdateConfig({
                  mode: config.mode === 'MANUAL' ? 'BIO_PILOT' : 'MANUAL',
                })
              }
              className="font-mono text-xs text-[#d7ecb8] hover:text-white underline cursor-pointer"
            >
              {config.mode === 'MANUAL'
                ? 'Voltar para controlador automático'
                : 'Ou testar no controle manual (setas do teclado)'}
            </button>
          </div>
        </div>
      </section>

      {/* CARD 3: Experimentos */}
      <section className="bg-[#2c471a] border-2 border-[#4a752c] rounded-sm overflow-hidden shadow-lg">
        <div className="bg-[#4a752c] px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-white">
          <div>
            <h2 className="font-display font-semibold text-base">Experimentos</h2>
            <p className="text-xs text-[#e3f2c9] mt-0.5">
              Alterar estímulos, conexões e parâmetros e observar como o comportamento muda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleRun}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#aad751] text-[#1f3311] font-mono text-xs font-semibold rounded-sm hover:bg-[#b8e264] transition-colors cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pausar
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Rodar
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onStepOnce}
              disabled={isRunning}
              title="Avançar 1 passo"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#203612] border border-white/20 text-white font-mono text-xs rounded-sm disabled:opacity-40 cursor-pointer"
            >
              <StepForward className="w-3.5 h-3.5" /> Passo
            </button>

            <button
              type="button"
              onClick={onReset}
              title="Reiniciar partida"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#203612] border border-white/20 text-white font-mono text-xs rounded-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Resetar
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Conexão de Reflexo */}
          <div className="flex items-center justify-between bg-[#203612] border border-[#4a752c] px-3.5 py-2.5 rounded-sm">
            <div>
              <span className="text-xs font-semibold text-white block">
                Conexões de Reflexo Anticolisão (Fibra Gigante)
              </span>
              <span className="text-[11px] text-[#c7e596]">
                Desative para observar a mosca seguir o cheiro da fruta sem desviar das paredes.
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onUpdateConfig({ giantFiberEnabled: !config.giantFiberEnabled })
              }
              className={`px-3 py-1.5 rounded-sm font-mono text-xs font-semibold cursor-pointer shrink-0 ${
                config.giantFiberEnabled
                  ? 'bg-[#aad751] text-[#1f3311]'
                  : 'bg-[#e7471d] text-white'
              }`}
            >
              {config.giantFiberEnabled ? 'Ativadas' : 'Desativadas'}
            </button>
          </div>

          {/* Sliders de Estímulos e Parâmetros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="exp-olfactory" className="text-[#c7e596]">
                  Estímulo da Comida (Olfato)
                </label>
                <span className="text-white font-semibold">
                  {config.olfactorySensitivity.toFixed(1)}x
                </span>
              </div>
              <input
                id="exp-olfactory"
                type="range"
                min={0.2}
                max={2.4}
                step={0.1}
                value={config.olfactorySensitivity}
                onChange={(e) =>
                  onUpdateConfig({ olfactorySensitivity: Number(e.target.value) })
                }
                className="w-full accent-[#aad751] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="exp-gaba" className="text-[#c7e596]">
                  Força das Conexões Inibitórias (GABA)
                </label>
                <span className="text-white font-semibold">
                  {config.gabaInhibitionGain.toFixed(1)}x
                </span>
              </div>
              <input
                id="exp-gaba"
                type="range"
                min={0.0}
                max={2.0}
                step={0.1}
                value={config.gabaInhibitionGain}
                onChange={(e) =>
                  onUpdateConfig({ gabaInhibitionGain: Number(e.target.value) })
                }
                className="w-full accent-[#e7471d] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="exp-noise" className="text-[#c7e596]">
                  Ruído Neural
                </label>
                <span className="text-white font-semibold">
                  {config.synapticNoise.toFixed(1)} mV
                </span>
              </div>
              <input
                id="exp-noise"
                type="range"
                min={0.0}
                max={4.0}
                step={0.2}
                value={config.synapticNoise}
                onChange={(e) =>
                  onUpdateConfig({ synapticNoise: Number(e.target.value) })
                }
                className="w-full accent-[#fbbc04] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="exp-speed" className="text-[#c7e596]">
                  Velocidade da Partida
                </label>
                <span className="text-white font-semibold">{config.speedMs} ms</span>
              </div>
              <input
                id="exp-speed"
                type="range"
                min={30}
                max={200}
                step={10}
                value={config.speedMs}
                onChange={(e) => onUpdateConfig({ speedMs: Number(e.target.value) })}
                className="w-full accent-[#aad751] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CARD 4: Métricas */}
      <section className="bg-[#2c471a] border-2 border-[#4a752c] rounded-sm overflow-hidden shadow-lg">
        <div className="bg-[#4a752c] px-4 py-3 text-white">
          <h2 className="font-display font-semibold text-base">Métricas</h2>
          <p className="text-xs text-[#e3f2c9] mt-0.5">
            Medir pontuação, sobrevivência, colisões, tempo de decisão e desempenho.
          </p>
        </div>

        <div className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono">
          <div className="bg-[#203612] border border-[#4a752c] p-3 rounded-sm">
            <span className="text-[10px] text-[#c7e596] uppercase block">Pontuação</span>
            <span className="text-lg font-bold text-[#aad751]">{gameState.score}</span>
            <span className="text-[10px] text-white/70 block">
              Recorde: {gameState.highScore}
            </span>
          </div>

          <div className="bg-[#203612] border border-[#4a752c] p-3 rounded-sm">
            <span className="text-[10px] text-[#c7e596] uppercase block">
              Sobrevivência
            </span>
            <span className="text-lg font-bold text-white">
              {gameState.stepsThisEpisode}
            </span>
            <span className="text-[10px] text-white/70 block">movimentos</span>
          </div>

          <div className="bg-[#203612] border border-[#4a752c] p-3 rounded-sm">
            <span className="text-[10px] text-[#c7e596] uppercase block">Colisões</span>
            <span className="text-lg font-bold text-[#ff8a6b]">
              {activeMetrics.collisions}
            </span>
            <span className="text-[10px] text-white/70 block">
              em {activeMetrics.episodes} partidas
            </span>
          </div>

          <div className="bg-[#203612] border border-[#4a752c] p-3 rounded-sm">
            <span className="text-[10px] text-[#c7e596] uppercase block">
              Tempo de decisão
            </span>
            <span className="text-lg font-bold text-[#fbbc04]">
              {activeMetrics.lastDecisionMs.toFixed(2)}
            </span>
            <span className="text-[10px] text-white/70 block">ms / passo</span>
          </div>

          <div className="bg-[#203612] border border-[#4a752c] p-3 rounded-sm col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#c7e596] uppercase block">
              Desempenho
            </span>
            <span className="text-lg font-bold text-white">{avgScore}</span>
            <span className="text-[10px] text-white/70 block">média pts/jogo</span>
          </div>
        </div>
      </section>
    </div>
  )
}
