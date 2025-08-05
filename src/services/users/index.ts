import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";

export const UserService = {
  login: (data: { email: string; password: string }) => {
    axios.post(endpoints.auth.login, data);
  },
};
