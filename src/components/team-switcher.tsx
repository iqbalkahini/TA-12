"use client"

import * as React from "react"
import { ChevronsUpDown, GraduationCap, Plus } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams,
  open
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
  open: boolean
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])


  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu >
      <div className="flex justify-center items-center mt-2">
        <GraduationCap className={`${open && 'mr-3'} h-10 w-10`} />
        {
          open && (
            <div className="flex flex-col justify-center">
              <h1 className="font-bold text-[#641E20]">MagangHub</h1>
            </div>
          )
        }
      </div>
    </SidebarMenu>
  )
}
