import { useQuery } from "@tanstack/react-query";

export const useFetchUser = () => {
  useQuery({
    queryKey: ["users"],
  });
};
