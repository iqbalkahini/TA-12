"use client"

import RoleBasedLayout from "./role-based-layout"

export default function SiswaLayout({ children, pathName }: { children: React.ReactNode, pathName: string }) {
    return (
        <RoleBasedLayout role="ssw" breadcrumbTitle={pathName}>
            {children}
        </RoleBasedLayout>
    )
}