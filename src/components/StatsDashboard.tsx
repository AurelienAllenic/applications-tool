import { Application, STATUS_CONFIG, ALL_STATUSES } from '../types'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Briefcase, Clock, MessageSquare, TrendingUp, Trophy, XCircle } from 'lucide-react'

interface Props {
  applications: Application[]
}

const PIE_COLORS: Record<string, string> = {
  'En attente': '#fbbf24',
  'Relancé': '#a78bfa',
  'Entretien': '#60a5fa',
  'Offre reçue': '#2dd4bf',
  'Accepté': '#4ade80',
  'Refusé': '#f87171',
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  bg: string
  delay?: string
}

function StatCard({ label, value, icon, color, bg, delay = '0ms' }: StatCardProps) {
  return (
    <div
      className="animate-slide-up rounded-xl border border-[#30363d] bg-[#161b22] p-3 min-[414px]:p-4 flex flex-col gap-1.5 min-[414px]:gap-2 card-hover overflow-hidden"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between gap-1">
        <p className="text-[9px] min-[414px]:text-[10px] sm:text-xs text-[#7d8590] font-semibold tracking-wide uppercase leading-tight truncate">
          {label}
        </p>
        <span className={`p-1 min-[414px]:p-1.5 rounded-lg ${bg} shrink-0`}>
          <span className={color}>{icon}</span>
        </span>
      </div>
      <p className={`text-2xl min-[414px]:text-3xl sm:text-4xl font-bold tabular-nums ${color}`} style={{ fontFamily: 'Syne, sans-serif' }}>
        {value}
      </p>
    </div>
  )
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0]
    const cfg = STATUS_CONFIG[name as keyof typeof STATUS_CONFIG]
    return (
      <div className="bg-[#1e2530] border border-[#30363d] rounded-lg px-3 py-2 shadow-xl">
        <p className={`text-sm font-semibold ${cfg?.color ?? 'text-white'}`}>{name}</p>
        <p className="text-white text-sm">{value} candidature{value > 1 ? 's' : ''}</p>
      </div>
    )
  }
  return null
}

export function StatsDashboard({ applications }: Props) {
  const total = applications.length
  const byStatus = ALL_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: applications.filter(a => a.statut === s).length }),
    {} as Record<string, number>
  )

  const pieData = ALL_STATUSES.filter(s => byStatus[s] > 0).map(s => ({
    name: s,
    value: byStatus[s],
  }))

  const tauxConversion =
    total > 0
      ? Math.round(((byStatus['Entretien'] + byStatus['Offre reçue'] + byStatus['Accepté']) / total) * 100)
      : 0

  return (
    <section className="mb-6">
      {/* Stat cards : 2 cols < 414px / 3 cols < 768px / 6 cols desktop */}
      <div className="grid grid-cols-2 min-[414px]:grid-cols-3 md:grid-cols-6 gap-2 mb-3">
        <StatCard label="Total" value={total} icon={<Briefcase size={14} />} color="text-[#e6edf3]" bg="bg-white/5" delay="0ms" />
        <StatCard label="Attente" value={byStatus['En attente']} icon={<Clock size={14} />} color="text-amber-400" bg="bg-amber-400/10" delay="50ms" />
        <StatCard label="Relancés" value={byStatus['Relancé']} icon={<MessageSquare size={14} />} color="text-purple-400" bg="bg-purple-400/10" delay="100ms" />
        <StatCard label="Entretiens" value={byStatus['Entretien']} icon={<TrendingUp size={14} />} color="text-blue-400" bg="bg-blue-400/10" delay="150ms" />
        <StatCard label="Acceptés" value={byStatus['Accepté']} icon={<Trophy size={14} />} color="text-green-400" bg="bg-green-400/10" delay="200ms" />
        <StatCard label="Refusés" value={byStatus['Refusé']} icon={<XCircle size={14} />} color="text-red-400" bg="bg-red-400/10" delay="250ms" />
      </div>

      {/* Pie chart */}
      {total > 0 && (
        <div
          className="animate-slide-up rounded-xl border border-[#30363d] bg-[#161b22] p-3 sm:p-5 flex flex-col sm:flex-row items-center gap-3 sm:gap-6"
          style={{ animationDelay: '300ms' }}
        >
          {/* Chart */}
          <div className="w-full sm:w-44 h-40 sm:h-44 shrink-0" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="46%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map(entry => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
              <h3 className="text-xs font-semibold text-[#7d8590] uppercase tracking-wide">Répartition</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-[#1e2530] border border-[#30363d] text-[#7d8590] shrink-0">
                Conv. <span className="text-[#e6edf3] font-semibold">{tauxConversion}%</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {ALL_STATUSES.filter(s => byStatus[s] > 0).map(s => {
                const cfg = STATUS_CONFIG[s]
                const pct = total > 0 ? Math.round((byStatus[s] / total) * 100) : 0
                return (
                  <div key={s} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[s] }} />
                    <span className="text-[#7d8590] truncate">{s}</span>
                    <span className={`ml-auto font-semibold tabular-nums ${cfg.color}`}>{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
