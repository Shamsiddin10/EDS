"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSelector from "../../components/LanguageSelector";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to login");
      }

      login(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] relative overflow-hidden px-4">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="z-10 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <LanguageSelector />
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">{t('welcome')}</h2>
            <p className="mt-3 text-gray-400 font-medium">{t('welcomeSub')}</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm text-center animate-shake">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 ml-1 mb-2">{t('phoneNumber')}</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    📞
                  </span>
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-600 transition-all outline-none"
                    placeholder="+998 90 123 45 67"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 ml-1 mb-2">{t('password')}</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    🔒
                  </span>
                  <input
                    type="password"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-600 transition-all outline-none"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 flex justify-center items-center text-base font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('signingIn')}
                </div>
              ) : t('login')}
            </button>
            
            <div className="text-center pt-2">
              <span className="text-gray-400">{t('noAccount')} </span>
              <a href="/register" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                {t('register')}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
