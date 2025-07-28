import { Table, type TableColumnsType } from "antd";
import CustomPagination from "./pagination";

const CustomTable = ({
  totalItems,
  columns,
  data,
}: {
  totalItems: number;
  columns: TableColumnsType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}) => {
  return (
    <>
      <Table columns={columns} dataSource={data} pagination={false} />
      <div className="flex justify-end mt-5">
        <CustomPagination total={totalItems} />
      </div>
    </>
  );
};

export default CustomTable;
