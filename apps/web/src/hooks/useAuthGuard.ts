'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';

/**
 * 로그인이 강제되는 모든 컨텐츠에서 재사용 가능한 인증 가드 훅
 */
export function useAuthGuard() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  /**
   * 인증이 필요한 페이지로 이동 시도.
   * requiresAuth가 false면 무조건 이동, true면 인증 시에만 이동.
   * @returns 인증 부족으로 이동하지 못한 경우 false (호출자가 로그인 모달 표시)
   */
  const tryNavigate = (href: string, requiresAuth: boolean): boolean => {
    if (!requiresAuth) {
      router.push(href);
      return true;
    }
    if (!isAuthenticated) {
      return false;
    }
    router.push(href);
    return true;
  };

  /**
   * 인증이 필요한 동작 실행.
   * @returns 인증되지 않았으면 false (호출자가 로그인 모달 표시)
   */
  const requireAuth = (action: () => void): boolean => {
    if (!isAuthenticated) {
      return false;
    }
    action();
    return true;
  };

  /**
   * 인증 필요 여부 확인.
   * @returns 인증된 경우 true
   */
  const checkAuth = (): boolean => isAuthenticated;

  return {
    isAuthenticated,
    tryNavigate,
    requireAuth,
    checkAuth,
  };
}
