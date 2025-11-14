import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { donateAddress, userAddress, signature } = await request.json();

    if (!donateAddress || !userAddress || !signature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const url = `https://scavenger.prod.gd.midnighttge.io/donate_to/${donateAddress}/${userAddress}/${signature}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Donate failed", details: data },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
