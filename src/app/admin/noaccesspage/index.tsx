import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const NoAccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Quay về trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default NoAccessPage;
