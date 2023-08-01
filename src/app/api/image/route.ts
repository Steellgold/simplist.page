import { generateImageFromComponent } from "#/lib/utils/render";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request): Promise<NextResponse> {
  console.log("request", request);

  const schema = z.object({
    question: z.string(),
    response: z.string()
  }).safeParse(await request.json());

  if (!schema.success) return NextResponse.json(schema.error, { status: 400 });

  return NextResponse.json(await generateImageFromComponent(), { status: 200 });
}