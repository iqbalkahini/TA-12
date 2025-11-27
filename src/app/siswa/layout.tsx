"use client"

import SiswaLayout from "@/components/siswa-layout";
import { useEffect, useState } from "react";

export default function LayoutSiswaWrapper({ children }: { children: React.ReactNode }) {
    const [pathName, setPathName] = useState("");


    useEffect(() => {
        const url = new URL(window.location.href);
        setPathName(url.pathname.split("/").at(-1) ?? "");
    }, []);
    return (
        <SiswaLayout pathName={pathName}>
            {children}
        </SiswaLayout>
    )
}