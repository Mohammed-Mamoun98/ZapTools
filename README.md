# ZapTools

Drop an AI chat widget into any React app in minutes. Server-side API key, tool calling, full streaming — built on Vercel AI SDK and OpenRouter.

## Packages

| Package | Description |
|---------|-------------|
| [`@zap-tools/sdk`](./packages/sdk) | Server — createZapServer handles requests, tools, and streaming |
| [`@zap-tools/sdk/client`](./packages/sdk) | Client — useZapChat hook (tree-shaken from server code) |
| [`@zap-tools/ui`](./packages/ui) | React components — ZapWidget, ZapProvider, useZap |

## Quick Start

### 1. Install

```bash
npm install @zap-tools/sdk zod
npm install @zap-tools/ui   # optional, for the floating widget
```

### 2. Create the server route

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

### 3. Connect the client hook

```ts
// providers.tsx
import { useZapChat } from "@zap-tools/sdk/client";

const chat = useZapChat({ endpoint: "/api/chat" });
```

### 4. Add the widget

```tsx
// App.tsx
import { ZapProvider, ZapWidget } from "@zap-tools/ui";

export function App() {
  return (
    <ZapProvider chat={chat}>
      <YourApp />
      <ZapWidget />
    </ZapProvider>
  );
}
```

## Server Configuration

```ts
const zap = createZapServer({
  apiKey: process.env.OPENROUTER_API_KEY!,  // required
  model: "openai/gpt-oss-120b:free",        // optional, defaults to this
  maxSteps: 5,                               // optional, defaults to 5
  systemPrompt: "You are a helpful assistant.",  // required
  tools: { weatherTool },                    // optional
});
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `apiKey` | `string` | — | Your OpenRouter API key (server-only) |
| `model` | `string` | `openai/gpt-oss-120b:free` | Any OpenRouter model ID |
| `systemPrompt` | `string` | — | System prompt for the AI |
| `tools` | `Record<string, ZapTool>` | `{}` | Tools the AI can call server-side |
| `maxSteps` | `number` | `5` | Max tool-calling loops per request |

## Defining Tools

Tools use the AI SDK `tool()` helper with Zod schemas. The AI decides when to call them — they only execute server-side.

```ts
import { tool } from "ai";
import { z } from "zod";

const weatherTool = tool({
  description: "Get the current weather for a city",
  parameters: z.object({
    city: z.string().describe("The city name"),
  }),
  execute: async ({ city }) => {
    const temp = await getTemp(city);
    return { city, temp, unit: "°C" };
  },
});
```

## Client Hook

```ts
import { useZapChat } from "@zap-tools/sdk/client";

const chat = useZapChat({ endpoint: "/api/chat" });
```

**ZapChatConfig**

| Field | Type | Description |
|-------|------|-------------|
| `endpoint` | `string` | URL of your API route (e.g. `/api/chat`) |

**ZapChatState (returned)**

| Field | Type | Description |
|-------|------|-------------|
| `messages` | `ZapMessage[]` | Chat history (role + content) |
| `input` | `string` | Current input value |
| `setInput` | `(input: string) => void` | Update input value |
| `handleSubmit` | `(e: FormEvent) => void` | Submit the message |
| `isLoading` | `boolean` | AI is generating a response |
| `isWaiting` | `boolean` | Alias for isLoading |

## UI Components

| Component | Description |
|-----------|-------------|
| `<ZapProvider chat={...}>` | Context provider — pass chat state from useZapChat |
| `<ZapWidget />` | Floating chat bubble with panel, zero config |
| `useZap()` | Access ZapChatState from any child component |

## Architecture

1. **Browser** — User types a message. `useZapChat` sends it to your API route.
2. **API Route** — `createZapServer` forwards to OpenRouter with your system prompt and tools.
3. **OpenRouter** — The AI responds, optionally calling tools (executed server-side).
4. **Stream back** — Response streams to the browser in real time via the Vercel AI SDK.

## Project Structure

```
zap_tools/
├── apps/
│   └── example/          # Next.js demo app
├── packages/
│   ├── sdk/              # @zap-tools/sdk (server + client entry)
│   └── ui/               # @zap-tools/ui (React components)
├── docs/                 # Design specs
└── turbo.json
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the example app
cd apps/example && pnpm dev
```

## Recommended Models

ZapTools uses OpenRouter, which gives you access to hundreds of models — including free ones.

| Model | Cost | Link |
|-------|------|------|
| `openai/gpt-oss-120b:free` | Free | [OpenRouter](https://openrouter.ai/openai/gpt-oss-120b:free) |

To use a different model, set the `ZAP_MODEL` env variable or pass it in config:

```ts
const zap = createZapServer({
  apiKey: process.env.OPENROUTER_API_KEY!,
  model: process.env.ZAP_MODEL,  // falls back to default
  systemPrompt: "You are a helpful assistant.",
});
```

> **Note:** Free models may have rate limits or lower context windows. Swap to a paid model for production workloads.

## Tech Stack

- **Turborepo** — monorepo build system
- **Vercel AI SDK** — streaming and tool calling
- **OpenRouter** — LLM provider (supports GPT-4o, Claude, Gemini, etc.)
- **Zod** — tool parameter schemas
- **Biome** — linting and formatting
- **tsdown** — package bundler
