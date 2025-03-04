import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales, defaultLocale } from '../../i18n/routing';
import Footer from '../components/Footer';
import { AppWrapper } from '../components/providers/AppWrapper';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'FHNW Dashboard',
  description: 'A dashboard for FHNW students to manage their studies',
  metadataBase: new URL('https://fhnw-dashboard.vercel.app'),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
  ],
  width: 'device-width',
  initialScale: 1,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale || defaultLocale;
  
  try {
    if (!locales.includes(locale)) {
      setRequestLocale(defaultLocale);
      const messages = await getMessages();
      
      return (
        <ThemeProvider>
          <NextIntlClientProvider locale={defaultLocale} messages={messages}>
            <AppWrapper>
              <div className="flex-1">
                {children}
              </div>
            </AppWrapper>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      );
    }
    
    setRequestLocale(locale);
    const messages = await getMessages();

    return (
      <ThemeProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppWrapper>
            <div className="flex-1">
              {children}
            </div>
          </AppWrapper>
          <Footer />
        </NextIntlClientProvider>
      </ThemeProvider>
    );
  } catch (error) {
    console.error('Error in LocaleLayout:', error);
    setRequestLocale(defaultLocale);
    const messages = await getMessages();
    
    return (
      <ThemeProvider>
        <NextIntlClientProvider locale={defaultLocale} messages={messages}>
          <AppWrapper>
            <div className="flex-1">
              {children}
            </div>
          </AppWrapper>
          <Footer />
        </NextIntlClientProvider>
      </ThemeProvider>
    );
  }
}
