"use client";

import { useZapChat } from "@zap-tools/sdk/client";
import { ZapProvider, ZapWidget } from "@zap-tools/ui";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const chat = useZapChat({
    endpoint: "/api/chat",
  });

  return (
    <ZapProvider chat={chat}>
      {children}
      <ZapWidget />
    </ZapProvider>
  );
}
