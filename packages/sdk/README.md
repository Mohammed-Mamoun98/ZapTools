# @zap-tools/sdk

Server & client SDK for ZapTools — create a streaming AI chat backend with tool calling, powered by Vercel AI SDK and OpenRouter.

## Install

```bash
npm install @zap-tools/sdk zod react react-dom
```

## Server Usage

```ts
// app/api/chat/route.ts
import { createZapServer } from "@zap-tools/sdk";
import { tool } from "ai";
import { z } from "zod";

const zap = createZapServer({
  apiKey: process.env.OPENROUTER_API_KEY!,
  systemPrompt: "You are a helpful assistant.",
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
```

## Client Usage

```ts
import { useZapChat } from "@zap-tools/sdk/client";

const chat = useZapChat({ endpoint: "/api/chat" });
```

The `/client` subpath is tree-shaken from server code — no server deps in your client bundle.

## Exports

| Subpath | Description |
|---------|-------------|
| `@zap-tools/sdk` | Server — `createZapServer`, types, `ZapTool` |
| `@zap-tools/sdk/client` | Client — `useZapChat` hook, `ZapChatState`, `ZapMessage` |

## Server Config

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `apiKey` | `string` | — | Your OpenRouter API key (server-only) |
| `model` | `string` | `openai/gpt-oss-120b:free` | Any OpenRouter model ID |
| `systemPrompt` | `string` | — | System prompt for the AI |
| `tools` | `Record<string, ZapTool>` | `{}` | Tools the AI can call server-side |
| `maxSteps` | `number` | `5` | Max tool-calling loops per request |

## License

MIT
