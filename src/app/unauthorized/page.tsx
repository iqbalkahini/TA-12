"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGuruData } from "@/hooks/useGuruData"
import { getGuruDefaultPath, getGuruRoles } from "@/utils/roleHelpers"
import { useAuth } from "@/hooks/useAuth"

export default function UnauthorizedPage() {
  const router = useRouter()
  const { guruData } = useGuruData()
  const [availableRoles, setAvailableRoles] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (guruData) {
      const roles = getGuruRoles({
        is_kaprog: guruData.is_kaprog,
        is_koordinator: guruData.is_koordinator,
        is_wali_kelas: guruData.is_wali_kelas,
        is_pembimbing: guruData.is_pembimbing,
      })
      setAvailableRoles(roles.map(r => r.label))
    }
  }, [guruData])

  const handleBackToDashboard = () => {
    if (guruData) {
      const defaultPath = getGuruDefaultPath({
        is_kaprog: guruData.is_kaprog,
        is_koordinator: guruData.is_koordinator,
        is_wali_kelas: guruData.is_wali_kelas,
        is_pembimbing: guruData.is_pembimbing,
      })
      router.push(defaultPath)
    } else {
      router.push(user?.role == "ssw" ? '/siswa/dashboard' : '/login')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <ShieldX className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Akses Ditolak</CardTitle>
          <CardDescription className="text-base">
            Anda tidak memiliki hak akses untuk halaman ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableRoles.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Role yang Anda miliki:
              </p>
              <ul className="space-y-1">
                {availableRoles.map((role, index) => (
                  <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={handleBackToDashboard}
              className="w-full bg-[#641E20] hover:bg-[#641E20]/90 text-white"
            >
              Kembali
            </Button>
          </div>

          <p className="text-xs text-center text-slate-500 mt-4">
            Jika Anda merasa ini adalah kesalahan, hubungi administrator sistem.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
