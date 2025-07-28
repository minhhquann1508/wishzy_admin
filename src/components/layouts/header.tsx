import { Layout } from "antd";
import { Link } from "react-router";

const { Header } = Layout;

const headerStyle = {
  backgroundColor: "#fff",
};

const MainHeaderComponent = () => {
  return (
    <Header className="flex justify-end" style={headerStyle}>
      <span>minhhquann1508@gmail</span>,{" "}
      <Link to={"/"} className="ml-1">
        Đăng xuất
      </Link>
    </Header>
  );
};

export default MainHeaderComponent;
