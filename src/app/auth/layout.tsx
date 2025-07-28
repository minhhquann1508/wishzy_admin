import { Link, Outlet } from "react-router";

import logoImg from "@/assets/wishzy-logo.png";

const AuthLayout = () => {
  return (
    <div className="container mx-auto flex justify-center items-center h-screen gap-10">
      <Link to={"/"} className="w-1/2 flex flex-col items-center">
        <img className="w-[200px]" src={logoImg} alt="logo" />
        <div>
          <h1 className="font-semibold text-2xl text-center leading-10">
            Chào mừng bạn đến với trang <br /> quản trị tại Wishzy
          </h1>
        </div>
      </Link>
      <div className="w-1/2 flex justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
