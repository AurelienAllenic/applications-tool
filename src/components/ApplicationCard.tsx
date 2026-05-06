import { Application, formatSalaireResume } from '../types'
import { StatusPicker } from './StatusPicker'
import { Pencil, Trash2, ExternalLink, MapPin, Calendar, User, Euro, Bell } from 'lucide-react'

interface Props {
  app: Application
  onEdit: (app: Application) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Application['statut']) => void
}

function fmt(date: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function ApplicationCard({ app, onEdit, onDelete, onStatusChange }: Props) {
  return (
    <div className="relative rounded-xl border border-[#30363d] bg-[#161b22] p-4 card-hover flex flex-col gap-3 min-w-0 overflow-hidden">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#e6edf3] truncate text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
            {app.entreprise}
          </p>
          <p className="text-sm text-[#7d8590] truncate mt-0.5">{app.poste}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(app)}
            className="p-2 rounded-lg text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/5 transition-colors"
            title="Modifier"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(app.id)}
            className="p-2 rounded-lg text-[#7d8590] hover:text-red-400 hover:bg-red-400/5 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs text-[#7d8590]">
        {app.localisation && (
          <span className="flex items-center gap-1.5 min-w-0">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{app.localisation}</span>
          </span>
        )}
        {app.dateEnvoi && (
          <span className="flex items-center gap-1.5">
            <Calendar size={11} className="shrink-0" />
            {fmt(app.dateEnvoi)}
          </span>
        )}
        {app.contact && (
          <span className="flex items-center gap-1.5 min-w-0">
            <User size={11} className="shrink-0" />
            <span className="truncate">{app.contact}</span>
          </span>
        )}
        {app.salaire.trim() !== '' && (
          <span className="flex items-center gap-1.5 min-w-0">
            <Euro size={11} className="shrink-0" />
            <span>{formatSalaireResume(app.salaire)}</span>
          </span>
        )}
        {app.dateRelance && (
          <span className="flex items-center gap-1.5 col-span-2">
            <Bell size={11} className="shrink-0" />
            Relance : {fmt(app.dateRelance)}
          </span>
        )}
      </div>

      {/* Comment */}
      {app.commentaires && (
        <p className="text-xs text-[#7d8590] bg-[#0d1117] rounded-lg px-3 py-2 line-clamp-2 leading-relaxed">
          {app.commentaires}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#30363d]">
        <div className="relative">
          <StatusPicker app={app} onStatusChange={onStatusChange} />
        </div>
        {app.lienOffre && (
          <a
            href={app.lienOffre}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#7d8590] hover:text-[#ff6b6b] transition-colors py-1"
          >
            <ExternalLink size={13} />
            <span>Voir l'offre</span>
          </a>
        )}
      </div>
    </div>
  )
}
