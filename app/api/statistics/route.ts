// app/api/statistics/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  try {
    // Gọi từ SERVER → không bị CORS
    const res = await fetch(
      `https://scavenger.prod.gd.midnighttge.io/statistics/${address}`
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: "Failed to fetch", details: error },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
