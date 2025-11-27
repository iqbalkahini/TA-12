"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronsUpDown, Check } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getGuruRoles, hasMultipleRoles, type GuruRoleData } from "@/utils/roleHelpers"
import { cn } from "@/lib/utils"

interface RoleSwitcherProps {
  guruData?: GuruRoleData
  open: boolean
}

export function RoleSwitcher({ guruData, open }: RoleSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  if (!guruData || !hasMultipleRoles(guruData)) {
    return null
  }

  const roles = getGuruRoles(guruData)
  const currentRole = roles.find(role => pathname.startsWith(`/${role.key}`))

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className={`flex flex-1 flex-col gap-0.5 leading-none ${!open && 'hidden'}`}>
                <span className="font-semibold">
                  {currentRole?.label || "Pilih Role"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Switch role
                </span>
              </div>
              <ChevronsUpDown className="mx-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            <DropdownMenuLabel>Role Guru</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roles.map((role) => (
              <DropdownMenuItem
                key={role.key}
                onClick={() => router.push(role.path)}
                className="cursor-pointer"
              >
                <span className="flex-1">{role.label}</span>
                {pathname.startsWith(`/${role.key}`) && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
