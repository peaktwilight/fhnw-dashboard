import { MetadataRoute } from 'next'

const BASE_URL = 'https://fhnw.doruk.ch'
const locales = ['en', 'de']
const routes = ['', '/campus', '/grades', '/news', '/settings', '/about']

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries = []

  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
      })
    }
  }

  return sitemapEntries
}