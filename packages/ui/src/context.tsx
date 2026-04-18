"use client";

import type { ZapClient } from "@zap-tools/sdk";
import { createContext, useContext, useState } from "react";

interface ZapContextType {
  client: ZapClient | null;
  setClient: (client: ZapClient | null) => void;
}

const ZapContext = createContext<ZapContextType | undefined>(undefined);

export function ZapProvider({
  children,
  client,
}: {
  children: React.ReactNode;
  client: ZapClient;
}) {
  const [clientState, setClientState] = useState<ZapClient | null>(client);

  return (
    <ZapContext.Provider
      value={{ client: clientState, setClient: setClientState }}
    >
      {children}
    </ZapContext.Provider>
  );
}

export function useZap() {
  const context = useContext(ZapContext);
  if (!context) {
    throw new Error("useZap must be used within a ZapProvider");
  }
  return context;
}
