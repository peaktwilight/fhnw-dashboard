import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from './routing';

export default getRequestConfig(async ({
  requestLocale
}) => {
  // This typically corresponds to the `[locale]` segment
  // Properly await the requestLocale promise
  const locale = await requestLocale || defaultLocale;

  // Ensure that the incoming locale is valid
  if (!locales.includes(locale as any)) {
    return {
      messages: (await import(`../messages/${defaultLocale}/index.json`)).default,
      timeZone: 'Europe/Zurich',
      defaultLocale,
      locales,
      locale: defaultLocale
    };
  }

  return {
    messages: (await import(`../messages/${locale}/index.json`)).default,
    timeZone: 'Europe/Zurich',
    defaultLocale,
    locales,
    locale // Explicitly return the locale as required by the new API
  };
}); 