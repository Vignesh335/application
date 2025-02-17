"use client"
import React, { useEffect, useState } from 'react';
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useRouter as nextRouter } from 'next/router';
import { signOut } from 'next-auth/react';

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
};

const items: MenuProps['items'] = [
    {
        label: 'Profile',
        key: 'profile'
    },
    {
        label: 'Create Admin',
        key: 'create-admin'
    },
    {
        label: 'View Admin',
        key: 'view-admin'
    },
    {
        label: 'View Volunteers',
        key: 'view-volunteers'
    },
    {
        label: 'View Child Application',
        key: 'view-child'
    },
    {
        label: 'View Pregnant Application',
        key: 'view-pregnant'
    },
    {
        label: 'View Widow Application',
        key: 'view-widow'
    },
    {
        label: 'View Old Age Application',
        key: 'view-old-aged'
    },
    {
        label: 'View Village Application',
        key: 'view-village'
    },
    {
        label: 'View Borewell Application',
        key: 'view-borewell'
    },
    {
        label: 'View Medical Application',
        key: 'view-medical-camp'
    },
    {
        label: 'Other Activities',
        key: 'other-activities'
    },
    {
        label: 'Map',
        key: 'map'
    },
    {
        label: 'Signout',
        key: 'signout'
    }
]

function AppLayout({ children, defaultpath, pathIndex }: any) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const router = useRouter()
    const pathname = usePathname()

    return (
        <Layout hasSider>
            <Sider style={siderStyle}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    onClick={(item) => {
                        if (item.key === 'signout') {
                            signOut()
                        }
                        else {
                            if (pathname.split('/')?.[pathIndex] !== item.key && router) {
                                router.push('/' + pathname.split('/')[1] + '/' + item.key)
                            }
                        }
                    }}
                    selectedKeys={[window.location.pathname.split('/')?.[pathIndex]]}
                    items={items}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <div>
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;