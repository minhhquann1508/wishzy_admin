import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  verified?: boolean;
  age?: number;
  createdAt?: string;
  address?: string;
}

// Thông tin chi tiết bổ sung
export interface PurchasedCourse {
  _id: string;
  title: string;
  status: "completed" | "in-progress" | "pending";
  purchaseDate: string;
}

export interface Activity {
  id: string;
  action: string;
  date: string;
}

export interface Grade {
  course: string;
  score: number;
}

export interface ClassInfo {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

// Interface mở rộng cho chi tiết user
export interface UserDetail extends User {
  purchasedCourses?: PurchasedCourse[];
  activities?: Activity[];
  grades?: Grade[];
  classes?: ClassInfo[];
}

// Response từ API get all users
export interface GetAllUsersResponse {
  msg: string;
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSizes: number;
    totalItems: number;
  };
}

export const UserService = {
  // Login
  login: (data: { email: string; password: string }) => {
    return axios.post(endpoints.auth.login, data);
  },

  // Get all user
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

  // Create user (admin)
  create: async (data: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const res = await axios.post(endpoints.user.create, data);
    return res.data;
  },

  // Update user theo id (admin)
  update: async (id: string, data: Partial<User>) => {
    const res = await axios.put(endpoints.user.updateById(id), data);
    return res.data;
  },

  // Delete user theo id (admin)
  delete: async (id: string) => {
    const res = await axios.delete(endpoints.user.deleteById(id));
    return res.data;
  },

};
