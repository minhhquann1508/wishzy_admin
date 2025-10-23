import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

// Import layout
const AdminLayout = lazy(() => import("@/app/admin/layout"));
const AuthLayout = lazy(() => import("@/app/auth/layout"));
import LoadingPage from "@/components/layouts/loading";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import GuestRoute from "@/components/common/GuestRoute";

// Import auth page
const LoginPage = lazy(() => import("@/app/auth/login"));
const RegisterPage = lazy(() => import("@/app/auth/register"));

// Import admin page
const Dashboard = lazy(() => import("@/app/admin/dashboard"));
const AdminManageCoursePage = lazy(() => import("@/app/admin/courses"));
const CourseDetailPage = lazy(() => import("@/app/admin/courses/[slug]"));
const AdminMangeUserPage = lazy(() => import("@/app/admin/users"));
const AdminMangeGradePage = lazy(() => import("@/app/admin/grades"));
const SubjectPage = lazy(() => import("@/app/admin/subjects"));
const ManageStudentPage = lazy(() => import("@/app/admin/students"));
const UserDetailPage = lazy(() => import("@/app/admin/students/[id]/edit"));
const ManageInstructorPage = lazy(() => import("@/app/admin/instructor"));
const BlogManager = lazy(() => import("@/app/admin/blogs"));
const BlogForm = lazy(() => import("@/app/admin/blogs/create-blog"));
const BlogEdit = lazy(() => import("@/app/admin/blogs/[slug]"));
const ManagePostCategoryPage = lazy(() => import("@/app/admin/blogs/post-category"));


// Import intructor

const withSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType>
) => {
  return () => (
    <Suspense fallback={<LoadingPage />}>
      <Component />
    </Suspense>
  );
};

const withProtectedRoute = (
  Component: React.LazyExoticComponent<React.ComponentType>
) => {
  return () => (
    <ProtectedRoute>
      <Suspense fallback={<LoadingPage />}>
        <Component />
      </Suspense>
    </ProtectedRoute>
  );
};

const withGuestRoute = (
  Component: React.LazyExoticComponent<React.ComponentType>
) => {
  return () => (
    <GuestRoute>
      <Suspense fallback={<LoadingPage />}>
        <Component />
      </Suspense>
    </GuestRoute>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: withGuestRoute(AuthLayout),
    children: [
      { index: true, Component: withSuspense(LoginPage) },
      { path: "/register", Component: withSuspense(RegisterPage) },
    ],
  },
  {
    path: "/admin",
    Component: withProtectedRoute(AdminLayout),
    children: [
      { index: true, Component: withSuspense(Dashboard) },
      { 
        path: "courses",
        children: [
          { index: true, Component: withSuspense(AdminManageCoursePage) },
          { path: ":slug", Component: withSuspense(CourseDetailPage) },
        ],
      },
      { path: "users", Component: withSuspense(AdminMangeUserPage) },
      {
        path: "students",
        children: [
          { index: true, Component: withSuspense(ManageStudentPage) },
          { path: ":userId/edit", Component: withSuspense(UserDetailPage) }, 
        ],
      },
      { path: "instructors", Component: withSuspense(ManageInstructorPage) },
      { path: "grades", Component: withSuspense(AdminMangeGradePage) },
      { path: "subjects", Component: withSuspense(SubjectPage) },
      { path: "posts/post-category", Component: withSuspense(ManagePostCategoryPage) },
      { path: "posts", 
        children: [
          { index: true, Component: withSuspense(BlogManager) },
          { path: "create", Component: withSuspense(BlogForm) },
          { path: ":slug", Component: withSuspense(BlogEdit) },
        ]
       },
    ],
  },
]);
