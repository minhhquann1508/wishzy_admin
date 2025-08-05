import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";

export const InstructorService = {
  getRequest: async () => {
    return await axios.get(endpoints.instructor.getInstructorRequest);
  },
};
