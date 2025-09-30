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
  Avatar,
} from "antd";
import {
  DownOutlined,
  PlusOutlined,
  DeleteOutlined,
  FilterOutlined,
  FileExcelOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { BlogService, type Post } from "@/services/posts";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Title } = Typography;

const BlogManager: React.FC = () => {
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await BlogService.getAll();
      setBlogs(res.posts || []);
    } catch {
      message.error("Không tải được danh sách blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDeleteBlogs = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map((slug) => BlogService.delete(slug.toString()))
      );
      message.success("Xóa thành công");
      fetchBlogs();
      setSelectedRowKeys([]);
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const actionMenu = (
    <Menu>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={handleDeleteBlogs}
      >
        Xóa bài viết
      </Menu.Item>
      <Menu.Item key="export" icon={<FileExcelOutlined />}>
        Xuất file Excel
      </Menu.Item>
    </Menu>
  );

  const filterMenu = (
    <Menu>
      <Menu.Item key="category">Lọc theo danh mục</Menu.Item>
      <Menu.Item key="author">Lọc theo tác giả</Menu.Item>
    </Menu>
  );

  const columns: ColumnsType<Post> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (_: unknown, record: Post) => (
        <Space>
          <Avatar shape="square" size={50} src={record.thumbnail} />
          <span
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => navigate(`/admin/blogs/${record.slug}`)}
          >
            {record.title}
          </span>
        </Space>
      ),
    },
    { title: "Người viết", dataIndex: ["createdBy", "fullName"], key: "author" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Hiển thị" : "Ẩn"}
        </Tag>
      ),
    },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => navigate(`/admin/blogs/${record.slug}/edit`)}
        >
          Sửa
        </Button>
      ),
    },
  ];

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
              Quản lý bài viết
            </Title>
            <Space>
              <Button icon={<FileExcelOutlined />}>Xuất file</Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/admin/blogs/create")}
              >
                Thêm bài viết
              </Button>
            </Space>
          </>
        ) : (
          <>
            <span>
              Đã chọn <b>{selectedRowKeys.length}</b> bài viết
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
          placeholder="Tìm kiếm bài viết"
          allowClear
          style={{ maxWidth: 500 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Spin spinning={loading}>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns}
          dataSource={blogs.filter((b) =>
            b.title.toLowerCase().includes(search.toLowerCase())
          )}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      </Spin>
    </div>
  );
};

export default BlogManager;
