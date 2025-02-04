import { NextResponse } from 'next/server';

interface NewsItem {
  title: string;
  link: string;
  date: string;
  description: string;
  category: string;
  image?: {
    src: string;
    alt: string;
  };
}

interface FHNWNewsItem {
  title: string;
  url: string;
  effective: string;
  description: string;
  news_detail: {
    university: string;
  };
  img?: {
    src: string;
    alt: string;
  };
}

interface FHNWNewsResponse {
  items: FHNWNewsItem[];
  items_total: number;
}

// Helper function to simplify school names for comparison
function simplifySchoolName(name: string): string {
  // Remove common prefixes and suffixes, and standardize the name
  return name
    .replace('Fachhochschule Nordwestschweiz, ', '')
    .replace(', Institut', '')
    .replace('Institut ', '')
    .trim();
}

// Helper function to get the base school name
function getBaseSchoolName(fullName: string): string {
  const parts = fullName.split(',')[0]; // Take only the first part before any comma
  return simplifySchoolName(parts);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const schools = searchParams.get('schools')?.split(',') || [];
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    console.log('Fetching news with params:', { query, schools, sortOrder });

    // Construct base URL for fetching news with correct parameters
    const baseUrl = 'https://www.fhnw.ch/de/searchbar.json';
    const params = new URLSearchParams({
      'template': 'training_full',
      'category': 'news',
      'q': query,
      'subject[]': 'News',
      'showImages': 'true',
      'limit': '100',
      'offset': '0',
      'sort_on': 'effective',
      'sort_order': sortOrder === 'asc' ? 'ascending' : 'descending'
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const data: FHNWNewsResponse = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    let news = data.items.map((item: FHNWNewsItem): NewsItem => ({
      title: item.title,
      link: item.url,
      date: new Date(item.effective).toLocaleDateString('de-CH'),
      description: item.description,
      category: item.news_detail?.university || '',
      image: item.img ? {
        src: item.img.src,
        alt: item.img.alt
      } : undefined
    }));

    // Extract unique base school names from the news items
    const availableSchools = Array.from(new Set(
      news
        .map(item => getBaseSchoolName(item.category))
        .filter(Boolean) // Remove empty categories
    )).sort();

    // Apply school filtering if specified, using partial matches
    if (schools.length > 0) {
      const simplifiedSelectedSchools = schools.map(simplifySchoolName);
      news = news.filter((item: NewsItem) => {
        const simplifiedCategory = simplifySchoolName(item.category);
        return simplifiedSelectedSchools.some(school => 
          simplifiedCategory.includes(school) || school.includes(simplifiedCategory)
        );
      });
    }

    console.log(`Successfully fetched ${news.length} news items after filtering`);
    console.log('Available schools:', availableSchools);

    return NextResponse.json({ 
      news,
      availableSchools 
    });
  } catch (error) {
    console.error('Error in news API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 