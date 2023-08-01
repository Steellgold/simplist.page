/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable camelcase */
import { prisma } from "#/lib/db/prisma";
import { stripe } from "#/lib/utils/stripe";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request): Promise<NextResponse> {
  const schema = z.object({
    userId: z.string()
  }).safeParse(await request.json());

  if (!schema.success) return NextResponse.json(schema.error, { status: 400 });

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: process.env.STRIPE_PRICE_ID || "", quantity: 1 }],
    mode: "payment",
    allow_promotion_codes: true,
    metadata: { userId: schema.data.userId },
    success_url: (process.env.NEXT_PUBLIC_URL || "") + "/auth/payment?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: process.env.NEXT_PUBLIC_URL
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  await prisma.payments.create({ data: { id: session.id, alreadyApproved: false } });

  return NextResponse.json(session.url, { status: 201 });
}