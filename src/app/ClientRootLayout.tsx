'use client';

import { ReactNode, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLanguage } from '@/utils/LanguageContext';
import { defaultLocale } from '@/i18n/index';
import enMessages from '@/messages/en/index.json';
import zhCNMessages from '@/messages/zh-CN/index.json';
import DynamicTitle from '@/components/common/DynamicTitle';

const messages = {
  'en': enMessages,
  'zh-CN': zhCNMessages
};

export default function ClientRootLayout({ children }: { children: ReactNode }) {
  const { locale } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // On first render, use default locale
  // After client-side hydration, use the language from context
  const currentLocale = mounted ? locale : defaultLocale;
  const currentMessages = messages[currentLocale as keyof typeof messages] || messages[defaultLocale];

  // Re-render when locale changes to apply new translations without losing state
  return (
    <NextIntlClientProvider locale={currentLocale} messages={currentMessages} timeZone="UTC">
      <DynamicTitle />
      {children}
    </NextIntlClientProvider>
  );
} 