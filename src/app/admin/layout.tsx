import type React from "react";
import { Outlet } from "react-router";

const AdminLayout = (): React.ReactNode => {
  return (
    <div>
      đây là admin
      <Outlet />
    </div>
  );
};

export default AdminLayout;
