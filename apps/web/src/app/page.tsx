import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { CafeList } from '@/features/cafe/components/CafeList';

function CafeListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
          <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  const t = await getTranslations('home');

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 제목 */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>

        {/* 카페 목록 */}
        <Suspense fallback={<CafeListSkeleton />}>
          <CafeList />
        </Suspense>
      </div>
    </div>
  );
}
