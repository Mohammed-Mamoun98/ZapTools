"use client";

import type { ZapChatState } from "@zap-tools/sdk/client";
import { createContext, useContext } from "react";

interface ZapContextType extends ZapChatState {}

const ZapContext = createContext<ZapContextType | undefined>(undefined);

export function ZapProvider({
  children,
  chat,
}: {
  children: React.ReactNode;
  chat: ZapChatState;
}) {
  return <ZapContext.Provider value={chat}>{children}</ZapContext.Provider>;
}

export function useZap() {
  const context = useContext(ZapContext);
  if (!context) {
    throw new Error("useZap must be used within a ZapProvider");
  }
  return context;
}
