import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import BlogForm from "../BlogForm";
import { BlogService, type Post } from "@/services/posts";
import { useMessage } from "@/hooks/useMessage";

const BlogEdit: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const message = useMessage();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (slug) {
      BlogService.getBySlug(slug)
        .then((res) => {
          if (res?.post) {
            setPost(res.post);
          } else {
            message.error("Không tìm thấy bài viết");
            navigate("/admin/blogs");
          }
        })
        .catch(() => {
          message.error("Lỗi khi tải bài viết");
          navigate("/admin/blogs");
        })
        .finally(() => setLoading(false));
    }
  }, [slug, message, navigate]);

  if (loading) return <Spin />;

  return (
    <div >
      {post && <BlogForm initialData={post} slug={slug} onSuccess={() => navigate("/admin/blogs")} />}
    </div>
  );
};

export default BlogEdit;
