import React from "react";
import { Card, List, Typography, Tag } from "antd";
import { CheckCircleTwoTone, ExclamationCircleTwoTone } from "@ant-design/icons";

const { Text } = Typography;

interface SEOCheckerProps {
  title: string;
  description: string;
  slug: string;
  content?: string;
}

const SEOChecker: React.FC<SEOCheckerProps> = ({ title, description, slug, content }) => {
  const rules = [
    {
      label: "Tiêu đề (Title) 50–60 ký tự",
      valid: title.length >= 20 && title.length <= 100,
      value: `${title.length} ký tự`,
    },
    {
      label: "Mô tả (Description) 120–160 ký tự",
      valid: description.length >= 120 && description.length <= 160,
      value: `${description.length} ký tự`,
    },
    {
      label: "Nội dung tối thiểu 300 từ",
      valid: (content?.split(" ").length || 0) >= 300,
      value: `${content?.split(" ").length || 0} từ`,
    },
    {
      label: "Từ khóa xuất hiện trong tiêu đề & mô tả",
      valid:
        title.toLowerCase().includes(slug.split("-")[0] || "") &&
        description.toLowerCase().includes(slug.split("-")[0] || ""),
      value: "Kiểm tra từ khóa",
    },
    {
      label: "Từ khóa xuất hiện trong nội dung",
      valid: content?.toLowerCase().includes(slug.split("-")[0] || ""),
      value: "Kiểm tra từ khóa",
    },
    {
      label: "Từ khóa xuất hiện trong tiêu đề & mô tả",
      valid:
        title.toLowerCase().includes(slug.split("-")[0] || "") &&
        description.toLowerCase().includes(slug.split("-")[0] || ""),
      value: "Kiểm tra từ khóa",
    },
  ];

  return (
    <Card title="SEO Checker" size="small" style={{ marginTop: 16 }}>
      <List
        size="small"
        dataSource={rules}
        renderItem={(item) => (
          <List.Item>
            {item.valid ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: 8 }} />
            ) : (
              <ExclamationCircleTwoTone twoToneColor="#faad14" style={{ marginRight: 8 }} />
            )}
            <Text>{item.label}</Text>
            <Tag color={item.valid ? "green" : "red"} style={{ marginLeft: "auto" }}>
              {item.value}
            </Tag>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default SEOChecker;
