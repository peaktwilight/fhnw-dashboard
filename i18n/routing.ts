import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'de'];
export const defaultLocale = 'en';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always prefix the default locale
  localePrefix: 'always'
}); 