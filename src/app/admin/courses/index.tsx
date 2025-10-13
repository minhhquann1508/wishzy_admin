import { CourseService } from "@/services/courses";
import type { CourseDto, ICourse, Level } from "@/types/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, Modal, Select, Switch, message, Col, Row, Tag, Space, Popconfirm, Table, Upload } from "antd";
import type { UploadFile } from "antd";
import { useState } from "react";
import { SubjectService } from "@/services/subjects";
import type { ISubject } from "@/types/subject";
import CkEditor from "@/components/common/ckEditor";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useSearchParams } from "react-router";
import { levelMapping } from "@/constants/constant";

const { Option } = Select;

const CoursePage = () => {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
  const queryClient = useQueryClient();

    // Lấy page và pageSize từ URL, fallback về default values
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  // Fetch subjects for Select options
  const { data: subjectData, isLoading: isSubjectsLoading } = useQuery({
    queryKey: ["subjects", { page: 1, limit: 100, status: true }],
    queryFn: () => SubjectService.getAll(1, 100, true),
    staleTime: 5 * 60 * 1000,
  });

  const { data: coursesData, isLoading: isCoursesLoading } = useQuery({
    queryKey: ['courses', currentPage, pageSize],
    queryFn: () => CourseService.getAll(currentPage, pageSize),
  });

  const createCourseMutation = useMutation({
    mutationFn: (courseData: CourseDto) => CourseService.create(courseData),
    onSuccess: () => {
      message.success('Tạo khoá học thành công');
      form.resetFields();
      setFileList([]);
      setEditingCourse(null);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error) => {
      message.error('Tạo khoá học thất bại');
      console.log(error);
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: CourseDto }) => 
      CourseService.update(slug, data),
    onSuccess: () => {
      message.success('Cập nhật khoá học thành công');
      form.resetFields();
      setFileList([]);
      setEditingCourse(null);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error) => {
      message.error('Cập nhật khoá học thất bại');
      console.log(error);
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (slug: string) => CourseService.delete(slug),
    onSuccess: () => {
      message.success('Xóa khoá học thành công');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error) => {
      message.error('Xóa khoá học thất bại');
      console.log(error);
    }
  });

  const showModal = () => {
    form.resetFields();
    setFileList([]);
    setEditingCourse(null);
    setOpen(true);
  };

  const showEditModal = (course: ICourse) => {
    setEditingCourse(course);
    
    const subjectId = typeof course.subject === 'object' && course.subject !== null 
      ? (course.subject as { _id: string })._id 
      : course.subject;
    
    form.setFieldsValue({
      courseName: course.courseName,
      description: course.description,
      thumbnail: course.thumbnail,
      price: course.price,
      status: course.status,
      level: course.level,
      totalDuration: course.totalDuration,
      subject: subjectId,
    });
    
    
    if (course.thumbnail) {
      setFileList([{
        uid: '-1',
        name: 'thumbnail',
        status: 'done',
        url: course.thumbnail,
      }]);
    }
    setOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setEditingCourse(null);
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
      if (editingCourse) {
        updateCourseMutation.mutate({ slug: editingCourse.slug, data: payload });
      } else {
        createCourseMutation.mutate(payload);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
      {
        title: 'STT',
        key: 'index',
        width: 60,
        render: (_: unknown, __: ICourse, index: number) => index + 1,
      },
      {
        title: 'Tên khoá học',
        dataIndex: 'courseName',
        key: 'courseName',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (field: number) => field.toLocaleString('vi-VN'),
    },
    {
      title: 'Trình độ',
      dataIndex: 'level',
      key: 'level',
      render: (level: Level) => {
        const levelInfo = levelMapping[level];
        if (!levelInfo) return <Tag>{level}</Tag>;
        return <Tag color={levelInfo.color}>{levelInfo.text}</Tag>;
      },
    },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status: boolean) => (
          <Tag color={status ? 'green' : 'red'}>
            {status ? 'Hiện' : 'Ẩn'}
          </Tag>
        ),
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      },
      {
        title: 'Hành động',
        key: 'actions',
        width: 120,
        render: (_: unknown, record: ICourse) => (
          <Space>
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => showEditModal(record)}
            />
            <Popconfirm
              title="Xóa khoá học"
              description="Bạn có chắc chắn muốn xóa khoá học này?"
              onConfirm={(e) => {
                e?.preventDefault();
                deleteCourseMutation.mutate(record.slug);
              }}
              onCancel={(e) => e?.preventDefault()}
              okText="Xóa"
              cancelText="Hủy"
              placement="topRight"
              getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
            >
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                size="small"
                danger
                loading={deleteCourseMutation.isPending}
                onClick={(e) => e.preventDefault()}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý khoá học</h1>
        <Button type="primary" onClick={showModal}>Tạo khoá học</Button>
      </div>
      <Table
        columns={columns}
        dataSource={coursesData?.data.courses || []}
        loading={isCoursesLoading}
        rowKey="_id"
        pagination={{
          current: coursesData?.data?.pagination?.currentPage || currentPage,
          pageSize: coursesData?.data?.pagination?.pageSize || pageSize,
          total: coursesData?.data?.pagination?.totalItems || 0,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} khoá học`,
          onChange: (page, size) => {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('page', page.toString());
            newParams.set('pageSize', (size || 10).toString());
            setSearchParams(newParams);
          },
          onShowSizeChange: (_, size) => {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('page', '1'); // Reset về trang 1 khi thay đổi page size
            newParams.set('pageSize', size.toString());
            setSearchParams(newParams);
          },  
        }}
      />
      <Modal
        title={editingCourse ? "Cập nhật khoá học" : "Tạo khoá học mới"}
        open={open}
        onOk={handleOk}
        confirmLoading={createCourseMutation.isPending || updateCourseMutation.isPending}
        onCancel={handleCancel}
        okText={editingCourse ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
        width={800}
        centered
        style={{ top: 20 }}
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

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item name="level" label="Trình độ">
                <Select>
                  <Option value="beginner">Cơ bản</Option>
                  <Option value="intermediate">Trung cấp</Option>
                  <Option value="advanced">Nâng cao</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="totalDuration" label="Tổng thời lượng (phút)">
                <InputNumber className="w-full" min={0} placeholder="0" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <CkEditor key={editingCourse?._id || 'new'} />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item name="thumbnail" label="Ảnh thumbnail">
                <Upload
                  name="image"
                  listType="picture-card"
                  fileList={fileList}
                  action="http://localhost:8000/api/upload/image"
                  onChange={({ fileList: newFileList, file }) => {
                    setFileList(newFileList);
                    if (file.status === 'done' && file.response) {
                      form.setFieldValue('thumbnail', file.response.url);
                    }
                  }}
                  onRemove={() => {
                    form.setFieldValue('thumbnail', undefined);
                  }}
                  maxCount={1}
                >
                  {fileList.length === 0 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" valuePropName="checked">
                <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
              </Form.Item>  
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CoursePage;