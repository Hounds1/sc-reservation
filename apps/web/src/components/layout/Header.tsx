'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { SignupForm } from '@/features/account/components/SignupForm';
import { useAuth } from '@/features/auth/context/AuthContext';

type AuthModalMode = 'login' | 'signup' | null;
type Locale = 'ko' | 'en';

const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

const navItemsConfig = [
  { 
    href: '/cafe', 
    labelKey: 'nav.cafe',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    href: '/stats', 
    labelKey: 'nav.stats',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    href: '/mypage', 
    labelKey: 'nav.mypage',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
];

export function Header() {
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const t = useTranslations('header');
  const { isAuthenticated, isLoading, user, refreshAuth, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [isLocaleDropdownOpen, setIsLocaleDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayMode, setDisplayMode] = useState<AuthModalMode>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const closeAuthModal = () => setAuthModalMode(null);

  // 로그인 성공 시 처리
  const handleLoginSuccess = async () => {
    await refreshAuth();
    closeAuthModal();
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    setIsUserDropdownOpen(false);
    await logout();
  };

  // 다크모드 초기화 및 적용
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  // 다크모드 토글
  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  // 언어 변경
  const changeLocale = (newLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    setIsLocaleDropdownOpen(false);
    window.location.reload();
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLocaleDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 모드 전환 시 애니메이션 처리
  const switchMode = (newMode: AuthModalMode) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setAuthModalMode(newMode);
      setDisplayMode(newMode);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  // authModalMode 변경 시 displayMode 동기화
  useEffect(() => {
    if (authModalMode !== null && displayMode === null) {
      setDisplayMode(authModalMode);
    }
    if (authModalMode === null) {
      setDisplayMode(null);
    }
  }, [authModalMode, displayMode]);

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.svg" 
            alt="Study Spot" 
            width={160} 
            height={40}
            priority
            className="h-10 w-[160px] dark:invert"
          />
        </Link>

        {/* 네비게이션 + 액션 */}
        <div className="flex items-center gap-2">
          {/* 네비게이션 메뉴 */}
          <nav className="flex items-center gap-1">
            {navItemsConfig.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-colors
                    ${isActive 
                      ? 'bg-green-800 text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {item.icon}
                  <span>{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          {/* 다크모드 토글 */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            aria-label={t('darkMode')}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* 언어 선택 드롭다운 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsLocaleDropdownOpen(!isLocaleDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>{localeNames[currentLocale]}</span>
              <svg className={`w-4 h-4 transition-transform ${isLocaleDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {isLocaleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                {(Object.keys(localeNames) as Locale[]).map((locale) => (
                  <button
                    key={locale}
                    onClick={() => changeLocale(locale)}
                    className={`
                      w-full px-4 py-2 text-left text-sm transition-colors
                      ${currentLocale === locale 
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-medium' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    {localeNames[locale]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 로그인/사용자 메뉴 */}
          {!isLoading && (
            isAuthenticated && user ? (
              <div className="relative ml-2" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* 사용자 아바타 */}
                  <div className="w-7 h-7 bg-green-700 dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.displayName}</span>
                  <svg className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 사용자 드롭다운 메뉴 */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {/* 사용자 정보 */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    {/* 메뉴 항목 */}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalMode('login')}
                className="ml-2 px-5 py-2 bg-green-700 dark:bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-green-800 dark:hover:bg-blue-500 active:scale-[0.98] transition-all duration-150"
              >
                {t('login')}
              </button>
            )
          )}
        </div>
      </div>

      {/* 인증 모달 */}
      <Modal 
        isOpen={authModalMode !== null} 
        onClose={closeAuthModal}
        showCloseButton={false}
      >
        <div 
          className={`
            relative w-[448px] transition-all duration-150 ease-out
            ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
          `}
        >
          {/* 닫기 버튼 - 애니메이션 컨테이너 안에 배치 */}
          <button
            onClick={closeAuthModal}
            className="absolute -top-2 -right-2 z-10 w-8 h-8 
              bg-white dark:bg-gray-700 rounded-full shadow-lg 
              flex items-center justify-center 
              hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-110
              transition-all duration-150"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {displayMode === 'login' && (
            <LoginForm 
              onSuccess={handleLoginSuccess}
              onSwitchToSignup={() => switchMode('signup')}
            />
          )}
          {displayMode === 'signup' && (
            <SignupForm 
              onSuccess={closeAuthModal}
              onSwitchToLogin={() => switchMode('login')}
            />
          )}
        </div>
      </Modal>
    </header>
  );
}
