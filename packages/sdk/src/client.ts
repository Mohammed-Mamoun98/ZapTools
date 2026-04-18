import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import type {
  ChatStreamChunk,
  ZapClient,
  ZapClientConfig,
  ZapMessage,
} from "./types";

export function createZapClient(config: ZapClientConfig): ZapClient {
  if (!config.apiKey) {
    throw new Error("OpenRouter API key is required");
  }
  const openrouter = createOpenRouter({
    apiKey: config.apiKey,
  });

  const model = config.model ?? "openai/gpt-4o-mini";
  const maxSteps = config.maxSteps ?? 5;

  return {
    chat: async function* (messages: ZapMessage[]) {
      // Convert ZapTool to AI SDK tool format
      const aiTools = Object.entries(config.tools).reduce<
        Record<
          string,
          {
            description: string;
            parameters: unknown;
            execute: (args: unknown) => Promise<unknown>;
          }
        >
      >((acc, [name, toolDef]) => {
        acc[name] = {
          description: toolDef.description ?? "",
          parameters: toolDef.parameters,
          execute: async (args: unknown) => {
            try {
              const result = await toolDef.execute(
                args as Parameters<typeof toolDef.execute>[0],
              );
              return result ?? "done";
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
              throw new Error(`Tool execution failed: ${errorMessage}`);
            }
          },
        };
        return acc;
      }, {});

      const result = streamText({
        model: openrouter(model),
        system: config.systemPrompt,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        tools: aiTools,
        maxSteps: maxSteps,
      });

      for await (const part of result.fullStream) {
        switch (part.type) {
          case "text-delta": {
            const chunk: ChatStreamChunk = {
              type: "text",
              content: part.textDelta,
            };
            yield chunk;
            break;
          }
          case "tool-call": {
            const chunk: ChatStreamChunk = {
              type: "tool_call",
              toolName: part.toolName,
            };
            yield chunk;
            break;
          }
          case "tool-result": {
            const chunk: ChatStreamChunk = {
              type: "tool_result",
              toolName: part.toolName,
              result: part.result,
            };
            yield chunk;
            break;
          }
          default:
            // Ignore other chunk types
            break;
        }
      }
    },
  };
}
