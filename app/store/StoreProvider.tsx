"use client";

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { loadStoredSchedule } from './scheduleSlice';
import { loadStoredSettings } from './settingsSlice';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Hydrate store from localStorage on mount
        try {
            const stored = localStorage.getItem('nurse_schedule_data');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.schedule) store.dispatch(loadStoredSchedule(parsed.schedule));
                if (parsed.settings) store.dispatch(loadStoredSettings(parsed.settings));
            }
        } catch (e) {
            console.error('Failed to load state from localStorage', e);
        }

        setIsClient(true);
    }, []);

    // Prevent layout shifts / hydration mismatch by not rendering until client is ready
    if (!isClient) return null;

    return <Provider store={store}>{children}</Provider>;
}
