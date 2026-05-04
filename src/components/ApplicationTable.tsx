import { Application } from '../types'
import { StatusPicker } from './StatusPicker'
import { Pencil, Trash2, ExternalLink } from 'lucide-react'

interface Props {
  applications: Application[]
  onEdit: (app: Application) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Application['statut']) => void
}

function fmt(date: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function ApplicationTable({ applications, onEdit, onDelete, onStatusChange }: Props) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-20 text-[#7d8590]">
        <p className="text-5xl mb-4">📭</p>
        <p className="font-semibold text-[#e6edf3]">Aucune candidature trouvée</p>
        <p className="text-sm mt-1">Modifiez vos filtres ou ajoutez une nouvelle candidature.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#30363d] w-full">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#30363d] bg-[#1e2530]">
            {['Entreprise', 'Poste', 'Localisation', 'Date envoi', 'Salaire', 'Contact', 'Statut', 'Relance', 'Offre', ''].map(h => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-[#7d8590] uppercase tracking-wider whitespace-nowrap first:rounded-tl-xl last:rounded-tr-xl"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {applications.map((app, i) => (
            <tr
              key={app.id}
              className={`border-b border-[#30363d] last:border-0 transition-colors hover:bg-white/[0.02] ${
                i % 2 === 0 ? '' : 'bg-white/[0.01]'
              }`}
            >
              <td className="px-4 py-3 font-semibold text-[#e6edf3] whitespace-nowrap max-w-[160px]" style={{ fontFamily: 'Syne, sans-serif' }}>
                <span className="truncate block">{app.entreprise}</span>
              </td>
              <td className="px-4 py-3 text-[#7d8590] max-w-[200px]">
                <span className="truncate block">{app.poste || '—'}</span>
              </td>
              <td className="px-4 py-3 text-[#7d8590] whitespace-nowrap">{app.localisation || '—'}</td>
              <td className="px-4 py-3 text-[#7d8590] whitespace-nowrap">{fmt(app.dateEnvoi)}</td>
              <td className="px-4 py-3 text-[#7d8590] whitespace-nowrap">
                {app.salaire ? `${app.salaire}k€` : '—'}
              </td>
              <td className="px-4 py-3 text-[#7d8590] whitespace-nowrap max-w-[120px]">
                <span className="truncate block">{app.contact || '—'}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="relative">
                  <StatusPicker app={app} onStatusChange={onStatusChange} position="down" />
                </div>
              </td>
              <td className="px-4 py-3 text-[#7d8590] whitespace-nowrap">{fmt(app.dateRelance)}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {app.lienOffre ? (
                  <a
                    href={app.lienOffre}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#7d8590] hover:text-[#ff6b6b] transition-colors"
                  >
                    <ExternalLink size={13} />
                    <span className="text-xs">Voir</span>
                  </a>
                ) : '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(app)}
                    className="p-1.5 rounded-lg text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/5 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => onDelete(app.id)}
                    className="p-1.5 rounded-lg text-[#7d8590] hover:text-red-400 hover:bg-red-400/5 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
