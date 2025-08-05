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
  msg?: string;
  data?: {
    accessToken?: string;
    user?: User;
  };
};

export const AuthService = {
  login: (data: LoginPayload) => {
    return axiosInstance.post<LoginResponse>(endpoints.auth.login, data);
  },
  register: (data: RegisterPayload) => {
    return axiosInstance.post(endpoints.auth.register, data);
  },
};
