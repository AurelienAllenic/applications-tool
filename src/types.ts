export type Status =
  | 'En attente'
  | 'Relancé'
  | 'Entretien'
  | 'Offre reçue'
  | 'Accepté'
  | 'Refusé'

export interface Application {
  id: string
  entreprise: string
  poste: string
  localisation: string
  dateEnvoi: string
  lienOffre: string
  contact: string
  salaire: string
  statut: Status
  dateRelance: string
  commentaires: string
  createdAt: string
}

export const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; dot: string }> = {
  'En attente': {
    label: 'En attente',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border border-amber-400/20',
    dot: 'bg-amber-400',
  },
  'Relancé': {
    label: 'Relancé',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border border-purple-400/20',
    dot: 'bg-purple-400',
  },
  'Entretien': {
    label: 'Entretien',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border border-blue-400/20',
    dot: 'bg-blue-400',
  },
  'Offre reçue': {
    label: 'Offre reçue',
    color: 'text-teal-400',
    bg: 'bg-teal-400/10 border border-teal-400/20',
    dot: 'bg-teal-400',
  },
  'Accepté': {
    label: 'Accepté',
    color: 'text-green-400',
    bg: 'bg-green-400/10 border border-green-400/20',
    dot: 'bg-green-400',
  },
  'Refusé': {
    label: 'Refusé',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border border-red-400/20',
    dot: 'bg-red-400',
  },
}

export const ALL_STATUSES: Status[] = [
  'En attente',
  'Relancé',
  'Entretien',
  'Offre reçue',
  'Accepté',
  'Refusé',
]

/** Contact / salaire quand l'utilisateur laisse la valeur par défaut */
export const LIBELLE_NON_SPECIFIE = 'Non spécifié'

/** Résumé carte & tableau : montants en k€, sans suffixe pour « Non spécifié ». */
export function formatSalaireResume(raw: string): string {
  const t = raw.trim()
  if (!t) return '—'
  const norm = t.replace(/\s+/g, ' ').toLowerCase()
  if (norm === LIBELLE_NON_SPECIFIE.toLowerCase()) return LIBELLE_NON_SPECIFIE
  return `${t} k€`
}

export const EMPTY_FORM: Omit<Application, 'id' | 'createdAt'> = {
  entreprise: '',
  poste: '',
  localisation: 'Paris',
  dateEnvoi: new Date().toISOString().split('T')[0],
  lienOffre: '',
  contact: LIBELLE_NON_SPECIFIE,
  salaire: LIBELLE_NON_SPECIFIE,
  statut: 'En attente',
  dateRelance: '',
  commentaires: '',
}
