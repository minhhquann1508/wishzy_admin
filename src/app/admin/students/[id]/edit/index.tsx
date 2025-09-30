import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Spin,
  Select,
  Space,
  Avatar,
  Tag,
  Card,
  List,
  Divider,
  Row,
  Col,
  ConfigProvider,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { UserService, type UserDetail } from "@/services/users";

const { Title, Text } = Typography;
const { Option } = Select;

const roleMap: Record<string, { text: string; color: string }> = {
  student: { text: "Học viên", color: "blue" },
  instructor: { text: "Giảng viên", color: "green" },
  admin: { text: "Quản trị", color: "red" },
};

const statusMap: Record<string, { text: string; color: string }> = {
  completed: { text: "Hoàn thành", color: "green" },
  "in-progress": { text: "Đang học", color: "blue" },
  pending: { text: "Chưa bắt đầu", color: "orange" },
};

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const fetchUser = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await UserService.getAll().then((res) =>
        res.users.find((u) => u._id === userId)
      );
      if (!data) throw new Error("Không tìm thấy người dùng");

      const detailedUser: UserDetail = {
        ...data,
        purchasedCourses: [
          { _id: "c1", title: "React cơ bản", status: "completed", purchaseDate: "2025-08-01" },
          { _id: "c2", title: "TypeScript nâng cao", status: "in-progress", purchaseDate: "2025-09-01" },
        ],
        activities: [
          { id: "a1", action: "Đăng nhập hệ thống", date: "2025-09-10" },
          { id: "a2", action: "Hoàn thành khóa React cơ bản", date: "2025-08-20" },
        ],
        grades: [
          { course: "React cơ bản", score: 95 },
          { course: "TypeScript nâng cao", score: 88 },
        ],
        classes: [
          { id: "cl1", name: "Lớp React 101", startDate: "2025-07-01", endDate: "2025-08-30" },
          { id: "cl2", name: "Lớp TS nâng cao", startDate: "2025-09-01", endDate: "2025-10-01" },
        ],
        verified: data.verified || false,
      };

      setUser(detailedUser);
      form.setFieldsValue({
        fullName: detailedUser.fullName,
        email: detailedUser.email,
        role: detailedUser.role,
        phone: detailedUser.phone,
        dob: detailedUser.dob,
        gender: detailedUser.gender,
        address: detailedUser.address,
        avatar: detailedUser.avatar,
      });
    } catch (err) {
      console.error(err);
      message.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleSave = async (values: Partial<UserDetail>) => {
    try {
      await UserService.update(userId!, values);
      message.success("Cập nhật thông tin thành công");
      setEditing(false);
      fetchUser();
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    }
  };

  if (loading || !user) return <Spin style={{ marginTop: 50 }} />;

  return (
    <ConfigProvider>
      <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
        <Space align="start" style={{ marginBottom: 24 }}>
          <Avatar size={100} src={user.avatar} style={{ backgroundColor: "#f0f0f0" }}>
            {!user.avatar && user.fullName.split(" ").map((word) => word[0].toUpperCase()).join("")}
          </Avatar>
          <div>
            <Title level={4} style={{ marginBottom: 0 }}>{user.fullName}</Title>
            <Tag color={roleMap[user.role]?.color || "default"}>{roleMap[user.role]?.text || user.role}</Tag>
            <div style={{ marginTop: 4, color: "#888" }}>
              Ngày tạo: {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "-"}
            </div>
            <div style={{ marginTop: 2, color: user.verified ? "green" : "orange" }}>
              {user.verified ? (
                <>
                  <CheckCircleOutlined style={{ marginRight: 4 }} />
                  Đã xác thực
                </>
              ) : (
                "Chưa xác thực"
              )}
            </div>
            {user.age && <div>Tuổi: {user.age}</div>}
            {user.phone && <div>SĐT: {user.phone}</div>}
            {user.dob && <div>Ngày sinh: {new Date(user.dob).toLocaleDateString("vi-VN")}</div>}
          </div>
        </Space>

        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: "Nhập họ và tên" }]}>
            <Input disabled={!editing} />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Nhập email hợp lệ" }]}>
            <Input disabled={!editing} />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone">
            <Input disabled={!editing} />
          </Form.Item>
          <Form.Item label="Ngày sinh" name="dob">
            <Input type="date" disabled={!editing} />
          </Form.Item>
          <Form.Item label="Vai trò" name="role">
            <Select disabled={!editing}>
              <Option value="student">Học viên</Option>
              <Option value="instructor">Giảng viên</Option>
              <Option value="admin">Quản trị</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            {editing ? (
              <Space>
                <Button type="primary" htmlType="submit">Lưu</Button>
                <Button onClick={() => setEditing(false)}>Hủy</Button>
              </Space>
            ) : (
              <Button type="primary" onClick={() => setEditing(true)}>Chỉnh sửa</Button>
            )}
            <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>Quay lại</Button>
          </Form.Item>
        </Form>

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Card title="Khóa học đã mua">
              {user.purchasedCourses?.length ? (
                <List
                  dataSource={user.purchasedCourses}
                  renderItem={(course) => (
                    <List.Item>
                      <List.Item.Meta
                        title={course.title}
                        description={
                          <>
                            <Text>Ngày mua: {new Date(course.purchaseDate).toLocaleDateString("vi-VN")}</Text>
                            <br />
                            <Tag color={statusMap[course.status]?.color}>{statusMap[course.status]?.text}</Tag>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : <Text>Người dùng chưa mua khóa học nào</Text>}
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Lớp đã tham gia">
              {user.classes?.length ? (
                <List
                  dataSource={user.classes}
                  renderItem={(cls) => (
                    <List.Item>
                      <List.Item.Meta
                        title={cls.name}
                        description={`${new Date(cls.startDate).toLocaleDateString("vi-VN")} - ${new Date(cls.endDate).toLocaleDateString("vi-VN")}`}
                      />
                    </List.Item>
                  )}
                />
              ) : <Text>Chưa tham gia lớp nào</Text>}
            </Card>
          </Col>
        </Row>

        <Divider />

        <Card title="Điểm số" style={{ marginBottom: 16 }}>
          {user.grades?.length ? (
            <List
              dataSource={user.grades}
              renderItem={(grade) => <List.Item><Text>{grade.course}: {grade.score} điểm</Text></List.Item>}
            />
          ) : <Text>Chưa có điểm</Text>}
        </Card>

        <Card title="Lịch sử hoạt động">
          {user.activities?.length ? (
            <List
              dataSource={user.activities}
              renderItem={(act) => <List.Item><Text>{act.action} - {new Date(act.date).toLocaleDateString("vi-VN")}</Text></List.Item>}
            />
          ) : <Text>Chưa có hoạt động nào</Text>}
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default UserDetailPage;
