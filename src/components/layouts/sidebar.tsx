import { Layout, Menu } from "antd";
import { Link } from "react-router";
import logoImg from "@/assets/wishzy-logo.png";
import type { ItemType } from "antd/es/menu/interface";
const { Sider } = Layout;

const sideBarStyle = {
  backgroundColor: "#fff",
  borderRight: "1px solid #ccc",
  padding: "16px 0",
};

const MenuComponent = ({ items }: { items: ItemType[] }) => {
  return <Menu style={{ width: "100%" }} mode="inline" items={items} />;
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
