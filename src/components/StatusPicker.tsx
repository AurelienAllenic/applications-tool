import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, X } from 'lucide-react'
import { Application, ALL_STATUSES, STATUS_CONFIG } from '../types'
import { StatusBadge } from './StatusBadge'

interface Props {
  app: Application
  onStatusChange: (id: string, status: Application['statut']) => void
}

export function StatusPicker({ app, onStatusChange }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const handlePick = (s: Application['statut']) => {
    onStatusChange(app.id, s)
    setOpen(false)
  }

  // Toujours en portail : évite le clipping (table scroll, transform, overflow)
  const modal = open
    ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex flex-col justify-end md:justify-center md:items-center animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full md:max-w-md bg-[#161b22] border border-[#30363d] rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Poignée — mobile seulement */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-[#484f58]" />
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-[#30363d]">
              <div className="min-w-0 mr-3">
                <p className="font-bold text-[#e6edf3] text-sm md:text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Changer le statut
                </p>
                <p className="text-xs text-[#7d8590] mt-0.5 truncate">
                  {app.entreprise}{app.poste ? ` — ${app.poste}` : ''}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full bg-[#1e2530] text-[#7d8590] hover:text-[#e6edf3] shrink-0"
                type="button"
              >
                <X size={15} />
              </button>
            </div>

            <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-2 gap-2">
              {ALL_STATUSES.map(s => {
                const cfg = STATUS_CONFIG[s]
                const selected = app.statut === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handlePick(s)}
                    className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-medium text-left transition-all border active:scale-95 ${
                      selected
                        ? `${cfg.bg} ${cfg.color} shadow-sm`
                        : 'border-[#30363d] text-[#7d8590] hover:border-[#484f58] hover:text-[#e6edf3]'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${selected ? cfg.dot : 'bg-[#484f58]'}`} />
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 hover:opacity-80 active:scale-95 transition-all"
      >
        <StatusBadge status={app.statut} size="sm" />
        <ChevronDown
          size={13}
          className={`text-[#7d8590] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {modal}
    </>
  )
}
