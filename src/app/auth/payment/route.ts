import { prisma } from "#/lib/db/prisma";
import { stripe } from "#/lib/utils/stripe";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

export const GET = async(request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url);
  const sessionId = requestUrl.searchParams.get("session_id");

  if (sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.status !== "complete" || session.payment_status !== "paid") return NextResponse.redirect(requestUrl.origin); // Lol, bye

    const schema = z.object({ userId: z.string() }).safeParse(session.metadata);
    if (!schema.success) return NextResponse.redirect(requestUrl.origin); // Lol, this never happens. (I think) (I hope) (I pray)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const alreadyPaid = await prisma.payments.findFirst({ where: { id: session.id } });
    if (alreadyPaid) return NextResponse.redirect(requestUrl.origin); // hmmm
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await prisma.payments.update({ where: { id: session.id }, data: { alreadyApproved: true } });

    const data = await prisma.user.update({
      where: { id: schema.data.userId },
      data: { credits: { increment: 100 * (session.amount_total || 1) } }
    });

    if (!data) return NextResponse.redirect(requestUrl.origin); // Lol, this never happens. (👀)
  }

  return NextResponse.redirect(requestUrl.origin);
};