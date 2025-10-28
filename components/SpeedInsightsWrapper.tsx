'use client';

import dynamic from 'next/dynamic';

// Dynamically import SpeedInsights only in production with no SSR
const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then((mod) => mod.SpeedInsights),
  { 
    ssr: false,
    loading: () => null
  }
);

export function SpeedInsightsWrapper() {
  // Only render in production
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }
  
  return <SpeedInsights />;
}

