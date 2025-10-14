import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Collapse,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Switch,
  Table,
  Upload,
  message,
  Popconfirm,
  Spin,
} from "antd";
import type { UploadFile } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { ChapterService } from "@/services/chapters";
import { LectureService } from "@/services/lessons";
import type { IChapter, ChapterDto, LectureDto, ILecture } from "@/types/chapter";

const { Panel } = Collapse;

const CourseDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [chapterForm] = Form.useForm();
  const [lectureForm] = Form.useForm();

  // State management
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [lectureModalOpen, setLectureModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<IChapter | null>(null);
  const [editingLecture, setEditingLecture] = useState<ILecture | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [videoFileList, setVideoFileList] = useState<UploadFile[]>([]);

  // Fetch chapters
  const { data: chaptersData, isLoading: isChaptersLoading } = useQuery({
    queryKey: ["chapters", slug],
    queryFn: () => ChapterService.getByCourseSlug(slug!),
    enabled: !!slug,
  });

  const chapters = chaptersData?.data?.chapters || [];

  // Chapter mutations
  const createChapterMutation = useMutation({
    mutationFn: (chapterData: ChapterDto) => ChapterService.create(chapterData),
    onSuccess: () => {
      message.success("Tạo chương thành công");
      chapterForm.resetFields();
      setChapterModalOpen(false);
      setEditingChapter(null);
      queryClient.invalidateQueries({ queryKey: ["chapters", slug] });
    },
    onError: () => {
      message.error("Tạo chương thất bại");
    },
  });

  const updateChapterMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChapterDto }) =>
      ChapterService.update(id, data),
    onSuccess: () => {
      message.success("Cập nhật chương thành công");
      chapterForm.resetFields();
      setChapterModalOpen(false);
      setEditingChapter(null);
      queryClient.invalidateQueries({ queryKey: ["chapters", slug] });
    },
    onError: () => {
      message.error("Cập nhật chương thất bại");
    },
  });

  const deleteChapterMutation = useMutation({
    mutationFn: (id: string) => ChapterService.delete(id),
    onSuccess: () => {
      message.success("Xóa chương thành công");
      queryClient.invalidateQueries({ queryKey: ["chapters", slug] });
    },
    onError: () => {
      message.error("Xóa chương thất bại");
    },
  });

  // Lecture mutations
  const createLectureMutation = useMutation({
    mutationFn: (lectureData: LectureDto & { chapterSlug: string }) =>
      LectureService.create(lectureData),
    onSuccess: () => {
      message.success("Tạo bài học thành công");
      lectureForm.resetFields();
      setVideoFileList([]);
      setLectureModalOpen(false);
      setEditingLecture(null);
      queryClient.invalidateQueries({ queryKey: ["chapters", slug] });
    },
    onError: () => {
      message.error("Tạo bài học thất bại");
    },
  });

  const updateLectureMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LectureDto }) =>
      LectureService.update(id, data),
    onSuccess: () => {
      message.success("Cập nhật bài học thành công");
      lectureForm.resetFields();
      setVideoFileList([]);
      setLectureModalOpen(false);
      setEditingLecture(null);
      queryClient.invalidateQueries({ queryKey: ["chapters", slug] });
    },
    onError: () => {
      message.error("Cập nhật bài học thất bại");
    },
  });

  const deleteLectureMutation = useMutation({
    mutationFn: (id: string) => LectureService.delete(id),
    onSuccess: () => {
      message.success("Xóa bài học thành công");
      queryClient.invalidateQueries({ queryKey: ["chapters", slug] });
    },
    onError: () => {
      message.error("Xóa bài học thất bại");
    },
  });

  // Chapter handlers
  const showChapterModal = () => {
    chapterForm.resetFields();
    setEditingChapter(null);
    setChapterModalOpen(true);
  };

  const showEditChapterModal = (chapter: IChapter) => {
    setEditingChapter(chapter);
    chapterForm.setFieldsValue({
      chapterName: chapter.chapterName,
      description: chapter.description,
      order: chapter.order,
      status: chapter.status,
    });
    setChapterModalOpen(true);
  };

  const handleChapterOk = async () => {
    try {
      const values = await chapterForm.validateFields();
      const payload: ChapterDto = {
        chapterName: values.chapterName,
        description: values.description,
        order: values.order,
        status: values.status,
        courseSlug: slug!,
      };

      if (editingChapter) {
        updateChapterMutation.mutate({ id: editingChapter._id, data: payload });
      } else {
        createChapterMutation.mutate(payload);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Lecture handlers
  const showLectureModal = (chapterSlug: string) => {
    lectureForm.resetFields();
    setVideoFileList([]);
    setEditingLecture(null);
    setSelectedChapter(chapterSlug);
    setLectureModalOpen(true);
  };

  const showEditLectureModal = (lecture: ILecture, chapterSlug: string) => {
    setEditingLecture(lecture);
    setSelectedChapter(chapterSlug);
    lectureForm.setFieldsValue({
      lectureName: lecture.lectureName,
      description: lecture.description,
      videoUrl: lecture.videoUrl,
      duration: lecture.duration,
      order: lecture.order,
      status: lecture.status,
    });

    if (lecture.videoUrl) {
      setVideoFileList([
        {
          uid: "-1",
          name: "video",
          status: "done",
          url: lecture.videoUrl,
        },
      ]);
    }
    setLectureModalOpen(true);
  };

  const handleLectureOk = async () => {
    try {
      const values = await lectureForm.validateFields();
      const payload = {
        lectureName: values.lectureName,
        description: values.description,
        videoUrl: values.videoUrl,
        duration: values.duration,
        order: values.order,
        status: values.status,
        chapterSlug: selectedChapter!,
      };

      if (editingLecture) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { chapterSlug, ...updatePayload } = payload;
        updateLectureMutation.mutate({ id: editingLecture._id, data: updatePayload });
      } else {
        createLectureMutation.mutate(payload);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Lecture table columns
  const lectureColumns = (chapterSlug: string) => [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_: unknown, __: ILecture, index: number) => index + 1,
    },
    {
      title: "Tên bài học",
      dataIndex: "lectureName",
      key: "lectureName",
    },
    {
      title: "Thời lượng (giây)",
      dataIndex: "duration",
      key: "duration",
      render: (duration?: number) => duration || "N/A",
    },
    {
      title: "Thứ tự",
      dataIndex: "order",
      key: "order",
    },
    {
      title: "Video",
      dataIndex: "videoUrl",
      key: "videoUrl",
      render: (videoUrl?: string) =>
        videoUrl ? (
          <PlayCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />
        ) : (
          "Chưa có"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => (
        <span style={{ color: status ? "green" : "red" }}>
          {status ? "Hiện" : "Ẩn"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_: unknown, record: ILecture) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditLectureModal(record, chapterSlug)}
          />
          <Popconfirm
            title="Xóa bài học"
            description="Bạn có chắc chắn muốn xóa bài học này?"
            onConfirm={() => deleteLectureMutation.mutate(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              loading={deleteLectureMutation.isPending}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isChaptersLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/courses")}
          >
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết khoá học</h1>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={showChapterModal}>
          Thêm chương
        </Button>
      </div>

      {chapters.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">Chưa có chương nào. Hãy thêm chương mới!</p>
          </div>
        </Card>
      ) : (
        <Collapse accordion>
          {chapters.map((chapter: IChapter) => (
            <Panel
              header={
                <div className="flex justify-between items-center">
                  <span className="font-semibold">
                    {chapter.order}. {chapter.chapterName}
                  </span>
                  <Space onClick={(e) => e.stopPropagation()}>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => showEditChapterModal(chapter)}
                    />
                    <Popconfirm
                      title="Xóa chương"
                      description="Bạn có chắc chắn muốn xóa chương này?"
                      onConfirm={() => deleteChapterMutation.mutate(chapter._id)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        loading={deleteChapterMutation.isPending}
                      />
                    </Popconfirm>
                  </Space>
                </div>
              }
              key={chapter._id}
            >
              <div className="mb-4">
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => showLectureModal(chapter.slug)}
                >
                  Thêm bài học
                </Button>
              </div>
              <Table
                columns={lectureColumns(chapter.slug)}
                dataSource={chapter.lectures || []}
                rowKey="_id"
                pagination={false}
                size="small"
              />
            </Panel>
          ))}
        </Collapse>
      )}

      {/* Chapter Modal */}
      <Modal
        title={editingChapter ? "Cập nhật chương" : "Tạo chương mới"}
        open={chapterModalOpen}
        onOk={handleChapterOk}
        confirmLoading={
          createChapterMutation.isPending || updateChapterMutation.isPending
        }
        onCancel={() => {
          chapterForm.resetFields();
          setEditingChapter(null);
          setChapterModalOpen(false);
        }}
        okText={editingChapter ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
      >
        <Form
          form={chapterForm}
          layout="vertical"
          initialValues={{ status: true, order: chapters.length + 1 }}
        >
          <Form.Item
            name="chapterName"
            label="Tên chương"
            rules={[{ required: true, message: "Vui lòng nhập tên chương" }]}
          >
            <Input placeholder="Nhập tên chương" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Nhập mô tả chương" />
          </Form.Item>

          <Form.Item
            name="order"
            label="Thứ tự"
            rules={[{ required: true, message: "Vui lòng nhập thứ tự" }]}
          >
            <InputNumber className="w-full" min={1} placeholder="1" />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Lecture Modal */}
      <Modal
        title={editingLecture ? "Cập nhật bài học" : "Tạo bài học mới"}
        open={lectureModalOpen}
        onOk={handleLectureOk}
        confirmLoading={
          createLectureMutation.isPending || updateLectureMutation.isPending
        }
        onCancel={() => {
          lectureForm.resetFields();
          setVideoFileList([]);
          setEditingLecture(null);
          setLectureModalOpen(false);
        }}
        okText={editingLecture ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={lectureForm}
          layout="vertical"
          initialValues={{ status: true, order: 1 }}
        >
          <Form.Item
            name="lectureName"
            label="Tên bài học"
            rules={[{ required: true, message: "Vui lòng nhập tên bài học" }]}
          >
            <Input placeholder="Nhập tên bài học" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Nhập mô tả bài học" />
          </Form.Item>

          <Form.Item
            name="order"
            label="Thứ tự"
            rules={[{ required: true, message: "Vui lòng nhập thứ tự" }]}
          >
            <InputNumber className="w-full" min={1} placeholder="1" />
          </Form.Item>

          <Form.Item name="duration" label="Thời lượng (giây)">
            <InputNumber className="w-full" min={0} placeholder="0" />
          </Form.Item>

          <Form.Item name="videoUrl" label="Video bài học">
            <Upload
              name="video"
              listType="picture-card"
              fileList={videoFileList}
              action="http://localhost:8000/api/upload/video"
              onChange={({ fileList: newFileList, file }) => {
                setVideoFileList(newFileList);
                if (file.status === "done" && file.response) {
                  lectureForm.setFieldValue("videoUrl", file.response.url);
                }
              }}
              onRemove={() => {
                lectureForm.setFieldValue("videoUrl", undefined);
              }}
              maxCount={1}
              accept="video/*"
            >
              {videoFileList.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload Video</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseDetailPage;
