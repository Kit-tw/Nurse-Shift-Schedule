'use client'
import { useState, useEffect } from 'react'
import { Schedule, ShiftId } from './NurseCalendar'

const SHIFTS = [
  { id: 'morning' as ShiftId, label: 'เช้า', time: '08:00–16:00', icon: '☀', bg: 'bg-green-50 border-green-200', text: 'text-green-800' },
  { id: 'evening' as ShiftId, label: 'บ่าย', time: '16:00–24:00', icon: '🌅', bg: 'bg-orange-50 border-orange-200', text: 'text-orange-800' },
  { id: 'night' as ShiftId, label: 'ดึก', time: '24:00–08:00', icon: '⏾', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800' },
]

export default function ShiftSummary({ selectedKey, schedule, onSave }: {
  selectedKey: string | null; schedule: Schedule
  onSave: (key: string, shifts: ShiftId[]) => void
}) {
  const [selected, setSelected] = useState<ShiftId[]>([])

  useEffect(() => {
    setSelected(selectedKey ? schedule[selectedKey] || [] : [])
  }, [selectedKey, schedule])

  if (!selectedKey) {
    return (
      <div className="border border-border rounded-xl p-4 bg-white text-sm text-muted text-center py-8">
        Click any date to assign shifts
      </div>
    )
  }

  const [y, m, d] = selectedKey.split('-').map(Number)
  const date = new Date(y, m, d)
  const label = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  function toggle(id: ShiftId) {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  return (
    <div className="border border-border rounded-xl p-4 bg-white">
      <div className="font-medium text-main text-sm mb-0.5">{label}</div>
      <div className="text-xs text-muted mb-3">Select one or more shifts</div>
      {SHIFTS.map(s => {
        const isSel = selected.includes(s.id)
        return (
          <div key={s.id}
            onClick={() => toggle(s.id)}
            className={`flex items-center gap-2 p-2 rounded-lg border mb-1.5 cursor-pointer transition-colors
              ${isSel ? `${s.bg} border-opacity-60` : 'border-border hover:bg-clinical'}`}
          >
            <span className="text-sm w-5 text-center">{s.icon}</span>
            <div className="flex-1">
              <div className={`text-xs font-medium ${isSel ? s.text : 'text-main'}`}>{s.label}</div>
              <div className="text-[10px] text-muted">{s.time}</div>
            </div>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px]
              ${isSel ? 'bg-success border-success text-white' : 'border-border'}`}>
              {isSel && '✓'}
            </div>
          </div>
        )
      })}
      <button onClick={() => onSave(selectedKey, selected)}
        className="w-full mt-2 py-1.5 text-xs font-medium bg-success hover:brightness-95 text-white rounded-lg transition-colors">
        Save shifts
      </button>
      <button onClick={() => { setSelected([]); onSave(selectedKey, []) }}
        className="w-full mt-1 py-1.5 text-xs text-muted hover:bg-clinical border border-border rounded-lg transition-colors">
        Clear
      </button>
    </div>
  )
}