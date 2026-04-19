import { createZapServer } from "@zap-tools/sdk";
import { tool } from "ai";
import { z } from "zod";

const zap = createZapServer({
  apiKey: process.env.OPENROUTER_API_KEY!,
  maxSteps: 5,
  systemPrompt:
    "You are a helpful assistant that can answer questions and use tools.",
  tools: {
    getUserEmail: tool({
      description: "Get the current user email",
      parameters: z.object({}),
      execute: async () => "user@example.com",
    }),
  },
});

export async function POST(req: Request) {
  return zap.handleRequest(req);
}
