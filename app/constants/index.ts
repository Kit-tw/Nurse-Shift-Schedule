export type ShiftId = 'morning' | 'evening' | 'night';

export const MONTHS = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

export const SHIFTS: Record<ShiftId, { id: ShiftId, label: string; time: string; icon: string; color: string; bg: string; text: string; cls: string }> = {
    morning: { id: 'morning', label: 'เช้า', time: '08:00–16:00', icon: '☀', color: 'bg-green-100 text-green-800', bg: 'bg-green-50 border-green-200', text: 'text-green-800', cls: 'bg-green-100 text-green-800' },
    evening: { id: 'evening', label: 'บ่าย', time: '16:00–24:00', icon: '🌅', color: 'bg-orange-100 text-orange-800', bg: 'bg-orange-50 border-orange-200', text: 'text-orange-800', cls: 'bg-orange-100 text-orange-800' },
    night: { id: 'night', label: 'ดึก', time: '24:00–08:00', icon: '⏾', color: 'bg-blue-100 text-blue-800', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', cls: 'bg-blue-100 text-blue-800' },
};

export const SHIFTS_ARRAY = [SHIFTS.morning, SHIFTS.evening, SHIFTS.night];

export type IncomeCategory = {
    id: string; // e.g. normal, ot, benefit, certificate
    name: string; // "Normal", "OT", "Benefit", "Certificate"
    defaultAmount: string; // e.g. "450", "900"
};

export const DEFAULT_INCOME_CATEGORIES: IncomeCategory[] = [
    { id: 'normal', name: 'Normal', defaultAmount: '450' },
    { id: 'ot', name: 'OT', defaultAmount: '900' },
    { id: 'benefit', name: 'Benefit', defaultAmount: '300' },
    { id: 'certificate', name: 'Certificate', defaultAmount: '1000' }
];

// For the 2 radio buttons in AllShiftsList
export const FILTER_OPTIONS = [
    { value: 'normal', label: 'Normal' },
    { value: 'ot', label: 'OT' }
];
