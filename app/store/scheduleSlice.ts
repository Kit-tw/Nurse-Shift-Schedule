import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShiftId } from '../constants';

export type RateType = 'normal' | 'ot' | 'extra';

export interface ShiftAssignment {
    id: ShiftId;
    rateType: RateType;
    extraLabel?: string;
    extraAmount?: number;
    customCategories?: string[]; // Specifically requested custom categories applied on top of the extra shift
}

export type Schedule = Record<string, ShiftAssignment[]>;

interface ScheduleState {
    data: Schedule;
}

const initialState: ScheduleState = {
    data: {},
};

export const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setShifts: (state, action: PayloadAction<{ key: string; shifts: ShiftAssignment[] }>) => {
            const { key, shifts } = action.payload;
            if (shifts.length > 0) {
                state.data[key] = shifts;
            } else {
                delete state.data[key];
            }
        },
        loadStoredSchedule: (state, action: PayloadAction<any>) => {
            // Auto-migrate old primitive string formats strictly to object array internally
            const incoming = action.payload;
            const normalized: Schedule = {};
            for (const [k, v] of Object.entries(incoming)) {
                if (Array.isArray(v) && v.length > 0) {
                    if (typeof v[0] === 'string') {
                        normalized[k] = (v as unknown as string[]).map(id => ({ id: id as ShiftId, rateType: 'normal' }));
                    } else {
                        normalized[k] = v as ShiftAssignment[];
                    }
                } else {
                    normalized[k] = [];
                }
            }
            state.data = normalized;
        }
    },
});

export const { setShifts, loadStoredSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
