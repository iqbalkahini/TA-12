"use client"

import RoleBasedLayout from "@/components/role-based-layout"
import { useRoleAccess } from "@/hooks/useRoleAccess"

export default function KaproLayout({ children, pathname }: { children: React.ReactNode, pathname: string }) {
    const { hasAccess, loading, guruData } = useRoleAccess('kapro')

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    // Jika tidak punya akses, useRoleAccess sudah handle redirect
    // Tapi kita tetap return null untuk safety
    if (!hasAccess) {
        return null
    }

    return (
        <RoleBasedLayout
            role="kapro"
            guruData={{
                is_pembimbing: guruData?.is_pembimbing,
                is_koordinator: guruData?.is_koordinator,
                is_wali_kelas: guruData?.is_wali_kelas,
                is_kaprog: guruData?.is_kaprog,
            }}
            breadcrumbTitle={pathname}
        >
            {children}
        </RoleBasedLayout>
    )
}
