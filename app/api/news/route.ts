import { NextRequest, NextResponse } from 'next/server';

interface FHNWNewsItem {
  '@id': string; // Link and ID
  '@type': string; // Added to fix linter error
  title: string;
  description: string;
  effective: string; // Date string (ISO format)
  image_field?: string; // Field name containing the image (e.g., 'preview_image_link')
  image_scales?: {
    // Dynamic key based on image_field
    [key: string]: Array<{
      scales: {
        preview?: { download: string };
        teaser?: { download: string };
        // Potentially add other scales like 'tile', 'mini', 'large' etc. as fallbacks
        large?: { download: string };
        mini?: { download: string };
      };
      // Add base_path if constructing URL differently
      base_path?: string;
    }>;
  };
  teaser_text?: string; // Can be used as fallback description
  teaser_title?: string; // Can be used as fallback title
}

interface FHNWNewsResponse {
  items: FHNWNewsItem[];
  // Might include other top-level fields like 'batching'
  items_total?: number;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string; // Keep as ISO string for now, format in frontend
  link: string;
  imageUrl?: string;
}

const FHNW_BASE_URL = 'https://www.fhnw.ch';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // Keep frontend query params for potential future use, but don't pass to API for now
  const query = searchParams.get('query') || '';
  const sortOrder = searchParams.get('sortOrder') || 'desc'; // Default to desc

  console.log('Fetching news with frontend params (not passed to API yet):', { query, sortOrder });

  // New base URL for the news API (fetching the list view)
  const baseUrl = `${FHNW_BASE_URL}/++api++/de/medien/newsroom/news`;
  // Basic parameters, fetching all items by default. Limit/offset can be added if needed.
  const params = new URLSearchParams({
    // Use 'fullobjects' to get detailed item data including image scales
    fullobjects: 'true',
    // Potentially add limit if performance becomes an issue, e.g., 'limit': '50'
    // Sorting is implicitly by 'effective' descending based on observed page behavior,
    // but cannot be directly controlled via simple URL params here.
  });

  const requestUrl = `${baseUrl}?${params.toString()}`;
  console.log(`Fetching news from: ${requestUrl}`);

  try {
    const response = await fetch(requestUrl, {
      headers: {
        'Accept': 'application/json',
      },
      // Increase cache duration if appropriate, e.g., revalidate every hour
      next: { revalidate: 600 } // Revalidate every 10 minutes
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error(`News API responded with status: ${response.status}`);
      console.error(`Response text: ${rawText}`);
      // Try parsing error message if JSON
      let errorMsg = `Failed to fetch news: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(rawText);
        errorMsg = errorJson.message || errorMsg;
      } catch (e) { /* Ignore parsing error */ }
      throw new Error(errorMsg);
    }

    let data: FHNWNewsResponse;
    try {
      data = JSON.parse(rawText);
    } catch (jsonError) {
      console.error('Error parsing JSON from news API:', jsonError);
      console.error('Raw text that failed to parse:', rawText);
      throw new Error('Failed to parse news data as JSON');
    }

    // Ensure 'items' array exists
    if (!data || !Array.isArray(data.items)) {
      console.error('Invalid news data format received (missing items array):', data);
      throw new Error('Invalid news data format received: items array missing');
    }

    const newsItems: NewsItem[] = data.items
      // Filter out items that might not be actual news (if needed based on @type)
      .filter(item => item['@type'] === 'FHNWNews')
      .map((item) => {
        let imageUrl: string | undefined = undefined;
        // Check if image data exists
        if (item.image_field && item.image_scales && item.image_scales[item.image_field]?.[0]) {
          const imgFieldKey = item.image_field as keyof typeof item.image_scales;
          const imgDataArray = item.image_scales[imgFieldKey];

          if (imgDataArray && imgDataArray.length > 0) {
              const imgData = imgDataArray[0];
              // Prefer teaser scale, then preview, then large, then mini as fallbacks
              const scale = imgData.scales.teaser || imgData.scales.preview || imgData.scales.large || imgData.scales.mini;
              if (scale?.download) {
                  // Construct absolute URL if the download path is relative
                  imageUrl = scale.download.startsWith('http')
                      ? scale.download
                      : `${FHNW_BASE_URL}${scale.download.startsWith('/') ? '' : '/'}${scale.download}`;
              }
          }
        }

        // Use teaser_title or title
        const title = item.teaser_title || item.title || 'No title';
        // Use teaser_text or description
        const description = item.teaser_text || item.description || '';

        return {
          id: item['@id'], // Use @id as a unique identifier
          title: title,
          description: description,
          date: item.effective, // Keep ISO date string
          link: item['@id'], // The @id is the direct link to the news item
          imageUrl: imageUrl,
        };
    });

    // Sort items by date descending (newest first) as API doesn't reliably sort
    newsItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log(`Successfully fetched and processed ${newsItems.length} news items.`);
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