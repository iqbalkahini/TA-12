import axiosInstance from "@/utils/axios";
import {
    PenilaianPagination,
    StudentApplicationItem,
    PenilaianApplicationDetail,
    DraftPenilaianPayload,
    PenilaianForm,
    CreatePenilaianFormPayload,
    ReviewApplicationItem
} from "@/types/penilaian";

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
        history: boolean = false
    ): Promise<PenilaianPagination<StudentApplicationItem>> => {
        const response = await axiosInstance.get(
            `/api/penilaian/pembimbing/students`,
            { params: { page, limit, history } }
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
        search: string = ""
    ): Promise<PenilaianPagination<ReviewApplicationItem>> => {
        const response = await axiosInstance.get(`/api/penilaian/review`, {
            params: { page, limit, search }
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