import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";

export interface Post {
  _id: string;
  slug: string;
  title: string;
  content: string;
  category: string | { _id: string; categoryName: string };
  description?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  file?: string;
  status: boolean;
  isFeatured?: boolean;
  createdBy?: {
    _id: string;
    fullName: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface GetAllBlogResponse {
  msg: string;
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSizes: number;
    totalItems: number;
  };
}

export interface GetPostBySlugResponse {
  msg: string;
  post: Post;
}

export const BlogService = {
  // Tạo bài viết mới
  create: async (data: {
    title: string;
    content: string;
    description?: string;
    category?: string;
    thumbnail?: string;
    thumbnailAlt?: string;
    status?: boolean;
    isFeatured?: boolean;
  }) => {
    const res = await axios.post(endpoints.post.create, data);
    return res.data;
  },

  // Lấy tất cả bài viết
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: boolean;
    title?: string;
  }) => {
    const res = await axios.get<GetAllBlogResponse>(
      endpoints.post.getAll,
      { params }
    );
    return res.data;
  },

  // Lấy bài viết theo slug
  getBySlug: async (slug: string) => {
    const url = endpoints.post.getPostBySlug(encodeURIComponent(slug));
    const res = await axios.get<GetPostBySlugResponse>(url);
    return res.data;
  },

  // Cập nhật bài viết theo slug
  update: async (
    slug: string,
    data: {
      title?: string;
      content?: string;
      description?: string;
      category?: string;
      thumbnail?: string;
      thumbnailAlt?: string;
      status?: boolean;
      isFeatured?: boolean;
    }
  ) => {
    const url = endpoints.post.updateBySlug(encodeURIComponent(slug));
    const res = await axios.put(url, data);
    return res.data;
  },

  // Cập nhật trạng thái hiển thị của bài viết
  updateStatus: async (slug: string, status: boolean) => {
    const url = endpoints.post.updateStatusBySlug(encodeURIComponent(slug));
    const res = await axios.put(url, { status });
    return res.data;
  },

  // Xóa bài viết theo slug
  delete: async (slug: string) => {
    const url = endpoints.post.deleteBySlug(encodeURIComponent(slug));
    const res = await axios.delete(url);
    return res.data;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post<{ message: string; url: string }>(
      endpoints.upload.image, 
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data.url; 
  },
};
