"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

export default function TeacherLessonsPage() {
  const { token } = useAuth() as any;
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [formData, setFormData] = useState({ title: "", content: "", videoUrl: "" });
  const [message, setMessage] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!selectedCourse) {
      setMessage("Please select a course first.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/lessons/${selectedCourse}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: "", content: "", videoUrl: "" });
        setMessage("Lesson created successfully!");
      } else {
        const error = await res.json();
        setMessage(error.message || "Failed to create lesson");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error occurred");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Lesson</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Add educational content to your existing courses.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
        
        {message && (
          <div className={`p-4 mb-6 rounded-md text-sm ${message.includes("success") ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Course</label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="" disabled>-- Select a Course --</option>
              {courses.map((c: any) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lesson Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Introduction to Variables"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL (Optional)</label>
            <input
              type="url"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={formData.videoUrl}
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              placeholder="e.g. https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lesson Content</label>
            <textarea
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-y"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Write your lesson materials or descriptions here..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 flex justify-center text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Publish Lesson
          </button>
        </form>
      </div>
    </div>
  );
}
