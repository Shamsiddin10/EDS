"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        // Redirect based on role
        switch (user.role) {
          case "STUDENT":
            router.push("/dashboard/student/courses");
            break;
          case "TEACHER":
            router.push("/dashboard/teacher/classes");
            break;
          case "DIRECTOR":
            router.push("/dashboard/director/approvals");
            break;
          case "ADMIN":
          case "SUPER_ADMIN":
            router.push("/dashboard/admin/users");
            break;
          default:
            router.push("/login");
        }
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
