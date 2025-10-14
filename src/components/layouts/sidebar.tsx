import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router";
import logoImg from "@/assets/wishzy-logo.jpg";
import type { ItemType } from "antd/es/menu/interface";
import { useMemo } from "react";

const { Sider } = Layout;

const sideBarStyle = {
  backgroundColor: "#fff",
  borderRight: "1px solid #ccc",
  padding: "16px 0",
};

const MenuComponent = ({ items }: { items: ItemType[] }) => {
  const location = useLocation();
  
  // Map route to menu key
  const getSelectedKey = (pathname: string): string => {
    if (pathname === '/admin' || pathname === '/admin/') return '/';
    if (pathname.includes('/admin/grades')) return 'grade';
    if (pathname.includes('/admin/subjects')) return 'subject';
    if (pathname.includes('/admin/courses')) return 'manage-course';
    if (pathname.includes('/admin/students')) return 'student';
    if (pathname.includes('/admin/instructors')) return 'intructor';
    if (pathname.includes('/admin/admins')) return 'admin';
    if (pathname.includes('/admin/exams')) return 'manage-exam';
    if (pathname.includes('/admin/feedbacks')) return 'feedback';
    if (pathname.includes('/admin/course-comments')) return 'course-comment';
    if (pathname.includes('/admin/posts')) return 'post';
    if (pathname.includes('/admin/post-categories')) return 'post-category';
    if (pathname.includes('/admin/post-comments')) return 'post-comment';
    if (pathname.includes('/admin/banners')) return 'manage-banner';
    if (pathname.includes('/admin/vouchers')) return 'manage-voucher';
    return '/';
  };

  // Get parent key for submenu
  const getOpenKeys = (pathname: string): string[] => {
    if (pathname.includes('/admin/grades') || pathname.includes('/admin/subjects')) {
      return ['manage-category'];
    }
    if (pathname.includes('/admin/students') || pathname.includes('/admin/instructors') || pathname.includes('/admin/admins')) {
      return ['manage-user'];
    }
    if (pathname.includes('/admin/feedbacks') || pathname.includes('/admin/course-comments')) {
      return ['manage-social'];
    }
    if (pathname.includes('/admin/posts') || pathname.includes('/admin/post-categories') || pathname.includes('/admin/post-comments')) {
      return ['manage-blog'];
    }
    return [];
  };

  const selectedKey = useMemo(() => getSelectedKey(location.pathname), [location.pathname]);
  const openKeys = useMemo(() => getOpenKeys(location.pathname), [location.pathname]);

  return (
    <Menu 
      style={{ width: "100%" }} 
      mode="inline" 
      items={items}
      selectedKeys={[selectedKey]}
      defaultOpenKeys={openKeys}
    />
  );
};

const SidebarComponent = ({
  width,
  items,
}: {
  width?: string;
  items: ItemType[];
}) => {
  return (
    <Sider width={width ?? 250} className="h-screen" style={sideBarStyle}>
      <Link to={"/"} className="flex justify-center mb-5">
        <img src={logoImg} width={120} />
      </Link>
      <MenuComponent items={items} />
    </Sider>
  );
};

export default SidebarComponent;
