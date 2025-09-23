export interface SubjectDto {
    subjectName: string;
    status?: boolean;
    grade: string;
}

export interface ISubject {
    _id: string;
    subjectName: string;
    status: boolean;
    grade: {
        _id: string;
        gradeName: string;
    };
    createdAt: string;
    updatedAt?: string;
    slug: string;
}

export interface SubjectPagination {
    currentPage: number;
    totalPages: number;
    pageSizes: number;
    totalItems: number;
}

export interface SubjectResponse {
    subjects: ISubject[];
    pagination: SubjectPagination;
}
