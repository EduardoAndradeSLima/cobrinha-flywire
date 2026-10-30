import React from 'react'
import { ExternalLink } from 'lucide-react'
import { FLYWIRE_NEURONS, FLYWIRE_SYNAPSES } from '../bio/connectomeData'
import type { NeuronDynamicState } from '../bio/lifEngine'

interface NeuronInspectorPanelProps {
  selectedNeuronId: string
  states: Record<string, NeuronDynamicState>
  onSelectNeuron: (id: string) => void
}

export const NeuronInspectorPanel: React.FC<NeuronInspectorPanelProps> = ({
  selectedNeuronId,
  states,
  onSelectNeuron,
}) => {
  const neuron =
    FLYWIRE_NEURONS.find((n) => n.id === selectedNeuronId) || FLYWIRE_NEURONS[18]
  const st = states[neuron.id]

  const upstream = FLYWIRE_SYNAPSES.filter((s) => s.targetId === neuron.id)
  const downstream = FLYWIRE_SYNAPSES.filter((s) => s.sourceId === neuron.id)

  const history = st?.historyV ?? Array(32).fill(-70)
  const width = 360
  const height = 68
  const mapY = (v: number) => {
    const norm = (v - -82) / (15 - -82)
    return height - 6 - Math.max(0, Math.min(1, norm)) * (height - 12)
  }

  const points = history
    .map((v, idx) => {
      const x = (idx / Math.max(1, history.length - 1)) * width
      const y = mapY(v)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const threshY = mapY(-50)
  const restY = mapY(-70)

  return (
    <div className="bg-[#2c471a] border-2 border-[#4a752c] rounded-sm p-4 shadow-lg space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2 pb-2.5 border-b border-white/15">
        <div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#fbbc04] block">
            [ OSCILOSCÓPIO INTRACELULAR · NEURÔNIO SELECIONADO ]
          </span>
          <h3 className="font-display text-lg font-semibold text-white mt-0.5">
            {neuron.label}{' '}
            <span className="font-mono text-xs text-[#c7e596] font-normal">
              — {neuron.neuropil}
            </span>
          </h3>
        </div>

        <a
          href={`https://codex.flywire.ai/app/search?filter_string=${neuron.flywireId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4a752c] hover:bg-[#578a34] text-white font-mono text-xs rounded-sm transition-colors"
          title="Ver reconstrução 3D oficial no FlyWire Codex"
        >
          <span>FlyWire ID: {neuron.flywireId}</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#fbbc04]" />
        </a>
      </div>

      <p className="text-xs sm:text-sm text-[#e3f2c9] leading-relaxed">
        {neuron.description}
      </p>

      {/* Indicadores Biofísicos */}
      <div className="grid grid-cols-3 gap-2.5 font-mono">
        <div className="bg-[#203612] border border-[#4a752c] px-3 py-2 rounded-sm">
          <span className="text-[10px] text-[#c7e596] block uppercase">
            Potencial de Membrana (Vm)
          </span>
          <span className="text-sm text-white font-semibold">
            {st ? Math.round(st.vMembrane) : -70} mV
          </span>
        </div>

        <div className="bg-[#203612] border border-[#4a752c] px-3 py-2 rounded-sm">
          <span className="text-[10px] text-[#c7e596] block uppercase">
            Frequência de Disparo
          </span>
          <span className="text-sm text-[#aad751] font-semibold">
            {st ? st.firingRateHz : 0} Hz ({st ? st.spikeCountWindow : 0} spikes/ciclo)
          </span>
        </div>

        <div className="bg-[#203612] border border-[#4a752c] px-3 py-2 rounded-sm">
          <span className="text-[10px] text-[#c7e596] block uppercase">
            Neurotransmissor
          </span>
          <span
            className={`text-sm font-semibold ${
              neuron.neurotransmitter === 'GABA' ? 'text-[#ff8a6b]' : 'text-[#fbbc04]'
            }`}
          >
            {neuron.neurotransmitter}
          </span>
        </div>
      </div>

      {/* Traçado de Voltagem (Patch-Clamp) */}
      <div className="bg-[#18290d] border border-[#4a752c] p-2.5 rounded-sm">
        <div className="flex justify-between font-mono text-[10px] text-[#c7e596] mb-1">
          <span>TRAÇADO DE VOLTAGEM INTRACELULAR (REPOUSO: -70mV)</span>
          <span className="text-[#ff8a6b]">LIMIAR DE AÇÃO: -50mV</span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16 block">
          <line
            x1="0"
            y1={threshY}
            x2={width}
            y2={threshY}
            stroke="rgba(231, 71, 29, 0.55)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1={restY}
            x2={width}
            y2={restY}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
          />
          <polyline
            fill="none"
            stroke={
              neuron.isMotor
                ? '#4974e8'
                : neuron.neurotransmitter === 'GABA'
                ? '#e7471d'
                : '#aad751'
            }
            strokeWidth="2"
            points={points}
          />
        </svg>
      </div>

      {/* Conexões Pré e Pós-Sinápticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/15 font-mono text-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#c7e596] block mb-1.5">
            Recebe Sinapses De ({upstream.length})
          </span>
          {upstream.length === 0 ? (
            <span className="text-white/60 text-[11px]">
              Receptor sensorial primário (estimulado pelo ambiente)
            </span>
          ) : (
            <ul className="space-y-1">
              {upstream.map((s) => (
                <li key={s.sourceId} className="flex items-center justify-between bg-[#203612] px-2 py-1 rounded-sm">
                  <button
                    type="button"
                    onClick={() => onSelectNeuron(s.sourceId)}
                    className="text-left text-white hover:text-[#fbbc04] underline cursor-pointer"
                  >
                    {s.sourceId}
                  </button>
                  <span className={s.isExcitatory ? 'text-[#aad751]' : 'text-[#ff8a6b]'}>
                    {s.isExcitatory ? '+' : '-'}
                    {s.synapseCount} sinapses
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#c7e596] block mb-1.5">
            Envia Sinapses Para ({downstream.length})
          </span>
          {downstream.length === 0 ? (
            <span className="text-white/60 text-[11px]">
              Saída motora terminal (comanda os músculos/curvas)
            </span>
          ) : (
            <ul className="space-y-1">
              {downstream.map((s) => (
                <li key={s.targetId} className="flex items-center justify-between bg-[#203612] px-2 py-1 rounded-sm">
                  <button
                    type="button"
                    onClick={() => onSelectNeuron(s.targetId)}
                    className="text-left text-white hover:text-[#fbbc04] underline cursor-pointer"
                  >
                    {s.targetId}
                  </button>
                  <span className={s.isExcitatory ? 'text-[#aad751]' : 'text-[#ff8a6b]'}>
                    {s.isExcitatory ? '+' : '-'}
                    {s.synapseCount} sinapses
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
