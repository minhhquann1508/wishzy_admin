import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";
import type { SubjectDto } from "@/types/subject";

export const SubjectService = {
    createSubject: async (subject: SubjectDto) => {
        return await axios.post(endpoints.subject, subject)
    },
    getAll: async (page: number, limit: number, status?: boolean, search?: string) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (status) params.append('status', status.toString());
        if (search) params.append('subjectName', search);
        return await axios.get(endpoints.subject, { params });
    },
    updateSubject: async (slug: string, subject: SubjectDto) => {
        return await axios.put(`${endpoints.subject}/${slug}`, subject);
    },
    deleteSubject: async (slug: string) => {
        return await axios.delete(`${endpoints.subject}/${slug}`);
    },
}