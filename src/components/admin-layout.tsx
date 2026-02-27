'use client'

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  School,
  Building2,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import Link from "next/link"

interface AdminLayoutProps {
  children: React.ReactNode
  user?: {
    username: string
    role: string
  }
}

const navigation = [
  { name: 'Beranda', href: '/admin', icon: LayoutDashboard },
  { name: 'Siswa', href: '/admin/siswa', icon: Users },
  { name: 'Guru', href: '/admin/guru', icon: GraduationCap },
  { name: 'Kosentrasi Keahlian', href: '/admin/jurusan', icon: BookOpen },
  { name: 'Kelas', href: '/admin/kelas', icon: School },
  { name: 'Industri', href: '/admin/industri', icon: Building2 },
  { name: 'Tahun Ajaran', href: '/admin/tahun-ajaran', icon: Calendar },
  { name: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
]

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const pathname = usePathname()

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCollapsed = localStorage.getItem('sidebar-collapsed')
      if (savedCollapsed !== null) {
        try {
          const isCollapsed = JSON.parse(savedCollapsed)
          setCollapsed(isCollapsed)
          // Apply CSS class immediately to prevent flicker
          document.documentElement.setAttribute('data-sidebar-collapsed', isCollapsed.toString())
        } catch {
          // If parsing fails, reset to default
          localStorage.removeItem('sidebar-collapsed')
          setCollapsed(false)
          document.documentElement.setAttribute('data-sidebar-collapsed', 'false')
        }
      } else {
        document.documentElement.setAttribute('data-sidebar-collapsed', 'false')
      }
      // Mark as hydrated after loading state
      setIsHydrated(true)
    }
  }, [])

  // Save collapsed state to localStorage whenever it changes
  const handleToggleCollapsed = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsed))
      document.documentElement.setAttribute('data-sidebar-collapsed', newCollapsed.toString())
    }
  }

  // Function to check if current path matches navigation item
  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  // Get current page title
  const getPageTitle = () => {
    const activeItem = navigation.find(item => {
      if (item.href === '/admin') {
        return pathname === '/admin'
      }
      return pathname.startsWith(item.href)
    })
    return activeItem ? activeItem.name : 'Panel Admin'
  }

  const pageTitle = getPageTitle()

  // Sidebar width is now controlled by CSS classes

  // Show loading or prevent flicker until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50/40">
        {/* Desktop sidebar - fixed width to prevent layout shift */}
        <div className="fixed inset-y-0 left-0 z-40 hidden bg-[#641E20] shadow-sm lg:block w-64">
          <div className="flex h-full flex-col border-r border-white/10">
            {/* Placeholder content */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="animate-pulse bg-white/20 h-7 w-24 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content with fixed margin */}
        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm sm:px-6 lg:px-8">
            <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
          </header>
          <main className="flex-1 p-6">
            <div className="mx-auto max-w-7xl">
              <div className="animate-pulse bg-gray-200 h-64 w-full rounded"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/40">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-[#641E20] shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Mobile header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
            <div className="flex flex-col justify-center gap-0.5">
              <span className="text-lg font-bold text-white leading-none">{pageTitle}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 leading-none">Admin</span>
            </div>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon!
              const active = isActive(item.href)
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start rounded-lg px-3 py-2 text-sm font-medium transition-all text-white hover:text-white hover:bg-[#772527]",
                      active
                        ? "bg-[#9C292B]"
                        : "bg-transparent"
                    )}
                  >
                    <Icon className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 text-white"
                    )} />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="sidebar-container fixed inset-y-0 left-0 z-40 hidden bg-[#641E20] shadow-sm lg:block">
        <div className="flex h-full flex-col border-r border-white/10">
          {/* Desktop header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
            <div className={cn(
              "flex flex-col justify-center gap-0.5 transition-opacity duration-200",
              collapsed ? "hidden" : "block"
            )}>
              {!collapsed && (
                <>
                  <span className="text-lg font-bold text-white leading-none">{pageTitle}</span> <br />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 leading-none">Admin</span>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleCollapsed}
              className="h-8 w-8 p-0 text-white hover:bg-[#772527] hover:text-white"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon!
              const active = isActive(item.href)
              return (
                <Link key={item.name} href={item.href} >
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start rounded-lg px-3 py-2 text-sm font-medium transition-all text-white hover:text-white hover:bg-[#772527]",
                      active
                        ? "bg-[#9C292B]"
                        : "bg-transparent",
                      collapsed && "justify-center"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0 text-white",
                      collapsed ? "mr-0" : "mr-3"
                    )} />
                    <span className={cn(
                      "transition-opacity duration-200",
                      collapsed ? "hidden" : "block"
                    )}>
                      {item.name}
                    </span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <Header
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}