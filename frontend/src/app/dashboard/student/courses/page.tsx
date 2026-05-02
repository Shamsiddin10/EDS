"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

export default function StudentCoursesPage() {
  const { user, token } = useAuth() as any;
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("enrolled");

  useEffect(() => {
    fetchEnrolledCourses();
    fetchAvailableCourses();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAvailableCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses/enrolled", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setEnrolledCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${courseId}/enroll`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchEnrolledCourses();
        setActiveTab("enrolled");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const displayCourses = activeTab === "enrolled" ? enrolledCourses : availableCourses;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Browse and manage your enrolled courses.</p>
      </div>

      <div className="flex space-x-4 mb-6 border-b dark:border-gray-700">
        <button
          onClick={() => setActiveTab("enrolled")}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "enrolled"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          My Enrollments
        </button>
        <button
          onClick={() => setActiveTab("browse")}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "browse"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Browse All Courses
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCourses.map((course: any) => {
          const isEnrolled = enrolledCourses.some((c: any) => c.id === course.id);
          
          return (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-32 bg-gradient-to-r from-teal-500 to-emerald-600 p-6 flex flex-col justify-end">
                <span className="text-xs font-semibold text-teal-100 bg-black/20 w-max px-2 py-1 rounded-full backdrop-blur-sm">
                  {course.teacher?.name || "Teacher"}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{course.description}</p>
                
                {activeTab === "browse" && !isEnrolled && (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Enroll Now
                  </button>
                )}
                
                {activeTab === "browse" && isEnrolled && (
                  <button disabled className="w-full mt-4 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                    Already Enrolled
                  </button>
                )}

                {activeTab === "enrolled" && (
                  <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Go to Class
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {displayCourses.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            {activeTab === "enrolled" 
              ? "You haven't enrolled in any courses yet. Switch to 'Browse' to find a course." 
              : "No courses available at the moment."}
          </div>
        )}
      </div>
    </div>
  );
}
