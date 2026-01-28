'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AuthCard } from '@/components/ui/AuthCard';
import { createAccount } from '../services/accounts';

export function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
  const t = useTranslations('auth.signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = name.trim() && email.trim() && password.trim() && displayName.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createAccount({ name, email, password, display_name: displayName || name });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title={t('title')}
      subtitle={t('subtitle')}
      footer={{
        text: t('hasAccount'),
        linkText: t('signInLink'),
        linkHref: '/login',
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
            {t('nameLabel')}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900 bg-white"
          />
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-black mb-2">
            {t('displayNameLabel')}
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t('displayNamePlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900 bg-white"
          />
        </div>

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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900 bg-white"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900 bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">{t('passwordHint')}</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full py-3 bg-green-800 text-white font-semibold rounded-md hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? t('loadingButton') : t('submitButton')}
        </button>
      </form>
    </AuthCard>
  );
}