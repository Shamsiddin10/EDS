"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSelector from "../../components/LanguageSelector";
import { API_URL } from "../../lib/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    role: "STUDENT",
    telegramUsername: "",
    telegramChatId: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // After registration, go to verify page
      router.push(`/verify?userId=${data.userId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] relative overflow-hidden py-12 px-4">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />

      <div className="z-10 w-full max-w-xl">
        <div className="flex justify-center mb-4">
          <LanguageSelector />
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">{t('register')}</h2>
            <p className="mt-3 text-gray-400 font-medium">Join our advanced learning ecosystem</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm text-center">
              {error}
            </div>
          )}

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">{t('firstName')}</label>
              <input
                name="firstName"
                required
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 text-white transition-all outline-none"
                placeholder="Asliddin"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">{t('lastName')}</label>
              <input
                name="lastName"
                required
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 text-white transition-all outline-none"
                placeholder="Ibrohimjonov"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">{t('phoneNumber')}</label>
              <input
                name="phoneNumber"
                required
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 text-white transition-all outline-none"
                placeholder="+998 90 123 45 67"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Telegram Chat ID</label>
              <input
                name="telegramChatId"
                required
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 text-white transition-all outline-none"
                placeholder="Masalan: 12345678"
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 ml-1">@userinfobot orqali ID'ingizni oling</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">{t('password')}</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 text-white transition-all outline-none"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">{t('role')}</label>
              <select
                name="role"
                className="w-full px-5 py-3.5 bg-[#1e293b] border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 text-white appearance-none outline-none cursor-pointer"
                onChange={handleChange}
                value={formData.role}
              >
                <option value="STUDENT">{t('student')}</option>
                <option value="TEACHER">{t('teacher')}</option>
                <option value="DIRECTOR">{t('director')}</option>
              </select>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? t('registering') : t('register')}
              </button>
              <p className="text-center mt-6 text-gray-400">
                {t('haveAccount')}{" "}
                <a href="/login" className="text-blue-400 font-bold hover:text-blue-300">
                  {t('login')}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
