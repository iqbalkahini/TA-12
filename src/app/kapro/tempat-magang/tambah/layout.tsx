"use client"

import KaproLayout from "@/components/kapro-layout";

export default function TambahIndustriLayout({ children }: { children: React.ReactNode }) {
    return (
        <KaproLayout pathname="Tambah Industri">
            {children}
        </KaproLayout>
    )
}