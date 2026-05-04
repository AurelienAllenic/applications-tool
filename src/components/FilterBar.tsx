import { Search, X, ArrowUpDown, LayoutList, LayoutGrid } from 'lucide-react'
import { ALL_STATUSES, Status } from '../types'

export type SortKey = 'dateEnvoi' | 'entreprise' | 'salaire' | 'createdAt'
export type SortDir = 'asc' | 'desc'

interface Props {
  search: string
  onSearch: (v: string) => void
  filterStatus: Status | ''
  onFilterStatus: (v: Status | '') => void
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
  view: 'table' | 'cards'
  onViewChange: (v: 'table' | 'cards') => void
  total: number
  filtered: number
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'createdAt', label: "Date d'ajout" },
  { value: 'dateEnvoi', label: "Date d'envoi" },
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'salaire', label: 'Salaire' },
]

export function FilterBar({
  search, onSearch,
  filterStatus, onFilterStatus,
  sortKey, sortDir, onSort,
  view, onViewChange,
  total, filtered,
}: Props) {
  return (
    <div className="flex flex-col gap-2 mb-5">

      {/* ── Row 1 : Search + Sort + View ── */}
      <div className="flex gap-2 items-center min-w-0">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8590] pointer-events-none" />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full rounded-lg bg-[#161b22] border border-[#30363d] text-[#e6edf3] pl-9 pr-8 py-2.5 text-sm outline-none transition-all placeholder:text-[#484f58] focus:border-[#ff6b6b] focus:ring-1 focus:ring-[#ff6b6b]/30"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d8590] hover:text-[#e6edf3] transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Sort select */}
        <div className="flex items-center gap-1 shrink-0">
          <ArrowUpDown size={12} className="text-[#7d8590] hidden sm:block" />
          <select
            value={sortKey}
            onChange={e => onSort(e.target.value as SortKey)}
            className="bg-[#161b22] border border-[#30363d] text-[#7d8590] rounded-lg text-xs px-2 py-2.5 outline-none focus:border-[#ff6b6b] transition-colors cursor-pointer w-[90px] sm:w-auto"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => onSort(sortKey)}
            className="p-2.5 rounded-lg border border-[#30363d] text-[#7d8590] hover:text-[#e6edf3] hover:border-[#484f58] transition-colors"
            title={sortDir === 'asc' ? 'Croissant' : 'Décroissant'}
          >
            {sortDir === 'asc' ? (
              <svg width="11" height="11" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 00.753-1.659l-4.796-5.48a1 1 0 00-1.506 0z" />
              </svg>
            ) : (
              <svg width="11" height="11" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 01.753 1.659l-4.796 5.48a1 1 0 01-1.506 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* View toggle — desktop only */}
        <div className="hidden md:flex rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden shrink-0">
          <button
            onClick={() => onViewChange('table')}
            title="Vue tableau"
            className={`px-3 py-2.5 transition-colors ${view === 'table' ? 'bg-[#ff6b6b]/15 text-[#ff6b6b]' : 'text-[#7d8590] hover:text-[#e6edf3]'}`}
          >
            <LayoutList size={14} />
          </button>
          <button
            onClick={() => onViewChange('cards')}
            title="Vue cartes"
            className={`px-3 py-2.5 transition-colors ${view === 'cards' ? 'bg-[#ff6b6b]/15 text-[#ff6b6b]' : 'text-[#7d8590] hover:text-[#e6edf3]'}`}
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>

      {/* ── Row 2 : Status chips + count ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1 no-scrollbar">
        <button
          onClick={() => onFilterStatus('')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            filterStatus === ''
              ? 'bg-[#ff6b6b]/15 border-[#ff6b6b]/30 text-[#ff6b6b]'
              : 'border-[#30363d] text-[#7d8590] hover:text-[#e6edf3] hover:border-[#484f58]'
          }`}
        >
          Tous
        </button>
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => onFilterStatus(filterStatus === s ? '' : s)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
              filterStatus === s
                ? 'bg-[#ff6b6b]/15 border-[#ff6b6b]/30 text-[#ff6b6b]'
                : 'border-[#30363d] text-[#7d8590] hover:text-[#e6edf3] hover:border-[#484f58]'
            }`}
          >
            {s}
          </button>
        ))}
        <span className="ml-auto shrink-0 text-xs text-[#7d8590] pl-2 whitespace-nowrap">
          {filtered !== total ? (
            <><span className="text-[#e6edf3] font-medium">{filtered}</span>/{total}</>
          ) : (
            <><span className="text-[#e6edf3] font-medium">{total}</span> résultat{total > 1 ? 's' : ''}</>
          )}
        </span>
      </div>
    </div>
  )
}
