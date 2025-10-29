import { NextRequest, NextResponse } from 'next/server';

/**
 * IOTA API Proxy Route
 * 
 * Proxies requests to the IOTA testnet API to bypass CORS restrictions.
 * All requests to /api/iota/* will be forwarded to https://api.testnet.iotaledger.net/*
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  console.log('[IOTA Proxy Catch-All] POST request, path:', resolvedParams.path);
  return proxyRequest(request, resolvedParams);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}

async function proxyRequest(
  request: NextRequest,
  { path }: { path: string[] }
) {
  try {
    const requestUrl = request.nextUrl.pathname;
    const requestFullUrl = request.nextUrl.href;
    const proxyPrefix = '/api/iota';
    
    // Log at the very start to verify route is being called
    console.log(`\n🔵 [IOTA Proxy] ========================================`);
    console.log(`   ROUTE HANDLER CALLED`);
    console.log(`   Method: ${request.method}`);
    console.log(`   Pathname: ${requestUrl}`);
    console.log(`   Full URL: ${requestFullUrl}`);
    console.log(`   Path array:`, JSON.stringify(path));
    console.log(`   Path length: ${path?.length || 0}`);
    console.log(`   Query: ${request.nextUrl.search}`);
    console.log(`========================================\n`);
    
    // Determine the actual path to forward to IOTA API
    let actualPath: string;
    
    // Check if path array is empty (root request) or if URL matches root exactly
    const isEmptyPath = !path || path.length === 0;
    const isExactMatch = requestUrl === proxyPrefix || requestUrl === `${proxyPrefix}/`;
    
    console.log(`[IOTA Proxy] isEmptyPath: ${isEmptyPath}, isExactMatch: ${isExactMatch}`);
    
    if (isEmptyPath || isExactMatch) {
      // Root request - SDK is POSTing directly to /api/iota for transactions
      // IOTA API expects POST to /api/core/v2/blocks
      if (request.method === 'POST') {
        actualPath = '/api/core/v2/blocks';
        console.log(`[IOTA Proxy] ✅ Root POST → ${actualPath} (transaction)`);
      } else {
        actualPath = '/api/core/v2/info';
        console.log(`[IOTA Proxy] ✅ Root ${request.method} → ${actualPath}`);
      }
    } else {
      // Has path segments - SDK might append paths like /api/core/v2/blocks
      // Reconstruct from path array
      actualPath = '/' + path.join('/');
      
      // If SDK already includes /api/core/v2/blocks, use it as-is
      // Otherwise, ensure it starts with /
      if (!actualPath.startsWith('/api/')) {
        // Path doesn't start with /api/, SDK might be using relative paths
        console.log(`[IOTA Proxy] ⚠️  Path doesn't match IOTA API format: ${actualPath}`);
      }
      
      console.log(`[IOTA Proxy] ✅ Path segments → ${actualPath}`);
    }
    
    // Ensure path starts with /
    const normalizedPath = actualPath.startsWith('/') ? actualPath : `/${actualPath}`;
    // IOTA Testnet uses api.testnet.iota.cafe (not .iotaledger.net) - .iotaledger.net returns 404
    const targetUrl = `https://api.testnet.iota.cafe${normalizedPath}`;
    
    // Get query string if any
    const searchParams = request.nextUrl.searchParams.toString();
    const fullUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl;
    
    console.log(`[IOTA Proxy] ${request.method} ${requestUrl} -> ${fullUrl}`);
    
    // Get request body if it exists
    let body: BodyInit | undefined;
    const contentType = request.headers.get('content-type');
    
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        const rawBody = await request.text();
        body = rawBody;
        console.log(`[IOTA Proxy] Request body length: ${rawBody?.length || 0}`);
      } catch (error) {
        console.warn('[IOTA Proxy] Could not read body:', error);
        body = undefined;
      }
    }
    
    // Forward the request to IOTA API
    const response = await fetch(fullUrl, {
      method: request.method,
      headers: {
        'Content-Type': contentType || 'application/json',
        // Forward some important headers
        ...Object.fromEntries(
          ['authorization', 'accept'].map(key => {
            const value = request.headers.get(key);
            return value ? [key, value] : null;
          }).filter(Boolean) as [string, string][]
        ),
      },
      body: body || undefined,
    });
    
    // Get response data
    const data = await response.text();
    
    // Return response with proper headers
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('IOTA API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

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

