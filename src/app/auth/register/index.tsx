import { useRegister } from "@/hooks/authHook";
import { Button, Form, Input} from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mutate, isPending } = useRegister();
  // hàm thưc hiện đăng ký - Duy Ánh
  const onFinish = async  (data: { fullName: string; email: string; password: string }) => { 
    mutate(data, {
      onSuccess() {
        console.log("Đăng ký thành công:", data);
        navigate("/");
      },
      onError(error) {
        console.error("Đăng ký thất bại:", error);
      },
    })
    
    // if (isSuccess) {
      
    //   navigate("/");
    // }
    // if (isError) {
    //   // message.error("Đăng ký thất bại, vui lòng thử lại!");
    //   console.log("Đăng ký thất bại ", isError);
    // }
    // try {
    //   const res = await AuthService.register(data)
    //   console.log(res);
    //   navigate("/");
    // } catch (error) {
    //   console.log("Error during registration:", error); 
    // }
    // console.log(data);  
    // form.resetFields();

  };
 

  return (
    <div className="p-5 border rounded-md">
      <Form
        form={form}
        name="register"
        layout="vertical"
        className="!w-[450px]"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký tài khoản</h2>
        
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" size="large" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input placeholder="Nhập email" size="large" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu" size="large" />
        </Form.Item>

        <Form.Item className="mt-6">
          <Button loading={isPending} type="primary" htmlType="submit" size="large" block>
            Đăng ký
          </Button>
        </Form.Item>

        <div className="text-center">
          Đã có tài khoản? <Link to="/" className="text-blue-500">Đăng nhập ngay</Link>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;