"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

export default function TeacherQuizzesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/courses`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
  }, [user]);

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }]);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ text: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return alert("Kursni tanlang");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          title,
          description,
          courseId: selectedCourse,
          questions,
        }),
      });

      if (res.ok) {
        alert("Test muvaffaqiyatli qo'shildi!");
        setTitle("");
        setDescription("");
        setQuestions([{ text: "", options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }]);
      } else {
        const data = await res.json();
        alert(data.message || "Xatolik yuz berdi");
      }
    } catch (error) {
      alert("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Yangi Test Yaratish</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Kursni Tanlang</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            required
          >
            <option value="">Kursni tanlang...</option>
            {courses.map((c: any) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Test Sarlavhasi</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            placeholder="Masalan: 1-chorak imtihoni"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tavsif (ixtiyoriy)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            rows={3}
          />
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-semibold">Savollar</h2>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
              <input
                type="text"
                value={q.text}
                onChange={(e) => {
                  const newQ = [...questions];
                  newQ[qIndex].text = e.target.value;
                  setQuestions(newQ);
                }}
                className="w-full p-3 mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-medium"
                placeholder={`Savol #${qIndex + 1}`}
                required
              />

              <div className="space-y-3">
                {q.options.map((o, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={o.isCorrect}
                      onChange={() => {
                        const newQ = [...questions];
                        newQ[qIndex].options.forEach((opt, idx) => opt.isCorrect = idx === oIndex);
                        setQuestions(newQ);
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <input
                      type="text"
                      value={o.text}
                      onChange={(e) => {
                        const newQ = [...questions];
                        newQ[qIndex].options[oIndex].text = e.target.value;
                        setQuestions(newQ);
                      }}
                      className="flex-1 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      placeholder={`Variant #${oIndex + 1}`}
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="text-sm text-blue-600 font-medium"
                >
                  + Variant qo'shish
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-600 transition-all"
          >
            + Savol qo'shish
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400"
        >
          {loading ? "Saqlanmoqda..." : "Testni Saqlash"}
        </button>
      </form>
    </div>
  );
}
