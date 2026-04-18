import type { z } from "zod";

// ─── Shared ───

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

// ─── Server-side (createZapServer) ───

export interface ZapServerConfig {
  apiKey: string;
  model?: string;
  maxSteps?: number;
  systemPrompt: string;
  // biome-ignore lint/suspicious/noExplicitAny: tool args/results are schema-typed at runtime via zod
  tools?: Record<string, ZapTool<any, any>>;
}

export interface ZapServer {
  handleRequest: (req: Request) => Promise<Response>;
}

// ─── Client-side (useZapChat) ───

export interface ZapChatConfig {
  endpoint: string;
}

export interface ZapChatState {
  messages: ZapMessage[];
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isWaiting: boolean;
}
