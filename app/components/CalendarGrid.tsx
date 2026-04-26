import { MONTHS, SHIFTS } from '../constants'
import { useAppSelector } from '../store/hooks'
import { useState } from 'react'
import SettingsModal from './SettingsModal'

export default function CalendarGrid({ year, month, selectedKey, onSelectDay, onChangeMonth }: {
  year: number; month: number;
  selectedKey: string | null
  onSelectDay: (key: string) => void
  onChangeMonth: (dir: number) => void
}) {
  const schedule = useAppSelector(state => state.schedule.data)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

  const cells: { day: number; current: boolean }[] = []
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, current: false })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true })
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - firstDay + 1, current: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="font-medium text-base">{MONTHS[month]} {year}</span>
          <div className="flex gap-2">
            <button onClick={() => onChangeMonth(-1)} className="border rounded px-2 py-1 text-sm border-border">‹</button>
            <button onClick={() => onChangeMonth(0)} className="border rounded px-2 py-1 text-sm border-border">Today</button>
            <button onClick={() => onChangeMonth(1)} className="border rounded px-2 py-1 text-sm border-border">›</button>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="border border-primary text-primary px-3 py-1 text-sm rounded-lg hover:bg-primary-light transition-colors ml-2 font-medium"
          >
            Edit Month Settings
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-muted uppercase py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map(({ day, current }, i) => {
          const key = current ? `${year}-${month}-${day}` : ''
          const assignments = current ? schedule[key] || [] : []
          const isToday = key === todayKey
          const isSelected = key === selectedKey
          return (
            <div key={i}
              onClick={() => current && onSelectDay(key)}
              className={`min-h-16 p-1 rounded border text-xs cursor-pointer transition-colors
                ${current ? 'bg-white hover:bg-clinical' : 'opacity-30 pointer-events-none bg-white'}
                ${isToday ? 'border-success' : 'border-border'}
                ${isSelected ? 'border-primary border-[1.5px]' : ''}`}
            >
              <div className={`w-5 h-5 flex items-center justify-center text-xs font-medium mb-1
                ${isToday ? 'bg-success text-white rounded-full' : ''}`}>
                {day}
              </div>
              {assignments.map(assignment => (
                <div key={assignment.id} className={`${SHIFTS[assignment.id].color} rounded px-1 py-0.5 mb-0.5 text-[14px] font-medium flex items-center justify-between`}>
                  <div><span className="text-sm w-5 text-center inline-block">{SHIFTS[assignment.id].icon}</span> {SHIFTS[assignment.id].label}</div>
                  {assignment.rateType === 'ot' && <span className="text-[9px] bg-red-500 text-white px-1 rounded font-bold leading-tight">OT</span>}
                </div>
              ))}
            </div>
          )
        })}
      </div>
      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        mode="month"
        monthKey={`${year}-${month}`}
      />
    </div>
  )
}