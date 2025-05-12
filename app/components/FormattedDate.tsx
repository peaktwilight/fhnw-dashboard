'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface FormattedDateProps {
  date: string;
  format?: 'short' | 'medium' | 'long';
  className?: string;
}

export default function FormattedDate({ 
  date, 
  format = 'medium',
  className = 'text-xs text-gray-500 dark:text-gray-400'
}: FormattedDateProps) {
  const t = useTranslations('common');
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  
  // Format date options based on the requested format
  const getDateOptions = () => {
    switch(format) {
      case 'short':
        return { 
          year: 'numeric' as const, 
          month: '2-digit' as const, 
          day: '2-digit' as const 
        };
      case 'long':
        return { 
          year: 'numeric' as const, 
          month: 'long' as const, 
          day: 'numeric' as const, 
          hour: '2-digit' as const, 
          minute: '2-digit' as const 
        };
      case 'medium':
      default:
        return { 
          year: 'numeric' as const, 
          month: '2-digit' as const, 
          day: '2-digit' as const 
        };
    }
  };
  
  // Get locale code from translations or fallback
  const getLocaleCode = (): string => {
    try {
      return t('dateLocaleCode');
    } catch {
      return 'en-US';
    }
  };
  
  // Format the date client-side only
  useEffect(() => {
    setIsMounted(true);
    
    try {
      // Only format the date on the client side
      const dateObj = new Date(date);
      const localeCode = getLocaleCode();
      const options = getDateOptions();
      
      setFormattedDate(dateObj.toLocaleDateString(localeCode, options));
    } catch (error) {
      // Fallback to ISO format
      setFormattedDate(new Date(date).toISOString().split('T')[0]);
    }
  }, [date, format]);
  
  // On the server, render a static date to avoid hydration mismatch
  if (!isMounted) {
    return (
      <time dateTime={date} className={className}>
        {new Date(date).toISOString().split('T')[0]}
      </time>
    );
  }
  
  return (
    <time dateTime={date} className={className}>
      {formattedDate}
    </time>
  );
}