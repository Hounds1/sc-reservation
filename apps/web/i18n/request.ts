import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { headers } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

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

  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});