import { openai } from "#/lib/utils/openai";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "#/lib/db/prisma";
import type { ChatCompletionRequestMessage } from "openai";

const ratelimit = new Ratelimit({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "3 s")
});

export async function POST(request: Request): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase.from("User").select("credits").eq("id", user.id).single();
  if (error) return NextResponse.json({ message: "You are not logged in, please refresh the page." }, { status: 401 });
  if (!data) return NextResponse.json({ message: "This connection is not linked to a user." }, { status: 404 });

  if (data.credits < 1) return NextResponse.json({ message: "You don't have enough credits, click on the text at bottom right to get more." }, {
    status: 402
  });

  const ip = request.headers.get("x-forwared-for") ?? "";
  const { success, reset } = await ratelimit.limit(ip);

  if (!success) {
    const now = Date.now();
    const seconds = Math.ceil((reset - now) / 1000);
    return NextResponse.json({ message: "Too Many Requests" }, {
      status: 429,
      headers: {
        ["retry-after"]: seconds.toString()
      }
    });
  }

  const schema = z.object({
    search: z.string(),
    reply: z.string().optional().nullable(),
    oldSearch: z.string().optional().nullable()
  }).safeParse(await request.json());

  if (!schema.success) return NextResponse.json({ message: schema.error }, { status: 400 });

  const messages: ChatCompletionRequestMessage[] = [
    { role: "system", content: [
      "You are a human, your name is Sam, and you are an AI assistant in a search engine website (like google).",
      "You are helping users to find information on the internet.",
      "You are a friendly and helpful assistant."
    ].join(" ") }
  ];

  if (schema.data.reply && schema.data.oldSearch) {
    messages.push({ role: "user", content: schema.data.oldSearch });
    messages.push({ role: "assistant", content: schema.data.reply });
  }

  messages.push({ role: "user", content: schema.data.search });

  const res = (await openai.createChatCompletion({ messages, model: "gpt-3.5-turbo" })).data;

  const schema2 = z.object({ choices: z.array(z.object({ message: z.object({ content: z.string().optional() }) }))
  }).safeParse(res);

  if (!schema2.success) return NextResponse.json({ message: schema2.error }, { status: 400 });

  const { credits } = await prisma.user.update({ where: { id: user.id }, data: { credits: { decrement: 1 } } });

  if (schema2.data.choices[0].message?.content) {
    return NextResponse.json({ message: schema2.data.choices[0].message.content, newCredits: credits }, { status: 200 });
  }

  return NextResponse.json({ message: "Sorry, I don't understand." }, { status: 400 });
}