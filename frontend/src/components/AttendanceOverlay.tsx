"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AttendanceOverlay() {
  const { user, attendanceMarked, setAttendanceMarked, checkAttendance } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user || attendanceMarked) return null;

  // Don't show overlay for Super Admin if you want to skip them
  if (user.role === 'SUPER_ADMIN') return null;

  const handleMarkAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        setAttendanceMarked(true);
        await checkAttendance();
      } else {
        const data = await res.json();
        alert(data.message || "Xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Attendance marking failed:", error);
      alert("Serverga bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Xush kelibsiz!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Bugungi darslarni boshlash uchun davomatdan o'ting. "Keldim" tugmasini bosing.
        </p>
        <button
          onClick={handleMarkAttendance}
          disabled={loading}
          className={`w-full py-4 px-6 rounded-xl text-xl font-bold transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 active:scale-95"
          }`}
        >
          {loading ? "Yuklanmoqda..." : "Keldim ✅"}
        </button>
      </div>
    </div>
  );
}
