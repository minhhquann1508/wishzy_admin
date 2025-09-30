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
  Switch,
} from "antd";
import {
  DownOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { TablePaginationConfig } from "antd/es/table";
import {
  PostCategoryService,
  type PostCategory,
  type GetAllPostCategoryResponse,
} from "@/services/post-category";

const { Search } = Input;
const { Title } = Typography;

const ManagePostCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<PostCategory | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const fetchCategories = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res: GetAllPostCategoryResponse =
        await PostCategoryService.getAll({ page, limit });
      let list = res.postCategories || [];
      if (search) {
        list = list.filter((c) =>
          c.categoryName.toLowerCase().includes(search.toLowerCase())
        );
      }
      setCategories(list);
      setPagination({
        current: res.pagination.currentPage,
        pageSize: res.pagination.pageSizes,
        total: res.pagination.totalItems,
      });
    } catch {
      message.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(pagination.current, pagination.pageSize);
  }, [search]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchCategories(newPagination.current ?? 1, newPagination.pageSize ?? 10);
  };

  const handleDeleteCategory = (slug: string) => {
    Modal.confirm({
      title: "Xác nhận ẩn danh mục?",
      icon: <ExclamationCircleOutlined />,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await PostCategoryService.delete(slug);
          message.success("Ẩn danh mục thành công");
          fetchCategories(pagination.current, pagination.pageSize);
        } catch {
          message.error("Ẩn thất bại");
        }
      },
    });
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: `Xác nhận ẩn ${selectedRowKeys.length} danh mục?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          for (const slug of selectedRowKeys) {
            await PostCategoryService.delete(slug as string);
          }
          message.success("Ẩn danh mục thành công");
          setSelectedRowKeys([]);
          fetchCategories(pagination.current, pagination.pageSize);
        } catch {
          message.error("Ẩn thất bại");
        }
      },
    });
  };

  const actionMenu = (record: PostCategory) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => {
          setEditingCategory(record);
          form.setFieldsValue({
            categoryName: record.categoryName,
            status: record.status,
          });
          setIsModalVisible(true);
        }}
      >
        Chỉnh sửa
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={() => handleDeleteCategory(record.slug)}
      >
        Ẩn danh mục
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: PostCategory) => (
        <Switch
          checked={status}
          checkedChildren="Hoạt động"
          unCheckedChildren="Ẩn"
          onChange={async (checked) => {
            try {
              await PostCategoryService.updateStatus(record.slug, checked);
              message.success("Cập nhật trạng thái thành công");
              fetchCategories(pagination.current, pagination.pageSize);
            } catch {
              message.error("Cập nhật thất bại");
            }
          }}
        />
      ),
    },
    {
      title: "Người tạo",
      dataIndex: ["createdBy", "fullName"],
      key: "createdBy",
      render: (text: string) => text || "-",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: unknown, record: PostCategory) => (
        <Dropdown overlay={actionMenu(record)} trigger={["click"]}>
          <Button type="link">
            Thao tác <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await PostCategoryService.update(editingCategory.slug, values);
        message.success("Cập nhật danh mục thành công");
      } else {
        await PostCategoryService.create(values);
        message.success("Tạo danh mục thành công");
      }
      setIsModalVisible(false);
      setEditingCategory(null);
      form.resetFields();
      fetchCategories(pagination.current, pagination.pageSize);
    } catch {
      message.error("Thao tác thất bại");
    }
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {selectedRowKeys.length > 0 ? (
          <>
            <Typography.Text strong>
              Đã chọn {selectedRowKeys.length} danh mục
            </Typography.Text>
            <Space>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
              >
                Ẩn danh mục
              </Button>
            </Space>
          </>
        ) : (
          <>
            <Title level={4} style={{ margin: 0 }}>
              Quản lý danh mục bài viết
            </Title>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() =>
                  fetchCategories(pagination.current, pagination.pageSize)
                }
              >
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingCategory(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                Thêm danh mục
              </Button>
            </Space>
          </>
        )}
      </div>

      <div
        style={{
          padding: "12px 24px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <Search
          placeholder="Tìm kiếm danh mục"
          allowClear
          style={{ maxWidth: 400 }}
          onSearch={(value) => setSearch(value)}
        />
      </div>

      <Spin spinning={loading}>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns}
          dataSource={categories}
          rowKey="slug"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          style={{ padding: "0 24px" }}
        />
      </Spin>

      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText={editingCategory ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên danh mục"
            name="categoryName"
            rules={[{ required: true, message: "Nhập tên danh mục" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagePostCategoryPage;
