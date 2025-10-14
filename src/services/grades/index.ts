import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";
import type { GradeDto } from "@/types/grade";

export const GradeService = {
    createGrade: async (grade: GradeDto) => {
        return await axios.post(endpoints.grade.createGrade, grade)
    },

    getAllGrades: async (page?: number, limit?: number, status?: boolean, search?: string) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (status) params.append('status', status.toString());
        if (search) params.append('gradeName', search);
        
        const url = params.toString() ? `${endpoints.grade.getAll}?${params}` : endpoints.grade.getAll;
        return await axios.get(url);
    },

    updateGrade: async (slug: string, grade: GradeDto) => {
        return await axios.put(`${endpoints.grade.getAll}/${slug}`, grade);
    },

    deleteGrade: async (slug: string) => {
        return await axios.delete(`${endpoints.grade.getAll}/${slug}`);
    }
}