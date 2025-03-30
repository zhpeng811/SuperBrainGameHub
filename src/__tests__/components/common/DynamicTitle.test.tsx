import React from 'react';
import { render } from '@testing-library/react';
import DynamicTitle from '@/components/common/DynamicTitle';

// Mock the useTranslations hook
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key === 'title' ? 'SuperBrain Game Hub' : key,
}));

describe('DynamicTitle', () => {
  it('should update document title', () => {
    // Mock document.title
    Object.defineProperty(document, 'title', {
      writable: true,
      value: '',
    });

    render(<DynamicTitle />);
    
    expect(document.title).toBe('SuperBrain Game Hub');
  });

  it('should not render anything visible', () => {
    const { container } = render(<DynamicTitle />);
    expect(container.firstChild).toBeNull();
  });
}); 