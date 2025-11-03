import { NextRequest, NextResponse } from 'next/server';

/**
 * IOTA API Proxy Root Route
 * 
 * Handles requests to /api/iota (without sub-paths)
 * For transaction blocks, the SDK typically POSTs to /api/core/v2/blocks
 */
export async function GET(request: NextRequest) {
  // Forward GET requests - SDK might query info or other endpoints
  return proxyToEndpoint(request, '/info', 'GET');
}

export async function POST(request: NextRequest) {
  // Log immediately - this proves the route is being called
  console.log('\n🟢 [IOTA Proxy Root] ========================================');
  console.log('🟢 POST request received to /api/iota');
  console.log(`🟢 URL: ${request.nextUrl.pathname}`);
  console.log(`🟢 Full URL: ${request.nextUrl.href}`);
  console.log(`🟢 Query: ${request.nextUrl.search}`);
  // Log headers
  const headersObj: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headersObj[key] = value;
  });
  console.log(`🟢 Headers:`, headersObj);
  console.log('🟢 This is the ROOT route handler');
  console.log('🟢 ========================================\n');
  
  // The IOTA SDK/dApp Kit posts to the base URL, expecting it to handle routing
  // Forward to base API URL - the SDK might include endpoint info in headers or body
  // Or maybe the base URL should handle all requests and route internally
  console.log(`[IOTA Proxy Root] Proxying POST to base IOTA API URL`);
  
  // Forward to base URL - let IOTA API handle routing
  // The SDK might be posting transaction blocks that the API routes internally
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
    // Ensure endpoint starts with / if not empty
    const normalizedEndpoint = endpoint && !endpoint.startsWith('/') && endpoint !== '' ? `/${endpoint}` : endpoint;
    const targetUrl = normalizedEndpoint ? `${baseUrl}${normalizedEndpoint}` : baseUrl;
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
        method,
        headers,
        body: body,
      });
      
      console.log(`[IOTA Proxy Root] ✅ Response received`);
      console.log(`[IOTA Proxy Root] Response status: ${response.status}`);
      console.log(`[IOTA Proxy Root] Response URL: ${response.url}`);
      
      // Log response headers
      const responseHeadersObj: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeadersObj[key] = value;
      });
      console.log(`[IOTA Proxy Root] Response headers:`, responseHeadersObj);
      
      // Even if the IOTA API returns an error, forward it to the client
      // Don't treat 404/500 as exceptions - they're valid responses from IOTA API
    } catch (fetchError) {
      console.error(`[IOTA Proxy Root] ❌ Network error (fetch failed):`, fetchError);
      const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
      const errorStack = fetchError instanceof Error ? fetchError.stack : undefined;
      console.error(`[IOTA Proxy Root] Error stack:`, errorStack);
      return NextResponse.json(
        { 
          error: 'Failed to connect to IOTA API', 
          details: errorMessage,
          url: fullUrl,
          method: method
        },
        { status: 502 }
      );
    }
    
    // Get response data
    let responseText: string;
    try {
      responseText = await response.text();
      console.log(`[IOTA Proxy Root] Response body length: ${responseText.length}`);
      console.log(`[IOTA Proxy Root] Response preview: ${responseText.substring(0, 200)}`);
    } catch (textError) {
      console.error(`[IOTA Proxy Root] ❌ Failed to read response body:`, textError);
      responseText = JSON.stringify({ 
        error: 'Failed to read response from IOTA API',
        details: textError instanceof Error ? textError.message : String(textError)
      });
    }
    
    // Return response with proper headers
    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('[IOTA Proxy Root] ❌ Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('[IOTA Proxy Root] Error stack:', errorStack);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
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

