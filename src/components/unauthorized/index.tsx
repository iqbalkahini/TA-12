'use client'

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldX, Home, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function UnauthorizedPage() {
    const router = useRouter()

    const { user } = useAuth()

    switch (user?.role) {
        case "adm":
            return "/admin"
            break;
        case "gru":
            "/"
            break;
        case "ssw":

            break;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="flex items-center justify-center mb-2">
                            <Image
                                src="/logo/logo_magangHub.png"
                                alt="MagangHub Logo"
                                width={160}
                                height={40}
                                className="w-40 h-10 object-contain"
                            />
                        </div>

                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#641E20] to-[#8B2635] flex items-center justify-center">
                                <ShieldX className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Akses Ditolak
                            </h1>
                            <p className="text-muted-foreground text-balance max-w-sm">
                                Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </Button>
                            <Button
                                className="flex-1 bg-[#641E20] hover:bg-[#641E20]/90 text-white"
                                asChild
                            >
                                <Link href="/">
                                    <Home className="w-4 h-4 mr-2" />
                                    Beranda
                                </Link>
                            </Button>
                        </div>

                        <div className="pt-4 border-t border-gray-200 w-full">
                            <p className="text-xs text-muted-foreground">
                                Kode Error: 403 - Forbidden
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
