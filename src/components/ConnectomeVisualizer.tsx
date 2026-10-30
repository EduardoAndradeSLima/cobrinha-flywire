import React from 'react'
import { FLYWIRE_NEURONS, FLYWIRE_SYNAPSES, type BioNeuron } from '../bio/connectomeData'
import type { ActiveSynapsePulse, NeuronDynamicState } from '../bio/lifEngine'

interface ConnectomeVisualizerProps {
  states: Record<string, NeuronDynamicState>
  activePulses: ActiveSynapsePulse[]
  selectedNeuronId: string
  onSelectNeuron: (neuronId: string) => void
  giantFiberEnabled: boolean
}

export const ConnectomeVisualizer: React.FC<ConnectomeVisualizerProps> = ({
  states,
  activePulses,
  selectedNeuronId,
  onSelectNeuron,
  giantFiberEnabled,
}) => {
  const neuronMap = new Map<string, BioNeuron>()
  for (const n of FLYWIRE_NEURONS) {
    neuronMap.set(n.id, n)
  }

  const pulseLookup = new Map<string, ActiveSynapsePulse>()
  for (const p of activePulses) {
    pulseLookup.set(`${p.sourceId}->${p.targetId}`, p)
  }

  const selectedNeuron =
    FLYWIRE_NEURONS.find((n) => n.id === selectedNeuronId) || FLYWIRE_NEURONS[12]
  const selectedState = states[selectedNeuron.id]

  return (
    <section className="w-full shadow-lg rounded-sm overflow-hidden select-none bg-[#2c471a] border-2 border-[#4a752c]">
      {/* Cabeçalho do Card: Visualização neural */}
      <div className="bg-[#4a752c] px-4 py-3 text-white">
        <h2 className="font-display font-semibold text-base">
          Visualização neural
        </h2>
        <p className="text-xs text-[#e3f2c9] mt-0.5">
          Mostrar a atividade dos neurônios durante a partida.
        </p>
      </div>

      {/* Área do Cérebro FlyWire */}
      <div className="p-3.5 space-y-3">
        <div className="relative rounded-sm overflow-hidden border border-[#4a752c] bg-[#08071a]">
          <svg
            viewBox="0 0 800 450"
            className="w-full h-auto block"
            role="img"
            aria-label="Visualização neural do conectoma FlyWire"
          >
            <image
              href="/flywire-brain.png"
              x="0"
              y="0"
              width="800"
              height="450"
              preserveAspectRatio="xMidYMid slice"
              opacity="0.62"
            />

            <rect
              x="0"
              y="0"
              width="800"
              height="450"
              fill="rgba(12, 22, 10, 0.28)"
            />

            <circle
              cx="400"
              cy="193"
              r="42"
              fill="rgba(74, 117, 44, 0.18)"
              stroke="rgba(251, 188, 4, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Conexões Sinápticas */}
            {FLYWIRE_SYNAPSES.map((syn) => {
              const src = neuronMap.get(syn.sourceId)
              const tgt = neuronMap.get(syn.targetId)
              if (!src || !tgt) return null

              const isGFPath =
                syn.sourceId.startsWith('DNp01_') ||
                syn.targetId.startsWith('DNp01_') ||
                syn.sourceId.startsWith('DNp04_') ||
                syn.targetId.startsWith('DNp04_')
              const disabled = !giantFiberEnabled && isGFPath

              const x1 = (src.x / 100) * 800
              const y1 = (src.y / 100) * 450
              const x2 = (tgt.x / 100) * 800
              const y2 = (tgt.y / 100) * 450

              const dx = x2 - x1
              const dy = y2 - y1
              const cx1 = x1 + dx * 0.35
              const cy1 = y1 + dy * 0.1
              const cx2 = x1 + dx * 0.65
              const cy2 = y2 - dy * 0.1
              const pathData = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`

              const pulse = pulseLookup.get(`${syn.sourceId}->${syn.targetId}`)
              const isHighlighted =
                selectedNeuronId === syn.sourceId || selectedNeuronId === syn.targetId

              let strokeColor = syn.isExcitatory
                ? 'rgba(170, 215, 81, 0.25)'
                : 'rgba(231, 71, 29, 0.3)'
              let strokeWidth = Math.max(1.1, Math.log10(syn.synapseCount) * 0.8)

              if (disabled) {
                strokeColor = 'rgba(255, 255, 255, 0.06)'
              } else if (pulse && pulse.intensity > 0.15) {
                strokeColor = syn.isExcitatory
                  ? `rgba(170, 215, 81, ${Math.min(1, pulse.intensity + 0.35).toFixed(2)})`
                  : `rgba(231, 71, 29, ${Math.min(1, pulse.intensity + 0.35).toFixed(2)})`
                strokeWidth += pulse.intensity * 2.6
              } else if (isHighlighted) {
                strokeColor = '#fbbc04'
                strokeWidth += 1.0
              }

              return (
                <path
                  key={`${syn.sourceId}->${syn.targetId}`}
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={syn.isExcitatory ? undefined : '5 3'}
                />
              )
            })}

            {/* Neurônios */}
            {FLYWIRE_NEURONS.map((neuron) => {
              const st = states[neuron.id]
              const cx = (neuron.x / 100) * 800
              const cy = (neuron.y / 100) * 450
              const isSelected = selectedNeuronId === neuron.id
              const isGFDisabled = !giantFiberEnabled && neuron.role === 'reflex'

              const vMem = st ? st.vMembrane : -52
              const spiked = st ? st.spikedThisTick || st.spikeCountWindow > 0 : false
              const hz = st ? st.firingRateHz : 0

              const depol = Math.max(0, Math.min(1, (vMem - -52) / 10))

              let fillColor = '#2c471a'
              let ringColor = '#aad751'

              if (isGFDisabled) {
                fillColor = '#1b2614'
                ringColor = 'rgba(255, 255, 255, 0.2)'
              } else if (spiked) {
                if (neuron.isMotor) {
                  fillColor = '#4974e8'
                  ringColor = '#ffffff'
                } else if (neuron.neurotransmitter === 'GABA') {
                  fillColor = '#e7471d'
                  ringColor = '#ffbfa8'
                } else if (neuron.role === 'compass') {
                  fillColor = '#fbbc04'
                  ringColor = '#ffffff'
                } else {
                  fillColor = '#aad751'
                  ringColor = '#ffffff'
                }
              } else if (depol > 0.2) {
                fillColor = '#4a752c'
                ringColor = '#aad751'
              }

              const radius = neuron.isMotor ? 11 : 9

              return (
                <g
                  key={neuron.id}
                  onClick={() => onSelectNeuron(neuron.id)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`Neurônio ${neuron.label}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectNeuron(neuron.id)
                    }
                  }}
                >
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 6.5}
                      fill="none"
                      stroke="#fbbc04"
                      strokeWidth="2.2"
                      strokeDasharray="3 2"
                    />
                  )}

                  {spiked && !isGFDisabled && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 4.5}
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="1.8"
                      opacity="0.85"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={fillColor}
                    stroke={isSelected ? '#fbbc04' : ringColor}
                    strokeWidth={isSelected ? 2.5 : 1.6}
                  />

                  <rect
                    x={cx - 46}
                    y={cy + radius + 2}
                    width="92"
                    height="15"
                    rx="3"
                    fill="rgba(16, 28, 10, 0.82)"
                  />

                  <text
                    x={cx}
                    y={cy + radius + 12.5}
                    textAnchor="middle"
                    fill={spiked ? '#ffffff' : '#d7ecb8'}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight={spiked || isSelected ? '600' : '400'}
                  >
                    {neuron.label} {isGFDisabled ? '' : `(${hz}Hz)`}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Resumo Simples do Neurônio Selecionado */}
        <div className="bg-[#203612] border border-[#4a752c] rounded-sm px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-semibold text-[#fbbc04]">{selectedNeuron.label}</span>
            <span className="text-[#c7e596] mx-2">·</span>
            <span className="text-white/90">{selectedNeuron.description}</span>
          </div>
          <span className="font-mono text-[#aad751] shrink-0">
            {selectedState ? `${selectedState.firingRateHz} Hz` : '0 Hz'} (
            {selectedState ? `${Math.round(selectedState.vMembrane)} mV` : '-52 mV'})
          </span>
        </div>
      </div>
    </section>
  )
}
