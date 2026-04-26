'use client'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setShifts, RateType, ShiftAssignment } from '../store/scheduleSlice'
import { SHIFTS_ARRAY } from '../constants'
import type { ShiftId } from '../constants'
import { Radio, Modal, Input, Checkbox } from 'antd'

export default function ShiftSummary({ selectedKey }: { selectedKey: string | null }) {
  const dispatch = useAppDispatch()
  const schedule = useAppSelector(state => state.schedule.data)
  const settings = useAppSelector(state => state.settings)

  const [selected, setSelected] = useState<ShiftAssignment[]>([])

  // Extra Shift Config Modal State
  const [extraModalOpen, setExtraModalOpen] = useState(false)
  const [activeExtraId, setActiveExtraId] = useState<ShiftId | null>(null)

  const [extraName, setExtraName] = useState('')
  const [extraAmount, setExtraAmount] = useState('')
  const [extraCheckedCat, setExtraCheckedCat] = useState<string[]>([])

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
  const workdayCategories = settings.categories.filter(c => c.type === 'work_day' || c.type === 'all')

  function toggle(id: ShiftId) {
    setSelected(prev => {
      const exists = prev.find(s => s.id === id)
      if (exists) return prev.filter(s => s.id !== id)
      return [...prev, { id, rateType: 'normal' }]
    })
  }

  function changeRate(id: ShiftId, rateType: RateType) {
    if (rateType === 'extra') {
      // Open configuration modal before actually committing
      setActiveExtraId(id)
      const existing = selected.find(s => s.id === id)
      setExtraName(existing?.extraLabel || '')
      setExtraAmount(existing?.extraAmount?.toString() || '')
      setExtraCheckedCat(existing?.customCategories || [])
      setExtraModalOpen(true)
    } else {
      setSelected(prev => prev.map(s => s.id === id ? { ...s, rateType, extraLabel: undefined, extraAmount: undefined, customCategories: undefined } : s))
    }
  }

  function saveExtraConfig() {
    if (!activeExtraId) return
    setSelected(prev => prev.map(s =>
      s.id === activeExtraId
        ? { ...s, rateType: 'extra', extraLabel: extraName, extraAmount: parseFloat(extraAmount) || 0, customCategories: extraCheckedCat }
        : s
    ))
    setExtraModalOpen(false)
  }

  function cancelExtraConfig() {
    // Revert visually to whatever it was strictly if they cancel
    setActiveExtraId(null)
    setExtraModalOpen(false)
  }

  function handleSave(shifts: ShiftAssignment[]) {
    if (selectedKey) dispatch(setShifts({ key: selectedKey, shifts }))
  }

  return (
    <div className="border border-border rounded-xl p-4 bg-white">
      <div className="font-medium text-main text-sm mb-0.5">{label}</div>
      <div className="text-xs text-muted mb-3">Select one or more shifts</div>
      {SHIFTS_ARRAY.map(s => {
        const found = selected.find(sel => sel.id === s.id)
        const isSel = !!found
        return (
          <div key={s.id}
            className={`flex flex-col p-2 rounded-lg border mb-1.5 transition-colors
              ${isSel ? `${s.bg} border-opacity-60` : 'border-border hover:bg-clinical'}`}
          >
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggle(s.id)}>
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
            {isSel && (
              <div className="mt-2 pt-2 border-t border-border flex justify-end">
                <Radio.Group
                  size="small"
                  value={found.rateType}
                  onChange={(e) => changeRate(s.id, e.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                  className="scale-90 origin-right"
                >
                  <Radio.Button value="normal">Normal</Radio.Button>
                  <Radio.Button value="ot">OT</Radio.Button>
                  <Radio.Button value="extra">Extra</Radio.Button>
                </Radio.Group>
              </div>
            )}

            {/* Show nice inline label if mapped internally as Extra */}
            {isSel && found.rateType === 'extra' && found.extraAmount && (
              <div className="mt-1 flex items-center justify-between text-[10px] font-medium bg-clinical py-1 px-2 rounded text-main border border-primary/20">
                <span>{found.extraLabel} (+{found.customCategories?.length} cats)</span>
                <span className="text-emerald-600 tabular-nums">฿{found.extraAmount}</span>
              </div>
            )}
          </div>
        )
      })}
      <button onClick={() => handleSave(selected)}
        className="w-full mt-2 py-1.5 text-xs font-medium bg-success hover:brightness-95 text-white rounded-lg transition-colors">
        Save shifts
      </button>
      <button onClick={() => { setSelected([]); handleSave([]) }}
        className="w-full mt-1 py-1.5 text-xs text-muted hover:bg-clinical border border-border rounded-lg transition-colors">
        Clear
      </button>

      {/* Pop up to configure Extra Workday Settings before setting Amount */}
      <Modal
        title="Configure Custom Extra Shift"
        open={extraModalOpen}
        onOk={saveExtraConfig}
        onCancel={cancelExtraConfig}
        okText="Apply Extra"
        okButtonProps={{ className: "bg-primary" }}
      >
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <div className="text-xs font-medium text-muted uppercase mb-1">Extra Label Name</div>
            <Input
              value={extraName}
              onChange={e => setExtraName(e.target.value)}
              placeholder="e.g. OT Holiday"
            />
          </div>

          <div className="bg-clinical p-3 rounded border border-border">
            <div className="text-xs font-medium text-muted uppercase mb-2">Include Add-on Workday Categories</div>
            <div className="flex flex-wrap gap-3">
              {workdayCategories.length === 0 ? <span className="text-xs italic text-muted">No workday categories defined globally.</span> : null}
              {workdayCategories.map(cat => (
                <Checkbox
                  key={cat.id}
                  checked={extraCheckedCat.includes(cat.id)}
                  onChange={(e) => {
                    if (e.target.checked) setExtraCheckedCat([...extraCheckedCat, cat.id])
                    else setExtraCheckedCat(extraCheckedCat.filter(id => id !== cat.id))
                  }}
                >
                  {cat.name}
                </Checkbox>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-muted uppercase mb-1">Base Amount (฿)</div>
            <Input
              type="number"
              value={extraAmount}
              onChange={e => setExtraAmount(e.target.value)}
              placeholder="e.g. 1500"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}