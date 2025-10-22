import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Modal, Button, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { UserService, type User, type UserDetail, type GetAllUsersResponse } from "@/services/users";
import { useMessage } from "@/hooks/useMessage";
import SearchFilterBar from "@/components/common/SearchFilterBar";
import type { FilterValues } from "@/components/common/SearchFilterBar";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ManageStudentPage: React.FC = () => {
  const message = useMessage();
  const navigate = useNavigate();

  // === Kiểm tra role ===
  const currentUserStr = localStorage.getItem("user");
  const currentUser: User | null = currentUserStr ? JSON.parse(currentUserStr) : null;
  const role = currentUser?.role;

  // Nếu không đủ quyền => redirect
  useEffect(() => {
    if (!["admin", "manager"].includes(role ?? "")) {
      navigate("/admin/no-access", { replace: true });
    }
  }, [role, navigate]);

  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<FilterValues>({ keyword: "", verified: null });
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

  // ========================= FETCH =========================
  const fetchStudents = async (
    page = 1,
    limit = 10,
    keyword = "",
    verified?: boolean | null
  ) => {
    try {
      setLoading(true);
      const res: GetAllUsersResponse = await UserService.getAllStudents({
        page,
        limit,
        fullName: keyword || undefined,
        verified: verified ?? undefined,
      });
      setStudents(res.students || []);
      setPagination({
        current: res.pagination.currentPage,
        pageSize: res.pagination.pageSizes,
        total: res.pagination.totalItems,
      });
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách học sinh");
      navigate("/admin/no-access", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetail = async (id: string) => {
    try {
      setLoading(true);
      const res = await UserService.getOne(id);
      setUserDetail(res.user);
      setIsViewModalVisible(true);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải thông tin học sinh");
    } finally {
      setLoading(false);
    }
  };

  // Khi filters thay đổi => gọi lại API
  useEffect(() => {
    if (["admin", "manager"].includes(role ?? "")) {
      fetchStudents(1, pagination.pageSize, filters.keyword, filters.verified);
    }
  }, [filters, role]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    const newPage = newPagination.current ?? 1;
    fetchStudents(newPage, pagination.pageSize, filters.keyword, filters.verified);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  // ========================= COLUMNS =========================
  const columns: ColumnsType<User> = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => text || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng thái xác thực",
      dataIndex: "verified",
      key: "verified",
      render: (verified: boolean) =>
        verified ? <Tag color="green">Đã xác thực</Tag> : <Tag color="red">Chưa xác thực</Tag>,
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
      align: "center",
      render: (_, record) => (
        <Button icon={<EyeOutlined />} type="link" onClick={() => fetchUserDetail(record._id)}>
          Xem
        </Button>
      ),
    },
  ];

  // ========================= RENDER =========================
  if (!["admin", "manager"].includes(role ?? "")) return null;

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "40px" }}>
      <div
        style={{
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Quản lý học sinh
        </Title>
      </div>

      <SearchFilterBar
        placeholder="Tìm kiếm học sinh theo tên"
        onFilterChange={handleFilterChange}
      />

      <Spin spinning={loading}>
        <Table<User>
          columns={columns}
          dataSource={students}
          rowKey="_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
        />
      </Spin>

      <Modal
        title="Chi tiết học sinh"
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setUserDetail(null);
        }}
        footer={null}
      >
        {userDetail ? (
          <div>
            <p>
              <b>Họ và tên:</b> {userDetail.fullName}
            </p>
            <p>
              <b>Email:</b> {userDetail.email}
            </p>
            <p>
              <b>Ngày tạo:</b>{" "}
              {userDetail.createdAt ? new Date(userDetail.createdAt).toLocaleDateString("vi-VN") : "-"}
            </p>
            <p>
              <b>Trạng thái:</b>{" "}
              {userDetail.verified ? <Tag color="green">Đã xác thực</Tag> : <Tag color="red">Chưa xác thực</Tag>}
            </p>

            {userDetail.purchasedCourses && userDetail.purchasedCourses.length > 0 && (
              <>
                <p><b>Khóa học đã mua:</b></p>
                <ul>
                  {userDetail.purchasedCourses.map(course => (
                    <li key={course._id}>
                      {course.title} - {course.status} ({new Date(course.purchaseDate).toLocaleDateString("vi-VN")})
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : (
          <Spin />
        )}
      </Modal>
    </div>
  );
};

export default ManageStudentPage;
