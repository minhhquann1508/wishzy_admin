export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  course: {
    getAll: "/course",
    create: "/course",
    updateBySlug: (slug: string) => `/course/${slug}`,
    deleteBySlug: (slug: string) => `/course/${slug}`,
  },
  user: {
    getAll: "/user",
    getOne: (id: string) => `/user/${id}`,
    create: "/user",          
    updateById: (id: string) => `/user/${id}`, 
    deleteById: (id: string) => `/user/${id}`,  
  },
  student: {
    getAllStudents: "/user/students",
  },
  instructor: {
    createInstructorRequest: "/instructor/request",
    getInstructorRequest: "/instructor/request-instructor",
    approveInstructor: "/instructor/approve",
    rejectInstructor: "/instructor/reject",
    getAllInstructors: "/instructor",
    getInstructorById: "/instructor",
    cancelInstructorRequest: "/instructor/cancel",
  },
  grade: {
    createGrade: "/grade",
    getAll: "/grade",
    deleteGrade: "/grade/:id",
  },
  subject: '/subject',
  postCategory: {
    create: "/post-category",
    getAll: "/post-category",
    updateBySlug: (slug: string) => `/post-category/${slug}`,
    updateStatusBySlug: (slug: string) => `/post-category/${slug}/status`,
    deleteBySlug: (slug: string) => `/post-category/${slug}`,
  },
  post: {
    create: "/post",
    getAll: "/post",
    getPostBySlug: (slug: string) => `/post/${slug}`,
    updateBySlug: (slug: string) => `/post/${slug}`,
    updateStatusBySlug: (slug: string) => `/post/${slug}/status`,
    deleteBySlug: (slug: string) => `/post/${slug}`,
  },
  upload: {
    image: "/upload/image",
    video: "/upload/video",
  },
  chapter: {
    getByCourseSlug: (courseSlug: string) => `/chapter/${courseSlug}`,
    create: "/chapter",
    updateById: (id: string) => `/chapter/${id}`,
    deleteById: (id: string) => `/chapter/${id}`,
  },
  lecture: {
    getByChapterId: (chapterId: string) => `/lecture/chapter/${chapterId}`,
    create: "/lecture",
    updateById: (id: string) => `/lecture/${id}`,
    deleteById: (id: string) => `/lecture/${id}`,
  },
};
