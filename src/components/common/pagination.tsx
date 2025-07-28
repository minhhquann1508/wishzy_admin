import { Pagination, type PaginationProps } from "antd";

const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
  current,
  pageSize
) => {
  console.log(current, pageSize);
};

const CustomPagination = ({
  page = 1,
  total,
}: {
  page?: number;
  total: number;
}) => {
  return (
    <Pagination
      showSizeChanger
      onShowSizeChange={onShowSizeChange}
      defaultCurrent={page}
      total={total}
    />
  );
};

export default CustomPagination;
