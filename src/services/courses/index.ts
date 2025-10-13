import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";
import type { CourseDto } from "@/types/course";

export const CourseService = {
  getAll: async (page: number, limit: number, status?: boolean) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (status !== undefined) params.append('status', status.toString());
    params.append('orderDate', '-1');
    return await axios.get(endpoints.course.getAll, { params });
  },
  create: async (courseData: CourseDto) => {
    return await axios.post(endpoints.course.create, courseData);
  },
  update: async (slug: string, courseData: CourseDto) => {
    return await axios.put(endpoints.course.updateBySlug(slug), courseData);
  },
  delete: async (slug: string) => {
    return await axios.delete(endpoints.course.deleteBySlug(slug));
  }
};
