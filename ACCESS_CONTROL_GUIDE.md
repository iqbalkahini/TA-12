# Access Control System - Guide

## 🔒 Overview
Sistem hak akses untuk memastikan setiap guru **hanya dapat mengakses halaman sesuai role yang dimiliki**.

---

## 🎯 Cara Kerja

### **1. Role Checking**
Setiap layout (kapro, koordinator, wali-kelas, pembimbing) menggunakan hook `useRoleAccess` untuk:
- ✅ Cek apakah guru memiliki role yang dibutuhkan
- ✅ Auto-redirect jika tidak punya akses
- ✅ Tampilkan loading state saat validasi

### **2. Redirect Logic**
Jika guru tidak punya akses ke halaman tertentu:
- Redirect ke **dashboard role tertinggi** yang dimiliki
- Jika tidak punya role apapun → redirect ke `/login`

---

## 📋 Skenario Testing

### **Skenario 1: Guru dengan Role Kaprog + Koordinator**
```
Login Response:
{
  "is_kaprog": true,
  "is_koordinator": true,
  "is_wali_kelas": false,
  "is_pembimbing": false
}

✅ Bisa akses: /kapro/*
✅ Bisa akses: /koordinator/*
❌ TIDAK bisa akses: /wali-kelas/* → Auto redirect ke /kapro/dashboard
❌ TIDAK bisa akses: /pembimbing/* → Auto redirect ke /kapro/dashboard
```

### **Skenario 2: Guru dengan Role Pembimbing Only**
```
Login Response:
{
  "is_kaprog": false,
  "is_koordinator": false,
  "is_wali_kelas": false,
  "is_pembimbing": true
}

❌ TIDAK bisa akses: /kapro/* → Auto redirect ke /pembimbing/dashboard
❌ TIDAK bisa akses: /koordinator/* → Auto redirect ke /pembimbing/dashboard
❌ TIDAK bisa akses: /wali-kelas/* → Auto redirect ke /pembimbing/dashboard
✅ Bisa akses: /pembimbing/*
```

### **Skenario 3: Guru dengan Semua Role**
```
Login Response:
{
  "is_kaprog": true,
  "is_koordinator": true,
  "is_wali_kelas": true,
  "is_pembimbing": true
}

✅ Bisa akses: /kapro/*
✅ Bisa akses: /koordinator/*
✅ Bisa akses: /wali-kelas/*
✅ Bisa akses: /pembimbing/*

Role Switcher: Menampilkan 4 opsi untuk switch antar role
```

### **Skenario 4: User Coba Akses Direct URL Tanpa Hak Akses**
```
Contoh: Guru pembimbing coba buka /kapro/dashboard di browser

Flow:
1. Page loading → useRoleAccess hook checking...
2. Deteksi: Guru tidak punya is_kaprog = true
3. Auto redirect ke /pembimbing/dashboard (role yang dimiliki)
4. User tidak bisa masuk ke halaman kapro
```

---

## 🛠️ Technical Implementation

### **Hook: useRoleAccess**
```typescript
const { hasAccess, loading, guruData } = useRoleAccess('kapro')

// Returns:
// - hasAccess: boolean (true jika punya akses)
// - loading: boolean (true saat checking)
// - guruData: object (data guru dari localStorage)
```

### **Helper Function: checkRoleAccess**
```typescript
import { checkRoleAccess } from '@/hooks/useRoleAccess'

const hasAccess = checkRoleAccess(guruData, 'kapro')
// Returns: true/false
```

---

## 🔐 Role Mapping

| Route Path       | Required Property     |
|------------------|-----------------------|
| `/kapro/*`       | `is_kaprog = true`    |
| `/koordinator/*` | `is_koordinator = true` |
| `/wali-kelas/*`  | `is_wali_kelas = true` |
| `/pembimbing/*`  | `is_pembimbing = true` |

---

## 📍 Unauthorized Page

### **Kapan Muncul?**
Sebenarnya **jarang muncul** karena sistem langsung redirect otomatis. Tapi unauthorized page tersedia untuk:
- Edge cases atau error handling
- Debugging
- Informasi ke user tentang role yang dimiliki

### **URL:** `/unauthorized`

### **Fitur:**
- 🛡️ Menampilkan pesan "Akses Ditolak"
- 📋 List role yang dimiliki user
- 🔙 Button "Kembali ke Dashboard" (auto ke role tertinggi)
- 🔑 Button "Login sebagai User Lain"

---

## ✅ Keamanan

### **Client-Side Protection**
- ✅ useRoleAccess hook di setiap layout
- ✅ Auto-redirect jika tidak punya akses
- ✅ Return null sebelum redirect (prevent flash content)

### **Best Practices**
1. **Data Flow:**
   ```
   Login → GuruData saved to localStorage
   → Page Load → useRoleAccess checking
   → Has Access? → Show Content : Redirect
   ```

2. **Data Persistence:**
   - Guru data disimpan di localStorage dengan key: `guruData`
   - Auto-loaded oleh `useGuruData` hook
   - Cleared on logout

3. **Error Handling:**
   - Jika guruData null → redirect `/login`
   - Jika tidak punya role apapun → redirect `/login`
   - Jika tidak punya akses → redirect ke dashboard role yang dimiliki

---

## 🧪 Testing Checklist

### Manual Testing:
- [ ] Login guru dengan 1 role → coba akses route role lain → Harus auto-redirect
- [ ] Login guru dengan multiple roles → coba switch role → Harus bisa akses semua
- [ ] Copy URL `/kapro/dashboard` tanpa login → Harus redirect `/login`
- [ ] Login pembimbing → paste URL `/kapro/dashboard` di browser → Harus redirect ke `/pembimbing/dashboard`
- [ ] Cek localStorage setelah login → Harus ada `guruData`
- [ ] Logout → coba akses route apapun → Harus redirect `/login`

### Edge Cases:
- [ ] GuruData corrupted di localStorage → System should handle gracefully
- [ ] All role flags = false → Should redirect to login
- [ ] Network error saat fetch guruData → Loading state handled properly

---

## 📝 Notes

- **Client-side only**: Ini protection di client-side. Untuk production, **backend API juga harus validate** role sebelum return data.
- **JWT Token**: Token yang disimpan sudah include role info, tapi guruData di localStorage lebih detail untuk UI logic.
- **Performance**: useRoleAccess hanya run sekali saat mount layout, minimal re-render.

---

## 🚀 Future Enhancements

1. **Server-Side Protection**: Implement middleware di Next.js untuk protect route di server-side
2. **Role Permissions**: Granular permissions per action (view, create, edit, delete)
3. **Audit Log**: Track siapa akses halaman apa dan kapan
4. **Dynamic Role Updates**: Real-time update jika role berubah di backend
