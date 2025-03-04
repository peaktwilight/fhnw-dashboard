import type { Metadata } from 'next';
import Home from './components/Home';

export const metadata: Metadata = {
  title: 'FHNW Student Dashboard',
  description: 'Your all-in-one FHNW campus tool for tracking grades, checking mensa menus, campus news, and more. Designed to make student life easier and more organized.',
  keywords: ['FHNW', 'student dashboard', 'grades tracker', 'campus tools', 'mensa menu', 'university tools'],
  authors: [{ name: 'FHNW Student Dashboard' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
    other: {
      rel: 'mask-icon',
      url: '/favicon.svg',
      color: '#2563eb'
    }
  },
  openGraph: {
    title: 'FHNW Student Dashboard',
    description: 'Your all-in-one FHNW campus tool for tracking grades, checking mensa menus, campus news, and more.',
    type: 'website',
    locale: 'en_US',
    siteName: 'FHNW Student Dashboard',
    images: [
      {
        url: '/favicon.svg',
        width: 24,
        height: 24,
        alt: 'FHNW Student Dashboard Icon'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'FHNW Student Dashboard',
    description: 'Your all-in-one FHNW campus tool for tracking grades, checking mensa menus, campus news, and more.',
    images: ['/favicon.svg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification', // Add your Google verification code
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#60a5fa' }
  ]
};

export default function Page() {
  return <Home />;
} 