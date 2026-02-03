'use client';

import Link from 'next/link';
import Image from 'next/image';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: {
    text: string;
    linkText: string;
    linkHref: string;
    onLinkClick?: () => void;  // 클릭 시 페이지 이동 대신 콜백 호출
  };
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="w-full p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      {/* 로고 */}
      <div className="flex items-center justify-center mb-6">
        <Image 
          src="/logo.svg" 
          alt="Study Spot" 
          width={160} 
          height={40}
          className="h-10 w-auto dark:invert"
        />
      </div>

      {/* 제목/부제목 */}
      <h1 className="text-2xl font-bold text-center text-black dark:text-white mb-2">
        {title}
      </h1>
      <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-8">
        {subtitle}
      </p>

      {/* 폼 영역 (children) */}
      {children}

      {/* 하단 링크 */}
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">{footer.text} </span>
        {footer.onLinkClick ? (
          <button 
            type="button"
            onClick={footer.onLinkClick}
            className="text-sm font-semibold text-green-800 dark:text-green-400 hover:underline"
          >
            {footer.linkText}
          </button>
        ) : (
          <Link href={footer.linkHref} className="text-sm font-semibold text-green-800 dark:text-green-400 hover:underline">
            {footer.linkText}
          </Link>
        )}
      </div>
    </div>
  );
}
