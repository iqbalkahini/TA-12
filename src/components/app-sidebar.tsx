"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { RoleSwitcher } from "@/components/role-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { getMenusByRole, type SidebarMenuItem } from "@/config/sidebar-menus"
import { useAuth } from "@/hooks/useAuth"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: string
  guruData?: {
    is_koordinator?: boolean
    is_pembimbing?: boolean
    is_wali_kelas?: boolean
    is_kaprog?: boolean
  }
}

// Sample teams data
const teams = [
  {
    name: "MagangHub",
    logo: GalleryVerticalEnd,
    plan: "SMK",
  },
]

export function AppSidebar({ role, guruData, ...props }: AppSidebarProps) {
  const [pathName, setPathName] = React.useState("")
  const [menus, setMenus] = React.useState<SidebarMenuItem[]>([])
  const { user, } = useAuth()
  const { open } = useSidebar()

  React.useEffect(() => {
    const url = new URL(window.location.href)
    const segments = url.pathname.split("/")
    setPathName(segments[2] || "")
  }, [])

  React.useEffect(() => {
    // Gunakan role dari props atau dari user
    const currentRole = role || user?.role || 'gru'
    const currentGuruData = guruData || {
      is_pembimbing: true, // default fallback
    }

    const roleMenus = getMenusByRole(currentRole, currentGuruData)
    setMenus(roleMenus)
  }, [role, guruData, user])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} open={open} />
        <RoleSwitcher guruData={guruData} open={open} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={menus} pathName={pathName} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.username || "User",
          email: "user@maganghub.id",
          avatar: "/avatars/default.jpg",
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
