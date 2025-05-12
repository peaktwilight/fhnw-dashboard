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
  
  // Format the date client-side only
  useEffect(() => {
    setIsMounted(true);
    
    try {
      // Only format the date on the client side
      const dateObj = new Date(date);
      
      // Get locale code from translations or fallback
      let localeCode = 'en-US';
      try {
        localeCode = t('dateLocaleCode');
      } catch {
        // Use default
      }
      
      // Format date options based on the requested format
      let options: Intl.DateTimeFormatOptions;
      switch(format) {
        case 'short':
          options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          };
          break;
        case 'long':
          options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          };
          break;
        case 'medium':
        default:
          options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          };
      }
      
      setFormattedDate(dateObj.toLocaleDateString(localeCode, options));
    } catch {
      // Fallback to ISO format
      setFormattedDate(new Date(date).toISOString().split('T')[0]);
    }
  }, [date, format, t]);
  
  // On the server, render an empty/hidden element to avoid hydration mismatch
  if (!isMounted) {
    return (
      <time dateTime={date} className={className}>
        <span className="opacity-0">Loading date...</span>
      </time>
    );
  }
  
  return (
    <time dateTime={date} className={className}>
      {formattedDate}
    </time>
  );
}