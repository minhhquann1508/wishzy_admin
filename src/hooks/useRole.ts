import { useState, useEffect, useMemo } from "react";
import { UserService, type User } from "@/services/users";
import { useMessage } from "@/hooks/useMessage";

export const useRole = (userId?: string) => {
  const message = useMessage();
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchRole = async () => {
      try {
        setLoading(true);
        const res = await UserService.getOne(userId);
        setUser(res.user);
        setRole(res.user.role?.toLowerCase() || null);
      } catch (err) {
        console.error(err);
        message.error("Không thể lấy thông tin vai trò");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [userId, message]);

  const roleChecks = useMemo(() => ({
    isAdmin: role === "admin",
    isManager: role === "manager",
    isStaff: role === "staff",
    isMarketing: role === "marketing",
    isContent: role === "content",
    isInstructor: role === "instructor",
    hasAnyRole: (roles: string[]) => roles.includes(role ?? ""),
  }), [role]);

  return { role, user, loading, ...roleChecks };
};
