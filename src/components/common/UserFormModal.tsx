// UserFormModal.tsx
import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import type { User } from "@/services/users";

const roleMap: Record<string, { text: string; value: string; color: string }> = {
  admin: { text: "Quản trị", value: "admin", color: "red" },
  marketing: { text: "Marketing", value: "marketing", color: "purple" },
  content: { text: "Content", value: "content", color: "orange" },
  manager: { text: "Quản lý", value: "manager", color: "volcano" },
  staff: { text: "Nhân viên", value: "staff", color: "blue" },
};

interface Props {
  open: boolean;
  mode: "create" | "edit";
  user?: User | null;
  onCancel: () => void;
  onSubmit: (values: Partial<User>) => void; 
}

const UserFormModal: React.FC<Props> = ({ open, mode, user, onCancel, onSubmit }) => {
  const [form] = Form.useForm<User>();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Nếu là edit, không gửi password nếu để trống
      const filteredValues: Partial<User> = { ...values };
      if (mode === "edit" && !filteredValues.password) {
        delete filteredValues.password;
      }
      onSubmit(filteredValues);
      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      title={mode === "create" ? "Thêm người dùng" : "Chỉnh sửa người dùng"}
      open={open}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={handleOk}
      okText={mode === "create" ? "Tạo mới" : "Cập nhật"}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label={mode === "create" ? "Mật khẩu" : "Mật khẩu mới"}
          name="password"
          rules={mode === "create" ? [{ required: true }] : []}
        >
          <Input.Password placeholder={mode === "edit" ? "Để trống nếu không đổi" : ""} />
        </Form.Item>
        <Form.Item label="SĐT" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
        <Form.Item label="Giới tính" name="gender">
          <Select>
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
            <Select.Option value="other">Khác</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Ngày sinh" name="dob">
          <Input type="date" />
        </Form.Item>
        <Form.Item label="Vai trò" name="role" rules={[{ required: true }]} initialValue="staff">
          <Select>
            {Object.values(roleMap).map(({ text, value }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
