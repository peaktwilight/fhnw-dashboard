import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales, defaultLocale } from '../../i18n/routing';
import Footer from '../components/Footer';
import { AppWrapper } from '../components/providers/AppWrapper';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { ThemeScript } from '../components/providers/ThemeScript';
import { SchemaMarkup } from '../components/SchemaMarkup';
import { Metadata, Viewport } from 'next';
import { Sora, Outfit } from 'next/font/google';
import '../globals.css';

// Sora - Geometric, modern display font for headings
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// Outfit - Clean, refined body font
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export async function generateMetadata({ params }: { params: { locale: string } | Promise<{ locale: string }> }): Promise<Metadata> {
  // Ensure params is awaited
  const resolvedParams = 'then' in params ? await params : params;
  const locale = resolvedParams.locale || defaultLocale;

  const baseMetadata = {
    metadataBase: new URL('https://fhnw.doruk.ch'),
    alternates: {
      canonical: `https://fhnw.doruk.ch/${locale}`,
      languages: {
        'en': 'https://fhnw.doruk.ch/en',
        'de': 'https://fhnw.doruk.ch/de'
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    authors: [{ name: 'Doruk Tan Ozturk', url: 'https://doruk.ch' }],
  };

  if (locale === 'de') {
    return {
      ...baseMetadata,
      title: 'FHNW Studenten-Dashboard | Alles an einem Ort',
      description: 'Das inoffizielle FHNW Student Dashboard bietet dir einen schnellen Überblick über Noten, Wetter, News und Campus-Ressourcen. Entwickelt von Studenten für Studenten.',
      keywords: 'FHNW, Dashboard, Studenten Portal, FHNW Brugg, FHNW Windisch, Studentenhilfe, Studentenportal, FHNW Ressourcen, Modulübersicht, Campusinfos, Schweizer Fachhochschule',
      openGraph: {
        title: 'FHNW Studenten-Dashboard | Dein digitaler Campus-Assistent',
        description: 'Vereinfache deinen Studienalltag an der FHNW mit diesem inoffiziellen Dashboard - Noten, News, Wetter und alle wichtigen Ressourcen auf einen Blick.',
        url: 'https://fhnw.doruk.ch/de',
        siteName: 'FHNW Studenten-Dashboard',
        locale: 'de_CH',
        type: 'website',
        images: [
          {
            url: 'https://fhnw.doruk.ch/images/screenshot.png',
            width: 1200,
            height: 630,
            alt: 'FHNW Studenten-Dashboard Screenshot'
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'FHNW Studenten-Dashboard | Alles an einem Ort',
        description: 'Das inoffizielle FHNW Student Dashboard bietet dir einen schnellen Überblick über Noten, Wetter, News und Campus-Ressourcen. Entwickelt von Studenten für Studenten.',
        images: ['https://fhnw.doruk.ch/images/screenshot.png'],
      }
    };
  }

  return {
    ...baseMetadata,
    title: 'FHNW Student Dashboard | Everything in One Place',
    description: 'The unofficial FHNW Student Dashboard gives you quick access to grades, weather, news, and campus resources. Made by students, for students.',
    keywords: 'FHNW, dashboard, student portal, FHNW Brugg, FHNW Windisch, student resources, student hub, FHNW tools, module overview, campus info, Swiss university of applied sciences',
    openGraph: {
      title: 'FHNW Student Dashboard | Your Digital Campus Assistant',
      description: 'Simplify your student life at FHNW with this unofficial dashboard - grades, news, weather, and all essential resources at a glance.',
      url: 'https://fhnw.doruk.ch/en',
      siteName: 'FHNW Student Dashboard',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://fhnw.doruk.ch/images/screenshot.png',
          width: 1200,
          height: 630,
          alt: 'FHNW Student Dashboard Screenshot'
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'FHNW Student Dashboard | Everything in One Place',
      description: 'The unofficial FHNW Student Dashboard gives you quick access to grades, weather, news, and campus resources. Made by students, for students.',
      images: ['https://fhnw.doruk.ch/images/screenshot.png'],
    }
  };
}

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
  params: { locale: string } | Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params
}: Props) {
  // Handle params whether it's a Promise or direct object
  const resolvedParams = 'then' in params ? await params : params;
  const locale = resolvedParams.locale || defaultLocale;
  
  try {
    if (!locales.includes(locale)) {
      setRequestLocale(defaultLocale);
      const messages = await getMessages();
      
      return (
        <html lang={defaultLocale} suppressHydrationWarning className="h-full">
          <head>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <ThemeScript />
            <SchemaMarkup />
          </head>
          <body className={`${outfit.variable} ${sora.variable} font-sans min-h-screen flex flex-col`}>
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
          </body>
        </html>
      );
    }
    
    setRequestLocale(locale);
    const messages = await getMessages();

    return (
      <html lang={locale} suppressHydrationWarning className="h-full">
        <head>
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <ThemeScript />
          <SchemaMarkup />
        </head>
        <body className={`${outfit.variable} ${sora.variable} font-sans min-h-screen flex flex-col`}>
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
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error in LocaleLayout:', error);
    setRequestLocale(defaultLocale);
    const messages = await getMessages();
    
    return (
      <html lang={defaultLocale} suppressHydrationWarning className="h-full">
        <head>
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <ThemeScript />
          <SchemaMarkup />
        </head>
        <body className={`${outfit.variable} ${sora.variable} font-sans min-h-screen flex flex-col`}>
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
        </body>
      </html>
    );
  }
}
