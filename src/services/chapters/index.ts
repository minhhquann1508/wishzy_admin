import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";
import type { ChapterDto, ChapterUpdateDto } from "@/types/chapter";

export const ChapterService = {
  getByCourseSlug: async (courseSlug: string) => {
    return await axios.get(endpoints.chapter.getByCourseSlug(courseSlug));
  },
  create: async (chapterData: ChapterDto) => {
    return await axios.post(endpoints.chapter.create, chapterData);
  },
  update: async (id: string, chapterData: ChapterUpdateDto) => {
    return await axios.put(endpoints.chapter.updateById(id), chapterData);
  },
  delete: async (id: string) => {
    return await axios.delete(endpoints.chapter.deleteById(id));
  }
};
