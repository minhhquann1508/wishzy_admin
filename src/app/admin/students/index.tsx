import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Dropdown,
  Menu,
  Typography,
  Spin,
  Modal,
  Form,
  Tag,
  Select,
} from "antd";
import { useMessage } from "@/hooks/useMessage";
import {
  DownOutlined,
  PlusOutlined,
  DeleteOutlined,
  FilterOutlined,
  FileExcelOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig, ColumnsType } from "antd/es/table";
import { UserService, type User, type GetAllUsersResponse } from "@/services/users";

const { Search } = Input;
const { Title } = Typography;

const roleMap: Record<string, { text: string; color: string }> = {
  student: { text: "Học viên", color: "blue" },
  instructor: { text: "Giảng viên", color: "green" },
  admin: { text: "Quản trị", color: "red" },
  marketing: { text: "Marketing", color: "purple" },
  content: { text: "Content", color: "orange" },
  manager: { text: "Quản lý", color: "volcano" },
};

const ManageStudentPage: React.FC = () => {
  const message = useMessage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form] = Form.useForm<User>();

  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res: GetAllUsersResponse = await UserService.getAll({ page, limit });
      setUsers(res.users || []);
      setPagination({
        current: res.pagination.currentPage,
        pageSize: res.pagination.pageSizes,
        total: res.pagination.totalItems,
      });
    } catch (err) {
      message.error("Không thể tải danh sách người dùng");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchUsers(newPagination.current ?? 1, newPagination.pageSize ?? 10);
  };

  const handleDeleteUser = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xoá?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          await UserService.delete(id);
          message.success("Xoá thành công");
          fetchUsers(pagination.current, pagination.pageSize);
        } catch (err) {
          console.error(err);
          message.error("Xoá thất bại");
        }
      },
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: "Tên đầy đủ",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: "15%",
      render: (role: string) => {
        const r = roleMap[role] || { text: role, color: "default" };
        return <Tag color={r.color}>{r.text}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) =>
        text ? new Date(text).toLocaleDateString("vi-VN") : "-",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="view"
              icon={<EyeOutlined />}
              onClick={() => {
                setCurrentUser(record);
                setIsViewModalVisible(true);
              }}
            >
              Xem
            </Menu.Item>
            <Menu.Item
              key="edit"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentUser(record);
                form.setFieldsValue(record);
                setIsEditModalVisible(true);
              }}
            >
              Sửa
            </Menu.Item>
            <Menu.Item
              key="delete"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteUser(record._id)}
            >
              Xoá
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button>
              Thao tác <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const handleCreateUser = async () => {
    try {
      const values = await form.validateFields();
      await UserService.create(values);
      message.success("Tạo người dùng thành công");
      setIsCreateModalVisible(false);
      form.resetFields();
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (err) {
      console.error(err);
      message.error("Tạo người dùng thất bại");
    }
  };

  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
      if (currentUser) {
        await UserService.update(currentUser._id, values);
        message.success("Cập nhật người dùng thành công");
        setIsEditModalVisible(false);
        form.resetFields();
        fetchUsers(pagination.current, pagination.pageSize);
      }
    } catch (err) {
      console.error(err);
      message.error("Cập nhật người dùng thất bại");
    }
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px 0px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Quản lý người dùng
        </Title>
        <Space>
          <Button icon={<FileExcelOutlined />}>Xuất file</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
          >
            Thêm người dùng
          </Button>
        </Space>
      </div>

      {/* Bộ lọc */}
      <div
        style={{
          padding: "12px 0px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          gap: "12px",
        }}
      >
        <Button icon={<FilterOutlined />}>+ Thêm điều kiện lọc</Button>
        <Search placeholder="Tìm kiếm người dùng" allowClear style={{ maxWidth: 500 }} />
      </div>

      {/* Bảng dữ liệu */}
      <Spin spinning={loading}>
        <Table<User>
          columns={columns}
          dataSource={users}
          rowKey="_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
      </Spin>

      {/* Modal thêm */}
      <Modal
        title="Thêm người dùng"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreateUser}
        okText="Tạo mới"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Vai trò"
            name="role"
            initialValue="student"
            rules={[{ required: true }]}
          >
            <Select>
              {Object.entries(roleMap).map(([key, { text }]) => (
                <Select.Option key={key} value={key}>
                  {text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa người dùng"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        onOk={handleUpdateUser}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mật khẩu mới" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Vai trò" name="role" rules={[{ required: true }]}>
            <Select>
              {Object.entries(roleMap).map(([key, { text }]) => (
                <Select.Option key={key} value={key}>
                  {text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết người dùng"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
      >
        {currentUser && (
          <div>
            <p>
              <b>Họ và tên:</b> {currentUser.fullName}
            </p>
            <p>
              <b>Email:</b> {currentUser.email}
            </p>
            <p>
              <b>Vai trò:</b>{" "}
              <Tag color={roleMap[currentUser.role]?.color}>
                {roleMap[currentUser.role]?.text}
              </Tag>
            </p>
            <p>
              <b>Ngày tạo:</b>{" "}
              {currentUser.createdAt
                ? new Date(currentUser.createdAt).toLocaleDateString("vi-VN")
                : "-"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageStudentPage;
