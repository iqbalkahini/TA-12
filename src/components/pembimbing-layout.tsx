"use client"

import RoleBasedLayout from "@/components/role-based-layout"
import { useGuruData } from "@/hooks/useGuruData"

export default function PembimbingLayout({ children, pathname }: { children: React.ReactNode, pathname: string }) {
    const { guruData, loading } = useGuruData()

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return (
        <RoleBasedLayout
            role="pembimbing"
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

    // return (
    //     <div className="flex">
    //         {/* SIDEBAR */}
    //         <aside className="w-20 bg-[#6b1717] text-white h-screen flex flex-col items-center py-6 fixed">
    //             <div className="w-full flex items-center justify-center mb-6">
    //                 <GraduationCap className="w-10 h-10 bg-white rounded-sm text-[#6b1717] p-1" />
    //             </div>

    //             <nav className="flex-1 w-full flex flex-col items-center space-y-5 mt-2">
    //                 <button className="">
    //                     <Home
    //                         className="w-5 h-5s"
    //                     />
    //                 </button>

    //                 <button className="">
    //                     <FileUp />
    //                 </button>

    //                 <button className="">
    //                     <TriangleAlert />
    //                 </button>

    //                 <button className="">
    //                     <CalendarCheck />
    //                 </button>
    //                 <button className="">
    //                     <Inbox />
    //                 </button>

    //                 <div className="mt-auto mb-4">
    //                     <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30">
    //                         <img src="https://i.pravatar.cc/100?img=12" alt="avatar" className="w-full h-full object-cover" />
    //                     </div>
    //                 </div>
    //             </nav>
    //         </aside>
    //         {/* MAIN CONTENT */}
    //         <main className="w-full">
    //             {children}
    //         </main>
    //     </div>
    // )
}