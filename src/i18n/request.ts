import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from '../i18n';

export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locale || defaultLocale,
    messages: (await import(`../messages/${locale || defaultLocale}/index.json`)).default,
    timeZone: 'UTC'
  };
}); 