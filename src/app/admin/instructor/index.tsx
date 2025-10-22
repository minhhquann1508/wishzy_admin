import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Button, Modal, Tag, message } from "antd";
import { EyeOutlined, FileSearchOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useNavigate } from "react-router-dom";

import { InstructorService, type Instructor, type GetAllInstructorsResponse } from "@/services/instructor";
import SearchFilterBar from "@/components/common/SearchFilterBar";
import type { FilterValues } from "@/components/common/SearchFilterBar";
import RequestInstructorModal from "./RequestInstructorModal";

const { Title } = Typography;

const ManageInstructorPage: React.FC = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState<FilterValues>({ keyword: "", verified: null });

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState<Instructor | null>(null);

  // Lấy role người dùng từ localStorage
  const currentUserStr = localStorage.getItem("user");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const role = currentUser?.role;

  // ========================= KIỂM TRA QUYỀN =========================
  useEffect(() => {
    if (!["admin", "manager"].includes(role ?? "")) {
      navigate("/admin/no-access", { replace: true });
    } else {
      fetchInstructors(1, pagination.pageSize, filters.keyword);
    }
  }, [role]);

  // ========================= FETCH GIẢNG VIÊN =========================
  const fetchInstructors = async (page = 1, limit = 10, keyword = "") => {
    try {
      setLoading(true);
      const res: GetAllInstructorsResponse = await InstructorService.getAll({
        page,
        limit,
        fullName: keyword || undefined,
        isInstructorActive: true,
      });
      setInstructors(res.instructors || []);
      setPagination({
        current: res.pagination.currentPage,
        pageSize: res.pagination.pageSizes,
        total: res.pagination.totalItems,
      });
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách giảng viên");
      navigate("/admin/no-access", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchInstructors(newPagination.current ?? 1, pagination.pageSize, filters.keyword);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    fetchInstructors(1, pagination.pageSize, newFilters.keyword);
  };

  // ========================= COLUMNS TABLE =========================
  const columns: ColumnsType<Instructor> = [
    { title: "Tên giảng viên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? new Date(text).toLocaleDateString("vi-VN") : "-"),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, instructor) => (
        <Button
          icon={<EyeOutlined />}
          type="link"
          onClick={() => {
            setCurrentInstructor(instructor);
            setIsViewModalOpen(true);
          }}
        >
          Xem
        </Button>
      ),
    },
  ];

  if (!["admin", "manager"].includes(role ?? "")) return null;

  // ========================= RENDER =========================
  return (
    <div style={{ minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Header + nút modal yêu cầu làm giảng viên */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Quản lý giảng viên
        </Title>
        <Button
          type="primary"
          icon={<FileSearchOutlined />}
          onClick={() => setIsRequestModalOpen(true)}
        >
          Xem yêu cầu làm giảng viên
        </Button>
      </div>

      {/* Search */}
      <SearchFilterBar
        placeholder="Tìm kiếm giảng viên theo tên"
        onFilterChange={handleFilterChange}
      />

      {/* Table danh sách giảng viên */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={instructors}
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

      {/* Modal xem chi tiết giảng viên */}
      <Modal
        title="Chi tiết giảng viên"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
      >
        {currentInstructor && (
          <div>
            <p>
              <b>Họ và tên:</b> {currentInstructor.fullName}
            </p>
            <p>
              <b>Email:</b> {currentInstructor.email}
            </p>
            <p>
              <b>Ngày tạo:</b>{" "}
              {currentInstructor.createdAt
                ? new Date(currentInstructor.createdAt).toLocaleDateString("vi-VN")
                : "-"}
            </p>
            <p>
              <b>Trạng thái:</b>{" "}
              {currentInstructor.verified ? (
                <Tag color="green">Đã xác thực</Tag>
              ) : (
                <Tag color="red">Chưa xác thực</Tag>
              )}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal danh sách yêu cầu làm giảng viên */}
      <RequestInstructorModal
        open={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
};

export default ManageInstructorPage;
