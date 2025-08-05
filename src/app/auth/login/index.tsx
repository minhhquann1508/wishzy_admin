import { Button, Checkbox, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthService, type LoginPayload, type LoginResponse } from "@/services/auth";
import type { AxiosResponse } from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setSubmitting(true);
    try {
      const payload: LoginPayload = {
        email: values.username,
        password: values.password,
      };

      const res: AxiosResponse<LoginResponse> = await AuthService.login(payload);
      navigate("/admin");
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div className="p-5 border rounded-md">
        <Form
            name="login"
            layout="vertical"
            className="!w-[450px]"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>

          <Form.Item
              label="Email"
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
          >
            <Input placeholder="Nhập email" size="large" />
          </Form.Item>

          <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" size="large" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" className="mb-0">
            <Checkbox>Ghi nhớ tài khoản</Checkbox>
          </Form.Item>

          <Form.Item className="flex justify-end mt-4">
            <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={submitting}
                block
            >
              Đăng nhập ngay
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </Form>
      </div>
  );
};

export default LoginPage;
