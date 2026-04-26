"use client";

import React, { useState } from 'react';
import { Form, Input, Button, Tabs } from 'antd';
import { GoogleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';

export default function AuthPage() {
    const [loading, setLoading] = useState(false);

    const onFinish = (values: any) => {
        setLoading(true);
        console.log('Mock API Call Started with values:', values);
        setTimeout(() => {
            console.log('Mock API Response: Success!');
            setLoading(false);
        }, 1000);
    };

    const handleGoogleLogin = () => {
        console.log('Mock Google OAuth Started');
    };

    const renderForm = (isRegister: boolean) => (
        <Form
            name={isRegister ? 'register' : 'login'}
            layout="vertical"
            className="mt-4"
            onFinish={onFinish}
            requiredMark={false}
        >
            <Form.Item
                name="username"
                label={<span className="text-muted text-sm font-medium">Username</span>}
                rules={[{ required: true, message: 'Please input your Username!' }]}
            >
                <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Username"
                    className="py-2.5 rounded-lg border-border hover:border-primary focus:border-primary"
                />
            </Form.Item>

            <Form.Item
                name="password"
                label={<span className="text-muted text-sm font-medium">Password</span>}
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Password"
                    className="py-2.5 rounded-lg border-border hover:border-primary focus:border-primary"
                />
            </Form.Item>

            {isRegister && (
                <Form.Item
                    name="confirmPassword"
                    label={<span className="text-muted text-sm font-medium">Confirm Password</span>}
                    rules={[
                        { required: true, message: 'Please confirm your Password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Confirm Password"
                        className="py-2.5 rounded-lg border-border hover:border-primary focus:border-primary"
                    />
                </Form.Item>
            )}

            <Form.Item className="mt-8 mb-4">
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full h-11 bg-primary text-white rounded-lg font-medium tracking-wide shadow-md shadow-primary/20 hover:!bg-primary/90 transition-all border-none"
                >
                    {isRegister ? 'Create Account' : 'Sign In'}
                </Button>
            </Form.Item>
        </Form>
    );

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Sign In',
            children: renderForm(false),
        },
        {
            key: '2',
            label: 'Register',
            children: renderForm(true),
        },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-clinical via-primary-light/30 to-clinical p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-primary/5 border border-primary/10 transition-all">

                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-light rounded-2xl text-primary text-xl font-bold mb-4 shadow-inner shadow-primary/10 border border-primary/20">
                        ✚
                    </div>
                    <h1 className="text-2xl font-bold text-main tracking-tight">Nurse Portal</h1>
                    <p className="text-sm text-muted mt-2">Manage your shifts and schedule efficiently.</p>
                </div>

                {/* Tab Selection */}
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    centered
                    indicator={{ size: (origin) => origin - 20, align: 'center' }}
                    className="auth-tabs"
                />

                {/* Social Login Separator */}
                <div className="mt-6 mb-6 flex items-center gap-3">
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="text-xs text-muted uppercase tracking-wider font-medium">Or continue with</span>
                    <div className="flex-1 h-px bg-border"></div>
                </div>

                {/* Google OAuth Placeholder */}
                <Button
                    onClick={handleGoogleLogin}
                    icon={<GoogleOutlined className="text-xl" />}
                    className="w-full h-11 rounded-lg border-border text-main hover:!border-primary hover:!text-primary font-medium hover:shadow-sm transition-all flex items-center justify-center gap-3"
                >
                    Google
                </Button>

            </div>

            {/* Global generic styles overrides for antd Tabs customization fitting the theme */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .auth-tabs .ant-tabs-nav::before { border-bottom-color: var(--color-border) !important; }
        .auth-tabs .ant-tabs-tab { padding: 8px 16px; margin: 0 16px; color: var(--color-muted) !important; font-weight: 500; font-size: 15px; }
        .auth-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: var(--color-primary) !important; font-weight: 600; }
        .auth-tabs .ant-tabs-ink-bar { background: var(--color-primary) !important; border-radius: 4px; height: 3px !important; }
      `}} />
        </div>
    );
}
