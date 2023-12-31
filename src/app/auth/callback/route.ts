import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "#/lib/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export const GET = async(request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const resp = await supabase.auth.exchangeCodeForSession(code);

    const existingUser = await prisma.user.findUnique({ where: { id: resp.data.user?.id } });
    if (existingUser) return NextResponse.redirect(requestUrl.origin);

    await prisma.user.create({
      data: {
        id: resp.data.user?.id,
        email: resp.data.user?.email ?? "",
        credits: 0
      }
    });
  }

  return NextResponse.redirect(requestUrl.origin);
};