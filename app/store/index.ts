import { configureStore } from '@reduxjs/toolkit';
import scheduleReducer from './scheduleSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
    reducer: {
        schedule: scheduleReducer,
        settings: settingsReducer,
    },
});

// Sync store to localStorage
store.subscribe(() => {
    if (typeof window !== 'undefined') {
        const state = store.getState();
        try {
            localStorage.setItem('nurse_schedule_data', JSON.stringify({
                schedule: state.schedule.data,
                settings: state.settings
            }));
        } catch (e) {
            console.error('Could not save state', e);
        }
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
