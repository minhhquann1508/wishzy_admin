import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";

// Kiểu dữ liệu User (theo backend bạn select)
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  age?: number;
  createdAt?: string;
}

// Kiểu dữ liệu pagination backend trả về
export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSizes: number;
  totalItems: number;
}

// Kiểu dữ liệu response khi getAllUser
export interface GetAllUsersResponse {
  msg: string;
  users: User[];
  pagination: Pagination;
}

export const UserService = {
  login: (data: { email: string; password: string }) => {
    return axios.post(endpoints.auth.login, data);
  },
  getAll: async (params?: {
    page?: number;
    limit?: number;
    fullName?: string;
    email?: string;
    role?: string;
  }): Promise<GetAllUsersResponse> => {
    const res = await axios.get(endpoints.user.getAll, { params });
    return res.data;
  },
};

