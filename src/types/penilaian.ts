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
