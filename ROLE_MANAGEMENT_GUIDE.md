# Role Management System - Guide

## 📋 Overview
Sistem ini mengelola 3 role utama (Admin, Guru, Siswa) dengan 4 sub-role untuk Guru yang bisa dimiliki secara bersamaan.

## 🎯 Sub-Role Guru & Prioritas

### Prioritas Redirect (Tertinggi ke Terendah):
1. **Kepala Program (Kaprog)** → `/kapro/dashboard`
2. **Koordinator** → `/koordinator/dashboard`
3. **Wali Kelas** → `/wali-kelas/dashboard`
4. **Pembimbing** → `/pembimbing/dashboard`

Ketika guru login, sistem akan redirect ke dashboard **role tertinggi** yang dimiliki.

---

## 🔐 Login Flow

### Response API Login Guru
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer",
  "expires_in": 24,
  "expires_at": "2025-11-28T02:38:49.435883426Z",
  "user": {
    "id": 44,
    "kode_guru": "896543234654",
    "nama": "bambang",
    "role": "gru",
    "is_active": true,
    "is_koordinator": true,
    "is_pembimbing": false,
    "is_wali_kelas": false,
    "is_kaprog": true
  }
}
```

### Yang Terjadi Setelah Login:
1. Token disimpan ke localStorage
2. Data `user` disimpan ke localStorage sebagai `guruData`
3. Sistem deteksi role yang dimiliki dari flag boolean (is_kaprog, is_koordinator, dll)
4. Redirect ke dashboard role tertinggi berdasarkan prioritas

**Contoh**: Guru dengan `is_kaprog: true` dan `is_koordinator: true` akan diredirect ke `/kapro/dashboard`

---

## 🔄 Role Switcher

### Kapan Role Switcher Muncul?
Role switcher **hanya muncul** jika guru memiliki **2 atau lebih role**.

### Lokasi
Muncul di **sidebar header**, di bawah Team Switcher.

### Cara Kerja
- Menampilkan semua role yang dimiliki guru
- User bisa klik untuk switch ke dashboard role lain
- Route otomatis berubah (tanpa perlu logout)

### Contoh UI:
```
┌────────────────────┐
│ Kepala Program  ▼  │  ← Current Role
├────────────────────┤
│ ✓ Kepala Program   │
│   Koordinator      │
└────────────────────┘
```

---

## 📁 Struktur Folder

```
src/
├── app/
│   ├── kapro/              # 7 pages
│   │   ├── dashboard/
│   │   ├── tempat-magang/
│   │   ├── pengajuan-pkl/
│   │   ├── bukti-diterima/
│   │   ├── pembimbing-pkl/
│   │   ├── perizinan/
│   │   └── pindah-pkl/
│   │
│   ├── koordinator/        # 7 pages
│   │   ├── dashboard/
│   │   ├── jadwal/
│   │   ├── permohonan-pkl/
│   │   ├── industri/
│   │   ├── peserta/
│   │   ├── cetak-surat/
│   │   └── pembimbing/
│   │
│   ├── wali-kelas/         # 2 pages
│   │   ├── dashboard/
│   │   └── permasalahan-siswa/
│   │
│   └── pembimbing/         # 5 pages (existing)
│       ├── dashboard/
│       ├── bukti/
│       ├── permasalahan/
│       ├── perizinan/
│       └── persetujuan-pindah/
```

---

## 🛠️ Key Components

### 1. **roleHelpers.ts**
```typescript
getPrimaryGuruRole(guruData)     // Get role tertinggi
getGuruDefaultPath(guruData)     // Get redirect path
getGuruRoles(guruData)           // Get all roles yang dimiliki
hasMultipleRoles(guruData)       // Cek apakah punya multiple roles
```

### 2. **role-switcher.tsx**
Component dropdown untuk switch role.

### 3. **useGuruData.ts**
Hook untuk manage guru data dari localStorage.

### 4. Layout per Role:
- `kapro-layout.tsx`
- `koordinator-layout.tsx`
- `wali-kelas-layout.tsx`
- `pembimbing-layout.tsx`

---

## 📊 Skenario Penggunaan

### Skenario 1: Guru dengan 1 Role (Pembimbing)
```
Login → Redirect ke /pembimbing/dashboard
Role switcher: TIDAK MUNCUL
```

### Skenario 2: Guru dengan 2 Role (Kaprog + Koordinator)
```
Login → Redirect ke /kapro/dashboard (prioritas tertinggi)
Role switcher: MUNCUL
User bisa switch ke /koordinator/dashboard
```

### Skenario 3: Guru dengan 4 Role (All)
```
Login → Redirect ke /kapro/dashboard
Role switcher: MUNCUL dengan 4 opsi
- Kepala Program
- Koordinator
- Wali Kelas
- Pembimbing
```

---

## ✅ Testing Checklist

1. ✅ Login guru dengan berbagai kombinasi role
2. ✅ Cek redirect ke role priority yang benar
3. ✅ Cek role switcher muncul/tidak sesuai kondisi
4. ✅ Test switch antar role tanpa logout
5. ✅ Cek menu sidebar berubah sesuai active role
6. ✅ Cek guru data persisted di localStorage

---

## 🔧 Next Steps untuk Backend Integration

1. **Endpoint Login**: Pastikan `/auth/guru/login` return structure sesuai `GuruLoginResponse`
2. **Guru Data API**: (Optional) Buat endpoint `/auth/guru/me` untuk refresh guru data
3. **Authorization**: Implement middleware untuk protect route berdasarkan role guru
4. **Data Filtering**: API harus filter data sesuai role:
   - Pembimbing: hanya lihat siswa binaannya
   - Wali Kelas: hanya lihat siswa kelasnya
   - Koordinator: lihat semua peserta PKL
   - Kaprog: lihat semua data jurusannya

---

## 📝 Notes

- Guru data disimpan di localStorage dengan key: `guruData`
- Role detection menggunakan boolean flags di user object
- Semua placeholder pages sudah dibuat, tinggal implementasi UI/logic sesuai design
- Role switcher terintegrasi dengan sidebar navigation
