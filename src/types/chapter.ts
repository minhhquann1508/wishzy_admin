export interface ILecture {
  _id: string;
  lectureName: string;
  description?: string;
  videoUrl?: string;
  duration?: number; // in seconds
  order: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LectureDto {
  lectureName: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  status?: boolean;
}

export interface IChapter {
  _id: string;
  chapterName: string;
  description?: string;
  order: number;
  status: boolean;
  course: string;
  lectures: ILecture[];
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface ChapterDto {
  chapterName: string;
  description?: string;
  order: number;
  status?: boolean;
  courseSlug: string;
}

export type ChapterUpdateDto = Partial<ChapterDto>;
export type LectureUpdateDto = Partial<LectureDto>;
