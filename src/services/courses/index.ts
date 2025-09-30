import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";
import type { CourseDto } from "@/types/course";

export const CourseService = {
  getAll: async (page: number, limit: number, status?: boolean) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (status) params.append('status', status.toString());
    return await axios.get(endpoints.course.getAll, { params });
  },
  create: async (courseData: CourseDto) => {
    return await axios.post(endpoints.course.create, courseData);
  }
};
