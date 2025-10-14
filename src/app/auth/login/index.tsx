import { Button, Checkbox, Form, Input, App } from "antd";
import { AuthService, type LoginPayload } from "@/services/auth";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { AuthUtils } from "@/utils/auth";
import { AxiosError } from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => AuthService.login(payload),
    onSuccess: (response) => {
      const { data } = response;
      
      AuthUtils.setToken(data?.accessToken || '');
      AuthUtils.setUser(data?.user || null);

      message.success('Đăng nhập thành công!');
      navigate('/admin');
    },
    onError: (error: AxiosError<{ msg?: string }>) => {
      message.error(error.response?.data?.msg || 'Đăng nhập thất bại!');
    },
  });

  const onFinish = async (values: { username: string; password: string }) => {
    const payload: LoginPayload = {
      email: values.username,
      password: values.password,
    };
    
    loginMutation.mutate(payload);
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
                loading={loginMutation.isPending}
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
