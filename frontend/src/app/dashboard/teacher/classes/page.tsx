"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

export default function TeacherCoursesPage() {
  const { user, token } = useAuth() as any;
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses/teacher", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: "", description: "" });
        setIsModalOpen(false);
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Classes</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage your courses and curriculum</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          + Create New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex items-end">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-white/20 text-white backdrop-blur-sm ${course.isApproved ? 'bg-green-500/20 text-green-100' : 'bg-yellow-500/20 text-yellow-100'}`}>
                {course.isApproved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{course.description}</p>
              
              <div className="flex justify-between items-center text-sm border-t dark:border-gray-700 pt-4 mt-4">
                <div className="flex space-x-4">
                  <span className="text-gray-500 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">{course._count?.enrollments || 0}</strong> Students
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">{course._count?.lessons || 0}</strong> Lessons
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            You haven't created any courses yet.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Course</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
            </div>
            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
