import { Schedule } from '../store/scheduleSlice';
import { SettingsState } from '../store/settingsSlice';

export type BreakdownItem = { name: string; amount: number; count: number };
export type MonthlySalaryResult = {
    total: number;
    breakdown: Record<string, BreakdownItem>;
};

export function calculateMonthSalary(
    year: number,
    month: number,
    schedule: Schedule,
    settings: SettingsState
): MonthlySalaryResult {
    const monthKey = `${year}-${month}`;
    const overrides = settings.monthOverrides[monthKey];

    const rates = overrides?.rates || settings.globalRates;
    const shiftMap = overrides?.shiftMap || settings.globalShiftMap;
    const workdayMap = overrides?.workdayMap || settings.globalWorkdayMap;
    const monthMap = overrides?.monthMap || settings.globalMonthMap;

    // Accumulators
    const breakdown: Record<string, BreakdownItem> = {};
    let total = 0;

    const addIncome = (id: string, name: string, amount: number) => {
        if (amount <= 0) return;
        if (!breakdown[id]) breakdown[id] = { name, amount: 0, count: 0 };
        breakdown[id].amount += amount;
        breakdown[id].count += 1;
        total += amount;
    };

    const getCatName = (id: string) => settings.categories.find(c => c.id === id)?.name || id;

    let hasAnyAssignments = false;

    for (const [dateKey, assignments] of Object.entries(schedule)) {
        const [y, m] = dateKey.split('-').map(Number);
        if (y !== year || m !== month || assignments.length === 0) continue;

        hasAnyAssignments = true;

        // Working Day Logic
        const workdayCats = Object.entries(workdayMap || {})
            .filter(([, isChecked]) => isChecked)
            .map(([id]) => id);

        workdayCats.forEach(id => {
            const amount = parseFloat(rates[id]) || 0;
            addIncome(id, getCatName(id), amount);
        });

        for (const shift of assignments) {
            if (shift.rateType === 'extra') {
                const amount = shift.extraAmount || 0;
                const label = shift.extraLabel || 'Extra Shift';
                addIncome(`extra_${label}`, label, amount);

                shift.customCategories?.forEach(id => {
                    const catAmount = parseFloat(rates[id]) || 0;
                    addIncome(id, getCatName(id), catAmount);
                });
            } else {
                const baseAmount = parseFloat(rates[shift.rateType]) || 0;
                if (baseAmount > 0) {
                    addIncome(shift.rateType, getCatName(shift.rateType), baseAmount);
                }

                const assignedCats = shiftMap[shift.id] || {};
                Object.entries(assignedCats).forEach(([catId, isChecked]) => {
                    if (isChecked && catId !== 'normal' && catId !== 'ot') {
                        const catAmt = parseFloat(rates[catId]) || 0;
                        addIncome(catId, getCatName(catId), catAmt);
                    }
                });
            }
        }
    }

    // Monthly Flat Logic
    if (hasAnyAssignments && monthMap) {
        const monthCats = Object.entries(monthMap)
            .filter(([, isChecked]) => isChecked)
            .map(([id]) => id);

        monthCats.forEach(id => {
            const amount = parseFloat(rates[id]) || 0;
            addIncome(id, getCatName(id), amount);
        });
    }

    return { total, breakdown };
}
