import MainHeaderComponent from "@/components/layouts/header";
import SidebarComponent from "@/components/layouts/sidebar";
import type { ItemType } from "antd/es/menu/interface";


import { Layout } from "antd";
import { Link, Outlet } from "react-router";
import {
  BookOpen,
  FileClock,
  Images,
  LayoutDashboard,
  MessagesSquare,
  Shapes,
  StickyNote,
  TicketPercent,
  UsersRound,
} from "lucide-react";


const { Content } = Layout;

const items: ItemType[] = [
  {
    key: "/",
    label: <Link to="/admin">Thống kê & báo cáo</Link>,
    icon: <LayoutDashboard size={16} />,
  },
  {
    key: "manage-user",
    label: "Quản lý người dùng",
    icon: <UsersRound size={16} />,
    children: [
      { key: "student", label: <Link to="/admin/students">Học sinh</Link> },
      { key: "intructor", label: <Link to="/admin/instructors">Giảng viên</Link> },
      { key: "admin", label: <Link to="/admin/admins">Quản trị viên</Link> },
    ],
  },
  {
    key: "manage-category",
    label: "Quản lý lớp & môn học",
    icon: <Shapes size={16} />,
    children: [
      { key: "grade", label: <Link to="/admin/grades">Lớp học</Link> },
      { key: "subject", label: <Link to="/admin/subjects">Môn học</Link> },
    ],
  },
  {
    key: "manage-course",
    label: <Link to="/admin/courses">Quản lý khóa học</Link>,
    icon: <BookOpen size={16} />,
  },
  {
    key: "manage-exam",
    label: <Link to="/admin/exams">Quản lý bài kiểm tra</Link>,
    icon: <FileClock size={16} />,
  },
  {
    key: "manage-social",
    label: "Quản lý giao tiếp",
    icon: <MessagesSquare size={16} />,
    children: [
      { key: "feedback", label: <Link to="/admin/feedbacks">Đánh giá</Link> },
      { key: "course-comment", label: <Link to="/admin/course-comments">Bình luận</Link> },
    ],
  },
  {
    key: "manage-blog",
    label: "Quản lý bài viết",
    icon: <StickyNote size={16} />,
    children: [
      { key: "post", label: <Link to="/admin/posts">Danh sách bài viết</Link> },
      { key: "post-category", label: <Link to="/admin/post-categories">Danh mục bài viết</Link> },
      { key: "post-comment", label: <Link to="/admin/post-comments">Bình luận</Link> },
    ],
  },
  {
    key: "manage-banner",
    label: <Link to="/admin/banners">Quản lý banner</Link>,
    icon: <Images size={16} />,
  },
  {
    key: "manage-voucher",
    label: <Link to="/admin/vouchers">Quản lý voucher</Link>,
    icon: <TicketPercent size={16} />,
  },
];

const AdminLayout = (): React.ReactNode => {
  return (
    <Layout>
      <SidebarComponent items={items} />
      <Layout>
        <MainHeaderComponent />
        <Content className="p-5 px-8">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
