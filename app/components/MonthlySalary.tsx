'use client'

import React from 'react';
import { useAppSelector } from '../store/hooks';
import { calculateMonthSalary } from '../utils/calculateSalary';

export default function MonthlySalary({ year, month }: { year: number, month: number }) {
    const schedule = useAppSelector(s => s.schedule.data);
    const settings = useAppSelector(s => s.settings);

    const { total, breakdown } = calculateMonthSalary(year, month, schedule, settings);
    const items = Object.values(breakdown).sort((a, b) => b.amount - a.amount);

    return (
        <div className="border border-border rounded-xl p-4 bg-primary-light/15 mt-4 transition-all">
            <div className="text-xs font-medium text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse inline-block"></span>
                Est. Monthly Salary Breakdown
            </div>

            {items.length === 0 ? (
                <div className="text-muted text-xs italic text-center py-4 bg-white/50 rounded-lg border border-border/50">
                    No income computed for this month yet.
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-b border-border/60 pb-1.5 last:border-0 last:pb-0">
                            <span className="text-muted font-medium">
                                {item.name}
                                <span className="text-[10px] text-muted bg-white border border-border px-1.5 py-0.5 ml-2 rounded font-mono">x{item.count}</span>
                            </span>
                            <span className="text-main tabular-nums font-semibold tracking-tight">฿{item.amount.toLocaleString()}</span>
                        </div>
                    ))}
                    <div className="pt-4 flex justify-between items-center mt-2">
                        <span className="font-bold text-main uppercase tracking-widest text-xs">Total Target Pay</span>
                        <span className="font-bold text-lg text-emerald-600 tabular-nums drop-shadow-sm">฿{total.toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
