import { openai } from "#/lib/utils/openai";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request): Promise<NextResponse> {
  console.log("request", request);

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