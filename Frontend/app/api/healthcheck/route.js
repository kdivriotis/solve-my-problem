import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "Healthy",
      uptime: Math.floor(process.uptime()),
      components: [],
    },
    { status: 200 }
  );
}
