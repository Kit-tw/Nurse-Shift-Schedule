"use client";

import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Space, Checkbox, Tabs, Select } from 'antd';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
    updateCategories, updateGlobalRates, updateGlobalShiftMap, updateGlobalWorkdayMap, updateGlobalMonthMap,
    updateMonthOverrides, clearMonthOverrides, IncomeCategory, ShiftIncomeMap, CategoryType
} from '../store/settingsSlice';
import { SHIFTS_ARRAY, MONTHS } from '../constants';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface Props {
    visible: boolean;
    onClose: () => void;
    mode: 'global' | 'month';
    monthKey?: string;
}

const TYPE_OPTIONS = [
    { value: 'shift', label: 'Shift' },
    { value: 'work_day', label: 'Work Day' },
    { value: 'month', label: 'Monthly' },
    { value: 'all', label: 'All' }
];

export default function SettingsModal({ visible, onClose, mode, monthKey }: Props) {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(state => state.settings);

    const [categories, setCategories] = useState<IncomeCategory[]>([]);
    const [rates, setRates] = useState<Record<string, string>>({});
    const [shiftMap, setShiftMap] = useState<Record<string, ShiftIncomeMap>>({});
    const [workdayMap, setWorkdayMap] = useState<Record<string, boolean>>({});
    const [monthMap, setMonthMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (visible) {
            if (mode === 'global') {
                setCategories(settings.categories);
                setRates(settings.globalRates);
                setShiftMap(settings.globalShiftMap);
                setWorkdayMap(settings.globalWorkdayMap || {});
                setMonthMap(settings.globalMonthMap || {});
            } else if (mode === 'month' && monthKey) {
                setCategories(settings.categories);
                const override = settings.monthOverrides[monthKey];
                setRates(override?.rates || settings.globalRates);
                setShiftMap(override?.shiftMap || settings.globalShiftMap);
                setWorkdayMap(override?.workdayMap || settings.globalWorkdayMap || {});
                setMonthMap(override?.monthMap || settings.globalMonthMap || {});
            }
        }
    }, [visible, mode, monthKey, settings]);

    const handleSave = () => {
        if (mode === 'global') {
            dispatch(updateCategories(categories));
            dispatch(updateGlobalRates(rates));
            dispatch(updateGlobalShiftMap(shiftMap));
            dispatch(updateGlobalWorkdayMap(workdayMap));
            dispatch(updateGlobalMonthMap(monthMap));
        } else if (mode === 'month' && monthKey) {
            dispatch(updateMonthOverrides({ monthKey, rates, shiftMap, workdayMap, monthMap }));
        }
        onClose();
    };

    const clearMonth = () => {
        if (monthKey) dispatch(clearMonthOverrides(monthKey));
        onClose();
    };

    const addCategory = () => {
        const newId = 'cat_' + Date.now();
        setCategories([...categories, { id: newId, name: 'New Category', type: 'shift' }]);
        setRates({ ...rates, [newId]: '0' });
    };

    const removeCategory = (id: string) => {
        setCategories(categories.filter(c => c.id !== id));
        const newRates = { ...rates }; delete newRates[id]; setRates(newRates);

        // Cleanup nested configs
        const newShiftMap = { ...shiftMap };
        Object.keys(newShiftMap).forEach(sId => { delete newShiftMap[sId][id]; });
        setShiftMap(newShiftMap);

        const newWorkdayMap = { ...workdayMap }; delete newWorkdayMap[id]; setWorkdayMap(newWorkdayMap);
        const newMonthMap = { ...monthMap }; delete newMonthMap[id]; setMonthMap(newMonthMap);
    };

    const title = mode === 'global' ? 'Global Income Settings' : `Edit Settings for ${monthKey ? MONTHS[parseInt(monthKey.split('-')[1])] : ''}`;

    return (
        <Modal
            title={<div className="text-lg font-bold text-main">{title}</div>}
            open={visible}
            onCancel={onClose}
            width={850}
            footer={
                <div className="flex justify-between w-full">
                    {mode === 'month' ? (
                        <Button danger onClick={clearMonth} type="dashed">Reset to Global</Button>
                    ) : <div />}
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={handleSave} className="bg-success hover:!bg-success/90">Save Settings</Button>
                    </Space>
                </div>
            }
        >
            <div className="my-4 text-sm text-muted">
                {mode === 'month' ? 'Overrides defined here apply ONLY to this month.' : 'Defaults defined here apply to all months by default.'}
            </div>

            <Tabs defaultActiveKey="1" items={[
                {
                    key: '1', label: 'Categories & Rates', children: (
                        <div>
                            <div className="grid grid-cols-[2fr,1.5fr,1.5fr,auto] gap-3 mb-2 px-2 text-xs font-semibold text-muted uppercase">
                                <div>Income Name</div>
                                <div>Category Type</div>
                                <div>Default Amount (฿)</div>
                                <div></div>
                            </div>
                            {categories.map(c => (
                                <div key={c.id} className="grid grid-cols-[2fr,1.5fr,1.5fr,auto] gap-3 items-center mb-3">
                                    <Input
                                        value={c.name}
                                        onChange={e => setCategories(categories.map(cat => cat.id === c.id ? { ...cat, name: e.target.value } : cat))}
                                        disabled={mode === 'month'}
                                    />
                                    <Select
                                        options={TYPE_OPTIONS}
                                        value={c.type === 'both' as any ? 'all' : c.type} // Fallback migration
                                        onChange={(val) => setCategories(categories.map(cat => cat.id === c.id ? { ...cat, type: val as CategoryType } : cat))}
                                        disabled={mode === 'month'}
                                        className="w-full"
                                    />
                                    <Input
                                        type="number"
                                        value={rates[c.id] || ''}
                                        onChange={e => setRates({ ...rates, [c.id]: e.target.value })}
                                    />
                                    <Button danger icon={<DeleteOutlined />} onClick={() => removeCategory(c.id)} disabled={mode === 'month'} />
                                </div>
                            ))}
                            {mode === 'global' && (
                                <Button type="dashed" icon={<PlusOutlined />} onClick={addCategory} className="w-full mt-2">
                                    Add Category
                                </Button>
                            )}
                        </div>
                    )
                },
                {
                    key: '2', label: 'Configurations & Filters', children: (
                        <div className="h-[450px] overflow-y-auto pr-3">
                            <h3 className="font-semibold text-main mb-2">Shift Configuration</h3>
                            <p className="text-xs text-muted mb-4">Categories applying strictly to specific individual shifts.</p>
                            {SHIFTS_ARRAY.map(shift => (
                                <div key={shift.id} className="mb-4 border border-border rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
                                        <span className="text-lg">{shift.icon}</span>
                                        <span className="font-semibold text-main">{shift.label} Shift</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {categories.filter(c => c.type === 'shift' || c.type === 'all' || (c.type as any) === 'both').length === 0 && (
                                            <span className="text-xs text-muted italic">No categories mapped to Shift scope.</span>
                                        )}
                                        {categories.filter(c => c.type === 'shift' || c.type === 'all' || (c.type as any) === 'both').map(c => {
                                            const isChecked = shiftMap[shift.id]?.[c.id] || false;
                                            const toggle = (checked: boolean) => setShiftMap({
                                                ...shiftMap,
                                                [shift.id]: { ...(shiftMap[shift.id] || {}), [c.id]: checked }
                                            });
                                            return (
                                                <Checkbox key={c.id} checked={isChecked} onChange={(e) => toggle(e.target.checked)}>
                                                    <span className="font-medium">{c.name}</span> <span className="text-muted text-xs">({rates[c.id]}฿)</span>
                                                </Checkbox>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            <h3 className="font-semibold text-main mt-8 mb-2">Workday Configuration</h3>
                            <p className="text-xs text-muted mb-4">Categories applying generically to any worked day regardless of specific shifts.</p>
                            <div className="border border-border rounded-lg p-4 bg-primary-light/10 mb-8">
                                <div className="flex flex-wrap gap-4">
                                    {categories.filter(c => c.type === 'work_day' || c.type === 'all' || (c.type as any) === 'both').length === 0 && (
                                        <span className="text-xs text-muted italic">No categories mapped to Workday scope.</span>
                                    )}
                                    {categories.filter(c => c.type === 'work_day' || c.type === 'all' || (c.type as any) === 'both').map(c => {
                                        const isChecked = workdayMap[c.id] || false;
                                        const toggle = (checked: boolean) => setWorkdayMap({ ...workdayMap, [c.id]: checked });
                                        return (
                                            <Checkbox key={c.id} checked={isChecked} onChange={(e) => toggle(e.target.checked)}>
                                                <span className="font-medium">{c.name}</span> <span className="text-muted text-xs">({rates[c.id]}฿)</span>
                                            </Checkbox>
                                        );
                                    })}
                                </div>
                            </div>

                            <h3 className="font-semibold text-main mt-8 mb-2">Monthly Configuration</h3>
                            <p className="text-xs text-muted mb-4">Base allowances applied exactly once per month (assuming any active shifts are recorded).</p>
                            <div className="border border-border rounded-lg p-4 bg-success/10 mb-4">
                                <div className="flex flex-wrap gap-4">
                                    {categories.filter(c => c.type === 'month' || c.type === 'all' || (c.type as any) === 'both').length === 0 && (
                                        <span className="text-xs text-muted italic">No categories mapped to Month scope.</span>
                                    )}
                                    {categories.filter(c => c.type === 'month' || c.type === 'all' || (c.type as any) === 'both').map(c => {
                                        const isChecked = monthMap[c.id] || false;
                                        const toggle = (checked: boolean) => setMonthMap({ ...monthMap, [c.id]: checked });
                                        return (
                                            <Checkbox key={c.id} checked={isChecked} onChange={(e) => toggle(e.target.checked)}>
                                                <span className="font-medium">{c.name}</span> <span className="text-muted text-xs">({rates[c.id]}฿)</span>
                                            </Checkbox>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    )
                }
            ]} />
        </Modal>
    );
}
