import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // 1. 쿠키에서 NEXT_LOCALE 확인 (사용자가 직접 선택한 언어)
  if (!locale) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
    
    if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
      locale = cookieLocale;
    }
  }

  // 2. 쿠키가 없으면 브라우저 언어 설정 확인
  if (!locale) {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    
    if (acceptLanguage) {
      const browserLocales = acceptLanguage
        .split(',')
        .map(lang => lang?.split(';')[0]?.trim().toLowerCase().substring(0, 2))
        .filter(Boolean);
      
      locale = browserLocales.find(lang => 
        routing.locales.includes(lang as any)
      ) || routing.defaultLocale;
    } else {
      locale = routing.defaultLocale;
    }
  }

  // 3. 유효하지 않은 locale이면 기본값 사용
  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
