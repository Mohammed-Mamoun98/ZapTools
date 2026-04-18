import type { z } from "zod";

export interface ZapMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ZapTool<Args = Record<string, unknown>, Result = unknown> {
  description?: string;
  parameters: z.ZodType<Args>;
  // biome-ignore lint/suspicious/noExplicitAny: accepts AI SDK ToolExecutionOptions or any caller context
  execute: (args: Args, ...rest: any[]) => PromiseLike<Result> | Result;
}

export interface ZapClientConfig {
  apiKey: string;
  model?: string;
  maxSteps?: number;
  systemPrompt: string;
  // biome-ignore lint/suspicious/noExplicitAny: tool args/results are schema-typed at runtime via zod
  tools: Record<string, ZapTool<any, any>>;
}

export interface ChatChunk {
  type: "text";
  content: string;
}

export interface ToolCallChunk {
  type: "tool_call";
  toolName: string;
}

export interface ToolResultChunk {
  type: "tool_result";
  toolName: string;
  result: unknown;
}

export type ChatStreamChunk = ChatChunk | ToolCallChunk | ToolResultChunk;

export interface ZapClient {
  chat: (messages: ZapMessage[]) => AsyncIterable<ChatStreamChunk>;
}
