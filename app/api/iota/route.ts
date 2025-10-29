import { NextRequest, NextResponse } from 'next/server';

/**
 * IOTA API Proxy Root Route
 * 
 * Handles requests to /api/iota (without sub-paths)
 * For transaction blocks, the SDK typically POSTs to /api/core/v2/blocks
 */
export async function GET(request: NextRequest) {
  return proxyToEndpoint(request, '/api/core/v2/info', 'GET');
}

export async function POST(request: NextRequest) {
  // Log immediately - this proves the route is being called
  console.log('\n🟢 [IOTA Proxy Root] ========================================');
  console.log('🟢 POST request received to /api/iota');
  console.log(`🟢 URL: ${request.nextUrl.pathname}`);
  console.log(`🟢 Full URL: ${request.nextUrl.href}`);
  console.log(`🟢 Headers:`, Object.fromEntries(request.headers.entries()));
  console.log('🟢 This is the ROOT route handler');
  console.log('🟢 ========================================\n');
  
  // CRITICAL: The SDK likely uses JSON-RPC and expects response in that format
  // OR the SDK appends a subpath - but since we're at root, this shouldn't be the case
  // Let's try proxying directly to IOTA API root since that's what SDK base URL should be
  console.log(`[IOTA Proxy Root] Proxying to IOTA API root (JSON-RPC endpoint)`);
  
  // IOTA SDK uses JSON-RPC - POST to root API URL
  // The base URL should be the RPC endpoint itself
  return proxyToEndpoint(request, '', 'POST');
}

export async function PUT(request: NextRequest) {
  return proxyToEndpoint(request, '/api/core/v2/info', 'PUT');
}

export async function DELETE(request: NextRequest) {
  return proxyToEndpoint(request, '/api/core/v2/info', 'DELETE');
}

async function proxyToEndpoint(
  request: NextRequest,
  endpoint: string,
  method: string
) {
  try {
    // IOTA Testnet uses api.testnet.iota.cafe (not .iotaledger.net)
    // The .iotaledger.net endpoint returns 404
    const baseUrl = 'https://api.testnet.iota.cafe';
    const targetUrl = `${baseUrl}${endpoint}`;
    const searchParams = request.nextUrl.searchParams.toString();
    const fullUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl;
    
    console.log(`[IOTA Proxy Root] ${method} /api/iota -> ${fullUrl}`);
    
    // Get request body if it exists
    let body: string | undefined;
    const contentType = request.headers.get('content-type') || 'application/json';
    
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        body = await request.text();
        console.log(`[IOTA Proxy Root] Body length: ${body?.length || 0}`);
      } catch (error) {
        console.warn('[IOTA Proxy Root] No body available:', error);
        body = undefined;
      }
    }
    
    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };
    
    // Forward important headers if present
    const auth = request.headers.get('authorization');
    const accept = request.headers.get('accept');
    if (auth) headers['authorization'] = auth;
    if (accept) headers['accept'] = accept;
    
    console.log(`[IOTA Proxy Root] Fetching ${fullUrl} with ${method}`);
    console.log(`[IOTA Proxy Root] Body preview: ${body?.substring(0, 100) || 'none'}`);
    
    // Forward the request to IOTA API
    let response: Response;
    try {
      response = await fetch(fullUrl, {
        method: method,
        headers,
        body: body,
      });
      
      console.log(`[IOTA Proxy Root] ✅ Response received`);
      console.log(`[IOTA Proxy Root] Response status: ${response.status}`);
      console.log(`[IOTA Proxy Root] Response headers:`, Object.fromEntries(response.headers.entries()));
    } catch (fetchError) {
      console.error(`[IOTA Proxy Root] ❌ Fetch failed:`, fetchError);
      return NextResponse.json(
        { 
          error: 'Failed to proxy request to IOTA API', 
          details: fetchError instanceof Error ? fetchError.message : String(fetchError)
        },
        { status: 502 }
      );
    }
    
    // Get response data
    const data = await response.text();
    console.log(`[IOTA Proxy Root] Response data length: ${data.length}`);
    console.log(`[IOTA Proxy Root] Response data preview: ${data.substring(0, 200)}`);
    
    // Return response with proper headers
    const responseHeaders = new Headers({
      'Content-Type': response.headers.get('content-type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    
    console.log(`[IOTA Proxy Root] Returning response with status: ${response.status}`);
    
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[IOTA Proxy Root] Error details:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Proxy request failed', 
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
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

