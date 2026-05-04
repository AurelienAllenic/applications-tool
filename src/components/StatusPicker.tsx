import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, X } from 'lucide-react'
import { Application, ALL_STATUSES, STATUS_CONFIG } from '../types'
import { StatusBadge } from './StatusBadge'

interface Props {
  app: Application
  onStatusChange: (id: string, status: Application['statut']) => void
  position?: 'up' | 'down'
}

export function StatusPicker({ app, onStatusChange, position = 'down' }: Props) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open, isMobile])

  const handlePick = (s: Application['statut']) => {
    onStatusChange(app.id, s)
    setOpen(false)
  }

  // Mobile bottom-sheet : rendu via portal dans document.body
  // → échappe au stacking context créé par transform des cartes animées
  const mobileSheet = isMobile && open
    ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex flex-col justify-end animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full bg-[#161b22] border-t border-[#30363d] rounded-t-2xl animate-slide-up"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#484f58]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#30363d]">
              <div className="min-w-0 mr-3">
                <p className="font-bold text-[#e6edf3] text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Changer le statut
                </p>
                <p className="text-xs text-[#7d8590] mt-0.5 truncate">
                  {app.entreprise}{app.poste ? ` — ${app.poste}` : ''}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full bg-[#1e2530] text-[#7d8590] hover:text-[#e6edf3] shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {/* Options */}
            <div className="px-4 py-3 grid grid-cols-2 gap-2">
              {ALL_STATUSES.map(s => {
                const cfg = STATUS_CONFIG[s]
                const selected = app.statut === s
                return (
                  <button
                    key={s}
                    onClick={() => handlePick(s)}
                    className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-medium text-left transition-all border active:scale-95 ${
                      selected
                        ? `${cfg.bg} ${cfg.color} shadow-sm`
                        : 'border-[#30363d] text-[#7d8590]'
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
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 hover:opacity-80 active:scale-95 transition-all"
      >
        <StatusBadge status={app.statut} size="sm" />
        <ChevronDown
          size={13}
          className={`text-[#7d8590] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Mobile bottom sheet (portal) */}
      {mobileSheet}

      {/* Desktop dropdown */}
      {!isMobile && open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={`absolute ${position === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 z-50 bg-[#1e2530] border border-[#30363d] rounded-xl shadow-2xl py-1.5 min-w-[190px] animate-scale-in`}
          >
            <p className="px-4 py-2 text-[10px] font-semibold text-[#7d8590] uppercase tracking-widest border-b border-[#30363d] mb-1">
              Changer le statut
            </p>
            {ALL_STATUSES.map(s => {
              const cfg = STATUS_CONFIG[s]
              const selected = app.statut === s
              return (
                <button
                  key={s}
                  onClick={() => handlePick(s)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                    selected
                      ? `${cfg.color} bg-white/5 font-medium`
                      : 'text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/5'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${selected ? cfg.dot : 'bg-[#484f58]'}`} />
                  {s}
                  {selected && <span className="ml-auto text-[10px] opacity-60">✓</span>}
                </button>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}
