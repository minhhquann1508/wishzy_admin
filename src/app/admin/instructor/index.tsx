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
  Tag,
  Modal,
  Form,
} from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  PlusOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig } from "antd/es/table";
import {
  InstructorService,
  type Instructor,
  type GetInstructorsResponse,
} from "@/services/instructor";

const { Search } = Input;
const { Title } = Typography;

const ManageInstructorPage: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Fetch danh sách giảng viên
  const fetchInstructors = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res: GetInstructorsResponse = await InstructorService.getAll({
        page,
        limit,
      });

      let data = res.instructors || [];

      if (!data.length) {
        data = [
          {
            _id: "demo1",
            fullName: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            specialization: "Toán học",
            status: "approved",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "demo2",
            fullName: "Trần Thị B",
            email: "tranthib@example.com",
            specialization: "Vật lý",
            status: "pending",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "demo3",
            fullName: "Lê Văn C",
            email: "levanc@example.com",
            specialization: "Hóa học",
            status: "rejected",
            createdAt: new Date().toISOString(),
          },
        ];
      }

      setInstructors(data);
      setPagination({
        current: res.pagination?.currentPage || 1,
        pageSize: res.pagination?.pageSizes || 10,
        total: res.pagination?.totalItems || data.length,
      });
    } catch (err) {
      message.error("Không thể tải danh sách giảng viên");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchInstructors(newPagination.current ?? 1, newPagination.pageSize ?? 10);
  };

  // Thêm giảng viên
  const handleAddInstructor = async () => {
    try {
      const values = await form.validateFields();
      console.log("Dữ liệu thêm:", values);
      message.success("Thêm giảng viên thành công!");
      setIsModalOpen(false);
      form.resetFields();
      fetchInstructors(pagination.current, pagination.pageSize);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: "Tên giảng viên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Chuyên môn",
      dataIndex: "specialization",
      key: "specialization",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        switch (status) {
          case "pending":
            return <Tag color="orange">Chờ duyệt</Tag>;
          case "approved":
            return <Tag color="green">Đã duyệt</Tag>;
          case "rejected":
            return <Tag color="red">Từ chối</Tag>;
          default:
            return <Tag>{status}</Tag>;
        }
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) =>
        text ? new Date(text).toLocaleDateString("vi-VN") : "-",
    },
  ];
 
  // Menu thao tác khi chọn checkbox
  const actionMenu = (
    <Menu>
      <Menu.Item key="approve" icon={<CheckOutlined />}>
        Duyệt giảng viên
      </Menu.Item>
      <Menu.Item key="reject" icon={<CloseOutlined />}>
        Từ chối giảng viên
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />}>
        Xóa giảng viên
      </Menu.Item>
    </Menu>
  );

  // Menu lọc
  const filterMenu = (
    <Menu>
      <Menu.Item key="status">Lọc theo trạng thái</Menu.Item>
      <Menu.Item key="specialization">Lọc theo chuyên môn</Menu.Item>
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
              Quản lý giảng viên
            </Title>
            <Space>
              <Button icon={<FileExcelOutlined />}>Xuất file</Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
              >
                Thêm giảng viên
              </Button>
            </Space>
          </>
        ) : (
          <>
            <span>
              Đã chọn <b>{selectedRowKeys.length}</b> giảng viên
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
        <Search
          placeholder="Tìm kiếm giảng viên"
          allowClear
          style={{ maxWidth: 500 }}
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
          dataSource={instructors}
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

      {/* Modal thêm giảng viên */}
      <Modal
        title="Thêm giảng viên mới"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddInstructor}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="fullName"
            label="Tên giảng viên"
            rules={[{ required: true, message: "Nhập tên giảng viên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Nhập email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="specialization"
            label="Chuyên môn"
            rules={[{ required: true, message: "Nhập chuyên môn" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageInstructorPage;
