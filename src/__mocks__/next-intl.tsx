import React from 'react';

// Mock for next-intl components and hooks
export function NextIntlClientProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useTranslations() {
  return (key: string) => {
    // Return a simple function that returns the key as a fallback
    return key;
  };
}

export function useFormatter() {
  return {
    dateTime: () => 'mocked date',
    number: () => 'mocked number',
    list: () => 'mocked list'
  };
}

// Add any other exports you need from next-intl
export default {
  useTranslations,
  useFormatter,
  NextIntlClientProvider
}; 