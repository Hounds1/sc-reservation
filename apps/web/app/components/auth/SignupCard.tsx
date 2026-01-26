// SignupCard.tsx (개념 예시)
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createAccount } from '../../lib/api/account/accounts';

export function SignupCard({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createAccount({
        name,
        email,
        password,
        display_name: displayName || name,
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-center gap-2 mb-6">
        <svg className="w-8 h-8 text-green-800" fill="currentColor" viewBox="0 0 20 20" />
        <span className="text-2xl font-semibold text-green-800">StudySpot</span>
      </div>

      <h1 className="text-2xl font-bold text-center text-black mb-2">
        회원가입
      </h1>
      <p className="text-sm text-center text-gray-500 mb-8">
        Start reserving your study spots today
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-black mb-2">이름</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900 bg-white"
          />
        </div>
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-black mb-2">
            닉네임
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your display name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900 bg-white"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900 bg-white"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-black mb-2">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900 bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 4 characters.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-green-800 text-white font-semibold rounded-md hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '처리 중...' : '가입하기'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-sm text-gray-500">Already have an account? </span>
        <Link href="/login" className="text-sm font-semibold text-green-800 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}