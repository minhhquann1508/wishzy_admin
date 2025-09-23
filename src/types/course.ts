import type { User } from "@/services/auth";

export interface CourseDto {
  // Create payload DTO for Course
  courseName: string;
  description?: string;
  thumbnail?: string;
  price: number;
  sale?: SaleDto;
  status?: boolean; // default handled by backend
  level?: Level; // default 'beginner'
  totalDuration?: number; // in minutes/seconds depending on backend convention
  subject: string; // ObjectId as string
  createdBy?: string; 
}

export type Level = 'beginner' | 'intermediate' | 'advanced';

export type SaleType = 'percent' | 'fixed';

export interface SaleDto {
  saleType: SaleType;
  value: number; // >= 0; if percent, backend enforces <= 50
  saleStartDate?: Date | string | null;
  saleEndDate?: Date | string | null;
}

// For updating an existing course (all fields optional)
export type CourseUpdateDto = Partial<CourseDto>;

// Shape of course returned from the backend
export interface ICourse {
  _id: string;
  slug: string;
  courseName: string;
  description?: string;
  thumbnail?: string;
  price: number;
  sale?: SaleDto;
  status: boolean;
  rating: number;
  averageRating: number;
  numberOfStudents: number;
  level: Level;
  totalDuration: number;
  subject: string | Record<string, unknown>;
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}

