'use client'

import { useState } from 'react'
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation'
import axiosInstance, { setTokens } from '@/utils/axios'
import { toast } from "sonner"
import { getGuruDefaultPath } from '@/utils/roleHelpers'

// Type untuk error handling
interface ApiError {
  response?: {
    data?: {
      message?: string
      error?: {
        code?: string
      }
    }
  }
  request?: unknown
  message?: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [adminData, setAdminData] = useState({ username: '', password: '' })
  const [guruData, setGuruData] = useState({ kode_guru: '', password: '' })
  const [siswaData, setSiswaData] = useState({ nama_lengkap: '', nisn: '' })
  const [loading, setLoading] = useState(false)

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axiosInstance.post('/auth/login', {
        username: adminData.username,
        password: adminData.password,
      });

      if (response.data && response.data.access_token && response.data.refresh_token) {
        setTokens(response.data.access_token, response.data.refresh_token)

        toast.success("Login berhasil!", {
          description: "Selamat datang di dashboard admin"
        })

        router.push('/admin')
      }
    } catch (err: unknown) {
      let errorMessage = 'Username atau password salah'

      const apiError = err as ApiError
      if (apiError.response?.data?.error?.code == "INVALID_CREDENTIALS") {
        errorMessage = 'Username atau password salah'
      } else if (apiError.request) {
        errorMessage = 'Tidak dapat terhubung ke server'
      } else if (apiError.message) {
        errorMessage = apiError.message
      }

      toast.error("Login gagal", {
        description: "Invalid Credentials"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGuruSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axiosInstance.post('/auth/guru/login', {
        kode_guru: guruData.kode_guru,
        password: guruData.password,
      });

      if (response.data && response.data.access_token && response.data.refresh_token) {
        setTokens(response.data.access_token, response.data.refresh_token)

        // Get guru role data from response.data.user
        const guruRoleData = {
          is_kaprog: response.data.user?.is_kaprog || false,
          is_koordinator: response.data.user?.is_koordinator || false,
          is_wali_kelas: response.data.user?.is_wali_kelas || false,
          is_pembimbing: response.data.user?.is_pembimbing || false,
        }

        // Save guru data to localStorage for role switcher
        if (response.data.user) {
          localStorage.setItem('guruData', JSON.stringify(response.data.user))
        }

        // Get redirect path based on role priority
        const redirectPath = getGuruDefaultPath(guruRoleData)

        toast.success("Login berhasil!", {
          description: "Selamat datang di dashboard"
        })

        router.push(redirectPath)
      }
    } catch (err: unknown) {
      let errorMessage = 'Kode guru atau password salah'

      const apiError = err as ApiError
      if (apiError.response?.data?.error?.code == "INVALID_CREDENTIALS") {
        errorMessage = 'Kode guru atau password salah'
      } else if (apiError.request) {
        errorMessage = 'Tidak dapat terhubung ke server'
      } else if (apiError.message) {
        errorMessage = apiError.message
      }

      toast.error("Login gagal", {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSiswaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axiosInstance.post('/auth/siswa/login', {
        nama_lengkap: siswaData.nama_lengkap,
        nisn: siswaData.nisn,
      });

      setTokens(response.data.access_token, response.data.refresh_token)

    } catch (error: unknown) {
      const apiError = error as ApiError
      if (apiError.response?.data?.error?.code == "SISWA_VALIDATION_ERROR") {
        toast.warning("Data siswa tidak ditemukan")
      } else {
        toast.error("Terjadi Kesalahan")
      }
      console.log(apiError.response?.data?.error?.code)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center">
                  <Image
                    src="/logo/logo_magangHub.png"
                    alt="MagangHub Logo"
                    width={160}
                    height={40}
                    className="w-40 h-10 object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold">Selamat Datang Kembali</h1>
                <p className="text-muted-foreground text-balance">
                  Masuk ke akun MagangHub Anda
                </p>
              </div>

              <Tabs defaultValue="admin" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                  <TabsTrigger value="guru">Guru</TabsTrigger>
                  <TabsTrigger value="siswa">Siswa</TabsTrigger>
                </TabsList>

                <TabsContent value="admin" className="mt-6">
                  <form onSubmit={handleAdminSubmit}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="admin-username">Username</Label>
                        <Input
                          id="admin-username"
                          type="text"
                          placeholder="Masukkan username"
                          value={adminData.username}
                          onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="admin-password">Password</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Masukkan password"
                          value={adminData.password}
                          onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-[#641E20] hover:bg-[#641E20]/90 text-white"
                        disabled={loading}
                      >
                        {loading ? 'Masuk...' : 'Masuk sebagai Admin'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="guru" className="mt-6">
                  <form onSubmit={handleGuruSubmit}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="guru-kode">Kode Guru</Label>
                        <Input
                          id="guru-kode"
                          type="text"
                          placeholder="Masukkan kode guru"
                          value={guruData.kode_guru}
                          onChange={(e) => setGuruData({ ...guruData, kode_guru: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="guru-password">Password</Label>
                        <Input
                          id="guru-password"
                          type="password"
                          placeholder="Masukkan password"
                          value={guruData.password}
                          onChange={(e) => setGuruData({ ...guruData, password: e.target.value })}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-[#641E20] hover:bg-[#641E20]/90 text-white"
                        disabled={loading}
                      >
                        {loading ? 'Masuk...' : 'Masuk sebagai Guru'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="siswa" className="mt-6">
                  <form onSubmit={handleSiswaSubmit}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="siswa-nama">Nama Lengkap</Label>
                        <Input
                          id="siswa-nama"
                          type="text"
                          placeholder="Masukkan nama lengkap"
                          value={siswaData.nama_lengkap}
                          onChange={(e) => setSiswaData({ ...siswaData, nama_lengkap: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="siswa-nisn">NISN</Label>
                        <Input
                          id="siswa-nisn"
                          type="text"
                          placeholder="Masukkan NISN"
                          value={siswaData.nisn}
                          onChange={(e) => setSiswaData({ ...siswaData, nisn: e.target.value })}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-[#641E20] hover:bg-[#641E20]/90 text-white"
                        disabled={loading}
                      >
                        {loading ? 'Masuk...' : 'Masuk sebagai Siswa'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="bg-muted relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#641E20] to-[#8B2635] opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Sistem Manajemen Magang</h2>
                <p className="text-white/90 text-balance">
                  Platform terpadu untuk mengelola data siswa, industri, dan program magang dengan mudah dan efisien.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
        Dengan melanjutkan, Anda menyetujui{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Ketentuan Layanan
        </a>{" "}
        dan{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Kebijakan Privasi
        </a>{" "}
        kami.
      </div>
    </div>
  )
}
