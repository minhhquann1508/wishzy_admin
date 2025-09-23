import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

// Import layout
const AdminLayout = lazy(() => import("@/app/admin/layout"));
const AuthLayout = lazy(() => import("@/app/auth/layout"));
import LoadingPage from "@/components/layouts/loading";

// Import auth page
const LoginPage = lazy(() => import("@/app/auth/login"));
const RegisterPage = lazy(() => import("@/app/auth/register"));

// Import admin page
const Dashboard = lazy(() => import("@/app/admin/dashboard"));
const AdminManageCoursePage = lazy(() => import("@/app/admin/courses"));
const AdminMangeUserPage = lazy(() => import("@/app/admin/users"));
const AdminMangeGradePage = lazy(() => import("@/app/admin/grades"));
const SubjectPage = lazy(() => import("@/app/admin/subjects"));
const ManageStudentPage = lazy(() => import("@/app/admin/students"));


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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: withSuspense(AuthLayout),
    children: [
      { index: true, Component: withSuspense(LoginPage) },
      { path: "/register", Component: withSuspense(RegisterPage) },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: withSuspense(Dashboard) },
      { path: "courses", Component: withSuspense(AdminManageCoursePage) },
      { path: "users", Component: withSuspense(AdminMangeUserPage) },
      { path: "students", Component: withSuspense(ManageStudentPage) },
      { path: "grades", Component: withSuspense(AdminMangeGradePage) },
      { path: "subjects", Component: withSuspense(SubjectPage) },
    ],
  },
]);
