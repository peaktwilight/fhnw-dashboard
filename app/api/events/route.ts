import { NextResponse } from 'next/server';

interface EventItem {
  title: string;
  link: string;
  date: string;
  time: string;
  description: string;
  location: string;
  school: string;
  image?: {
    src: string;
    alt: string;
  };
}

interface FHNWEventItem {
  title: string;
  url: string;
  event_detail: {
    event_date: string;
    location_short: string;
  };
  description: string;
  entryText: string;
  start_date_short: string;
  img?: {
    src: string;
    alt: string;
  };
  fhnw_location: string[];
  school?: string;
}

interface FHNWEventResponse {
  items: FHNWEventItem[];
  items_total: number;
  batching?: {
    first: string;
    last: string;
    next?: string;
  };
}

// Helper function to parse event date and time
function parseEventDateTime(eventDate: string): { date: string; time: string } {
  try {
    // Example input: "Do, 6.2.2025, 18:00–19:30 Uhr"
    const parts = eventDate.split(', ');
    if (parts.length >= 3) {
      return {
        date: parts[1],
        time: parts[2].replace(' Uhr', '')
      };
    }
    return {
      date: parts[1] || '',
      time: parts[2] || ''
    };
  } catch (error) {
    console.error('Error parsing event date time:', error);
    return { date: '', time: '' };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const locations = searchParams.get('locations')?.split(',').filter(Boolean) || [];
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    console.log('Fetching events with params:', { query, locations, sortOrder });

    // Construct base URL for fetching events with correct parameters
    const baseUrl = 'https://www.fhnw.ch/de/searchbar.json';
    const params = new URLSearchParams({
      'template': 'training_full',
      'category': 'events',
      'q': query,
      'eventtype[]': 'infoanlass',
      'showImages': 'true',
      'limit': '100', // Get more items to handle frontend pagination
      'offset': '0'
    });

    // Add location parameters if specified
    if (locations.length > 0) {
      locations.forEach(location => {
        params.append('fhnw_location[]', location);
      });
    }

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data: FHNWEventResponse = await response.json();
    
    if (!data.items) {
      throw new Error('Invalid response format: missing items');
    }

    let events = data.items.map((item: FHNWEventItem): EventItem => {
      const { date, time } = parseEventDateTime(item.event_detail.event_date);
      return {
        title: item.title,
        link: item.url,
        date: date,
        time: time,
        description: item.entryText || item.description || '',
        location: item.event_detail.location_short,
        school: item.school || '',
        image: item.img ? {
          src: item.img.src,
          alt: item.img.alt
        } : undefined
      };
    });

    // Filter by location if specified (as a backup in case the API filtering doesn't work)
    if (locations.length > 0) {
      events = events.filter(event => 
        locations.some(loc => event.location.toLowerCase().includes(loc.toLowerCase()))
      );
    }

    // Sort events by date if needed
    if (sortOrder === 'desc') {
      events.reverse();
    }

    // Extract unique locations from the API response
    const availableLocations = Array.from(new Set(
      events.map(item => item.location).filter(Boolean)
    )).sort();

    console.log(`Successfully fetched ${events.length} events after filtering`);
    console.log('Available locations:', availableLocations);

    return NextResponse.json({ 
      events,
      availableLocations,
      total: data.items_total || events.length,
      hasMore: data.batching?.next ? true : false
    });
  } catch (error) {
    console.error('Error in events API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 