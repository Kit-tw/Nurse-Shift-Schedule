'use client'
import { useState } from 'react'
import CalendarGrid from './CalendarGrid'
import ShiftSummary from './ShiftSummary'
import AllShiftsList from './AllShiftsList'

export type ShiftId = 'morning' | 'evening' | 'night'
export type Schedule = Record<string, ShiftId[]>

export default function NurseCalendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [schedule, setSchedule] = useState<Schedule>({})
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  function changeMonth(dir: number) {
    if (dir === 0) { setYear(now.getFullYear()); setMonth(now.getMonth()); return }
    const next = new Date(year, month + dir, 1)
    setYear(next.getFullYear()); setMonth(next.getMonth())
    setSelectedKey(null)
  }

  function saveShifts(key: string, shifts: ShiftId[]) {
    setSchedule(prev => shifts.length > 0
      ? { ...prev, [key]: shifts }
      : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
    )
  }

  return (
    <div className="min-h-screen bg-clinical p-6">
      <h1 className="text-2xl font-medium mb-1">Nurse Schedule</h1>
      <p className="text-sm text-muted mb-6">Click a date to assign shifts</p>
      <div className="flex gap-6">
        <div className="flex-1">
          <CalendarGrid
            year={year} month={month}
            schedule={schedule}
            selectedKey={selectedKey}
            onSelectDay={setSelectedKey}
            onChangeMonth={changeMonth}
          />
        </div>
        <div className="w-64 flex flex-col gap-4">
          <ShiftSummary
            selectedKey={selectedKey}
            schedule={schedule}
            onSave={saveShifts}
          />
          <AllShiftsList year={year} month={month} schedule={schedule} />
        </div>
      </div>
    </div>
  )
}