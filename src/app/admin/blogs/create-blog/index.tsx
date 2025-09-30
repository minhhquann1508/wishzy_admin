import React from "react";
import { useNavigate } from "react-router-dom";
import BlogForm from "../BlogForm";

const BlogCreate: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div >
      <h2>Thêm bài viết</h2>
      <BlogForm onSuccess={() => navigate("/admin/blogs")} />
    </div>
  );
};

export default BlogCreate;
