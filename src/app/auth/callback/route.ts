import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { NextRequest } from "next/server";
import { prisma } from "#/lib/db/prisma";

export const dynamic = "force-dynamic";

export const GET = async(request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const resp = await supabase.auth.exchangeCodeForSession(code);

    const data = await prisma.user.create({
      data: {
        id: resp.data.user?.id,
        email: resp.data.user?.email ?? "",
        credits: 0
      }
    });

    console.log(data);
  }

  return NextResponse.redirect(requestUrl.origin);
};