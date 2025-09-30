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
      { key: "student", label: "Học sinh" },
      { key: "intructor", label: "Giảng viên" },
      { key: "admin", label: "Quản trị viên" },
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
    label: "Quản lý khóa học",
    icon: <BookOpen size={16} />,
  },
  {
    key: "manage-exam",
    label: "Quản lý bài kiểm tra",
    icon: <FileClock size={16} />,
  },
  {
    key: "manage-social",
    label: "Quản lý giao tiếp",
    icon: <MessagesSquare size={16} />,
    children: [
      { key: "feedback", label: "Đánh giá" },
      { key: "course-comment", label: "Bình luận" },
    ],
  },
  {
    key: "manage-blog",
    label: "Quản lý bài viết",
    icon: <StickyNote size={16} />,
    children: [
      { key: "post", label: "Danh sách bài viết" },
      { key: "post-category", label: "Danh mục bài viết" },
      { key: "post-comment", label: "Bình luận" },
    ],
  },
  {
    key: "manage-banner",
    label: "Quản lý banner",
    icon: <Images size={16} />,
  },
  {
    key: "manage-voucher",
    label: "Quản lý voucher",
    icon: <TicketPercent size={16} />,
  },
];

const AdminLayout = (): React.ReactNode => {
  return (
    <Layout>
      <SidebarComponent items={items} />
      <Layout>
        <MainHeaderComponent />
        <Content className="bg-white mt-5 ml-5 pt-5 px-8">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
