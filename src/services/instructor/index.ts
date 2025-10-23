import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";

// ---------------- KIỂU DỮ LIỆU ---------------- //
export interface Instructor {
  _id: string;
  fullName: string;
  email: string;
  role: string; 
  avatar?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  password?: string;
  verified?: boolean;
  age?: number;
  createdAt?: string;
  address?: string;
  isInstructorActive?: boolean;
}

export interface GetAllInstructorsResponse {
  msg: string;
  instructors: Instructor[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSizes: number;
    totalItems: number;
  };
}

// Kiểu cho từng yêu cầu làm giảng viên
export interface InstructorRequest {
  _id: string;
  fullName: string;
  email: string;
  requestedAt: string;
  verified?: boolean;
}

export interface GetInstructorRequestsResponse {
  msg: string;
  requests: InstructorRequest[]; // sửa từ 'users' sang 'requests'
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSizes: number;
    totalItems: number;
  };
}


export interface ApiResponse<T> {
  msg: string;
  data?: T;
}

export interface RequestInstructorPayload {
  email: string;
  password: string;
  fullName: string;
}

// ---------------- SERVICE ---------------- //
export const InstructorService = {
  getRequests: async (params?: {
  page?: number;
  limit?: number;
  fullName?: string;
  email?: string;
}): Promise<GetInstructorRequestsResponse> => {
  const res = await axios.get(endpoints.instructor.getInstructorRequest, { params });
  console.log("API getRequests data:", res.data);
  return {
    ...res.data,
    requests: res.data.users,
  };
},

  createRequest: async (
    payload: RequestInstructorPayload
  ): Promise<ApiResponse<null>> => {
    const res = await axios.post(endpoints.instructor.createInstructorRequest, payload);
    return res.data;
  },

  approveRequest: async (id: string): Promise<ApiResponse<null>> => {
    const res = await axios.put(`${endpoints.instructor.approveInstructor}/${id}`);
    return res.data;
  },

  rejectRequest: async (id: string): Promise<ApiResponse<null>> => {
    const res = await axios.put(`${endpoints.instructor.rejectInstructor}/${id}`);
    return res.data;
  },
  getAll: async (params?: {
    page?: number;
    limit?: number;
    fullName?: string;
    email?: string;
    isInstructorActive?: boolean;
  }): Promise<GetAllInstructorsResponse> => {
    const res = await axios.get(endpoints.instructor.getAllInstructors, { params });
    return res.data;
  },

  getById: async (id: string): Promise<Instructor> => {
    const res = await axios.get(`${endpoints.instructor.getInstructorById}/${id}`);
    return res.data.instructor;
  },

  cancelRequest: async (id: string): Promise<ApiResponse<null>> => {
    const res = await axios.put(`${endpoints.instructor.cancelInstructorRequest}/${id}`);
    return res.data;
  },
};
