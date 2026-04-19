# @zap-tools/ui

React components for ZapTools — a floating AI chat widget with streaming support.

## Install

```bash
npm install @zap-tools/ui @zap-tools/sdk react react-dom
```

## Usage

```tsx
import { ZapProvider, ZapWidget } from "@zap-tools/ui";
import { useZapChat } from "@zap-tools/sdk/client";

function App() {
  const chat = useZapChat({ endpoint: "/api/chat" });

  return (
    <ZapProvider chat={chat}>
      <YourApp />
      <ZapWidget />
    </ZapProvider>
  );
}
```

## Components

| Component | Description |
|-----------|-------------|
| `<ZapProvider chat={...}>` | Context provider — pass chat state from `useZapChat` |
| `<ZapWidget />` | Floating chat bubble with panel, zero config |
| `useZap()` | Access `ZapChatState` from any child component |

## Peer Dependencies

- `react` >= 19.0.0
- `react-dom` >= 19.0.0
- `@zap-tools/sdk` >= 0.0.1

## License

MIT
