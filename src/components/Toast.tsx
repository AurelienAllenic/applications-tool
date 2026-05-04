import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastData {
  id: string
  type: ToastType
  title: string
  message?: string
}

const ICONS = {
  success: <CheckCircle size={16} className="text-green-400 shrink-0" />,
  error: <XCircle size={16} className="text-red-400 shrink-0" />,
  info: <Info size={16} className="text-blue-400 shrink-0" />,
}

const BORDERS = {
  success: 'border-green-400/20',
  error: 'border-red-400/20',
  info: 'border-blue-400/20',
}

function ToastItem({ toast, onRemove }: { toast: ToastData; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Entrée
    const t1 = setTimeout(() => setVisible(true), 10)
    // Sortie automatique après 4s
    const t2 = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, 4000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [toast.id, onRemove])

  return (
    <div
      className={`flex items-start gap-3 bg-[#1e2530] border ${BORDERS[toast.type]} rounded-xl px-4 py-3 shadow-2xl max-w-[320px] w-full transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      {ICONS[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#e6edf3] leading-tight">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-[#7d8590] mt-0.5 leading-snug">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300) }}
        className="text-[#7d8590] hover:text-[#e6edf3] transition-colors shrink-0 mt-0.5"
      >
        <X size={13} />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastData[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null
  return createPortal(
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center sm:left-auto sm:right-5 sm:translate-x-0 sm:items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>,
    document.body
  )
}

// Hook utilitaire
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, type, title, message }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const toast = {
    success: (title: string, message?: string) => addToast('success', title, message),
    error: (title: string, message?: string) => addToast('error', title, message),
    info: (title: string, message?: string) => addToast('info', title, message),
  }

  return { toasts, removeToast, toast }
}
