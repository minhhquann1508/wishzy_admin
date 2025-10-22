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
      <Menu.Item key="status-1">Trạng thái: Hiển thị</Menu.Item>
      <Menu.Item key="status-2">Trạng thái: Ẩn</Menu.Item>
      <Menu.Item key="featured-1">Nổi bật: Có</Menu.Item>
      <Menu.Item key="featured-2">Nổi bật: Không</Menu.Item>
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
            onClick={() => navigate(`/admin/posts/${record.slug}`)}
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
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => {
        const date = new Date(createdAt);
        const formatted = date.toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        return formatted;
      },
    },
  ];

  return (
    <div style={{  minHeight: "100vh" }}>
      <div
        style={{
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
              <Button size="large" icon={<FileExcelOutlined />}>Quản lí bình luận</Button>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => navigate("/admin/posts/create")}
              >
                Tạo bài viết
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
                <Button size="large" type="primary">
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
          pagination={{ pageSize: 10, showSizeChanger: false }}
          style={{ marginTop: 16 }}
          locale={{ emptyText: "Không có bài viết" }}
        />
      </Spin>
    </div>
  );
};

export default BlogManager;
