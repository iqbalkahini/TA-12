// types/penilaian.ts

export interface PenilaianPagination<T> {
    data: T[];
    total: number;
}

// ==========================================
// 1. PEMBIMBING TYPES
// ==========================================

export interface StudentApplicationItem {
    application_id: number;
    siswa_id: number;
    siswa_username: string;
    siswa_nisn: string;
    kelas_nama: string;
    industri_id: number;
    industri_nama: string;
    tanggal_mulai?: string | null;
    tanggal_selesai?: string | null;
    pkl_status: string;         // e.g. 'approved'
    penilaian_status: string;   // e.g. 'sudah_dinilai', 'belum_dinilai'
}

export interface FormItemDetail {
    id: number;
    urutan: number;
    tujuan_pembelajaran: string;
}

export interface PenilaianItem {
    form_item_id: number;
    skor: number;
    deskripsi: string;
}

export interface PenilaianApplicationDetail {
    application_id: number;
    form_id: number;
    form_nama: string;
    status: string;              // 'final', 'draft', etc.
    tanggal_mulai?: string | null;
    tanggal_selesai?: string | null;
    total_skor: number;
    rata_rata: string;           // string format for decimal
    catatan_akhir: string | null;
    finalized_at: string | null; // ISO date string or null
    items: PenilaianItem[];
    form_items: FormItemDetail[];
}

export interface DraftPenilaianPayload {
    items: PenilaianItem[];
    catatan_akhir?: string;
}

// ==========================================
// 2. KOORDINATOR TYPES
// ==========================================

export interface PenilaianForm {
    id: number;
    nama: string;
    is_active: boolean;
    created_by: number;
    created_at: string;
    updated_at: string;
    items: FormItemDetail[];
}

export interface CreateFormItemPayload {
    urutan: number;
    tujuan_pembelajaran: string;
}

export interface CreatePenilaianFormPayload {
    nama: string;
    items: CreateFormItemPayload[];
}

export interface ReviewApplicationItem {
    application_id: number;
    siswa_id: number;
    siswa_username: string;
    siswa_nisn: string;
    kelas_id: number;
    kelas_nama: string;
    jurusan_id: number;
    jurusan_nama: string;
    industri_id: number;
    industri_nama: string;
    pembimbing_guru_id: number;
    total_skor: number;
    rata_rata: string;
    finalized_at: string;
}


// cetak sertifikat
interface Siswa {
    nama: string;
    nisn: string;
}

interface NilaiPKL {
    aspek_1: number;
    desc_1: string;
    aspek_2: number;
    desc_2: string;
    aspek_3: number;
    desc_3: string;
    aspek_4: number;
    desc_4: string;
}

export interface SertifikatPKL {
    nomor_sertifikat: string;
    siswa: Siswa;
    nama_industri: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    hasil_pkl: "Amat Baik" | "Baik" | "Cukup" | "Kurang"; // Menggunakan union type untuk validasi
    tanggal_terbit: string;
    nilai: NilaiPKL;
    nama_pimpinan: string;
    jenis_nomor_pimpinan?: string;
    nip_pimpinan: string;
    jabatan_pimpinan: string;
    nama_pembimbing: string;
    jenis_nomor_pembimbing?: string;
    nip_pembimbing: string;
    jabatan_pembimbing: string;
}

// sertif penilaian 
interface SchoolInfo {
    nama_sekolah: string;
    alamat_jalan: string;
    kelurahan: string;
    kecamatan: string;
    kab_kota: string;
    provinsi: string;
    kode_pos: string;
    telepon: string;
    email: string;
    website: string;
    logo_url: string;
}

interface SiswaDetail {
    nama: string;
    nisn: string;
    kelas: string;
    konsentrasi_keahlian: string;
    tempat_pkl: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    nama_instruktur: string;
    jabatan_instruktur: string;
    nip_instruktur: string;
    nama_pembimbing: string;
    jabatan_pembimbing: string;
    nip_pembimbing: string;
}

interface NilaiDetail {
    skor_1: number;
    desc_1: string;
    skor_2: number;
    desc_2: string;
    skor_3: number;
    desc_3: string;
    skor_4: number;
    desc_4: string;
}

export interface LaporanPKL {
    school_info: SchoolInfo;
    siswa: SiswaDetail;
    nilai: NilaiDetail;
    jenis_nomor?: string;
    sakit: number;
    izin: number;
    alpa: number;
    tempat_tanggal: string;
}
