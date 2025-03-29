import { defaultLocale } from '@/i18n/index';

export async function getMessages(locale?: string) {
  // Check if we're in a browser environment safely
  const isBrowser = typeof window !== 'undefined';
  const selectedLocale = locale || 
    (isBrowser ? localStorage.getItem('locale') || defaultLocale : defaultLocale);
  
  try {
    // Using dynamic import to load the messages
    return (await import(`../messages/${selectedLocale}/index.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${selectedLocale}`, error);
    return (await import(`../messages/${defaultLocale}/index.json`)).default;
  }
} 