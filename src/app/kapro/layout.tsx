"use client";

import KaproLayout from "@/components/kapro-layout";
import { useEffect, useState } from "react";

export default function KaproLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [pathName, setPathName] = useState("");

    useEffect(() => {
        const url = new URL(window.location.href);
        setPathName(url.pathname.split("/").at(-1) ?? "");
    }, []);

    if (!pathName) return null;
    
    return (
        <KaproLayout pathname={pathName}>
            {children}
        </KaproLayout>
    )
}
