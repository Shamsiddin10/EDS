"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";

export default function MonitoringPage() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("teachers");

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const [tRes, sRes, aRes] = await Promise.all([
        fetch(`${apiBase}/api/admin/teachers`, { headers }),
        fetch(`${apiBase}/api/admin/students`, { headers }),
        fetch(`${apiBase}/api/admin/attendance`, { headers }),
      ]);

      setTeachers(await tRes.json());
      setStudents(await sRes.json());
      setAttendance(await aRes.json());
    } catch (error) {
      console.error("Failed to fetch monitoring data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) return <div className="p-8">Yuklanmoqda...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Direktor Monitoringi</h1>

      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
        {["teachers", "students", "attendance"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-4 font-medium transition-all ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "teachers" ? "O'qituvchilar" : tab === "students" ? "O'quvchilar" : "Davomat"}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {activeTab === "teachers" && (
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="p-4">F.I.SH</th>
                <th className="p-4">Telefon</th>
                <th className="p-4">Kurslar soni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {teachers.map((t: any) => (
                <tr key={t.id}>
                  <td className="p-4">{t.firstName} {t.lastName}</td>
                  <td className="p-4">{t.phoneNumber}</td>
                  <td className="p-4">{t.coursesTaught?.length || 0} ta</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "students" && (
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="p-4">F.I.SH</th>
                <th className="p-4">Telefon</th>
                <th className="p-4">A'zo kurslar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((s: any) => (
                <tr key={s.id}>
                  <td className="p-4">{s.firstName} {s.lastName}</td>
                  <td className="p-4">{s.phoneNumber}</td>
                  <td className="p-4">{s.enrollments?.length || 0} ta</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "attendance" && (
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="p-4">F.I.SH</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Vaqt</th>
                <th className="p-4">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {attendance.map((a: any) => (
                <tr key={a.id}>
                  <td className="p-4">{a.user.firstName} {a.user.lastName}</td>
                  <td className="p-4">{a.user.role}</td>
                  <td className="p-4">{new Date(a.date).toLocaleTimeString()}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm">
                      Keldi ✅
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
