"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
  attendanceMarked: boolean;
  setAttendanceMarked: (marked: boolean) => void;
  checkAttendance: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const router = useRouter();

  const checkAttendance = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/attendance/status`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      setAttendanceMarked(data.hasCheckedIn);
    } catch (error) {
      console.error("Attendance check failed:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      checkAttendance();
    }
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Redirect based on role
    // ... rest of logic
    switch (userData.role) {
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
        router.push("/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, attendanceMarked, setAttendanceMarked, checkAttendance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
