import { openai } from "#/lib/utils/openai";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { ChatCompletionRequestMessage } from "openai";

export async function POST(request: Request): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

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

  const schema2 = z.object({
    choices: z.array(z.object({
      message: z.object({
        content: z.string().optional()
      })
    }))
  }).safeParse(res);

  if (!schema2.success) return NextResponse.json({ message: schema2.error }, { status: 400 });

  if (schema2.data.choices[0].message?.content) {
    return NextResponse.json({ message: schema2.data.choices[0].message.content }, { status: 200 });
  }

  return NextResponse.json({ message: "Sorry, I don't understand." }, { status: 400 });
}