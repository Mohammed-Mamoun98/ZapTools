# Zap Tools SDK — Design Spec

**Date:** 2026-04-18  
**Status:** Approved

---

## Context

Developers need a drop-in chatbot widget they can add to any React app with minimal config. The widget should be AI-powered (via OpenRouter) and capable of calling app-specific functions (getters/setters) that the developer provides. The goal is an MVP SDK that feels native — using the Vercel AI SDK's `tool()` pattern developers already know.

---

## Section 1: Developer API

The SDK exposes a single `createZapClient` function. Developers pass a config with their OpenRouter API key, a system prompt, and tools defined using Vercel AI SDK's `tool()` helper with Zod schemas.

```ts
import { createZapClient } from '@zap-tools/sdk';
import { tool } from 'ai';
import { z } from 'zod';

const zap = createZapClient({
  apiKey: 'sk-or-...',
  model: 'openai/gpt-4o-mini', // OpenRouter model string (optional, has default)
  maxSteps: 5,                  // max tool-call loops (optional, default: 5)
  systemPrompt: 'You are a helpful assistant for ...',
  tools: {
    getUserEmail: tool({
      description: 'Get the current user email',
      parameters: z.object({}),
      execute: () => user.email,
    }),
    setUserEmail: tool({
      description: 'Update the user email',
      parameters: z.object({ email: z.string() }),
      execute: ({ email }) => {
        user.email = email;
        return 'Email updated';
      },
    }),
  },
});
```

The `zap` client is then passed to `ZapProvider` which provides it to `ZapWidget` via React context.

```tsx
import { ZapProvider, ZapWidget } from '@zap-tools/ui';

export default function App() {
  return (
    <ZapProvider client={zap}>
      <YourApp />
      <ZapWidget />
    </ZapProvider>
  );
}
```

---

## Section 2: Architecture & Data Flow

```
Developer's React App
├── createZapClient(config)     → ZapClient (sdk)
└── <ZapProvider client={zap}>  → React context
    └── <ZapWidget />           → floating bubble + chat panel (ui)
```

**Request flow:**

1. User types a message in the chat panel
2. UI calls `client.chat(messages)` → returns async stream
3. `streamText()` (Vercel AI SDK) sends messages to OpenRouter
4. AI responds with text or a tool call
5. If tool call → developer's `execute()` runs → result fed back to AI → repeats (up to `maxSteps`)
6. Final streamed text is rendered incrementally in the chat UI

**Key decisions:**

- All AI logic lives in `@zap-tools/sdk` — UI package never touches OpenRouter directly
- SDK returns an async iterable (stream) — UI just renders it
- `stepCountIs(maxSteps)` from Vercel AI SDK handles multi-step tool loops
- Chat history stored in React state — no persistence in MVP

---

## Section 3: Monorepo Structure

```
zap_tools/
├── package.json              ← pnpm workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json             ← base tsconfig (strict, path aliases)
│
├── packages/
│   ├── sdk/
│   │   ├── package.json      ← @zap-tools/sdk
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts      ← public exports (createZapClient)
│   │       ├── client.ts     ← createZapClient: wires model + tools + streamText
│   │       └── types.ts      ← ZapClientConfig, ZapClient, ZapMessage types
│   │
│   └── ui/
│       ├── package.json      ← @zap-tools/ui
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts        ← public exports (ZapProvider, ZapWidget, useZap)
│           ├── context.tsx     ← ZapProvider + useZap hook
│           ├── widget.tsx      ← Floating bubble + toggle logic
│           ├── chat-panel.tsx  ← Messages list + input area
│           └── message.tsx     ← Single message bubble
│
├── apps/
│   └── example/
│       ├── package.json      ← Next.js 14 app
│       ├── next.config.ts
│       └── src/
│           └── app/
│               ├── layout.tsx
│               ├── page.tsx   ← wires createZapClient + ZapProvider + ZapWidget
│               └── globals.css
│
└── .gitignore
```

**Package boundaries:**

- `@zap-tools/sdk` — zero React dependency; pure TypeScript + Vercel AI SDK
- `@zap-tools/ui` — depends on `@zap-tools/sdk`, React, Tailwind CSS v4, shadcn/ui
- `apps/example` — depends on both packages; minimal Next.js demo

---

## Section 4: Widget UI

**Components:**

| Component | Purpose | shadcn |
|---|---|---|
| Floating bubble | Fixed bottom-right, toggles panel open/close | `Button` |
| Chat panel | Slides up from bubble, contains all chat UI | `Card` |
| Message list | Scrollable area, user + AI messages | `ScrollArea` |
| Tool call badge | Shows "Using tool: getUserEmail…" while AI calls tools | inline badge |
| Input area | Text input + send button | `Input`, `Button` |
| Avatars | User / AI icons in message bubbles | `Avatar` |

**Styling:**

- Tailwind CSS v4 in the UI package
- All styles scoped via Tailwind utility classes — no CSS-in-JS
- Widget is a self-contained React tree; CSS bundled with the package
- No external CSS framework required in the consuming app (beyond Tailwind)

---

## Section 5: Error Handling

| Scenario | Behavior |
|---|---|
| `apiKey` missing | `createZapClient` throws immediately on init |
| Network error | Caught, surfaces as system message: "Connection failed. Please try again." |
| Tool execution error | Caught by SDK; error message fed back to AI as tool result so AI can explain |
| Max steps reached | Natural cutoff at `maxSteps` (default 5); AI renders final partial response |
| Empty tool response | Handled gracefully; AI still receives a result to continue |

**Out of scope for MVP:** persistence, retry logic, rate limiting, auth beyond API key.

---

## Verification Plan

1. `pnpm install` — workspace resolves all packages
2. `pnpm turbo build` — sdk + ui build without errors
3. `cd apps/example && pnpm dev` — Next.js dev server starts
4. Open browser → floating bubble appears bottom-right
5. Type a message → AI responds with streamed text
6. Trigger a tool (e.g., "what is my email?") → tool call badge appears → AI returns result
7. Multi-step: ask AI to update email then confirm → two tool calls in one conversation, both execute
8. Network error test: disable network → error message appears in chat gracefully
