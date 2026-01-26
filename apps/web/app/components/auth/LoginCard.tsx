'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LoginCardProps {
  onSuccess?: () => void;
}

export function LoginCard({ onSuccess }: LoginCardProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-center gap-2 mb-6">
        <svg className="w-8 h-8 text-green-800" fill="currentColor" viewBox="0 0 20 20">
        </svg>
        <span className="text-2xl font-semibold text-green-800">StudySpot</span>
      </div>

      <h1 className="text-2xl font-bold text-center text-black mb-2">
        Welcome back
      </h1>
      <p className="text-sm text-center text-gray-500 mb-8">
        Sign in to your account to continue
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-800 text-white font-semibold rounded-md hover:bg-green-900 transition-colors"
        >
          Sign in
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-sm text-gray-500">Don't have an account? </span>
        <Link href="/sign-up" className="text-sm font-semibold text-green-800 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}