import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🔍 Proxy API called:', request.url);
  const { searchParams } = new URL(request.url);
  
  // Get the authorization header from the request
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    console.log('❌ Missing authorization header');
    return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
  }
  
  console.log('🔑 Authorization header present:', authHeader.substring(0, 20) + '...');

  try {
    // Get query parameters from the request
    const semesterId = searchParams.get('semesterId') || '20251';
    const top = searchParams.get('top') || '100';
    const statusType = searchParams.get('statusType') || '100005';
    
    // Generate a correlation ID
    const correlationId = crypto.randomUUID();
    
    // Build the FHNW API URL
    const fhnwUrl = new URL('https://bariapi.fhnw.ch/cit_auxilium/prod/api/Anmeldung');
    fhnwUrl.searchParams.append('$top', top);
    fhnwUrl.searchParams.append('$filter', `((semesterId eq ${semesterId})) and ((statusType eq ${statusType}))`);
    fhnwUrl.searchParams.append('correlationId', correlationId);
    fhnwUrl.searchParams.append('language', 'EN');
    
    console.log('📡 Making request to FHNW API:', fhnwUrl.toString());

    // Make the request to FHNW API with proper headers
    const response = await fetch(fhnwUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json;odata=verbose,text/plain, */*; q=0.01',
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'Origin': 'https://auxilium.webapps.fhnw.ch',
        'Referer': 'https://auxilium.webapps.fhnw.ch/'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `FHNW API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return the data with CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Error fetching from FHNW API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from FHNW API' },
      { status: 500 }
    );
  }
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}