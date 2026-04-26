"use client";

import React from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavComponent = {
    name: string;
    route: string;
};

const navItems: NavComponent[] = [
    { name: 'Home', route: '/' },
];

export default function Navbar() {
    const pathname = usePathname();

    const menuItems = navItems.map((item) => ({
        key: item.route,
        label: <Link href={item.route}>{item.name}</Link>,
    }));

    return (
        <Menu
            mode="horizontal"
            selectedKeys={[pathname || '/']}
            items={menuItems}
            style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0.5rem 1rem', fontSize: '1rem', fontWeight: 500 }}
        />
    );
}
