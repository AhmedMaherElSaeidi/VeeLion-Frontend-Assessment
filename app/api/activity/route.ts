import { NextResponse } from "next/server";
import { getActivityFromBackend, createActivityInBackend } from "@/lib/backendApi";

export async function GET() {
  try {
    const logs = await getActivityFromBackend();
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Unable to fetch activity logs.",
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { action?: string; info?: string };

    if (typeof payload.action !== "string" || !payload.action.trim()) {
      return NextResponse.json({ error: { message: "action is required" } }, { status: 400 });
    }

    const entry = await createActivityInBackend(
      payload.action.trim(),
      payload.info?.trim() || undefined,
    );
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Unable to create activity entry.",
        },
      },
      { status: 500 },
    );
  }
}
