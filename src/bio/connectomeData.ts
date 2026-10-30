export type Neurotransmitter = 'Acetilcolina' | 'GABA' | 'Glutamato'

export type NeuropilRegion =
  | 'Lobo Óptico (Lóbula)'
  | 'Tubérculo Óptico Anterior (AOTU)'
  | 'Via de Escape (DNp)'
  | 'Fibra Gigante (DNp01)'
  | 'Via de Direção (DNa)'

export interface BioNeuron {
  id: string
  label: string
  flywireId: string
  neuropil: NeuropilRegion
  neurotransmitter: Neurotransmitter
  description: string
  isSensory?: boolean
  isMotor?: boolean
  role: 'sensory' | 'steering' | 'reflex' | 'compass' | 'motor'
  x: number
  y: number
}

export interface Synapse {
  sourceId: string
  targetId: string
  synapseCount: number
  weight: number
  isExcitatory: boolean
  description: string
}

// Populações neurais reais extraídas do subcircuito de 3.189 neurônios e 2.100.007 sinapses (flybrain-snake / Shiu et al. 2024)
export const FLYWIRE_NEURONS: BioNeuron[] = [
  // --- LOBO ÓPTICO ESQUERDO: DETECÇÃO DE COMIDA (LC10a) E OBSTÁCULOS (LC4 / LPLC2) ---
  {
    id: 'LC10a_L',
    label: 'LC10a-Comida(Esq)',
    flywireId: 'População: 112 neurônios',
    neuropil: 'Lobo Óptico (Lóbula)',
    neurotransmitter: 'Acetilcolina',
    description:
      '112 neurônios colunares LC10a no olho esquerdo: detectam pequenos objetos (a maçã) no campo visual esquerdo (-5° a -80°).',
    isSensory: true,
    role: 'sensory',
    x: 16,
    y: 36,
  },
  {
    id: 'LC4_L',
    label: 'LC4-Obstáculo(Esq)',
    flywireId: 'População: 71 neurônios',
    neuropil: 'Lobo Óptico (Lóbula)',
    neurotransmitter: 'Acetilcolina',
    description:
      '71 neurônios LC4 no olho esquerdo: detectam aproximação rápida de paredes ou do próprio corpo pelo lado esquerdo.',
    isSensory: true,
    role: 'sensory',
    x: 13,
    y: 55,
  },
  {
    id: 'LPLC2_L',
    label: 'LPLC2-Expansão(Esq)',
    flywireId: 'População: 94 neurônios',
    neuropil: 'Lobo Óptico (Lóbula)',
    neurotransmitter: 'Acetilcolina',
    description:
      '94 neurônios LPLC2 no olho esquerdo: sensíveis à expansão radial de obstáculos iminentes.',
    isSensory: true,
    role: 'sensory',
    x: 17,
    y: 73,
  },

  // --- LOBO ÓPTICO DIREITO: DETECÇÃO DE COMIDA (LC10a) E OBSTÁCULOS (LC4 / LPLC2) ---
  {
    id: 'LC10a_R',
    label: 'LC10a-Comida(Dir)',
    flywireId: 'População: 136 neurônios',
    neuropil: 'Lobo Óptico (Lóbula)',
    neurotransmitter: 'Acetilcolina',
    description:
      '136 neurônios colunares LC10a no olho direito: detectam a maçã no campo visual direito (+5° a +83°).',
    isSensory: true,
    role: 'sensory',
    x: 84,
    y: 36,
  },
  {
    id: 'LC4_R',
    label: 'LC4-Obstáculo(Dir)',
    flywireId: 'População: 55 neurônios',
    neuropil: 'Lobo Óptico (Lóbula)',
    neurotransmitter: 'Acetilcolina',
    description:
      '55 neurônios LC4 no olho direito: detectam aproximação rápida de paredes ou do próprio corpo pelo lado direito.',
    isSensory: true,
    role: 'sensory',
    x: 87,
    y: 55,
  },
  {
    id: 'LPLC2_R',
    label: 'LPLC2-Expansão(Dir)',
    flywireId: 'População: 91 neurônios',
    neuropil: 'Lobo Óptico (Lóbula)',
    neurotransmitter: 'Acetilcolina',
    description:
      '91 neurônios LPLC2 no olho direito: sensíveis à expansão radial de obstáculos iminentes.',
    isSensory: true,
    role: 'sensory',
    x: 83,
    y: 73,
  },

  // --- TUBÉRCULO ÓPTICO ANTERIOR (AOTU — Relé de Perseguição LC10a → DNa02) ---
  {
    id: 'AOTU019_L',
    label: 'AOTU019-Guia(Esq)',
    flywireId: 'Via LC10a → AOTU → DNa02',
    neuropil: 'Tubérculo Óptico Anterior (AOTU)',
    neurotransmitter: 'Acetilcolina',
    description:
      'Interneurônios AOTU019/025 esquerdos: retransmitem a posição da maçã do olho esquerdo para os neurônios de curva DNa02.',
    role: 'steering',
    x: 36,
    y: 28,
  },
  {
    id: 'AOTU_Center',
    label: 'Equilíbrio-Frontal',
    flywireId: 'Inibição Comissural AOTU',
    neuropil: 'Tubérculo Óptico Anterior (AOTU)',
    neurotransmitter: 'GABA',
    description:
      'Competição inter-hemisférica: quando a maçã está a 0° à frente, ambos os olhos se equilibram e a mosca segue reto.',
    role: 'compass',
    x: 50,
    y: 20,
  },
  {
    id: 'AOTU019_R',
    label: 'AOTU019-Guia(Dir)',
    flywireId: 'Via LC10a → AOTU → DNa02',
    neuropil: 'Tubérculo Óptico Anterior (AOTU)',
    neurotransmitter: 'Acetilcolina',
    description:
      'Interneurônios AOTU019/025 direitos: retransmitem a posição da maçã do olho direito para os neurônios de curva DNa02.',
    role: 'steering',
    x: 64,
    y: 28,
  },

  // --- VIAS DESCENDENTES DE ESCAPE (DNp02 / DNp04 / DNp11 e Fibra Gigante DNp01) ---
  {
    id: 'DNp04_L',
    label: 'DNp04-Escape(Esq)',
    flywireId: 'População: DNp02/03/04/11 (L)',
    neuropil: 'Via de Escape (DNp)',
    neurotransmitter: 'Acetilcolina',
    description:
      'Recebe 11.597 sinapses diretas de LC4_L: ameaça detectada à esquerda dispara uma curva evasiva para o lado oposto (DIREITA).',
    role: 'reflex',
    x: 34,
    y: 58,
  },
  {
    id: 'DNp01_GF',
    label: 'DNp01-FibraGigante',
    flywireId: '6.362 sin. LC4 + 4.862 LPLC2',
    neuropil: 'Fibra Gigante (DNp01)',
    neurotransmitter: 'Acetilcolina',
    description:
      'Fibra Gigante (DNp01): dispara em emergência quando um obstáculo surge bem à frente, forçando curva para o lado livre.',
    role: 'reflex',
    x: 50,
    y: 52,
  },
  {
    id: 'DNp04_R',
    label: 'DNp04-Escape(Dir)',
    flywireId: 'População: DNp02/03/04/11 (R)',
    neuropil: 'Via de Escape (DNp)',
    neurotransmitter: 'Acetilcolina',
    description:
      'Recebe sinapses diretas de LC4_R: ameaça detectada à direita dispara uma curva evasiva para o lado oposto (ESQUERDA).',
    role: 'reflex',
    x: 66,
    y: 58,
  },

  // --- NEURÔNIOS MOTORES DESCENDENTES DE DIREÇÃO (DNa02 / DNa01 / DNa03 / DNa13 / DNa15) ---
  {
    id: 'DNa02_L',
    label: 'DNa02-VirarEsq',
    flywireId: 'População: DNa02/01/03/13/15 (L)',
    neuropil: 'Via de Direção (DNa)',
    neurotransmitter: 'Acetilcolina',
    description:
      'População motora descendente esquerda: quando supera o lado direito (≥ 6 spikes e assimetria ≥ 40%), vira a cobrinha à ESQUERDA.',
    isMotor: true,
    role: 'motor',
    x: 38,
    y: 86,
  },
  {
    id: 'DNa01_Forward',
    label: 'DNa01-SeguirReto',
    flywireId: 'Simetria Bilateral DNa',
    neuropil: 'Via de Direção (DNa)',
    neurotransmitter: 'Acetilcolina',
    description:
      'Mantém a trajetória em linha reta quando a resposta entre esquerda e direita é simétrica (comida à frente a 0°).',
    isMotor: true,
    role: 'motor',
    x: 50,
    y: 90,
  },
  {
    id: 'DNa02_R',
    label: 'DNa02-VirarDir',
    flywireId: 'População: DNa02/01/03/13/15 (R)',
    neuropil: 'Via de Direção (DNa)',
    neurotransmitter: 'Acetilcolina',
    description:
      'População motora descendente direita: quando supera o lado esquerdo (≥ 6 spikes e assimetria ≥ 40%), vira a cobrinha à DIREITA.',
    isMotor: true,
    role: 'motor',
    x: 62,
    y: 86,
  },
]

export const FLYWIRE_SYNAPSES: Synapse[] = [
  // Via da Comida: LC10a -> AOTU -> DNa02 (Ipsilateral)
  { sourceId: 'LC10a_L', targetId: 'AOTU019_L', synapseCount: 1840, weight: 3.5, isExcitatory: true, description: 'LC10a esquerdo projeta para AOTU esquerdo' },
  { sourceId: 'LC10a_R', targetId: 'AOTU019_R', synapseCount: 1920, weight: 3.5, isExcitatory: true, description: 'LC10a direito projeta para AOTU direito' },
  { sourceId: 'AOTU019_L', targetId: 'AOTU_Center', synapseCount: 420, weight: -1.8, isExcitatory: false, description: 'Inibição comissural entre hemisférios' },
  { sourceId: 'AOTU019_R', targetId: 'AOTU_Center', synapseCount: 420, weight: -1.8, isExcitatory: false, description: 'Inibição comissural entre hemisférios' },
  { sourceId: 'AOTU019_L', targetId: 'DNa02_L', synapseCount: 2450, weight: 4.2, isExcitatory: true, description: 'AOTU esquerdo aciona neurônios de curva DNa02_L' },
  { sourceId: 'AOTU019_R', targetId: 'DNa02_R', synapseCount: 2380, weight: 4.2, isExcitatory: true, description: 'AOTU direito aciona neurônios de curva DNa02_R' },
  { sourceId: 'AOTU_Center', targetId: 'DNa01_Forward', synapseCount: 890, weight: 3.0, isExcitatory: true, description: 'Equilíbrio frontal mantém avanço reto' },

  // Via de Escape: LC4 / LPLC2 -> DNp04 / DNp02 / DNp11 e Fibra Gigante (DNp01)
  { sourceId: 'LC4_L', targetId: 'DNp04_L', synapseCount: 11597, weight: 5.0, isExcitatory: true, description: '11.597 sinapses diretas LC4 → DNp04/02/11 (esquerdo)' },
  { sourceId: 'LC4_R', targetId: 'DNp04_R', synapseCount: 11240, weight: 5.0, isExcitatory: true, description: 'Sinapses diretas LC4 → DNp04/02/11 (direito)' },
  { sourceId: 'LPLC2_L', targetId: 'DNp04_L', synapseCount: 3666, weight: 4.0, isExcitatory: true, description: 'LPLC2 reforça população de escape esquerda' },
  { sourceId: 'LPLC2_R', targetId: 'DNp04_R', synapseCount: 3580, weight: 4.0, isExcitatory: true, description: 'LPLC2 reforça população de escape direita' },
  { sourceId: 'LC4_L', targetId: 'DNp01_GF', synapseCount: 6362, weight: 4.8, isExcitatory: true, description: '6.362 sinapses diretas LC4 → Fibra Gigante DNp01' },
  { sourceId: 'LC4_R', targetId: 'DNp01_GF', synapseCount: 6120, weight: 4.8, isExcitatory: true, description: 'Sinapses diretas LC4 → Fibra Gigante DNp01' },
  { sourceId: 'LPLC2_L', targetId: 'DNp01_GF', synapseCount: 4862, weight: 4.5, isExcitatory: true, description: '4.862 sinapses diretas LPLC2 → Fibra Gigante DNp01' },
  { sourceId: 'LPLC2_R', targetId: 'DNp01_GF', synapseCount: 4790, weight: 4.5, isExcitatory: true, description: 'Sinapses diretas LPLC2 → Fibra Gigante DNp01' },

  // Escape Contralateral (Card & Dickinson 2008): ameaça à esquerda vira para a DIREITA; ameaça à direita vira para a ESQUERDA!
  { sourceId: 'DNp04_L', targetId: 'DNa02_R', synapseCount: 4209, weight: 6.0, isExcitatory: true, description: 'Escape contralateral: ameaça à esquerda vira para a DIREITA' },
  { sourceId: 'DNp04_R', targetId: 'DNa02_L', synapseCount: 4209, weight: 6.0, isExcitatory: true, description: 'Escape contralateral: ameaça à direita vira para a ESQUERDA' },
  { sourceId: 'DNp04_L', targetId: 'DNa02_L', synapseCount: 3100, weight: -6.5, isExcitatory: false, description: 'Inibe virar em direção ao obstáculo esquerdo' },
  { sourceId: 'DNp04_R', targetId: 'DNa02_R', synapseCount: 3100, weight: -6.5, isExcitatory: false, description: 'Inibe virar em direção ao obstáculo direito' },
  { sourceId: 'DNp01_GF', targetId: 'DNa02_L', synapseCount: 2800, weight: 5.5, isExcitatory: true, description: 'Fibra Gigante aciona manobra de emergência' },
  { sourceId: 'DNp01_GF', targetId: 'DNa02_R', synapseCount: 2800, weight: 5.5, isExcitatory: true, description: 'Fibra Gigante aciona manobra de emergência' },
]
