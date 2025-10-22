import React, { useEffect, useState } from "react";
import { Modal, Table, Button, message, Spin, Input, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import { InstructorService, type InstructorRequest } from "@/services/instructor";

interface Props {
  open: boolean;
  onClose: () => void;
}

const RequestInstructorModal: React.FC<Props> = ({ open, onClose }) => {
  const [requests, setRequests] = useState<InstructorRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");

  const fetchRequests = async (page = 1, keyword = "") => {
    try {
      setLoading(true);
      const res = await InstructorService.getRequests({ page, limit: pageSize, fullName: keyword });
      setRequests(res.requests || []);
      setTotal(res.pagination.totalItems);
      setPage(res.pagination.currentPage);
      setPageSize(res.pagination.pageSizes);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchRequests(page, keyword);
  }, [open]);

  const handleApprove = async (id: string) => {
    try {
      setLoading(true);
      await InstructorService.approveRequest(id);
      message.success("Duyệt yêu cầu thành công");
      fetchRequests(page, keyword);
    } catch (err) {
      console.error(err);
      message.error("Duyệt thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setLoading(true);
      await InstructorService.rejectRequest(id);
      message.success("Từ chối yêu cầu thành công");
      fetchRequests(page, keyword);
    } catch (err) {
      console.error(err);
      message.error("Từ chối thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    fetchRequests(1, value); // reset page về 1 khi tìm kiếm
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchRequests(newPage, keyword);
  };

  const columns: ColumnsType<InstructorRequest> = [
    { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ngày gửi yêu cầu",
      dataIndex: "requestedAt",
      key: "requestedAt",
      render: (text: string) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Button type="primary" size="small" onClick={() => handleApprove(record._id)} style={{ marginRight: 5 }}>
            Duyệt
          </Button>
          <Button danger size="small" onClick={() => handleReject(record._id)}>
            Từ chối
          </Button>
        </>
      ),
    },
  ];

  return (
    <Modal
      title="Danh sách yêu cầu làm giảng viên"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Input.Search
        placeholder="Tìm kiếm theo tên"
        allowClear
        enterButton="Tìm kiếm"
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="_id"
          pagination={false}
        />
        {total > pageSize && (
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            style={{ marginTop: 16, textAlign: "right" }}
          />
        )}
      </Spin>
    </Modal>
  );
};

export default RequestInstructorModal;
