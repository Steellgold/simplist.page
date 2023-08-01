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