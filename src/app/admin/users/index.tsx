import { InstructorService } from "@/services/instructor";
import { useQuery } from "@tanstack/react-query";

const ManageUserPage = () => {
  const { data, isPending } = useQuery({
    queryKey: ["instructor"],
    queryFn: InstructorService.getRequest,
  });

  return (
    <>
      <div>quản trị user</div>
    </>
  );
};

export default ManageUserPage;
