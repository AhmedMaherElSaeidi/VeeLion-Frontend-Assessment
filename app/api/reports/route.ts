import { NextResponse } from "next/server";
import { getReportsSummaryFromBackend } from "@/lib/backendApi";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const summary = await getReportsSummaryFromBackend({
      hours: searchParams.get("hours") ?? undefined,
      minutes: searchParams.get("minutes") ?? undefined,
      seconds: searchParams.get("seconds") ?? undefined,
    });

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Unable to fetch the tasks summary.",
        },
      },
      { status: 500 },
    );
  }
}