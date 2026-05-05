import { useState, useMemo, useRef } from 'react'
import { Plus, Download, Upload, Briefcase, X, Trash2 } from 'lucide-react'
import { useApplications } from './hooks/useApplications'
import { StatsDashboard } from './components/StatsDashboard'
import { ApplicationTable } from './components/ApplicationTable'
import { ApplicationCard } from './components/ApplicationCard'
import { ApplicationModal } from './components/ApplicationModal'
import { FilterBar, SortKey, SortDir } from './components/FilterBar'
import { ToastContainer, useToast } from './components/Toast'
import { Application, Status } from './types'

/** Première valeur numérique trouvée — utile pour une fourchette type « 45-50 » ou « 45 à 50 ». */
function salarySortValue(raw: string): number {
  const matches = raw.match(/\d+(?:[.,]\d+)?/g)
  if (!matches?.length) return 0
  return parseFloat(matches[0].replace(',', '.'))
}

export default function App() {
  const {
    applications,
    addApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
    clearAll,
    exportData,
    importData,
  } = useApplications()

  const { toasts, removeToast, toast } = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [clearConfirm, setClearConfirm] = useState(false)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<Status | ''>('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [view, setView] = useState<'table' | 'cards'>('table')

  const importRef = useRef<HTMLInputElement>(null)

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = useMemo(() => {
    let list = [...applications]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        a =>
          a.entreprise.toLowerCase().includes(q) ||
          a.poste.toLowerCase().includes(q) ||
          a.localisation.toLowerCase().includes(q)
      )
    }
    if (filterStatus) {
      list = list.filter(a => a.statut === filterStatus)
    }
    list.sort((a, b) => {
      let av: string | number = a[sortKey] ?? ''
      let bv: string | number = b[sortKey] ?? ''
      if (sortKey === 'salaire') {
        av = salarySortValue(a.salaire)
        bv = salarySortValue(b.salaire)
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [applications, search, filterStatus, sortKey, sortDir])

  const openAdd = () => {
    setEditingApp(null)
    setModalOpen(true)
  }

  const openEdit = (app: Application) => {
    setEditingApp(app)
    setModalOpen(true)
  }

  const handleSave = (data: Omit<Application, 'id' | 'createdAt'>) => {
    if (editingApp) {
      updateApplication(editingApp.id, data)
    } else {
      addApplication(data)
    }
  }

  const handleDelete = (id: string) => setDeleteConfirm(id)
  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteApplication(deleteConfirm)
      setDeleteConfirm(null)
      toast.info('Candidature supprimée')
    }
  }

  const handleExport = () => {
    const count = exportData()
    toast.success(
      'Export réussi',
      `${count} candidature${count > 1 ? 's' : ''} exportée${count > 1 ? 's' : ''} · jobtracker_${new Date().toISOString().split('T')[0]}.json`
    )
  }

  const handleImport = async (file: File) => {
    const result = await importData(file)
    if (result.ok) {
      toast.success(
        'Import réussi',
        `${result.count} candidature${result.count > 1 ? 's' : ''} restaurée${result.count > 1 ? 's' : ''}`
      )
    } else {
      toast.error('Import échoué', result.reason)
    }
  }

  const handleClearAll = () => {
    clearAll()
    setClearConfirm(false)
    toast.info('Données effacées', 'Vous pouvez maintenant importer un fichier.')
  }

  const appToDelete = applications.find(a => a.id === deleteConfirm)

  return (
    <div className="min-h-screen bg-[#0d1117]">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-[#0d1117]/90 backdrop-blur-md border-b border-[#30363d]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2 min-w-0 overflow-hidden">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-xl bg-[#ff6b6b]/15 border border-[#ff6b6b]/20">
              <Briefcase size={16} className="text-[#ff6b6b]" />
            </div>
            <div>
              <h1
                className="text-base sm:text-lg font-extrabold text-[#e6edf3] leading-none"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                JobTracker
              </h1>
              <p className="text-[10px] text-[#7d8590] leading-none mt-0.5 hidden sm:block">
                Suivi de candidatures
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <input
              ref={importRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleImport(file)
                e.target.value = ''
              }}
            />

            {/* Vider tout — icône seule sur mobile */}
            <button
              onClick={() => setClearConfirm(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-sm font-medium text-[#7d8590] hover:text-red-400 hover:bg-red-400/5 border border-[#30363d] hover:border-red-400/20 transition-colors"
              title="Vider toutes les données"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline text-xs">Vider</span>
            </button>

            {/* Import */}
            <button
              onClick={() => importRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-sm font-medium text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/5 border border-[#30363d] transition-colors"
              title="Importer un fichier JSON"
            >
              <Upload size={14} />
              <span className="hidden sm:inline text-xs">Importer</span>
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-sm font-medium text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/5 border border-[#30363d] transition-colors"
              title="Exporter en JSON"
            >
              <Download size={14} />
              <span className="hidden sm:inline text-xs">Exporter</span>
            </button>
            {/* Add button — hidden on mobile (FAB used instead) */}
            <button
              onClick={openAdd}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[#ff6b6b] hover:bg-[#ff5252] text-white transition-all hover:shadow-lg hover:shadow-[#ff6b6b]/20 active:scale-95"
            >
              <Plus size={16} />
              Ajouter
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 pb-24 sm:pb-8 min-w-0">
        <StatsDashboard applications={applications} />

        <FilterBar
          search={search}
          onSearch={setSearch}
          filterStatus={filterStatus}
          onFilterStatus={setFilterStatus}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          view={view}
          onViewChange={setView}
          total={applications.length}
          filtered={filtered.length}
        />

        {/* ── Table : desktop uniquement (CSS), visible si view === 'table' ── */}
        <div className={view === 'table' ? 'hidden md:block' : 'hidden'}>
          {filtered.length === 0
            ? <EmptyState onAdd={openAdd} />
            : <ApplicationTable
                applications={filtered}
                onEdit={openEdit}
                onDelete={handleDelete}
                onStatusChange={updateStatus}
              />
          }
        </div>

        {/* ── Cartes : toujours visible sur mobile, visible sur desktop si view === 'cards' ── */}
        <div className={view === 'cards' ? 'block' : 'md:hidden'}>
          {filtered.length === 0 ? (
            <EmptyState onAdd={openAdd} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(app => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onStatusChange={updateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── FAB mobile ── */}
      <button
        onClick={openAdd}
        className="sm:hidden fixed bottom-6 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white shadow-2xl shadow-[#ff6b6b]/30 transition-all active:scale-90"
        aria-label="Ajouter une candidature"
      >
        <Plus size={22} />
      </button>

      {/* ── Modal Add/Edit ── */}
      <ApplicationModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingApp(null) }}
        onSave={handleSave}
        initialData={editingApp}
      />

      {/* ── Delete confirm ── */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        >
          <div className="animate-scale-in bg-[#161b22] border border-[#30363d] rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl mx-4">
            <div className="flex items-start justify-between mb-4">
              <h3
                className="font-bold text-[#e6edf3] text-base"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Supprimer ?
              </h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="p-1.5 rounded-lg text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/5 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            {appToDelete && (
              <p className="text-sm text-[#7d8590] mb-5 leading-relaxed">
                Voulez-vous supprimer la candidature chez{' '}
                <span className="text-[#e6edf3] font-semibold">{appToDelete.entreprise}</span>
                {appToDelete.poste && (
                  <> — <span className="italic">{appToDelete.poste}</span></>
                )} ? Cette action est irréversible.
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/5 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-all active:scale-95"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Vider tout — confirmation ── */}
      {clearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        >
          <div className="animate-scale-in bg-[#161b22] border border-[#30363d] rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl mx-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#e6edf3] text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Vider toutes les données ?
                </h3>
                <p className="text-xs text-[#7d8590] mt-1">
                  {applications.length} candidature{applications.length > 1 ? 's' : ''} seront supprimées
                </p>
              </div>
              <button
                onClick={() => setClearConfirm(false)}
                className="p-1.5 rounded-lg text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/5 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3 mb-5">
              <p className="text-xs text-[#7d8590] leading-relaxed">
                💡 <span className="text-[#e6edf3] font-medium">Conseil :</span> Exporte d'abord tes données avant de vider,
                pour pouvoir les réimporter ensuite depuis un autre navigateur ou appareil.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setClearConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/5 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleExport()
                  setTimeout(() => handleClearAll(), 300)
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-[#30363d] text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/5 transition-colors"
              >
                Exporter puis vider
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-all active:scale-95"
              >
                Vider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toasts ── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-16 sm:py-20 text-[#7d8590]">
      <p className="text-5xl mb-4">📭</p>
      <p className="font-semibold text-[#e6edf3] text-base">Aucune candidature trouvée</p>
      <p className="text-sm mt-1">Modifiez vos filtres ou ajoutez une nouvelle candidature.</p>
      <button
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#ff6b6b] hover:bg-[#ff5252] text-white transition-all active:scale-95"
      >
        <Plus size={16} />
        Ajouter une candidature
      </button>
    </div>
  )
}
