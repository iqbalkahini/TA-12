import axiosInstance from "@/utils/axios";
import {
    PenilaianPagination,
    StudentApplicationItem,
    PenilaianApplicationDetail,
    DraftPenilaianPayload,
    PenilaianForm,
    CreatePenilaianFormPayload,
    ReviewApplicationItem,
    SertifikatPKL,
    LaporanPKL
} from "@/types/penilaian";
import axios from "axios";

// ==========================================
// PEMBIMBING ENDPOINTS
// ==========================================

export const pembimbingPenilaianApi = {
    /**
     * Get list of students assigned to the current pembimbing.
     */
    getStudents: async (
        page: number = 1,
        limit: number = 10,
        history: boolean = false,
        status: 'belum_dinilai' | 'sudah_dinilai' | 'semua' = 'semua',
        search: string = ""
    ): Promise<PenilaianPagination<StudentApplicationItem>> => {
        const response = await axiosInstance.get(
            `/api/penilaian/pembimbing/students`,
            { params: { page, limit, history, status: status === 'semua' ? null : status, search } }
        );
        return response.data;
    },

    /**
     * Get application grading details by application ID.
     */
    getApplicationDetail: async (
        applicationId: number
    ): Promise<PenilaianApplicationDetail> => {
        const response = await axiosInstance.get(
            `/api/penilaian/applications/${applicationId}`
        );
        return response.data;
    },

    /**
     * Save grading progress as draft.
     */
    saveDraft: async (
        applicationId: number,
        payload: DraftPenilaianPayload
    ): Promise<PenilaianApplicationDetail> => {
        const response = await axiosInstance.put(
            `/api/penilaian/applications/${applicationId}/draft`,
            payload
        );
        return response.data;
    },

    /**
     * Finalize application grading. Cannot be changed after this.
     */
    finalizeScore: async (
        applicationId: number
    ): Promise<PenilaianApplicationDetail> => {
        const response = await axiosInstance.post(
            `/api/penilaian/applications/${applicationId}/finalize`
        );
        return response.data;
    }
};

// ==========================================
// KOORDINATOR ENDPOINTS
// ==========================================

export const koordinatorPenilaianApi = {
    /**
     * Get all grading forms.
     */
    getForms: async (): Promise<PenilaianPagination<PenilaianForm>> => {
        const response = await axiosInstance.get(`/api/penilaian/forms`);
        return response.data;
    },

    /**
     * Create a new grading form.
     */
    createForm: async (
        payload: CreatePenilaianFormPayload
    ): Promise<PenilaianForm> => {
        const response = await axiosInstance.post(`/api/penilaian/forms`, payload);
        return response.data;
    },

    /**
     * Update an existing grading form.
     */
    updateForm: async (
        formId: number,
        payload: CreatePenilaianFormPayload
    ): Promise<PenilaianForm> => {
        const response = await axiosInstance.put(
            `/api/penilaian/forms/${formId}`,
            payload
        );
        return response.data;
    },

    /**
     * Activate a specific grading form.
     */
    activateForm: async (formId: number): Promise<{ success: boolean }> => {
        const response = await axiosInstance.post(
            `/api/penilaian/forms/${formId}/activate`
        );
        return response.data;
    },

    /**
     * Get list of finalized score reviews.
     */
    getReviewList: async (
        page: number = 1,
        limit: number = 10,
        search: string = "",
        jurusan_id?: number | null,
        kelas_id?: number | null,
        industri_id?: number | null,
    ): Promise<PenilaianPagination<ReviewApplicationItem>> => {
        const params: any = { page, limit };
        if (search) params.search = search;
        if (jurusan_id) params.jurusan_id = jurusan_id;
        if (kelas_id) params.kelas_id = kelas_id;
        if (industri_id) params.industri_id = industri_id;

        const response = await axiosInstance.get(`/api/penilaian/review`, {
            params
        });
        return response.data;
    },

    /**
     * Get details of a finalized grading for review.
     */
    getReviewDetail: async (
        applicationId: number
    ): Promise<PenilaianApplicationDetail> => {
        const response = await axiosInstance.get(
            `/api/penilaian/review/${applicationId}`
        );
        return response.data;
    }
};

// cetak sertifikat 
export const cetakSertifikat = async (code_jurusan: string, data: SertifikatPKL) => {
    const response = await axios.post(`http://b0sogsc0oo84w8ckkgskws80.13.212.194.164.sslip.io/api/v1/letters/sertifikat/${code_jurusan}`, data)
    return response.data;
};

export const cetakPenilaian = async (data: LaporanPKL) => {
    const response = await axios.post(`http://b0sogsc0oo84w8ckkgskws80.13.212.194.164.sslip.io/api/v1/letters/penilaian`, data);
    return response.data;
};