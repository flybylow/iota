import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Test route works!' });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  return NextResponse.json({ 
    message: 'POST works!', 
    bodyLength: body.length,
    timestamp: new Date().toISOString()
  });
}

