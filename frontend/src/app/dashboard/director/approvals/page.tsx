"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

export default function DirectorApprovalsPage() {
  const { token } = useAuth() as any;
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const fetchPendingCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setPendingCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (courseId: string) => {
    setLoadingId(courseId);
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        // Remove the approved course from the list
        setPendingCourses(pendingCourses.filter((c: any) => c.id !== courseId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Approvals</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Review and approve new courses created by teachers.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teacher</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pendingCourses.map((course: any) => (
                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Created: {new Date(course.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{course.teacher?.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs">{course.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleApprove(course.id)}
                      disabled={loadingId === course.id}
                      className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md font-medium disabled:opacity-50 transition-colors"
                    >
                      {loadingId === course.id ? "Approving..." : "Approve Course"}
                    </button>
                  </td>
                </tr>
              ))}

              {pendingCourses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No pending courses waiting for approval.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
