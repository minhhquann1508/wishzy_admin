import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";
import type { CourseDto } from "@/types/course";

export const CourseService = {
  getAll: async () => {
    return await axios.get(endpoints.course.getAll);
  },
  create: async (courseData: CourseDto) => {
    return await axios.post(endpoints.course.create, courseData);
  }
};
