// ManageStudentPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  Dropdown,
  Typography,
  Spin,
  Tag,
  Modal,
} from "antd";
import {
  DownOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig, ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";

import { UserService, type User, type GetAllUsersResponse } from "@/services/users";
import { useMessage } from "@/hooks/useMessage";
import SearchFilterBar, { type FilterValues } from "@/components/common/SearchFilterBar";
import UserFormModal from "@/components/common/UserFormModal";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

// Role map
const roleMap: Record<string, { text: string; value: string; color: string }> = {
  admin: { text: "Quản trị", value: "admin", color: "red" },
  marketing: { text: "Marketing", value: "marketing", color: "purple" },
  content: { text: "Content", value: "content", color: "orange" },
  manager: { text: "Quản lý", value: "manager", color: "volcano" },
  staff: { text: "Nhân viên", value: "staff", color: "blue" },
};

const ManageStudentPage: React.FC = () => {
  const message = useMessage();
  const navigate = useNavigate();

  const currentUserStr = localStorage.getItem("user");
  const currentUser: User | null = currentUserStr ? JSON.parse(currentUserStr) : null;
  const role = currentUser?.role;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState<FilterValues>({ keyword: "", verified: null });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  interface FetchUsersParams {
    page: number;
    limit: number;
    fullName?: string;
  }

  const fetchUsers = useCallback(
    async (page = 1, limit = 10, filtersData: FilterValues = { keyword: "" }) => {
      try {
        setLoading(true);
        const params: FetchUsersParams = { page, limit };
        if (filtersData.keyword) params.fullName = filtersData.keyword;

        const res: GetAllUsersResponse = await UserService.getAll(params);
        setUsers(res.users || []);
        setPagination({
          current: res.pagination.currentPage,
          pageSize: res.pagination.pageSizes,
          total: res.pagination.totalItems,
        });
      } catch (err) {
        console.error(err);
        message.error("Không thể tải danh sách người dùng");
        navigate("/admin/no-access", { replace: true });
      } finally {
        setLoading(false);
      }
    },
    [message]
  );

  useEffect(() => {
    if (!["admin", "manager"].includes(role ?? "")) {
      navigate("/admin/no-access", { replace: true });
    } else {
      fetchUsers(pagination.current, pagination.pageSize, filters);
    }
  }, [role, fetchUsers, navigate, pagination.current, pagination.pageSize, filters]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchUsers(newPagination.current ?? 1, newPagination.pageSize ?? 10, filters);
  };

  // CRUD actions
  const handleDeleteUser = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xoá?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          await UserService.delete(id);
          message.success("Xoá thành công");
          fetchUsers(pagination.current, pagination.pageSize, filters);
        } catch {
          message.error("Xoá thất bại");
        }
      },
    });
  };

  const handleSubmitUser = async (values: Partial<User>) => {
    try {
      if (modalMode === "create") {
        const newUser: User = { ...values, _id: "" } as User;
        await UserService.create(newUser);
        message.success("Tạo người dùng thành công");
      } else if (modalMode === "edit" && selectedUser) {
        await UserService.update(selectedUser._id, values);
        message.success("Cập nhật người dùng thành công");
      }
      setModalOpen(false);
      setSelectedUser(null);
      fetchUsers(pagination.current, pagination.pageSize, filters);
    } catch {
      message.error(modalMode === "create" ? "Tạo người dùng thất bại" : "Cập nhật thất bại");
    }
  };

  const handleEditUser = async (id: string) => {
    try {
      setLoading(true);
      const res = await UserService.getOne(id);
      setSelectedUser(res.user);
      setModalMode("edit");
      setModalOpen(true);
    } catch {
      message.error("Không thể lấy thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (id: string) => {
    try {
      setLoading(true);
      const res = await UserService.getOne(id);
      setSelectedUser(res.user);
      setIsViewModalVisible(true);
    } catch {
      message.error("Không thể lấy thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<User> = [
    { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: "15%",
      render: (role) => <Tag color={roleMap[role]?.color}>{roleMap[role]?.text}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => (text ? new Date(text).toLocaleDateString("vi-VN") : "-"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        const menuItems: MenuProps["items"] = [
          { key: "view", label: "Xem", icon: <EyeOutlined /> },
          { key: "edit", label: "Sửa", icon: <EditOutlined /> },
          { key: "delete", label: "Xoá", icon: <DeleteOutlined />, danger: true },
        ];

        const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
          if (key === "view") handleViewUser(record._id);
          else if (key === "edit") handleEditUser(record._id); // fetch getOne
          else if (key === "delete") handleDeleteUser(record._id);
        };

        return (
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]}>
            <Button>
              Thao tác <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  if (!["admin", "manager"].includes(role ?? "")) return null;

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        style={{
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
            onClick={() => {
              setSelectedUser(null);
              setModalMode("create");
              setModalOpen(true);
            }}
          >
            Thêm người dùng
          </Button>
        </Space>
      </div>

      <SearchFilterBar onFilterChange={setFilters} initialFilters={filters} />

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

      {/* Modal Thêm/Sửa */}
      <UserFormModal
        open={modalOpen}
        mode={modalMode}
        user={modalMode === "edit" ? selectedUser : null}
        onCancel={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSubmitUser}
      />

      {/* Modal Xem */}
      <Modal
        title="Chi tiết người dùng"
        open={isViewModalVisible}
        footer={null}
        onCancel={() => setIsViewModalVisible(false)}
      >
        {selectedUser && (
          <div>
            <p><b>Họ và tên:</b> {selectedUser.fullName}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Vai trò:</b> <Tag color={roleMap[selectedUser.role]?.color}>{roleMap[selectedUser.role]?.text}</Tag></p>
            <p><b>Ngày tạo:</b> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("vi-VN") : "-"}</p>
            <p><b>SĐT:</b> {selectedUser.phone || "-"}</p>
            <p><b>Địa chỉ:</b> {selectedUser.address || "-"}</p>
            <p><b>Giới tính:</b> {selectedUser.gender || "-"}</p>
            <p><b>Ngày sinh:</b> {selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString("vi-VN") : "-"}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageStudentPage;
