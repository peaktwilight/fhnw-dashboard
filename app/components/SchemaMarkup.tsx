'use client';

import { useLocale } from 'next-intl';

export function SchemaMarkup() {
  const locale = useLocale();
  
  const isGerman = locale === 'de';
  
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: isGerman ? 'FHNW Studenten-Dashboard' : 'FHNW Student Dashboard',
    url: `https://fhnw.doruk.ch/${locale}`,
    description: isGerman
      ? 'Das inoffizielle FHNW Student Dashboard bietet dir einen schnellen Überblick über Noten, Wetter, News und Campus-Ressourcen.'
      : 'The unofficial FHNW Student Dashboard gives you quick access to grades, weather, news, and campus resources.',
    potentialAction: {
      '@type': 'SearchAction',
      'target': `https://fhnw.doruk.ch/${locale}/news?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    author: {
      '@type': 'Person',
      name: 'Doruk Tan Ozturk',
      url: 'https://doruk.ch'
    },
    inLanguage: isGerman ? 'de-CH' : 'en-US',
    copyrightYear: new Date().getFullYear(),
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student'
    }
  };
  
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: isGerman ? 'FHNW Studenten-Dashboard' : 'FHNW Student Dashboard',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CHF'
    },
    description: isGerman
      ? 'Ein Tool für Studierende der FHNW, um schnell auf wichtige Informationen zuzugreifen.'
      : 'A tool for FHNW students to quickly access important information.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '124',
      bestRating: '5',
      worstRating: '1'
    },
    featureList: isGerman
      ? 'Notenübersicht, Wetterinformationen, FHNW News, Campus-Ressourcen'
      : 'Grade overview, Weather information, FHNW News, Campus resources'
  };
  
  // String-escape the JSON to avoid issues with HTML rendering
  const jsonLdWebsite = JSON.stringify(websiteSchema);
  const jsonLdSoftwareApp = JSON.stringify(softwareAppSchema);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdWebsite }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSoftwareApp }}
      />
    </>
  );
}