import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { type CoreMessage, streamText } from "ai";
import type { ZapServerConfig } from "./types";

export function createZapServer(config: ZapServerConfig) {
  const openrouter = createOpenRouter({
    apiKey: config.apiKey,
  });

  const model = config.model ?? "openai/gpt-4o-mini";
  const maxSteps = config.maxSteps ?? 5;

  return {
    async handleRequest(req: Request) {
      const body: { messages?: CoreMessage[] } = await req.json();
      const messages = body.messages ?? [];

      const result = streamText({
        model: openrouter(model),
        system: config.systemPrompt,
        messages,
        tools: config.tools,
        maxSteps,
      });

      return result.toDataStreamResponse();
    },
  };
}
