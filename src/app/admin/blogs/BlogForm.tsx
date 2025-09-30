import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Select,
  Switch,
  Upload,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Collapse,
} from "antd";
import { UploadOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { BlogService, type Post } from "@/services/posts";
import { PostCategoryService, type PostCategory } from "@/services/post-category";

const { TextArea } = Input;
const { Title } = Typography;

interface BlogFormProps {
  initialData?: Post;
  slug?: string;
  onSuccess?: () => void;
}

interface BlogFormValues {
  title: string;
  description: string;
  content: string;
  category: string;
  thumbnail?: { originFileObj: File }[];
  status: boolean;
  isFeatured?: boolean;
  slug?: string;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData, slug, onSuccess }) => {
  const [form] = Form.useForm<BlogFormValues>();
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [preview, setPreview] = useState<string>();
  const [altText, setAltText] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Watch giá trị form để SEO Preview update realtime ---
  const watchTitle = Form.useWatch("title", form);
  const watchDescription = Form.useWatch("description", form);
  const watchSlug = Form.useWatch("slug", form);

  // Hàm chuyển tiếng Việt thành slug
  const toSlug = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  useEffect(() => {
    PostCategoryService.getAll()
      .then((res) => setCategories(res.postCategories || []))
      .catch(() => message.error("Không tải được danh mục"));
  }, []);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        title: initialData.title,
        description: initialData.description,
        content: initialData.content,
        category:
          typeof initialData.category === "string"
            ? initialData.category
            : initialData.category._id,
        status: Boolean(initialData.status),
        isFeatured: Boolean(initialData.isFeatured),
        slug: initialData.slug,
      });
      if (initialData.thumbnail) setPreview(initialData.thumbnail);
      if (initialData.thumbnailAlt) setAltText(initialData.thumbnailAlt);
    }
  }, [initialData]);

  // Tự động tạo slug khi nhập tiêu đề
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!form.getFieldValue("slug")) {
      form.setFieldsValue({ slug: toSlug(value) });
    }
  };

  const handleSubmit = async (values: BlogFormValues) => {
    try {
      setLoading(true);
      let thumbnail: string | undefined = preview;

      if (values.thumbnail && values.thumbnail[0]?.originFileObj) {
        thumbnail = await BlogService.uploadImage(values.thumbnail[0].originFileObj);
      }

      const payload = {
        title: values.title,
        description: values.description,
        content: values.content,
        category: values.category,
        status: values.status,
        isFeatured: values.isFeatured,
        thumbnail,
        thumbnailAlt: altText,
        slug: values.slug,
      };

      if (slug) {
        await BlogService.update(slug, payload);
        message.success("Cập nhật thành công");
      } else {
        await BlogService.create(payload);
        message.success("Tạo mới thành công");
      }
      onSuccess?.();
    } catch {
      message.error("Lưu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header sticky */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          padding: "24px 12px",
          marginBottom: 16,
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          {slug ? `Chỉnh sửa bài viết - ${initialData?.title}` : "Tạo bài viết mới"}
        </Title>
        <Button type="primary" onClick={() => form.submit()} loading={loading}>
          {slug ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>

      <Form<BlogFormValues> form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={24}>
          <Col span={16}>
            <Card style={{ marginBottom: 24 }}>
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: "Nhập tiêu đề" }]}
              >
                <Input
                  size="large"
                  placeholder="Nhập tiêu đề bài viết"
                  onChange={handleTitleChange}
                />
              </Form.Item>

              <Form.Item
                label="Mô tả ngắn"
                name="description"
                rules={[{ required: true, message: "Nhập mô tả" }]}
              >
                <TextArea rows={3} placeholder="Nhập mô tả ngắn" />
              </Form.Item>

              <Form.Item
                label="Nội dung"
                name="content"
                rules={[{ required: true, message: "Nhập nội dung" }]}
              >
                <TextArea
                  rows={14}
                  placeholder="Nhập nội dung bài viết..."
                  style={{ fontFamily: "monospace" }}
                />
              </Form.Item>

              <Form.Item
                label="Danh mục"
                name="category"
                rules={[{ required: true, message: "Chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {categories.map((c) => (
                    <Select.Option key={c._id} value={c._id}>
                      {c.categoryName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>

            {/* Card SEO với preview + collapse */}
            <Card>
              <Title level={5}>Xem trước SEO</Title>
              <div
                style={{
                  padding: 16,
                  border: "1px solid #f0f0f0",
                  borderRadius: 4,
                  marginBottom: 16,
                }}
              >
                <a
                  style={{
                    color: "#1a0dab",
                    fontSize: 18,
                    lineHeight: "22px",
                    marginBottom: 4,
                    display: "block",
                    wordBreak: "break-word",
                  }}
                >
                  {watchTitle || "Tiêu đề SEO"}
                </a>
                <div
                  style={{
                    color: "#006621",
                    fontSize: 14,
                    marginBottom: 4,
                    wordBreak: "break-word",
                  }}
                >
                  {`www.wishzy.vn/blog/${watchSlug || "duong-dan-bai-viet"}`}
                </div>
                <div
                  style={{
                    color: "#545454",
                    fontSize: 14,
                    marginBottom: 4,
                    whiteSpace: "normal",
                  }}
                >
                  {watchDescription || "Mô tả SEO"}
                </div>
              </div>

              <Collapse ghost>
                <Collapse.Panel header="Chỉnh sửa SEO" key="1">
                  <Form.Item label="Mô tả SEO" name="description">
                    <TextArea rows={3} placeholder="Nhập mô tả SEO" />
                  </Form.Item>

                  <Form.Item label="Đường dẫn (Slug)" name="slug">
                    <Input
                      addonBefore={<p style={{ margin: 0 }}>www.wishzy.vn/blog/</p>}
                      placeholder="Tùy chỉnh slug (nếu cần)"
                      onChange={(e) =>
                        form.setFieldsValue({ slug: toSlug(e.target.value) })
                      }
                    />
                  </Form.Item>
                </Collapse.Panel>
              </Collapse>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col span={8}>
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <Card title="Trạng thái">
                <Form.Item
                  label="Hiển thị"
                  name="status"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                </Form.Item>
                <Form.Item label="Bài viết nổi bật" name="isFeatured" valuePropName="checked">
                  <Switch checkedChildren="Nổi bật" unCheckedChildren="Thường" />
                </Form.Item>
              </Card>

              <Card title="Ảnh bìa">
                <Form.Item
                  name="thumbnail"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e?.fileList}
                >
                  <Upload
                    beforeUpload={(file) => {
                      const previewUrl = URL.createObjectURL(file);
                      setPreview(previewUrl);
                      return false;
                    }}
                    maxCount={1}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                </Form.Item>

                <div
                  style={{
                    marginTop: 12,
                    borderRadius: 6,
                    overflow: "hidden",
                    textAlign: "center",
                    minHeight: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fafafa",
                  }}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt={altText || "preview"}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: 220,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ color: "#999" }}>Chưa chọn ảnh</span>
                  )}
                </div>

                {preview && (
                  <>
                    <Form.Item label="ALT text" style={{ marginTop: 8 }}>
                      <Input
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Nhập ALT cho ảnh"
                      />
                    </Form.Item>
                    <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => window.open(preview, "_blank")}
                      >
                        Xem
                      </Button>
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          setPreview(undefined);
                          setAltText("");
                          form.setFieldsValue({ thumbnail: undefined });
                        }}
                      >
                        Xóa
                      </Button>
                    </Space>
                  </>
                )}
              </Card>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default BlogForm;
