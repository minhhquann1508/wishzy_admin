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
  message,
  Modal,
  Form,
  Tag,
} from "antd";
import {
  DownOutlined,
  PlusOutlined,
  DeleteOutlined,
  FilterOutlined,
  FileExcelOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig } from "antd/es/table";
import { UserService, type User, type GetAllUsersResponse } from "@/services/users";
import { Link } from "react-router-dom";

const { Search } = Input;
const { Title } = Typography;

const ManageStudentPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const roleMap: Record<string, { text: string; color: string }> = {
    student: { text: "Học viên", color: "blue" },
    instructor: { text: "Giảng viên", color: "green" },
    admin: { text: "Quản trị", color: "red" },
  };

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
  }, []);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchUsers(newPagination.current ?? 1, newPagination.pageSize ?? 10);
  };

  const handleDeleteUsers = () => {
    Modal.confirm({
      title: "Xác nhận xoá?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => UserService.delete(id as string)));
          message.success("Xoá thành công");
          fetchUsers(pagination.current, pagination.pageSize);
          setSelectedRowKeys([]);
        } catch (err) {
          console.error(err);
          message.error("Xoá thất bại");
        }
      },
    });
  };

  const actionMenu = (
    <Menu>
      <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={handleDeleteUsers}>
        Xóa người dùng
      </Menu.Item>
      <Menu.Item key="export" icon={<FileExcelOutlined />}>
        Xuất file Excel
      </Menu.Item>
    </Menu>
  );

  const filterMenu = (
    <Menu>
      <Menu.Item key="role">Lọc theo vai trò</Menu.Item>
      <Menu.Item key="date">Lọc theo ngày tạo</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Tên đầy đủ",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string, record: User) => (
        <Link to={`/admin/students/${record._id}/edit`}>{text}</Link>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
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
      render: (text: string) => (text ? new Date(text).toLocaleDateString("vi-VN") : "-"),
    },
  ];

  const handleCreateUser = async () => {
    try {
      const values = await form.validateFields();
      values.role = "student";
      await UserService.create(values);
      message.success("Tạo người dùng thành công");
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (err) {
      console.error(err);
      message.error("Tạo người dùng thất bại");
    }
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div
        style={{
          padding: "16px 0px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {selectedRowKeys.length === 0 ? (
          <>
            <Title level={4} style={{ margin: 0 }}>
              Quản lý người dùng <span style={{ color: "#888", fontSize: 14 }}>(Click vào tên người dùng để chỉnh sửa)</span>
            </Title>
            <Space>
              <Button icon={<FileExcelOutlined />}>Xuất file</Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Thêm người dùng
              </Button>
            </Space>
          </>
        ) : (
          <>
            <span>
              Đã chọn <b>{selectedRowKeys.length}</b> người dùng
            </span>
            <Space>
              <Dropdown overlay={actionMenu} placement="bottomRight">
                <Button type="primary">
                  Thao tác <DownOutlined />
                </Button>
              </Dropdown>
            </Space>
          </>
        )}
      </div>

      <div
        style={{
          padding: "12px 0px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          gap: "12px",
        }}
      >
        <Dropdown overlay={filterMenu} trigger={["click"]}>
          <Button icon={<FilterOutlined />}>
            + Thêm điều kiện lọc <DownOutlined />
          </Button>
        </Dropdown>
        <Search placeholder="Tìm kiếm người dùng" allowClear style={{ maxWidth: 500 }} />
      </div>

      <Spin spinning={loading}>
        <Table
          rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
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

      <Modal
        title="Thêm người dùng"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreateUser}
        okText="Tạo mới"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Nhập họ và tên" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Nhập email hợp lệ" }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Nhập mật khẩu" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageStudentPage;
