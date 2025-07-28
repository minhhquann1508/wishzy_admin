import { Spin } from "antd";
import logoImg from "@/assets/wishzy-logo.png";

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center !bg-transparent animate-pulse transition-opacity duration-300">
      <Spin
        tip={<span className="text-orange-500">Đang tải....</span>}
        size="large"
        className="custom-orange-spin !bg-transparent"
      >
        <img src={logoImg} alt="logo" width={160} height={80} />
      </Spin>
    </div>
  );
};

export default LoadingPage;
