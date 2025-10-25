'use client'

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
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
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"

interface AdminLayoutProps {
  children: React.ReactNode
  user?: {
    username: string
    role: string
  }
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Guru', href: '/admin/guru', icon: GraduationCap },
  { name: 'Siswa', href: '/admin/siswa', icon: Users },
  { name: 'Jurusan', href: '/admin/jurusan', icon: BookOpen },
  { name: 'Kelas', href: '/admin/kelas', icon: School },
  { name: 'Industri', href: '/admin/industri', icon: Building2 },
]

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

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

  // Sidebar width is now controlled by CSS classes

  // Show loading or prevent flicker until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50/40">
        {/* Desktop sidebar - fixed width to prevent layout shift */}
        <div className="fixed inset-y-0 left-0 z-40 hidden bg-white shadow-sm lg:block w-64">
          <div className="flex h-full flex-col border-r border-gray-200">
            {/* Placeholder content */}
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="animate-pulse bg-gray-200 h-7 w-24 rounded"></div>
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
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Mobile header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo/logo_magangHub.png"
                alt="MagangHub Logo"
                width={100}
                height={28}
                className="h-7 w-auto"
              />
              <span className="text-sm font-medium text-gray-500">Admin</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                  className={cn(
                    "w-full justify-start rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100",
                    active
                      ? "bg-[#641E20] text-white hover:bg-[#641E20]/90"
                      : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    active ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  {item.name}
                </Button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="sidebar-container fixed inset-y-0 left-0 z-40 hidden bg-white shadow-sm lg:block">
        <div className="flex h-full flex-col border-r border-gray-200">
          {/* Desktop header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className={cn(
              "flex items-center space-x-3 transition-opacity duration-200",
              collapsed ? "hidden" : "block"
            )}>
              <Image
                src="/logo/logo_magangHub.png"
                alt="MagangHub Logo"
                width={100}
                height={28}
                className="h-7 w-auto"
              />
              {!collapsed && <span className="text-sm font-medium text-gray-500">Admin</span>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleCollapsed}
              className="h-8 w-8 p-0"
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
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "w-full justify-start rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100",
                    active
                      ? "bg-[#641E20] text-white hover:bg-[#641E20]/90"
                      : "text-gray-700 hover:text-gray-900",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    active ? "text-white" : "text-gray-400 group-hover:text-gray-600",
                    collapsed ? "mr-0" : "mr-3"
                  )} />
                  <span className={cn(
                    "transition-opacity duration-200",
                    collapsed ? "hidden" : "block"
                  )}>
                    {item.name}
                  </span>
                </Button>
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