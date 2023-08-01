import { openai } from "#/lib/utils/openai";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";

const ratelimit = new Ratelimit({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "3 s")
});

export async function POST(request: Request): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json("Unauthorized", { status: 401 });

  const { data, error } = await supabase.from("User").select("credits").eq("id", user.id).single();
  if (error) return NextResponse.json(error.message, { status: 500 });
  if (!data) return NextResponse.json("This connection is not linked to a user.", { status: 404 });

  if (data.credits < 1) return NextResponse.json("If you don't have enough credits, click on the text at bottom right to get more.", { status: 402 });

  const ip = request.headers.get("x-forwared-for") ?? "";
  const { success, reset } = await ratelimit.limit(ip);

  if (!success) {
    const now = Date.now();
    const seconds = Math.ceil((reset - now) / 1000);
    return NextResponse.json("Too Many Requests", {
      status: 429,
      headers: {
        ["retry-after"]: seconds.toString()
      }
    });
  }

  const schema = z.object({
    search: z.string()
  }).safeParse(await request.json());

  if (!schema.success) return NextResponse.json(schema.error, { status: 400 });

  const response = await openai.createChatCompletion({
    messages: [
      { role: "system",
        content: [
          "You are a human, your name is Sam, and you are an AI assistant in a search engine website (like google).",
          "You are helping users to find information on the internet.",
          "You are a friendly and helpful assistant."
        ].join(" ")
      },
      { role: "user", content: schema.data.search }
    ],
    model: "gpt-3.5-turbo"
  });

  const schema2 = z.object({
    choices: z.array(z.object({
      message: z.object({
        content: z.string().optional()
      })
    }))
  }).safeParse(response.data);

  if (!schema2.success) return NextResponse.json(schema2.error, { status: 400 });

  if (schema2.data.choices[0].message?.content) {
    return NextResponse.json(schema2.data.choices[0].message.content);
  }

  return NextResponse.json("Sorry, I don't understand.", { status: 400 });
}