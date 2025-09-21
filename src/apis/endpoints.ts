export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  course: {
    getAll: "/course",
    create: "/course",
  },
  user: {
    getAll: "/user",
  },
  instructor: {
    getInstructorRequest: "/instructor/request-instructor",
  },
  grade: {
    createGrade: "/grade",
    getAll: "/grade",
    deleteGrade: "/grade/:id",
  },
  subject: '/subject'
};
