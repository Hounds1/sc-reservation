'use client';

import Link from 'next/link';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: {
    text: string;
    linkText: string;
    linkHref: string;
  };
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* 로고 */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <svg className="w-8 h-8 text-green-800" fill="currentColor" viewBox="0 0 20 20" />
        <span className="text-2xl font-semibold text-green-800">StudySpot</span>
      </div>

      {/* 제목/부제목 */}
      <h1 className="text-2xl font-bold text-center text-black mb-2">
        {title}
      </h1>
      <p className="text-sm text-center text-gray-500 mb-8">
        {subtitle}
      </p>

      {/* 폼 영역 (children) */}
      {children}

      {/* 하단 링크 */}
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-500">{footer.text} </span>
        <Link href={footer.linkHref} className="text-sm font-semibold text-green-800 hover:underline">
          {footer.linkText}
        </Link>
      </div>
    </div>
  );
}