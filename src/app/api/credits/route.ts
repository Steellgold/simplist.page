import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "#/lib/db/prisma";

export async function GET(): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json("Unauthorized", { status: 401 });

  const data = await prisma.user.findUnique({ where: { id: user.id } });
  if (!data) return NextResponse.json("This connection is not linked to a user.", { status: 404 });

  return NextResponse.json(data.credits, { status: 200 });
}

export async function PUT(): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json("Unauthorized", { status: 401 });

  const data = await prisma.user.findUnique({ where: { id: user.id } });
  if (!data) return NextResponse.json("This connection is not linked to a user.", { status: 404 });

  if (data.credits < 1) return NextResponse.json({
    message: "You don't have enough credits, click on the text at bottom right to get more."
  }, { status: 402 });

  const { credits } = await prisma.user.update({
    where: { id: user.id },
    data: { credits: { decrement: 1 } },
    select: { credits: true }
  });

  return NextResponse.json({ newCredits: credits }, { status: 200 });
}