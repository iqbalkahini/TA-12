"use client";

import KaproLayout from "@/components/kapro-layout";
import { usePathname } from "next/navigation";

export default function KaproLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (!pathname) return null;

    // Jika sedang di halaman edit, jangan gunakan KaproLayout (biarkan layout edit yang handle)
    if (pathname.includes("/edit") || pathname.includes("/tambah")) {
        return <>{children}</>;
    }

    const title = pathname.split("/").at(-1) ?? "";

    return (
        <KaproLayout pathname={title}>
            {children}
        </KaproLayout>
    )
}
