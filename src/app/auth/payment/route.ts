import type { NextRequest } from "next/server";
import { stripe } from "#/lib/utils/stripe";
import { NextResponse } from "next/server";
import { prisma } from "#/lib/db/prisma";
import { kv } from "@vercel/kv";
import { z } from "zod";

export const GET = async(request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url);
  const sessionId = requestUrl.searchParams.get("session_id");

  if (sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.status !== "complete" || session.payment_status !== "paid") return NextResponse.redirect(requestUrl.origin); // Payment not complete

    const schema = z.object({ userId: z.string() }).safeParse(session.metadata);
    if (!schema.success) return NextResponse.redirect(requestUrl.origin); // User is not logged in when buying credits

    if (await kv.get(session.id) == true) return NextResponse.redirect(requestUrl.origin); // User already got credits
    await kv.set(session.id, true);

    const data = await prisma.user.update({
      where: { id: schema.data.userId },
      data: { credits: { increment: 100 } }
    });

    if (!data) return NextResponse.redirect(requestUrl.origin); // User not found (shouldn't happen)
  }

  return NextResponse.redirect(requestUrl.origin);
};