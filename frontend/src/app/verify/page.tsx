"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

function VerifyContent() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || t('invalidCode'));
      }

      login(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
      
      <div className="z-10 w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
        <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/30">
          <span className="text-4xl">📱</span>
        </div>
        
        <h2 className="text-3xl font-extrabold text-white mb-3">{t('verifyTitle')}</h2>
        <p className="text-gray-400 mb-10">{t('verifySub')}</p>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="text"
            maxLength={6}
            required
            className="w-full text-center text-4xl tracking-[1rem] font-black py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-blue-500 text-white outline-none transition-all"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
          />

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full py-4 text-lg font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            {isLoading ? "..." : t('verifyBtn')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
