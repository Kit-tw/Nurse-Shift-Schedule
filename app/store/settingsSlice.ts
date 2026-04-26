import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CategoryType = 'shift' | 'work_day' | 'month' | 'all';

export type IncomeCategory = {
    id: string;
    name: string;
    type: CategoryType;
};

// e.g., morning -> { normal: true, ot: false }
export type ShiftIncomeMap = Record<string, boolean>;

export interface SettingsState {
    categories: IncomeCategory[];
    globalRates: Record<string, string>;
    globalShiftMap: Record<string, ShiftIncomeMap>;
    globalWorkdayMap: Record<string, boolean>;
    globalMonthMap: Record<string, boolean>; // monthly mappings: { base_salary: true }
    monthOverrides: Record<string, {
        rates?: Record<string, string>;
        shiftMap?: Record<string, ShiftIncomeMap>;
        workdayMap?: Record<string, boolean>;
        monthMap?: Record<string, boolean>;
    }>;
}

const initialState: SettingsState = {
    categories: [
        { id: 'normal', name: 'Normal', type: 'shift' },
        { id: 'ot', name: 'OT', type: 'shift' },
        { id: 'benefit', name: 'Benefit', type: 'all' },
        { id: 'certificate', name: 'Certificate', type: 'work_day' },
    ],
    globalRates: {
        normal: '450',
        ot: '900',
        benefit: '300',
        certificate: '1000'
    },
    globalShiftMap: {
        morning: { normal: true },
        evening: { normal: true },
        night: { normal: true, benefit: true }
    },
    globalWorkdayMap: {
        certificate: true
    },
    globalMonthMap: {},
    monthOverrides: {}
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateCategories: (state, action: PayloadAction<IncomeCategory[]>) => {
            state.categories = action.payload;
        },
        updateGlobalRates: (state, action: PayloadAction<Record<string, string>>) => {
            state.globalRates = action.payload;
        },
        updateGlobalShiftMap: (state, action: PayloadAction<Record<string, ShiftIncomeMap>>) => {
            state.globalShiftMap = action.payload;
        },
        updateGlobalWorkdayMap: (state, action: PayloadAction<Record<string, boolean>>) => {
            state.globalWorkdayMap = action.payload;
        },
        updateGlobalMonthMap: (state, action: PayloadAction<Record<string, boolean>>) => {
            state.globalMonthMap = action.payload;
        },
        updateMonthOverrides: (state, action: PayloadAction<{
            monthKey: string;
            rates: Record<string, string>;
            shiftMap: Record<string, ShiftIncomeMap>;
            workdayMap: Record<string, boolean>;
            monthMap: Record<string, boolean>;
        }>) => {
            state.monthOverrides[action.payload.monthKey] = {
                rates: action.payload.rates,
                shiftMap: action.payload.shiftMap,
                workdayMap: action.payload.workdayMap,
                monthMap: action.payload.monthMap,
            };
        },
        clearMonthOverrides: (state, action: PayloadAction<string>) => {
            delete state.monthOverrides[action.payload];
        },
        loadStoredSettings: (state, action: PayloadAction<SettingsState>) => {
            const loaded = action.payload;
            if (!loaded.globalWorkdayMap) loaded.globalWorkdayMap = {};
            if (!loaded.globalMonthMap) loaded.globalMonthMap = {};
            if (loaded.categories && loaded.categories.length > 0) {
                loaded.categories = loaded.categories.map(c => {
                    let t = c.type;
                    if ((t as string) === 'both') t = 'all';
                    return { ...c, type: t || 'shift' };
                });
            }
            return loaded;
        }
    },
});

export const {
    updateCategories,
    updateGlobalRates,
    updateGlobalShiftMap,
    updateGlobalWorkdayMap,
    updateGlobalMonthMap,
    updateMonthOverrides,
    clearMonthOverrides,
    loadStoredSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;
