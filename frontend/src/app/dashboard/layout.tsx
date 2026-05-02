"use client";

import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import LanguageSelector from "../../components/LanguageSelector";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getLinks = () => {
    switch (user.role) {
      case "STUDENT":
        return [
          { name: t('courses'), path: "/dashboard/student/courses" },
          { name: "Assignments", path: "/dashboard/student/assignments" },
          { name: "Grades", path: "/dashboard/student/grades" },
        ];
      case "TEACHER":
        return [
          { name: "My Classes", path: "/dashboard/teacher/classes" },
          { name: "Create Lesson", path: "/dashboard/teacher/lessons" },
          { name: "Grade Students", path: "/dashboard/teacher/grading" },
        ];
      case "ADMIN":
      case "SUPER_ADMIN":
        return [
          { name: "User Management", path: "/dashboard/admin/users" },
          { name: "System Settings", path: "/dashboard/admin/settings" },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1e293b]/50 backdrop-blur-md border-r border-white/10 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg" />
            <h2 className="text-2xl font-black tracking-tight text-white">EduSys</h2>
          </div>
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest px-1">
            {user.role} {t('dashboard')}
          </p>
        </div>

        <div className="px-4 mb-4">
          <LanguageSelector />
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
            >
              <span className="w-1.5 h-1.5 bg-gray-600 group-hover:bg-blue-500 rounded-full mr-3 transition-colors" />
              <span className="font-semibold">{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 bg-[#0f172a]/50">
          <div className="mb-6 px-2">
            <p className="text-sm font-bold text-white">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{user.phoneNumber}</p>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-3 text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all"
          >
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0f172a] relative">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="p-10 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
