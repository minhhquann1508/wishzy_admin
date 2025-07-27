import { Spin } from "antd";
import logoImg from "@/assets/wishzy-logo.jpg";

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Spin
        tip={<span className="text-orange-500 text-lg">Đang tải....</span>}
        size="large"
        className="custom-orange-spin"
      >
        <img src={logoImg} alt="logo" width={160} height={80} />
      </Spin>
    </div>
  );
};

export default LoadingPage;
