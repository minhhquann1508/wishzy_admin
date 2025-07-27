import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";

export const AuthService = {
  login: (data: { email: string; password: string }) => {
    axios.post(endpoints.auth.login, data);
  },
};
