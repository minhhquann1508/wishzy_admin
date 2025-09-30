import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";

// --- Định nghĩa kiểu dữ liệu --- //
export interface Instructor {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: "instructor";
  age?: number;
  isInstructorActive: boolean;
  createdAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSizes: number;
  totalItems: number;
}

export interface GetInstructorRequestsResponse {
  msg: string;
  users: Instructor[];
  pagination: Pagination;
}

export interface GetInstructorsResponse {
  msg: string;
  instructors: Instructor[];
  pagination: Pagination;
}

export interface RequestInstructorPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface ApiResponse<T> {
  msg: string;
  data: T;
}

// --- Service --- //
export const InstructorService = {
  // Lấy danh sách yêu cầu giảng viên
  getRequests: async (page = 1, limit = 10): Promise<GetInstructorRequestsResponse> => {
    const res = await axios.get(endpoints.instructor.getInstructorRequest, {
      params: { page, limit },
    });
    return res.data;
  },

  // Gửi yêu cầu trở thành giảng viên
  createRequest: async (
    payload: RequestInstructorPayload
  ): Promise<ApiResponse<null>> => {
    const res = await axios.post(endpoints.instructor.createInstructorRequest, payload);
    return res.data;
  },

  // Duyệt yêu cầu giảng viên
  approveRequest: async (id: string): Promise<ApiResponse<null>> => {
    const res = await axios.put(`${endpoints.instructor.approveInstructor}/${id}`);
    return res.data;
  },

  // Từ chối yêu cầu giảng viên
  rejectRequest: async (id: string): Promise<ApiResponse<null>> => {
    const res = await axios.put(`${endpoints.instructor.rejectInstructor}/${id}`);
    return res.data;
  },

  // Lấy danh sách giảng viên
  getAll: async ({
    page = 1,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }): Promise<GetInstructorsResponse> => {
    const res = await axios.get(endpoints.instructor.getAllInstructors, {
      params: { page, limit },
    });
    return res.data;
  },
  
  // Lấy chi tiết giảng viên
  getById: async (id: string): Promise<Instructor> => {
    const res = await axios.get(`${endpoints.instructor.getInstructorById}/${id}`);
    return res.data.instructor;
  },

  // Huỷ yêu cầu làm giảng viên
  cancelRequest: async (id: string): Promise<ApiResponse<null>> => {
    const res = await axios.put(`${endpoints.instructor.cancelInstructorRequest}/${id}`);
    return res.data;
  },
};
