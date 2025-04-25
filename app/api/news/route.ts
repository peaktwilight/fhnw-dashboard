import { NextResponse } from 'next/server';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string; // Keep as ISO string for now, format in frontend
  link: string;
  imageUrl?: string;
}

export async function GET() {
  // Use the official newsroom Solr endpoint directly
  const solrUrl = "https://www.fhnw.ch/++api++//@solr?doEmptySearch=true&extra_conditions=W1siZWZmZWN0aXZlIiwiZGF0ZS1yYW5nZSIse31dLFsiU3ViamVjdCIsInN0cmluZyIseyJpbiI6WyJOZXdzIl19XV0%3D&facet_conditions=eyJ0YXhvbm9teV91bml2ZXJzaXR5Ijp7ImMiOnt9LCJtIjp0cnVlfX0%3D&group_select=4&lang=de&q=&rows=20&sort=effective%20desc";

  try {
    const response = await fetch(solrUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 600 }
    });
    const rawText = await response.text();
    if (!response.ok) {
      console.error(`News Solr API responded with status: ${response.status}`);
      console.error(`Response text: ${rawText}`);
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }
    let data: unknown;
    try {
      data = JSON.parse(rawText);
    } catch (jsonError) {
      console.error('Error parsing JSON from news Solr API:', jsonError);
      console.error('Raw text that failed to parse:', rawText);
      throw new Error('Failed to parse news data as JSON');
    }
    console.log('Solr API response:', JSON.stringify(data, null, 2));
    let docs: unknown[] = [];
    if (
      typeof data === 'object' &&
      data !== null &&
      'response' in data &&
      typeof (data as { response?: unknown }).response === 'object' &&
      (data as { response?: unknown }).response !== null &&
      'docs' in (data as { response: { docs?: unknown } }).response &&
      Array.isArray((data as { response: { docs?: unknown } }).response.docs)
    ) {
      docs = (data as { response: { docs: unknown[] } }).response.docs ?? [];
    }
    console.log('Solr docs:', JSON.stringify(docs, null, 2));
    const FHNW_BASE_URL = 'https://www.fhnw.ch';
    const newsItems: NewsItem[] = (docs as Record<string, unknown>[])
      .filter((item) => (item as Record<string, unknown>).Type === 'FHNWNews')
      .map((item) => {
        const doc = item as Record<string, unknown>;
        let imageUrl: string | undefined = undefined;
        if (doc.image_field && doc.image_scales) {
          try {
            const scalesObj = JSON.parse(doc.image_scales as string);
            const fieldArr = scalesObj[doc.image_field as string];
            if (Array.isArray(fieldArr) && fieldArr.length > 0) {
              const imageObj = fieldArr[0];
              const scales = imageObj.scales || {};
              const basePath = imageObj.base_path || '';
              const preferredOrder = ['teaser', 'preview', 'large', 'mini', 'thumb', 'tile', 'icon'];
              let found = undefined;
              for (const key of preferredOrder) {
                if (scales[key]?.download) {
                  found = scales[key].download;
                  break;
                }
              }
              if (!found) {
                for (const key in scales) {
                  if (scales[key]?.download) {
                    found = scales[key].download;
                    break;
                  }
                }
              }
              if (found) {
                if (typeof found === 'string' && found.startsWith('@@images/')) {
                  imageUrl = `${FHNW_BASE_URL}${basePath}/${found}`;
                } else if (typeof found === 'string' && found.startsWith('http')) {
                  imageUrl = found;
                } else if (typeof found === 'string') {
                  imageUrl = `${FHNW_BASE_URL}${found.startsWith('/') ? '' : '/'}${found}`;
                }
              }
            }
          } catch (e) {
            console.error('Error parsing image_scales for item', doc, e);
          }
        }
        const id = typeof doc.UID === 'string' ? doc.UID : (typeof doc['@id'] === 'string' ? doc['@id'] : '');
        const title = typeof doc.Title === 'string' ? doc.Title : 'No title';
        const description = typeof doc.Description === 'string' ? doc.Description : '';
        const date = typeof doc.effective === 'string' ? doc.effective : '';
        let link = '';
        if (typeof doc['@id'] === 'string') {
          link = doc['@id'];
        } else if (typeof doc.path_string === 'string') {
          link = `${FHNW_BASE_URL}${doc.path_string.replace('/Plone', '')}`;
        }
        return {
          id,
          title,
          description,
          date,
          link,
          imageUrl,
        };
      });
    console.log('Mapped newsItems:', JSON.stringify(newsItems, null, 2));
    // Already sorted by effective desc from API
    return NextResponse.json(newsItems);
  } catch (error) {
    console.error('Error in news API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while fetching news';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 