import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'zh-CN'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locale || defaultLocale,
    messages: (await import(`./messages/${locale || defaultLocale}/index.json`)).default,
    timeZone: 'UTC'
  };
}); 