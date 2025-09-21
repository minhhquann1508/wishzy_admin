export interface GradeDto {
    gradeName: string,
    status?: boolean,
}

export interface IGrade {
    _id: string;
    gradeName: string;
    status: boolean;
    createdAt: string;
    updatedAt?: string;
    slug: string;
}

export interface GradePagination {
    currentPage: number;
    totalPages: number;
    pageSizes: number;
    totalItems: number;
}

export interface GradeResponse {
    grades: IGrade[];
    pagination: GradePagination;
}