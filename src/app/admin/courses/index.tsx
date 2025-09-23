import { CourseService } from "@/services/courses";
import type { CourseDto, Level, SaleType } from "@/types/course";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, Modal, Select, Switch, DatePicker, message, Col, Row } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { SubjectService } from "@/services/subjects";
import type { ISubject } from "@/types/subject";

const { Option } = Select;

const CoursePage = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  // Fetch subjects for Select options
  const { data: subjectData, isLoading: isSubjectsLoading } = useQuery({
    queryKey: ["subjects", { page: 1, limit: 100, status: true }],
    queryFn: () => SubjectService.getAll(1, 100, true),
    staleTime: 5 * 60 * 1000,
  });

  const createCourseMutation = useMutation({
    mutationFn: (courseData: CourseDto) => CourseService.create(courseData),
    onSuccess: () => {
      message.success('Tạo khoá học thành công');
      form.resetFields();
      setOpen(false);
    },
    onError: (error) => {
      message.error('Tạo khoá học thất bại');
      console.log(error);
    }
  });

  const showModal = () => {
    form.resetFields();
    setOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload: CourseDto = {
        courseName: values.courseName,
        description: values.description,
        thumbnail: values.thumbnail,
        price: values.price,
        sale: values.saleType && values.saleValue !== undefined ? {
          saleType: values.saleType as SaleType,
          value: values.saleValue,
          saleStartDate: values.saleRange?.[0] ? values.saleRange[0].toDate() : null,
          saleEndDate: values.saleRange?.[1] ? values.saleRange[1].toDate() : null,
        } : undefined,
        status: values.status,
        level: values.level as Level,
        totalDuration: values.totalDuration,
        subject: values.subject,
      };

      // Basic client-side validation for percent sale
      if (payload.sale?.saleType === 'percent' && payload.sale.value > 50) {
        message.error('Giảm giá theo phần trăm không được vượt quá 50%');
        return;
      }
      createCourseMutation.mutate(payload);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý khoá học</h1>
        <Button type="primary" onClick={showModal}>Tạo khoá học</Button>
      </div>

      <Modal
        title="Tạo khoá học mới"
        open={open}
        onOk={handleOk}
        confirmLoading={createCourseMutation.isPending}
        onCancel={handleCancel}
        okText="Tạo"
        cancelText="Hủy"
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true, level: 'beginner' }}
        >
          <Form.Item
            name="courseName"
            label="Tên khoá học"
            rules={[{ required: true, message: 'Vui lòng nhập tên khoá học' }]}
          >
            <Input placeholder="Nhập tên khoá học" />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item name="thumbnail" label="Ảnh thumbnail (URL)">
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
              >
                <InputNumber className="w-full" min={0} placeholder="0" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Giảm giá">
            <Input.Group compact>
              <Form.Item name="saleType" noStyle>
                <Select placeholder="Loại" style={{ width: 120 }} allowClear>
                  <Option value="percent">Phần trăm</Option>
                  <Option value="fixed">Cố định</Option>
                </Select>
              </Form.Item>
              <Form.Item name="saleValue" noStyle>
                <InputNumber style={{ width: 'calc(100% - 120px)' }} min={0} placeholder="Giá trị" />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item name="saleRange" label="Thời gian khuyến mãi">
            <DatePicker.RangePicker
              className="w-full"
              showTime
              format="YYYY-MM-DD HH:mm"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item name="level" label="Trình độ">
                <Select>
                  <Option value="beginner">Cơ bản</Option>
                  <Option value="intermediate">Trung cấp</Option>
                  <Option value="advanced">Nâng cao</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="totalDuration" label="Tổng thời lượng (phút)">
                <InputNumber className="w-full" min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                  name="subject"
                  label="Môn học"
                  rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
                >
                  <Select
                    placeholder="Chọn môn học"
                    loading={isSubjectsLoading}
                    showSearch
                    optionFilterProp="children"
                  >
                    {(subjectData?.data?.subjects as ISubject[] | undefined)?.map((s) => (
                      <Option key={s._id} value={s._id}>{s.subjectName}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea placeholder="Nhập mô tả" rows={4} />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CoursePage;