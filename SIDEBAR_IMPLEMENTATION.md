# Dokumentasi Implementasi Sidebar Multi-Role

## Overview
Sistem sidebar telah di-refactor untuk mendukung multiple roles dengan mudah. Sekarang Anda dapat dengan mudah menambahkan role baru (Koordinator, Wali Kelas, Kapro, Siswa) tanpa harus membuat sidebar dari awal.

## Struktur File

### 1. Config Sidebar (`src/config/sidebar-menus.ts`)
File ini berisi konfigurasi menu untuk setiap role:
- `pembimbingMenus` - Menu untuk Pembimbing
- `koordinatorMenus` - Menu untuk Koordinator
- `waliKelasMenus` - Menu untuk Wali Kelas
- `kaproMenus` - Menu untuk Kepala Program
- `siswaMenus` - Menu untuk Siswa

### 2. Generic Sidebar Component (`src/components/app-sidebar.tsx`)
Component sidebar yang menerima props `role` dan `guruData` untuk menentukan menu mana yang akan ditampilkan.

### 3. Role-Based Layout (`src/components/role-based-layout.tsx`)
Layout component yang dapat digunakan untuk semua role dengan sidebar yang sesuai.

## Cara Menggunakan untuk Role Lain

### Contoh 1: Membuat Layout untuk Koordinator

1. Buat folder dan file layout:
```
src/app/koordinator/layout.tsx
```

2. Isi dengan kode berikut:
```typescript
"use client"

import RoleBasedLayout from "@/components/role-based-layout"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import type { Guru } from "@/types/api"

export default function KoordinatorLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [guruData, setGuruData] = useState<Guru | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // TODO: Fetch guru data dari API
        // const data = await fetchGuruByUserId(user.id)
        
        setGuruData({
            is_pembimbing: false,
            is_koordinator: true, // <-- Set ke true untuk koordinator
            is_wali_kelas: false,
            is_kaprog: false,
        } as Guru)
        setLoading(false)
    }, [user])

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return (
        <RoleBasedLayout 
            role="gru"
            guruData={{
                is_pembimbing: guruData?.is_pembimbing,
                is_koordinator: guruData?.is_koordinator,
                is_wali_kelas: guruData?.is_wali_kelas,
                is_kaprog: guruData?.is_kaprog,
            }}
        >
            {children}
        </RoleBasedLayout>
    )
}
```

### Contoh 2: Membuat Layout untuk Wali Kelas

1. Buat folder dan file layout:
```
src/app/wali-kelas/layout.tsx
```

2. Isi dengan kode berikut:
```typescript
"use client"

import RoleBasedLayout from "@/components/role-based-layout"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import type { Guru } from "@/types/api"

export default function WaliKelasLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [guruData, setGuruData] = useState<Guru | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // TODO: Fetch guru data dari API
        
        setGuruData({
            is_pembimbing: false,
            is_koordinator: false,
            is_wali_kelas: true, // <-- Set ke true untuk wali kelas
            is_kaprog: false,
        } as Guru)
        setLoading(false)
    }, [user])

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return (
        <RoleBasedLayout 
            role="gru"
            guruData={{
                is_pembimbing: guruData?.is_pembimbing,
                is_koordinator: guruData?.is_koordinator,
                is_wali_kelas: guruData?.is_wali_kelas,
                is_kaprog: guruData?.is_kaprog,
            }}
        >
            {children}
        </RoleBasedLayout>
    )
}
```

### Contoh 3: Membuat Layout untuk Kapro

```typescript
"use client"

import RoleBasedLayout from "@/components/role-based-layout"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import type { Guru } from "@/types/api"

export default function KaproLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [guruData, setGuruData] = useState<Guru | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setGuruData({
            is_pembimbing: false,
            is_koordinator: false,
            is_wali_kelas: false,
            is_kaprog: true, // <-- Set ke true untuk kapro
        } as Guru)
        setLoading(false)
    }, [user])

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return (
        <RoleBasedLayout 
            role="gru"
            guruData={{
                is_pembimbing: guruData?.is_pembimbing,
                is_koordinator: guruData?.is_koordinator,
                is_wali_kelas: guruData?.is_wali_kelas,
                is_kaprog: guruData?.is_kaprog,
            }}
        >
            {children}
        </RoleBasedLayout>
    )
}
```

### Contoh 4: Membuat Layout untuk Siswa

```typescript
"use client"

import RoleBasedLayout from "@/components/role-based-layout"

export default function SiswaLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleBasedLayout role="ssw">
            {children}
        </RoleBasedLayout>
    )
}
```

## Menambah atau Mengubah Menu

Untuk menambah atau mengubah menu untuk setiap role, edit file `src/config/sidebar-menus.ts`:

```typescript
// Contoh menambah menu baru untuk pembimbing
export const pembimbingMenus: SidebarMenuItem[] = [
  {
    name: "Dashboard",
    url: "/pembimbing/dashboard",
    icon: Home,
    pathName: ["dashboard"],
  },
  // Tambah menu baru di sini
  {
    name: "Menu Baru",
    url: "/pembimbing/menu-baru",
    icon: IconName,
    pathName: ["menu-baru"],
  },
]
```

## Integrasi dengan API

Untuk mendapatkan data guru yang sebenarnya dari API:

```typescript
useEffect(() => {
    const fetchGuruData = async () => {
        try {
            const response = await fetch(`/api/guru/user/${user?.id}`)
            const data = await response.json()
            setGuruData(data)
        } catch (error) {
            console.error("Error fetching guru data:", error)
        } finally {
            setLoading(false)
        }
    }

    if (user?.id) {
        fetchGuruData()
    }
}, [user])
```

## Catatan Penting

1. **Admin tetap menggunakan AdminLayout sendiri** - Tidak perlu diubah karena sudah working dengan baik
2. **Semua role guru (pembimbing, koordinator, wali kelas, kapro) menggunakan RoleBasedLayout**
3. **Siswa juga menggunakan RoleBasedLayout dengan role="ssw"**
4. **Breadcrumb otomatis ter-update** berdasarkan pathname
5. **Menu ditentukan berdasarkan kombinasi role dan guruData**

## Struktur Folder Routing

```
src/app/
├── admin/              # Sudah ada, pakai AdminLayout
├── pembimbing/         # Sudah diupdate ke RoleBasedLayout
├── koordinator/        # Buat baru dengan contoh di atas
├── wali-kelas/         # Buat baru dengan contoh di atas
├── kapro/              # Buat baru dengan contoh di atas
└── siswa/              # Buat baru dengan contoh di atas
```

## Keuntungan Arsitektur Ini

1. ✅ **DRY (Don't Repeat Yourself)** - Tidak perlu duplikasi kode sidebar
2. ✅ **Maintainable** - Update menu hanya di satu tempat (sidebar-menus.ts)
3. ✅ **Scalable** - Mudah menambah role baru
4. ✅ **Type-safe** - Menggunakan TypeScript interfaces
5. ✅ **Consistent UI** - Semua role punya tampilan yang konsisten
