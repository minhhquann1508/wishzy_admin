import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";

export const CourseService = {
  getAll: async () => {
    return await axios.get(endpoints.course.getAll);
  },
};
