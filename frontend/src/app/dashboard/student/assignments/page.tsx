"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

export default function StudentAssignmentsPage() {
  const { token } = useAuth() as any;
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/assignments/student", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAssignments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent, assignmentId: string) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`http://localhost:5000/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fileUrl })
      });

      if (res.ok) {
        setMessage("Assignment submitted successfully!");
        setFileUrl("");
        setSelectedAssignment(null);
        fetchAssignments(); // refresh to show submitted status
      } else {
        const errData = await res.json();
        setMessage(errData.message || "Failed to submit assignment");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error occurred");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Assignments</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">View pending tasks and submit your homework.</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-md text-sm ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assignments.map((assignment: any) => {
          const isSubmitted = assignment.submissions && assignment.submissions.length > 0;
          const dueDate = new Date(assignment.dueDate);
          const isOverdue = !isSubmitted && new Date() > dueDate;

          return (
            <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                    {assignment.lesson?.course?.title} &rarr; {assignment.lesson?.title}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  isSubmitted ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                  isOverdue ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {isSubmitted ? 'Submitted' : isOverdue ? 'Overdue' : 'Pending'}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{assignment.description}</p>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center">
                <span className="font-medium mr-2">Due Date:</span> 
                {dueDate.toLocaleString()}
              </div>

              {isSubmitted ? (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  You have already submitted this assignment.
                </div>
              ) : selectedAssignment === assignment.id ? (
                <form onSubmit={(e) => handleSubmit(e, assignment.id)} className="mt-4 p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Submission File/Link URL</label>
                    <input
                      type="url"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="https://drive.google.com/..."
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                      Confirm Submit
                    </button>
                    <button type="button" onClick={() => setSelectedAssignment(null)} className="flex-1 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setSelectedAssignment(assignment.id)}
                  className="w-full text-center bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Submit Assignment
                </button>
              )}
            </div>
          );
        })}

        {assignments.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            You don't have any assignments yet.
          </div>
        )}
      </div>
    </div>
  );
}
