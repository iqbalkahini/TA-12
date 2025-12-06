"use client";

import WaliKelasLayout from "@/components/wali-kelas-layout";
import { useEffect, useState } from "react";

export default function WaliKelasLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [pathName, setPathName] = useState("");

    useEffect(() => {
        const url = new URL(window.location.href);
        setPathName(url.pathname.split("/").at(-1) ?? "");
    }, []);

    if (!pathName) return null;
    
    return (
        <WaliKelasLayout pathname={pathName}>
            {children}
        </WaliKelasLayout>
    )
}
