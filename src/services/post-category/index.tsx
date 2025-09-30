import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";

export interface PostCategory {
  _id: string;
  slug: string;
  categoryName: string;
  status: boolean;
  createdBy?: {
    _id: string;
    fullName: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface GetAllPostCategoryResponse {
  msg: string;
  postCategories: PostCategory[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSizes: number;
    totalItems: number;
  };
}

export const PostCategoryService = {
  create: async (data: { categoryName: string; status?: boolean }) => {
    return await axios.post(endpoints.postCategory.create, data);
  },

  getAll: async (params?: { page?: number; limit?: number; status?: boolean }) => {
    const res = await axios.get<GetAllPostCategoryResponse>(endpoints.postCategory.getAll, {
      params,
    });
    return res.data;
  },

  update: async (slug: string, data: { categoryName?: string; status?: boolean }) => {
    return await axios.put(endpoints.postCategory.updateBySlug(slug), data);
  },

  updateStatus: async (slug: string, status: boolean) => {
    return await axios.put(endpoints.postCategory.updateStatusBySlug(slug), { status });
  },

  delete: async (slug: string) => {
    return await axios.delete(endpoints.postCategory.deleteBySlug(slug));
  },
};
