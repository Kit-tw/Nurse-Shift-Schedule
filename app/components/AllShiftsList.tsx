import { Schedule, ShiftId } from './NurseCalendar'
const SHIFTS: Record<ShiftId, { label: string; cls: string }> = {
  morning: { label: 'เช้า', cls: 'bg-green-100 text-green-800' },
  evening: { label: 'บ่าย', cls: 'bg-orange-100 text-orange-800' },
  night: { label: 'ดึก', cls: 'bg-blue-100 text-blue-800' },
}

export default function AllShiftsList({ year, month, schedule }: { year: number; month: number; schedule: Schedule }) {
  const entries = Object.entries(schedule)
    .filter(([k]) => { const [y, m] = k.split('-').map(Number); return y === year && m === month })
    .sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="border border-border rounded-xl p-4 bg-white">
      <div className="text-xs font-medium text-muted uppercase tracking-wide mb-3">All scheduled shifts</div>
      {entries.length === 0
        ? <div className="text-xs text-muted text-center py-4">No shifts scheduled yet</div>
        : entries.map(([key, shifts]) => {
          const [y, m, d] = key.split('-').map(Number)
          const date = new Date(y, m, d)
          const label = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
          return (
            <div key={key} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
              <span className="text-xs text-muted w-24 shrink-0">{label}</span>
              <div className="flex gap-2 flex-wrap">
                {shifts.map(sid => (
                  <span key={sid} className={`${SHIFTS[sid].cls} text-[9px] font-medium px-1.5 py-0.5 rounded`}>
                    {SHIFTS[sid].label}
                  </span>
                ))}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}