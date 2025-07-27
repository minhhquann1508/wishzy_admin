import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div>
      <h1 className="font-bold">Đây là layout</h1>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
