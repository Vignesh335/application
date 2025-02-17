"use client";

import { Spin } from "antd";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SessionInfo({ children }: any) {
    const { data: session }: any = useSession();
    const router = useRouter()
    const pathname = window.location.pathname.split("/")

    if ((session && (['trustadmin', 'trustsub'].includes(pathname[1]) && pathname.length > 2) || pathname.length === 2) || pathname.length === 1) {
        return (
            <div>
                {children}
            </div>
        );
    } else {
        return (
            <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
                <div style={{ marginLeft: '20px', fontSize: '30px' }}>
                    Loading
                </div>
            </div>
        );
    }
}
