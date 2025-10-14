import axios from "@/apis/axios";
import { endpoints } from "@/apis/endpoints";
import type { LectureDto, LectureUpdateDto } from "@/types/chapter";

export const LectureService = {
  getByChapterId: async (chapterId: string) => {
    return await axios.get(endpoints.lecture.getByChapterId(chapterId));
  },
  create: async (lectureData: LectureDto & { chapterSlug: string }) => {
    return await axios.post(endpoints.lecture.create, lectureData);
  },
  update: async (id: string, lectureData: LectureUpdateDto) => {
    return await axios.put(endpoints.lecture.updateById(id), lectureData);
  },
  delete: async (id: string) => {
    return await axios.delete(endpoints.lecture.deleteById(id));
  }
};
