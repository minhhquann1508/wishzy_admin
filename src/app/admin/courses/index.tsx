import CustomTable from "@/components/common/table";
import LoadingPage from "@/components/layouts/loading";
import { CourseService } from "@/services/courses";
import { useQuery } from "@tanstack/react-query";
import { Button, Image, Space, type TableColumnsType } from "antd";
import { Eye, Info, Pencil } from "lucide-react";

const columns: TableColumnsType = [
  {
    title: "Tên khóa học",
    dataIndex: "courseName",
    key: "courseName",
  },
  {
    title: "Giá (VNĐ)",
    dataIndex: "price",
    key: "price",
    render: (val: number) => <span>{val.toLocaleString()}</span>,
  },
  {
    title: "Hình ảnh",
    dataIndex: "thumbnail",
    key: "thumbnail",
    render: (img: string) => (
      <Image className="object-cover" width={80} height={80} src={img} />
    ),
  },
  {
    title: "Danh mục",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Thao tác",
    key: "action",
    render: () => (
      <Space size="small">
        <Button>
          <Eye size={18} />
        </Button>
        <Button>
          <Pencil size={18} />
        </Button>
        <Button>
          <Info size={18} />
        </Button>
      </Space>
    ),
  },
];

const ManageCoursePage = () => {
  const fetchListCourse = async () => {
    const res = await CourseService.getAll();
    if (!res) throw new Error("Không có dữ liệu");
    return res;
  };

  const { isPending, data: courseData } = useQuery({
    queryKey: ["course"],
    queryFn: fetchListCourse,
  });

  if (isPending || !courseData) {
    return <LoadingPage />;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tableData = courseData.data.map((i: any) => {
      const { id, courseName, price, thumbnail, gradeName, subjectName } = i;
      return {
        key: id,
        courseName,
        price,
        thumbnail,
        category: `${subjectName} ${gradeName}`,
      };
    });
    return (
      <CustomTable
        columns={columns}
        data={tableData}
        totalItems={courseData.data.length}
      />
    );
  }
};

export default ManageCoursePage;
