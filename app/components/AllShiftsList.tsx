'use client'
import { useState } from 'react'
import { useAppSelector } from '../store/hooks'
import { SHIFTS, FILTER_OPTIONS } from '../constants'
import { Radio } from 'antd'

export default function AllShiftsList({ year, month }: { year: number; month: number }) {
  const schedule = useAppSelector(state => state.schedule.data)
  // Options: 'all', 'normal', 'ot' 
  // Wait, user asked to filter or categorize. We'll use local state to filter assignments.
  const [filterMode, setFilterMode] = useState('all')

  const filterOptionsWithAll = [{ value: 'all', label: 'All' }, ...FILTER_OPTIONS]

  const mappedEntries = Object.entries(schedule).map(([k, shifts]) => {
    // filter shifting arrays visually using state
    const filteredShifts = filterMode === 'all'
      ? shifts
      : shifts.filter(s => s.rateType === filterMode)
    return { k, filteredShifts }
  })

  const entries = mappedEntries
    .filter(data => {
      const [y, m] = data.k.split('-').map(Number);
      return y === year && m === month && data.filteredShifts.length > 0
    })
    .sort((a, b) => a.k.localeCompare(b.k))

  return (
    <div className="border border-border rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium text-muted uppercase tracking-wide">Summary</div>
        <Radio.Group
          options={filterOptionsWithAll}
          onChange={(e) => setFilterMode(e.target.value)}
          value={filterMode}
          size="small"
          optionType="button"
          buttonStyle="solid"
          className="scale-[0.80] origin-right"
        />
      </div>

      {entries.length === 0
        ? <div className="text-xs text-muted text-center py-4">No shifts scheduled yet</div>
        : entries.map(({ k, filteredShifts }) => {
          const [y, m, d] = k.split('-').map(Number)
          const date = new Date(y, m, d)
          const label = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
          return (
            <div key={k} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
              <span className="text-xs text-muted w-24 shrink-0">{label}</span>
              <div className="flex gap-2 flex-wrap">
                {filteredShifts.map(assign => (
                  <span key={assign.id} className={`${SHIFTS[assign.id].cls} text-[9px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1`}>
                    {SHIFTS[assign.id].label}
                    {assign.rateType === 'ot' && <b className="text-red-500 bg-white px-0.5 rounded ml-0.5">OT</b>}
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