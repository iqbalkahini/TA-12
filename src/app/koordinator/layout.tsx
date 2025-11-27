"use client";

import KoordinatorLayout from "@/components/koordinator-layout";
import { useEffect, useState } from "react";

export default function KoordinatorLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [pathName, setPathName] = useState("");

    useEffect(() => {
        const url = new URL(window.location.href);
        setPathName(url.pathname.split("/").at(-1) ?? "");
    }, []);

    if (!pathName) return null;
    
    return (
        <KoordinatorLayout pathname={pathName}>
            {children}
        </KoordinatorLayout>
    )
}
