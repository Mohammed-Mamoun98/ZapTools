# ZapTools

A monorepo for building AI-powered chat widgets. Drop a fully functional chat assistant into any React app with a few lines of code.

## Packages

| Package | Description |
|---------|-------------|
| [`@zap-tools/sdk`](./packages/sdk) | Core client — connects to any LLM via OpenRouter, supports tool calling |
| [`@zap-tools/ui`](./packages/ui) | React components — floating widget, chat panel, message bubbles |

## Quick Start

```bash
pnpm install
pnpm build
```

### 1. Create a client

```ts
import { createZapClient } from "@zap-tools/sdk";
import { z } from "zod";

const client = createZapClient({
  apiKey: process.env.OPENROUTER_API_KEY!,
  model: "openai/gpt-4o-mini",
  systemPrompt: "You are a helpful assistant.",
  tools: {
    getWeather: {
      description: "Get the current weather for a city",
      parameters: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ city, temp: "22°C", condition: "Sunny" }),
    },
  },
});
```

### 2. Add the widget

```tsx
import { ZapWidget } from "@zap-tools/ui";
import { ZapProvider } from "@zap-tools/ui";

export default function App() {
  return (
    <ZapProvider client={client}>
      <ZapWidget />
    </ZapProvider>
  );
}
```

## Project Structure

```
zap_tools/
├── apps/
│   └── example/          # Next.js demo app
├── packages/
│   ├── sdk/              # @zap-tools/sdk
│   └── ui/               # @zap-tools/ui
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

## Tech Stack

- **Turborepo** — monorepo build system
- **Vercel AI SDK** — streaming and tool calling
- **OpenRouter** — LLM provider (supports GPT-4o, Claude, Gemini, etc.)
- **Zod** — tool parameter schemas
- **Biome** — linting and formatting
- **tsdown** — package bundler
