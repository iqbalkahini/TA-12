'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { StatisticsCard } from "@/components/statistics-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiService } from "@/lib/api"
import type { DashboardStats } from "@/types/api"
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  School, 
  Building2, 
  UserCheck,
  TrendingUp,
  Clock
} from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await apiService.getDashboardStats()
      setStats(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await apiService.logout()
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    } catch (err) {
      console.error('Logout failed:', err)
      // Still redirect even if logout fails
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
  }

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AdminLayout onLogout={handleLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout onLogout={handleLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={loadDashboardStats}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!stats) {
    return (
      <AdminLayout onLogout={handleLogout}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">No data available</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your PKL management system</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatisticsCard
            title="Total Users"
            value={stats.total_users}
            description="All system users"
            icon={Users}
            variant="default"
          />
          <StatisticsCard
            title="Guru"
            value={stats.total_guru}
            description={`${stats.guru_users} active`}
            icon={GraduationCap}
            variant="success"
          />
          <StatisticsCard
            title="Siswa"
            value={stats.total_siswa}
            description={`${stats.siswa_users} active`}
            icon={UserCheck}
            variant="warning"
          />
          <StatisticsCard
            title="Admin Users"
            value={stats.admin_users}
            description="System administrators"
            icon={Users}
            variant="destructive"
          />
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatisticsCard
            title="Jurusan"
            value={stats.total_jurusan}
            description="Study programs"
            icon={BookOpen}
            variant="default"
          />
          <StatisticsCard
            title="Kelas"
            value={stats.total_kelas}
            description="Classes"
            icon={School}
            variant="success"
          />
          <StatisticsCard
            title="Industri"
            value={stats.total_industri}
            description="Industry partners"
            icon={Building2}
            variant="warning"
          />
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Active Users</span>
                <Badge variant="success">
                  {stats.guru_users + stats.siswa_users + stats.admin_users}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">System Status</span>
                <Badge variant="success">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database Status</span>
                <Badge variant="success">Connected</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Last Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-2">
                Statistics were last updated on:
              </div>
              <div className="text-lg font-semibold">
                {formatLastUpdated(stats.last_updated)}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Data is refreshed automatically every few minutes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <a
                href="/admin/guru"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <GraduationCap className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Manage Guru</span>
              </a>
              <a
                href="/admin/siswa"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserCheck className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium">Manage Siswa</span>
              </a>
              <a
                href="/admin/jurusan"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Manage Jurusan</span>
              </a>
              <a
                href="/admin/kelas"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <School className="h-8 w-8 text-orange-600 mb-2" />
                <span className="text-sm font-medium">Manage Kelas</span>
              </a>
              <a
                href="/admin/industri"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Building2 className="h-8 w-8 text-red-600 mb-2" />
                <span className="text-sm font-medium">Manage Industri</span>
              </a>
              <a
                href="/admin/reports"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <TrendingUp className="h-8 w-8 text-indigo-600 mb-2" />
                <span className="text-sm font-medium">Reports</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
