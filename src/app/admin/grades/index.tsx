import { GradeService } from '@/services/grades';
import { Button, Modal, Form, Input, Switch, Table, Tag, Space, Popconfirm } from 'antd';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router';
import type { GradeDto, IGrade } from '@/types/grade';
import { useMessage } from '@/hooks/useMessage';

const GradePage = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingGrade, setEditingGrade] = useState<IGrade | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const message = useMessage();

  // Lấy page, pageSize và search từ URL, fallback về default values
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const searchQuery = searchParams.get('search') || '';
  const [searchValue, setSearchValue] = useState(searchQuery);

  const { data: grades, isLoading } = useQuery({
    queryKey: ['grades', currentPage, pageSize, searchQuery],
    queryFn: () => GradeService.getAllGrades(currentPage, pageSize, true, searchQuery),
  });

  const handleSearch = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (!e.target.value) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      newParams.set('page', '1');
      setSearchParams(newParams);
    }
  };

  const createGradeMutation = useMutation({
    mutationFn: (gradeData: GradeDto) => GradeService.createGrade(gradeData),
    onSuccess: (data) => {
      message.success('Tạo lớp học thành công!');
      form.resetFields();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      console.log('Grade created successfully:', data);
    },
    onError: (error) => {
      message.error('Có lỗi xảy ra khi tạo lớp học!');
      console.error('Error creating grade:', error);
    },
  });

  const updateGradeMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: GradeDto }) => 
      GradeService.updateGrade(slug, data),
    onSuccess: () => {
      message.success('Cập nhật lớp học thành công!');
      form.resetFields();
      setOpen(false);
      setIsEditMode(false);
      setEditingGrade(null);
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
    onError: (error) => {
      message.error('Có lỗi xảy ra khi cập nhật lớp học!');
      console.error('Error updating grade:', error);
    },
  });

  const deleteGradeMutation = useMutation({
    mutationFn: (slug: string) => GradeService.deleteGrade(slug),
    onSuccess: () => {
      message.success('Xóa lớp học thành công!');
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
    onError: (error) => {
      message.error('Có lỗi xảy ra khi xóa lớp học!');
      console.error('Error deleting grade:', error);
    },
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const gradeData: GradeDto = {
        gradeName: values.gradeName,
        status: values.status ?? true,
      };
      
      if (isEditMode && editingGrade) {
        updateGradeMutation.mutate({ slug: editingGrade.slug, data: gradeData });
      } else {
        createGradeMutation.mutate(gradeData);
      }
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };
    
  const showModal = () => {
    setIsEditMode(false);
    setEditingGrade(null);
    form.resetFields();
    setOpen(true);
  };

  const showEditModal = (grade: IGrade) => {
    setIsEditMode(true);
    setEditingGrade(grade);
    form.setFieldsValue({
      gradeName: grade.gradeName,
      status: grade.status,
    });
    setOpen(true);
  };
    
  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
    setIsEditMode(false);
    setEditingGrade(null);
  };

  const handleDelete = (slug: string) => {
    deleteGradeMutation.mutate(slug);
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: unknown, __: IGrade, index: number) => index + 1,
    },
    {
      title: 'Tên lớp học',
      dataIndex: 'gradeName',
      key: 'gradeName',
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
      render: (_: unknown, record: IGrade) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="Xóa lớp học"
            description="Bạn có chắc chắn muốn xóa lớp học này?"
            onConfirm={(e) => {
              e?.preventDefault();
              handleDelete(record.slug);
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
              loading={deleteGradeMutation.isPending}
              onClick={(e) => e.preventDefault()}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Quản lý lớp học</h1>
        <Space>
          <Input.Search
            placeholder="Tìm kiếm theo tên lớp học..."
            allowClear
            enterButton={<SearchOutlined />}
            value={searchValue}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" onClick={showModal}>
            Tạo lớp học
          </Button>
        </Space>
      </div>
      
      <Table
        columns={columns}
        dataSource={grades?.data.grades || []}
        loading={isLoading}
        rowKey="_id"
        pagination={{
          current: grades?.data?.pagination?.currentPage || currentPage,
          pageSize: grades?.data?.pagination?.pageSizes || pageSize,
          total: grades?.data?.pagination?.totalItems || 0,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} lớp học`,
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
        title={isEditMode ? "Cập nhật lớp học" : "Tạo lớp học mới"}
        open={open}
        onOk={handleOk}
        confirmLoading={isEditMode ? updateGradeMutation.isPending : createGradeMutation.isPending}
        onCancel={handleCancel}
        okText={isEditMode ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true }}
        >
          <Form.Item
            name="gradeName"
            label="Tên lớp học"
            rules={[
              { required: true, message: 'Vui lòng nhập tên lớp học!' },
              { min: 2, message: 'Tên lớp học phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tên lớp học" />
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

export default GradePage