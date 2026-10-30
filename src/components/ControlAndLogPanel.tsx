import React from 'react'
import { Play, Pause, RotateCcw, StepForward } from 'lucide-react'
import type { DecisionLogEntry, SimulationConfig } from '../game/types'

interface ControlAndLogPanelProps {
  isRunning: boolean
  onToggleRun: () => void
  onStepOnce: () => void
  onReset: () => void
  config: SimulationConfig
  onUpdateConfig: (partial: Partial<SimulationConfig>) => void
  decisionLogs: DecisionLogEntry[]
}

export const ControlAndLogPanel: React.FC<ControlAndLogPanelProps> = ({
  isRunning,
  onToggleRun,
  onStepOnce,
  onReset,
  config,
  onUpdateConfig,
  decisionLogs,
}) => {
  return (
    <div className="space-y-4">
      {/* Controles de Neuromodulação e Ablação */}
      <div className="bg-[#2c471a] border-2 border-[#4a752c] rounded-sm p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/15">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#aad751] block">
              [ BANCADA DE NEUROMODULAÇÃO E ABLAÇÃO ]
            </span>
            <h3 className="font-display text-base font-semibold text-white">
              Parâmetros Biofísicos do Circuito FlyWire
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleRun}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#aad751] text-[#1f3311] font-mono text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#b8e264] transition-colors cursor-pointer"
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
              aria-label="Avançar um ciclo sináptico"
              title="Avançar 1 ciclo (14ms)"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#203612] border border-[#4a752c] text-white font-mono text-xs rounded-sm disabled:opacity-40 hover:border-[#aad751] transition-colors cursor-pointer"
            >
              <StepForward className="w-3.5 h-3.5" /> Passo (14ms)
            </button>

            <button
              type="button"
              onClick={onReset}
              aria-label="Reiniciar simulação"
              title="Reiniciar episódio"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#203612] border border-[#4a752c] text-white font-mono text-xs rounded-sm hover:border-[#e7471d] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Resetar
            </button>
          </div>
        </div>

        {/* Botões de Modo e Ablação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
          <button
            type="button"
            onClick={() =>
              onUpdateConfig({
                mode: config.mode === 'BIO_PILOT' ? 'MANUAL' : 'BIO_PILOT',
              })
            }
            className={`px-3 py-2 text-left border rounded-sm font-mono text-xs transition-colors cursor-pointer ${
              config.mode === 'BIO_PILOT'
                ? 'bg-[#203612] border-[#aad751] text-white'
                : 'bg-[#203612] border-[#fbbc04] text-[#fbbc04]'
            }`}
          >
            <span className="text-[10px] text-[#c7e596] block uppercase">
              Modo de Operação
            </span>
            <span className="font-semibold">
              {config.mode === 'BIO_PILOT'
                ? 'BIO-PILOTO (Cérebro FlyWire Autônomo)'
                : 'MANUAL (Setas do Teclado / WASD)'}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdateConfig({ giantFiberEnabled: !config.giantFiberEnabled })
            }
            className={`px-3 py-2 text-left border rounded-sm font-mono text-xs transition-colors cursor-pointer ${
              config.giantFiberEnabled
                ? 'bg-[#203612] border-[#aad751] text-[#aad751]'
                : 'bg-[#203612] border-[#e7471d] text-[#ff8a6b]'
            }`}
          >
            <span className="text-[10px] text-[#c7e596] block uppercase">
              Sistema Fibra Gigante (Reflexo Evasivo)
            </span>
            <span className="font-semibold">
              {config.giantFiberEnabled
                ? 'ATIVO (Desvia de Paredes e Corpo)'
                : 'ABLACIONADO (Sem Reflexo Anticolisão)'}
            </span>
          </button>
        </div>

        {/* Sliders Biofísicos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-white/15 font-mono text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="speed-slider" className="text-[#c7e596]">
                Intervalo do Ciclo Motor
              </label>
              <span className="text-white font-semibold">{config.speedMs} ms</span>
            </div>
            <input
              id="speed-slider"
              type="range"
              min={30}
              max={200}
              step={10}
              value={config.speedMs}
              onChange={(e) => onUpdateConfig({ speedMs: Number(e.target.value) })}
              className="w-full accent-[#aad751] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="olfactory-slider" className="text-[#c7e596]">
                Ganho Olfativo (ORN → PFNd)
              </label>
              <span className="text-[#fbbc04] font-semibold">
                {config.olfactorySensitivity.toFixed(1)}x
              </span>
            </div>
            <input
              id="olfactory-slider"
              type="range"
              min={0.2}
              max={2.4}
              step={0.1}
              value={config.olfactorySensitivity}
              onChange={(e) =>
                onUpdateConfig({ olfactorySensitivity: Number(e.target.value) })
              }
              className="w-full accent-[#fbbc04] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="gaba-slider" className="text-[#c7e596]">
                Inibição GABAérgica (Δ7 / LC4)
              </label>
              <span className="text-[#ff8a6b] font-semibold">
                {config.gabaInhibitionGain.toFixed(1)}x
              </span>
            </div>
            <input
              id="gaba-slider"
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
              <label htmlFor="noise-slider" className="text-[#c7e596]">
                Ruído Sináptico Térmico
              </label>
              <span className="text-white font-semibold">
                {config.synapticNoise.toFixed(1)} mV
              </span>
            </div>
            <input
              id="noise-slider"
              type="range"
              min={0.0}
              max={4.0}
              step={0.2}
              value={config.synapticNoise}
              onChange={(e) => onUpdateConfig({ synapticNoise: Number(e.target.value) })}
              className="w-full accent-[#aad751] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Registro de Decisões dos Neurônios Descendentes */}
      <div className="bg-[#2c471a] border-2 border-[#4a752c] rounded-sm p-4 shadow-lg">
        <div className="pb-2.5 mb-2.5 border-b border-white/15 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#c7e596] block">
              [ HISTÓRICO DO CORDÃO NERVOSO VENTRAL ]
            </span>
            <h3 className="font-display text-base font-semibold text-white">
              Últimas Decisões dos Neurônios Motores (DNa01 / DNa02)
            </h3>
          </div>
          <span className="font-mono text-xs text-[#aad751]">Tempo Real</span>
        </div>

        <div className="max-h-44 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
          {decisionLogs.length === 0 ? (
            <p className="text-[#c7e596] py-4 text-center">
              Aguardando disparo sináptico...
            </p>
          ) : (
            decisionLogs.map((log) => (
              <div
                key={log.tick}
                className="bg-[#203612] border border-[#4a752c] px-2.5 py-1.5 rounded-sm flex items-center justify-between gap-2"
              >
                <div className="truncate">
                  <span className="text-[#c7e596] mr-2">#{log.tick}</span>
                  <span
                    className={
                      log.reflexTriggered
                        ? 'text-[#ff8a6b] font-semibold'
                        : log.action === 'STRAIGHT'
                        ? 'text-[#aad751]'
                        : 'text-[#fbbc04] font-semibold'
                    }
                  >
                    {log.dominantNeuron}
                  </span>
                  <span className="text-[#e3f2c9] ml-2">{log.reason}</span>
                </div>
                <span className="shrink-0 px-2 py-0.5 bg-[#2c471a] border border-[#4a752c] text-[10px] text-white rounded-sm">
                  {log.direction === 'UP'
                    ? 'NORTE'
                    : log.direction === 'RIGHT'
                    ? 'LESTE'
                    : log.direction === 'DOWN'
                    ? 'SUL'
                    : 'OESTE'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
