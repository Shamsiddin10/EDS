"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

export default function TeacherGradingPage() {
  const { token } = useAuth() as any;
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/grades/submissions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setSubmissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGrade = async (e: React.FormEvent, submissionId: string) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`http://localhost:5000/api/grades/${submissionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ score, feedback })
      });

      if (res.ok) {
        setMessage("Grade submitted successfully!");
        setScore("");
        setFeedback("");
        setSelectedSubmission(null);
        fetchSubmissions(); // Refresh list to show graded status
      } else {
        const errData = await res.json();
        setMessage(errData.message || "Failed to submit grade");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error occurred");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grade Submissions</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Review student homework and provide feedback and grades.</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-md text-sm ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {submissions.map((sub: any) => {
            const isGraded = !!sub.grade;
            const submittedAt = new Date(sub.submittedAt);
            const dueDate = new Date(sub.assignment?.dueDate);
            const isLate = submittedAt > dueDate;

            return (
              <li key={sub.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{sub.student?.name}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">({sub.student?.email})</span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${isGraded ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {isGraded ? 'Graded' : 'Needs Grading'}
                      </span>
                      {isLate && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">Late Submission</span>
                      )}
                    </div>
                    
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                      {sub.assignment?.lesson?.course?.title} &rarr; {sub.assignment?.title}
                    </p>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                      <strong>Submitted Link:</strong> 
                      <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline break-all">
                        {sub.fileUrl}
                      </a>
                    </div>
                  </div>

                  <div className="w-full lg:w-1/3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    {isGraded ? (
                      <div>
                        <div className="text-center mb-2">
                          <span className="text-3xl font-black text-green-600 dark:text-green-400">{sub.grade.score}</span>
                          <span className="text-gray-500 dark:text-gray-400"> / 100</span>
                        </div>
                        {sub.grade.feedback && (
                          <div className="text-sm text-gray-600 dark:text-gray-300 italic border-t dark:border-gray-700 pt-2 mt-2">
                            "{sub.grade.feedback}"
                          </div>
                        )}
                      </div>
                    ) : selectedSubmission === sub.id ? (
                      <form onSubmit={(e) => handleGrade(e, sub.id)} className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Score (0-100)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback (Optional)</label>
                          <textarea
                            rows={2}
                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button type="submit" className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors">
                            Submit
                          </button>
                          <button type="button" onClick={() => setSelectedSubmission(null)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button 
                        onClick={() => setSelectedSubmission(sub.id)}
                        className="w-full h-full min-h-[4rem] flex items-center justify-center border-2 border-dashed border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium text-sm"
                      >
                        Grade this Assignment
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}

          {submissions.length === 0 && (
            <li className="p-12 text-center text-gray-500 dark:text-gray-400">
              No assignments have been submitted by students yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
