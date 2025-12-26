// app/api/analytics/route.ts
// Fetch total GA4 sessions securely via service account

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";

// Enable Next.js incremental static regeneration for this route
// This makes the response cached for 24 hours and regenerated in the background
export const revalidate = 86400; // 86400 seconds = 24 hours

const propertyId = process.env.GA4_PROPERTY_ID!;
const clientEmail = process.env.GA4_CLIENT_EMAIL!;
const privateKey = (process.env.GA4_PRIVATE_KEY || "").replace(/\\n/g, "\n");

export async function GET() {
  try {
    // Check environment variables
    if (!propertyId || !clientEmail || !privateKey) {
      return NextResponse.json(
        { error: "Missing GA4 credentials" },
        { status: 500 },
      );
    }

    // Initialize GA4 Data API client
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });

    // Query GA4 for total sessions only
    const sessionsResponse = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "2025-01-01", endDate: "today" }],
      metrics: [{ name: "sessions" }],
    });

    const totalSessions = sessionsResponse[0]?.rows?.[0]?.metricValues?.[0]?.value
      ? Number(sessionsResponse[0].rows[0].metricValues[0].value)
      : 0;

    // Add caching headers (edge + browser) - cache for 24 hours
    const headers = new Headers({
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    });

    return NextResponse.json(
      {
        metric: "sessions",
        label: "Total Sessions",
        total: totalSessions,
      },
      { headers },
    );
  } catch (err: unknown) {
    console.error("GA4 API Error:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch GA4 data",
        detail: String(err),
      },
      { status: 500 },
    );
  }
}
