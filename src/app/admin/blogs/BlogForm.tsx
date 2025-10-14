import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
} from "antd";
import {
  ArrowLeftOutlined,
  UploadOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { BlogService, type Post } from "@/services/posts";
import { PostCategoryService, type PostCategory } from "@/services/post-category";
import SEOChecker from "@/components/common/SEOChecker";
import CkEditor from "@/components/common/ckEditor"; 

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
  tags?: string[];
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData, slug, onSuccess }) => {
  const [form] = Form.useForm<BlogFormValues>();
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [preview, setPreview] = useState<string>();
  const [altText, setAltText] = useState("");
  const [loading, setLoading] = useState(false);

  const watchTitle = Form.useWatch("title", form);
  const watchDescription = Form.useWatch("description", form);
  const watchSlug = Form.useWatch("slug", form);
  const watchContent = Form.useWatch("content", form);

  const toSlug = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

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
        tags: initialData.tags || [],
      });
      if (initialData.thumbnail) setPreview(initialData.thumbnail);
      if (initialData.thumbnailAlt) setAltText(initialData.thumbnailAlt);
    }
  }, [initialData]);

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
        tags: values.tags || [],
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
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/admin/blogs">
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              style={{ padding: 0, fontSize: 20 }}
            />
          </Link>
          <Title level={4} style={{ margin: 0 }}>
            {slug ? `${initialData?.title}` : "Tạo bài viết mới"}
          </Title>
        </div>
        <Button
          type="primary"
          style={{ width: 120, height: 40 }}
          onClick={() => form.submit()}
          loading={loading}
        >
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
                label="Nội dung"
                name="content"
                rules={[{ required: true, message: "Nhập nội dung" }]}
              >
                <CkEditor
                  value={form.getFieldValue("content") || ""}
                  onChange={(data) => form.setFieldsValue({ content: data })}
                />
              </Form.Item>

              <div style={{ display: "flex", gap: 16 }}>
                <Form.Item
                  label="Danh mục"
                  name="category"
                  style={{ flex: 1 }}
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
                <Form.Item label="Người viết" style={{ flex: 1 }}>
                  <Input value={initialData?.createdBy?.fullName || "Admin"} disabled />
                </Form.Item>
              </div>
            </Card>

            <Card title="Tối ưu SEO">
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
                    marginBottom: 4,
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {watchTitle || "Tiêu đề SEO"}
                </a>
                <div style={{ color: "#006621", fontSize: 14, marginBottom: 4 }}>
                  {`www.wishzy.vn/blog/${watchSlug || "duong-dan-bai-viet"}`}
                </div>
                <div
                  style={{
                    color: "#545454",
                    fontSize: 14,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {watchDescription || "Mô tả SEO"}
                </div>
              </div>

              <Form.Item label="Mô tả SEO" name="description">
                <TextArea rows={3} placeholder="Nhập mô tả SEO" />
              </Form.Item>

              <Form.Item label="Đường dẫn (Slug)" name="slug">
                <Input
                  addonBefore="www.wishzy.vn/blog/"
                  placeholder="Tùy chỉnh slug"
                  onChange={(e) => form.setFieldsValue({ slug: toSlug(e.target.value) })}
                />
              </Form.Item>

              <SEOChecker
                title={watchTitle || ""}
                description={watchDescription || ""}
                slug={watchSlug || ""}
                content={watchContent || ""}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <Card title="Trạng thái">
                <Form.Item label="Hiển thị" name="status" valuePropName="checked" initialValue>
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
                    <Space style={{ justifyContent: "flex-end", width: "100%" }}>
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

              <Card title="Nhãn">
                <Form.Item name="tags">
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder="Nhập nhãn"
                    tokenSeparators={[","]}
                  />
                </Form.Item>
              </Card>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default BlogForm;
