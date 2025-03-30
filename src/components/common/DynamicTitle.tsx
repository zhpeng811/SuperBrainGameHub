'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function DynamicTitle() {
  const t = useTranslations('header');

  useEffect(() => {
    // Update the document title when language changes
    document.title = t('title');
  }, [t]);

  // This component doesn't render anything visible
  return null;
} 