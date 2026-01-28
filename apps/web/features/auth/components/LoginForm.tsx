'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AuthCard } from '@/components/ui/AuthCard';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const t = useTranslations('auth.login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess?.();
  };

  return (
    <AuthCard
      title={t('title')}
      subtitle={t('subtitle')}
      footer={{
        text: t('noAccount'),
        linkText: t('signUpLink'),
        linkHref: '/sign-up',
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
            {t('emailLabel')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
            {t('passwordLabel')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('passwordPlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-800 text-white font-semibold rounded-md hover:bg-green-900 transition-colors"
        >
          {t('submitButton')}
        </button>
      </form>
    </AuthCard>
  );
}