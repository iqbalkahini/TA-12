"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import React, { useEffect, useState } from "react"

interface RoleBasedLayoutProps {
    children: React.ReactNode
    role?: string
    guruData?: {
        is_koordinator?: boolean
        is_pembimbing?: boolean
        is_wali_kelas?: boolean
        is_kaprog?: boolean
    }
    breadcrumbTitle?: string
}

const pathNameMap: Record<string, string> = {
    dashboard: "Dashboard",
    "data-industri": "Data Industri",
    "data-siswa": "Data Siswa",
    "detail-siswa": "Detail Siswa",
    bukti: "Bukti",
    permasalahan: "Permasalahan",
    perizinan: "Perizinan",
    "persetujuan-pindah": "Persetujuan Pindah",
    pembimbing: "Data Pembimbing",
    industri: "Data Industri",
    "monitoring-siswa": "Monitoring Siswa",
    siswa: "Data Siswa",
    absensi: "Absensi",
    jurusan: "Data Jurusan",
    guru: "Data Guru",
    monitoring: "Monitoring PKL",
    pindah: "Pengajuan Pindah",
}

export default function RoleBasedLayout({ 
    children, 
    role, 
    guruData,
    breadcrumbTitle 
}: RoleBasedLayoutProps) {
    const [pathName, setPathName] = useState("")

    useEffect(() => {
        const url = new URL(window.location.href)
        const segments = url.pathname.split("/")
        const currentPath = segments[2] || ""
        setPathName(pathNameMap[currentPath] || breadcrumbTitle || currentPath)
    }, [breadcrumbTitle])

    return (
        <SidebarProvider>
            <AppSidebar role={role} guruData={guruData} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        {pathName}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
