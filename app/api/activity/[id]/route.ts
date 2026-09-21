import { NextResponse } from "next/server";
import { deleteActivityInBackend } from "@/lib/backendApi";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await deleteActivityInBackend(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Unable to delete activity entry." } },
      { status: 500 }
    );
  }
}