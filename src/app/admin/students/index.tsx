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
} from "antd";
import {
  DownOutlined,
  PlusOutlined,
  DeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig } from "antd/es/table";
import {
  UserService,
  type User,
  type GetAllUsersResponse,
} from "@/services/users";

const { Search } = Input;
const { Title } = Typography;

const ManageStudentPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch danh sách user
  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res: GetAllUsersResponse = await UserService.getAll({
        page,
        limit,
      });

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

  const columns = [
    {
      title: "Tên đầy đủ",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string) => <a>{text}</a>,
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
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) =>
        text ? new Date(text).toLocaleDateString("vi-VN") : "-",
    },
  ];

  // Menu nhập liệu
  const menu = (
    <Menu>
      <Menu.Item key="1">Nhập từ Excel</Menu.Item>
      <Menu.Item key="2">Nhập từ CSV</Menu.Item>
    </Menu>
  );

  // Menu xuất dữ liệu
  const exportMenu = (
    <Menu>
      <Menu.Item key="1">Xuất Excel</Menu.Item>
      <Menu.Item key="2">Xuất CSV</Menu.Item>
    </Menu>
  );

  // Menu thao tác
  const actionMenu = (
    <Menu>
      <Menu.Item key="delete" icon={<DeleteOutlined />}>
        Xóa người dùng
      </Menu.Item>
      <Menu.Item key="update">Cập nhật vai trò</Menu.Item>
    </Menu>
  );

  // Menu lọc
  const filterMenu = (
    <Menu>
      <Menu.Item key="role">Lọc theo vai trò</Menu.Item>
      <Menu.Item key="email">Lọc theo email</Menu.Item>
    </Menu>
  );

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
        {selectedRowKeys.length === 0 ? (
          <>
            <Title level={4} style={{ margin: 0 }}>
              Danh sách người dùng
            </Title>
            <Space>
              <Dropdown overlay={menu} placement="bottomRight">
                <Button>
                  Nhập dữ liệu <DownOutlined />
                </Button>
              </Dropdown>
              <Dropdown overlay={exportMenu} placement="bottomRight">
                <Button>
                  Xuất dữ liệu <DownOutlined />
                </Button>
              </Dropdown>
              <Button type="primary" icon={<PlusOutlined />}>
                Tạo người dùng
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

      {/* Thanh lọc + tìm kiếm */}
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
        <Search
          placeholder="Tìm kiếm người dùng"
          allowClear
          style={{ width: "100%" }}
        />
      </div>

      {/* Table */}
      <Spin spinning={loading}>
        <Table
          style={{ margin: 0 }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
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
    </div>
  );
};

export default ManageStudentPage;
