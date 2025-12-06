"use client";

import PembimbingLayout from "@/components/pembimbing-layout";
import { useEffect, useState } from "react";

export default function PembimbingLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [pathName, setPathName] = useState("");

    useEffect(() => {
        const url = new URL(window.location.href);
        setPathName(url.pathname.split("/").at(-1) ?? "");
    }, []);

    // Anda bisa render loading dulu saat pathname belum didapat
    if (!pathName) return null;
    return (
        <PembimbingLayout pathname={pathName}>
            {children}
        </PembimbingLayout>
    )
}