"use client"
import { SessionProvider } from "next-auth/react";
import SessionInfo from "./SessionInfo";
import { useEffect } from "react";

export default function Content({ children }: any) {
    useEffect(() => {
        // Fix issue where Leaflet icon images don't display correctly in Next.js
        const L = require('leaflet');
        delete L.Icon.Default.prototype._getIconUrl;
    }, []);

    return <>
        <SessionProvider>
            <SessionInfo>
                <main>{children}</main>
            </SessionInfo>
        </SessionProvider>
    </>
}