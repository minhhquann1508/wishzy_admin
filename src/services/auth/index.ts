// src/services/auth/index.ts
import axiosInstance from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type User = {
  id?: string;
  email?: string;
  fullName?: string;
  role?: string;
};

export type LoginResponse = {
  accessToken?: string;
  user?: User;
};

export const AuthService = {
  login: async (data: LoginPayload) => {
    const response = await axiosInstance.post(endpoints.auth.login, data);
    return response;
  },
  register: (data: RegisterPayload) => {
    return axiosInstance.post(endpoints.auth.register, data);
  },
};
