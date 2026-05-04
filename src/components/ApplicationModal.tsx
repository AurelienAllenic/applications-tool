import { useEffect, useRef, useState } from 'react'
import { X, ExternalLink, Building2, MapPin, Calendar, User, Euro, Link, FileText, Bell } from 'lucide-react'
import { Application, ALL_STATUSES, EMPTY_FORM, Status, STATUS_CONFIG } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<Application, 'id' | 'createdAt'>) => void
  initialData?: Application | null
}

interface FieldProps {
  label: string
  icon?: React.ReactNode
  required?: boolean
  children: React.ReactNode
}

function Field({ label, icon, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#7d8590] uppercase tracking-wider">
        {icon && <span className="opacity-70">{icon}</span>}
        {label}
        {required && <span className="text-[#ff6b6b]">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg bg-[#0d1117] border border-[#30363d] text-[#e6edf3] px-3 py-2.5 text-sm outline-none transition-all placeholder:text-[#484f58] focus:border-[#ff6b6b] focus:ring-1 focus:ring-[#ff6b6b]/30'

export function ApplicationModal({ open, onClose, onSave, initialData }: Props) {
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      if (initialData) {
        const { id: _id, createdAt: _c, ...rest } = initialData
        setForm(rest)
      } else {
        setForm({ ...EMPTY_FORM })
      }
      setTimeout(() => firstInputRef.current?.focus(), 50)
    }
  }, [open, initialData])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.entreprise.trim() || !form.poste.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="animate-slide-up w-full sm:max-w-2xl bg-[#161b22] border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92svh] sm:max-h-[95vh] flex flex-col"
        style={{ maxWidth: '100vw' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#e6edf3]" style={{ fontFamily: 'Syne, sans-serif' }}>
              {initialData ? 'Modifier la candidature' : 'Nouvelle candidature'}
            </h2>
            <p className="text-xs text-[#7d8590] mt-0.5">
              {initialData ? 'Modifiez les informations ci-dessous' : 'Renseignez les informations de votre candidature'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto overflow-x-hidden flex-1 px-4 sm:px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Field label="Entreprise" icon={<Building2 size={12} />} required>
              <input
                ref={firstInputRef}
                value={form.entreprise}
                onChange={e => set('entreprise', e.target.value)}
                placeholder="ex : Google, Airbus…"
                className={inputClass}
                required
              />
            </Field>

            <Field label="Intitulé du poste" icon={<FileText size={12} />} required>
              <input
                value={form.poste}
                onChange={e => set('poste', e.target.value)}
                placeholder="ex : Développeur React Senior"
                className={inputClass}
                required
              />
            </Field>

            <Field label="Localisation" icon={<MapPin size={12} />}>
              <input
                value={form.localisation}
                onChange={e => set('localisation', e.target.value)}
                placeholder="ex : Paris, Remote…"
                className={inputClass}
              />
            </Field>

            <Field label="Salaire (k€)" icon={<Euro size={12} />}>
              <input
                value={form.salaire}
                onChange={e => set('salaire', e.target.value)}
                placeholder="ex : 55"
                type="number"
                className={inputClass}
              />
            </Field>

            <Field label="Date d'envoi" icon={<Calendar size={12} />}>
              <input
                value={form.dateEnvoi}
                onChange={e => set('dateEnvoi', e.target.value)}
                type="date"
                className={inputClass}
              />
            </Field>

            <Field label="Date de relance" icon={<Bell size={12} />}>
              <input
                value={form.dateRelance}
                onChange={e => set('dateRelance', e.target.value)}
                type="date"
                className={inputClass}
              />
            </Field>

            <Field label="Contact / Recruteur" icon={<User size={12} />}>
              <input
                value={form.contact}
                onChange={e => set('contact', e.target.value)}
                placeholder="Prénom Nom"
                className={inputClass}
              />
            </Field>

            <Field label="Statut">
              <select
                value={form.statut}
                onChange={e => set('statut', e.target.value as Status)}
                className={inputClass}
              >
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Lien de l'offre" icon={<Link size={12} />}>
              <div className="relative">
                <input
                  value={form.lienOffre}
                  onChange={e => set('lienOffre', e.target.value)}
                  placeholder="https://…"
                  type="url"
                  className={`${inputClass} pr-9`}
                />
                {form.lienOffre && (
                  <a
                    href={form.lienOffre}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d8590] hover:text-[#ff6b6b] transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Commentaires">
                <textarea
                  value={form.commentaires}
                  onChange={e => set('commentaires', e.target.value)}
                  placeholder="Notes, impressions, prochaines étapes…"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          </div>

          {/* Status selector visual */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-[#7d8590] uppercase tracking-wider mb-2">Statut visuel</p>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map(s => {
                const cfg = STATUS_CONFIG[s]
                const selected = form.statut === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('statut', s)}
                    className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium px-3 py-1.5 transition-all border ${
                      selected
                        ? `${cfg.bg} ${cfg.color} scale-105 shadow-md`
                        : 'border-[#30363d] text-[#7d8590] hover:border-[#484f58]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selected ? cfg.dot : 'bg-[#484f58]'}`} />
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#30363d] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/5 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#ff6b6b] hover:bg-[#ff5252] text-white transition-all hover:shadow-lg hover:shadow-[#ff6b6b]/20 active:scale-95"
          >
            {initialData ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}
