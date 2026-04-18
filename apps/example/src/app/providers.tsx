"use client";

import { createZapClient } from "@zap-tools/sdk";
import { ZapProvider, ZapWidget } from "@zap-tools/ui";
import { tool } from "ai";
import type { ReactNode } from "react";
import { z } from "zod";

const zap = createZapClient({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "sk-or-placeholder",
  model: "stepfun/step-3.5-flash",
  maxSteps: 5,
  systemPrompt:
    "You are a helpful assistant that can answer questions and use tools.",
  tools: {
    getUserEmail: tool({
      description: "Get the current user email",
      parameters: z.object({}),
      execute: async () => "user@example.com",
    }),
    setUserEmail: tool({
      description: "Update the user email",
      parameters: z.object({ email: z.string() }),
      execute: async ({ email }) => `Email updated to ${email}`,
    }),
    alert: tool({
      description: "just an alert message",
      parameters: z.object({ message: z.string() }),
      execute: async ({ message }) => alert(message),
    }),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ZapProvider client={zap}>
      {children}
      <ZapWidget />
    </ZapProvider>
  );
}
