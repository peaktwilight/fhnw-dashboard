'use client';

import { NextIntlClientProvider as OriginalNextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

// Define a type for the messages object
type Messages = {
  [key: string]: {
    [key: string]: string | Messages;
  };
};

// This component provides translations to client components
export default function NextIntlClientProvider({
  children,
  locale,
  messages
}: {
  children: ReactNode;
  locale?: string;
  messages: Messages;
}) {
  return (
    <OriginalNextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </OriginalNextIntlClientProvider>
  );
} 