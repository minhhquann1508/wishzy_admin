import { SubjectService } from "@/services/subjects";
import { GradeService } from "@/services/grades";
import type { SubjectDto, ISubject } from "@/types/subject";
import type { IGrade } from "@/types/grade";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Modal, Select, Switch, Table, Tag, Space, Popconfirm } from "antd"
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useSearchParams } from "react-router";

const SubjectPage = () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const [editingSubject, setEditingSubject] = useState<ISubject | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

     // Lấy page và pageSize từ URL, fallback về default values
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const { data: subjects, isLoading } = useQuery({
        queryKey: ['subjects', currentPage, pageSize],
        queryFn: () => SubjectService.getAll(currentPage, pageSize, true),
    }) 

    // Fetch grades for the select dropdown
    const { data: grades, isLoading: gradesLoading } = useQuery({
        queryKey: ['grades'],
        queryFn: () => GradeService.getAllGrades(1, 100, true),
    });

    const showModal = () => {
        setIsEditMode(false);
        setEditingSubject(null);
        form.resetFields();
        setOpen(true);
    }

    const showEditModal = (subject: ISubject) => {
        setIsEditMode(true);
        setEditingSubject(subject);
        form.setFieldsValue({
            subjectName: subject.subjectName,
            status: subject.status,
            grade: subject.grade._id,
        });
        setOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setOpen(false);
        setIsEditMode(false);
        setEditingSubject(null);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const subjectData: SubjectDto = {
                subjectName: values.subjectName,
                status: values.status ?? true,
                grade: values.grade,
            };
            
            if (isEditMode && editingSubject) {
                updateSubjectMutation.mutate({ slug: editingSubject.slug, data: subjectData });
            } else {
                createSubjectMutation.mutate(subjectData);
            }
        } catch (error) {
            console.error('Form validation error:', error);
        }
    }

    const createSubjectMutation = useMutation({
        mutationFn: (subjectData: SubjectDto) => SubjectService.createSubject(subjectData),
        onSuccess: () => {
            message.success('Tạo môn học thành công!');
            form.resetFields();
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        },
        onError: (error) => {
            message.error('Có lỗi xảy ra khi tạo môn học!');
            console.error('Error creating subject:', error);
        }
    });

    const updateSubjectMutation = useMutation({
        mutationFn: ({ slug, data }: { slug: string; data: SubjectDto }) => 
            SubjectService.updateSubject(slug, data),
        onSuccess: () => {
            message.success('Cập nhật môn học thành công!');
            form.resetFields();
            setOpen(false);
            setIsEditMode(false);
            setEditingSubject(null);
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        },
        onError: (error) => {
            message.error('Có lỗi xảy ra khi cập nhật môn học!');
            console.error('Error updating subject:', error);
        },
    });

    const deleteSubjectMutation = useMutation({
        mutationFn: (slug: string) => SubjectService.deleteSubject(slug),
        onSuccess: () => {
            message.success('Xóa môn học thành công!');
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        },
        onError: (error) => {
            message.error('Có lỗi xảy ra khi xóa môn học!');
            console.error('Error deleting subject:', error);
        }
    })

    const handleDelete = (slug: string) => {
        deleteSubjectMutation.mutate(slug);
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            render: (_: unknown, __: ISubject, index: number) => index + 1,
        },
        {
            title: 'Tên môn học',
            dataIndex: 'subjectName',
            key: 'subjectName',
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
            render: (_: unknown, record: ISubject) => (
                <Space>
                    <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => showEditModal(record)}
                    />
                    <Popconfirm
                        title="Xóa môn học"
                        description="Bạn có chắc chắn muốn xóa môn học này?"
                        onConfirm={(e) => {
                            e?.preventDefault();
                            handleDelete(record.slug);
                        }}
                        onCancel={(e) => e?.preventDefault()}
                        okText="Xóa"
                        cancelText="Hủy"
                        placement="topRight"
                    >
                        <Button 
                            type="text" 
                            icon={<DeleteOutlined />} 
                            size="small"
                            danger
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>Quản lý môn học</h1>
                <Button type="primary" onClick={showModal}>
                    Tạo môn học
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={subjects?.data?.subjects || []}
                loading={isLoading}
                rowKey="_id"
                pagination={{
                    current: subjects?.data?.pagination?.currentPage || currentPage,
                    pageSize: subjects?.data?.pagination?.pageSizes || pageSize,
                    total: subjects?.data?.pagination?.totalItems || 0,
                    showTotal: (total, range) => 
                        `${range[0]}-${range[1]} của ${total} môn học`,
                    onChange: (page, size) => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('page', page.toString());
                        newParams.set('pageSize', (size || 10).toString());
                        setSearchParams(newParams);
                    },
                    onShowSizeChange: (_, size) => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('page', '1');
                        newParams.set('pageSize', size.toString());
                        setSearchParams(newParams);
                    },
                }}
            />

            <Modal
                title={isEditMode ? "Cập nhật môn học" : "Thêm môn học"}
                open={open}
                onOk={handleOk}
                confirmLoading={isEditMode ? updateSubjectMutation.isPending : createSubjectMutation.isPending}
                okText={isEditMode ? "Cập nhật" : "Tạo"}
                cancelText="Hủy"
                onCancel={handleCancel}
            >
                <Form
                form={form}
                layout="vertical"
                initialValues={{ status: true }}
                >
                <Form.Item
                    name="subjectName"
                    label="Tên môn học"
                    rules={[
                    { required: true, message: 'Vui lòng nhập tên môn học!' },
                    { min: 2, message: 'Tên môn học phải có ít nhất 2 ký tự!' }
                    ]}
                >
                    <Input placeholder="Nhập tên môn học" />
                </Form.Item>

                <Form.Item
                    name="grade"
                    label="Lớp học"
                    rules={[
                    { required: true, message: 'Vui lòng chọn lớp học!' }
                    ]}
                >
                    <Select
                        placeholder="Chọn lớp học"
                        loading={gradesLoading}
                        options={grades?.data?.grades?.map((grade: IGrade) => ({
                            value: grade._id,
                            label: grade.gradeName,
                        })) || []}
                    />
                </Form.Item>
                
                <Form.Item
                    name="status"
                    label="Trạng thái"
                    valuePropName="checked"
                >
                    <Switch 
                    checkedChildren="Hiện" 
                    unCheckedChildren="Ẩn" 
                    />
                </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default SubjectPage