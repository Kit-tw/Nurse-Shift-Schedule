"use client";

import React, { useState } from 'react';
import { Menu, Button } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SettingOutlined } from '@ant-design/icons';
import SettingsModal from './SettingsModal';

export type NavComponent = {
    name: string;
    route: string;
};

const navItems: NavComponent[] = [
    { name: 'Home', route: '/' },
    { name: 'Login / Register', route: '/login' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const menuItems = navItems.map((item) => ({
        key: item.route,
        label: <Link href={item.route}>{item.name}</Link>,
    }));

    return (
        <div className="flex items-center justify-between border-b border-gray-200 bg-white">
            <Menu
                mode="horizontal"
                selectedKeys={[pathname || '/']}
                items={menuItems}
                style={{ display: 'flex', flex: 1, padding: '0.5rem 1rem', fontSize: '1rem', fontWeight: 500, borderBottom: 'none' }}
            />
            <div className="pr-6">
                <Button
                    type="text"
                    icon={<SettingOutlined />}
                    className="text-muted hover:text-primary transition-colors flex items-center font-medium"
                    onClick={() => setSettingsOpen(true)}
                >
                    Global Settings
                </Button>
            </div>
            <SettingsModal
                visible={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                mode="global"
            />
        </div>
    );
}
