import { CodeBlock, CodeBlockCopyButton } from "@/components/CodeBlock";
import Link from "next/link";

const serverInstallCode = "npm install @zap-tools/sdk zod";
const uiInstallCode = "npm install @zap-tools/ui";
const serverRouteCode = `import { createZapServer } from "@zap-tools/sdk";
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
}`;
const clientHookCode = `import { useZapChat } from "@zap-tools/sdk/client";

const chat = useZapChat({ endpoint: "/api/chat" });`;
const providerCode = `import { ZapProvider, ZapWidget } from "@zap-tools/ui";

export function App() {
  return (
    <ZapProvider chat={chat}>
      <YourApp />
      <ZapWidget />
    </ZapProvider>
  );
}`;
const toolDefCode = `import { tool } from "ai";
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
});`;
const serverConfigCode = `const zap = createZapServer({
  apiKey: process.env.OPENROUTER_API_KEY!,
  model: "openai/gpt-oss-120b:free",  // optional, defaults to this
  maxSteps: 5,                          // optional, defaults to 5
  systemPrompt: "You are a helpful assistant.",
  tools: { weatherTool },
});`;

export default function DocsPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white font-sans">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-5 md:px-12 py-5 md:py-6 border-b border-white/7">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] rounded-lg flex items-center justify-center text-sm font-bold">
            ⚡
          </div>
          <span className="text-lg font-bold tracking-tight">ZapTools</span>
        </Link>
        <ul className="flex gap-4 md:gap-7 list-none text-sm font-medium text-white/45">
          <li>
            <Link href="/docs" className="text-white/90 transition-colors">
              Docs
            </Link>
          </li>
          <li>
            <Link
              href="/examples"
              className="hover:text-white/90 transition-colors"
            >
              Examples
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/Mohammed-Mamoun98/ZapTools" target="_blank" rel="noopener noreferrer"
              className="hover:text-white/90 transition-colors"
            >
              GitHub
            </Link>
          </li>
        </ul>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-12 py-12 md:py-20">
        {/* Header */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">
          Documentation
        </h1>
        <p className="text-white/45 font-mono text-sm mb-14 max-w-lg">
          Everything you need to add an AI chat widget to your React app in
          minutes.
        </p>

        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="text-[#a78bfa]">01</span> Quick Start
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-white/70">
                Install the packages
              </h3>
              <CodeBlock
                code={serverInstallCode}
                language="bash"
                fileName="terminal"
              >
                <CodeBlockCopyButton />
              </CodeBlock>
              <p className="text-[11px] text-white/38 font-mono mt-2">
                If you want the UI widget, also install @zap-tools/ui
              </p>
              <CodeBlock
                code={uiInstallCode}
                language="bash"
                fileName="terminal"
              >
                <CodeBlockCopyButton />
              </CodeBlock>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-white/70">
                Create the server route
              </h3>
              <p className="text-[11px] text-white/38 font-mono mb-3">
                This is your API route. The server holds your API key and tools
                — nothing reaches the browser.
              </p>
              <CodeBlock
                code={serverRouteCode}
                language="ts"
                fileName="app/api/chat/route.ts"
              >
                <CodeBlockCopyButton />
              </CodeBlock>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-white/70">
                Connect the client hook
              </h3>
              <p className="text-[11px] text-white/38 font-mono mb-3">
                Import the client-side hook from the sub-path export to keep
                server code out of your bundle.
              </p>
              <CodeBlock
                code={clientHookCode}
                language="ts"
                fileName="providers.tsx"
              >
                <CodeBlockCopyButton />
              </CodeBlock>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-white/70">
                Add the widget
              </h3>
              <p className="text-[11px] text-white/38 font-mono mb-3">
                Wrap your app with the provider and drop in the floating chat
                widget.
              </p>
              <CodeBlock code={providerCode} language="tsx" fileName="App.tsx">
                <CodeBlockCopyButton />
              </CodeBlock>
            </div>
          </div>
        </section>

        {/* Server Config */}
        <section className="mb-16">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="text-[#a78bfa]">02</span> Server Configuration
          </h2>
          <CodeBlock code={serverConfigCode} language="ts" fileName="route.ts">
            <CodeBlockCopyButton />
          </CodeBlock>
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-white/70">
              ZapServerConfig
            </h3>
            <div className="border border-white/7 rounded-lg overflow-hidden">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-white/7 text-white/45">
                    <th className="text-left px-4 py-2.5">Field</th>
                    <th className="text-left px-4 py-2.5">Type</th>
                    <th className="text-left px-4 py-2.5">Default</th>
                    <th className="text-left px-4 py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="text-white/60">
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-[#a78bfa]">apiKey</td>
                    <td className="px-4 py-2.5">string</td>
                    <td className="px-4 py-2.5">—</td>
                    <td className="px-4 py-2.5">
                      Your OpenRouter API key (server-only)
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-[#a78bfa]">model</td>
                    <td className="px-4 py-2.5">string</td>
                    <td className="px-4 py-2.5">openai/gpt-oss-120b:free</td>
                    <td className="px-4 py-2.5">Any OpenRouter model ID</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-[#a78bfa]">systemPrompt</td>
                    <td className="px-4 py-2.5">string</td>
                    <td className="px-4 py-2.5">—</td>
                    <td className="px-4 py-2.5">System prompt for the AI</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-[#a78bfa]">tools</td>
                    <td className="px-4 py-2.5">
                      Record&lt;string, ZapTool&gt;
                    </td>
                    <td className="px-4 py-2.5">{}</td>
                    <td className="px-4 py-2.5">
                      Tools the AI can call server-side
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-[#a78bfa]">maxSteps</td>
                    <td className="px-4 py-2.5">number</td>
                    <td className="px-4 py-2.5">5</td>
                    <td className="px-4 py-2.5">
                      Max tool-calling loops per request
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Defining Tools */}
        <section className="mb-16">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="text-[#a78bfa]">03</span> Defining Tools
          </h2>
          <p className="text-[11px] text-white/38 font-mono mb-4">
            Tools use the AI SDK <code className="text-[#a78bfa]">tool()</code>{" "}
            helper with Zod schemas. The AI decides when to call them.
          </p>
          <CodeBlock code={toolDefCode} language="ts" fileName="tools.ts">
            <CodeBlockCopyButton />
          </CodeBlock>
          <p className="text-[11px] text-white/38 font-mono mt-4">
            Tools are server-only — the AI calls them on your API route. The
            browser never sees the implementation.
          </p>
        </section>

        {/* Client Hook */}
        <section className="mb-16">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="text-[#a78bfa]">04</span> Client Hook
          </h2>
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-white/70">
              ZapChatConfig
            </h3>
            <div className="border border-white/7 rounded-lg overflow-hidden">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-white/7 text-white/45">
                    <th className="text-left px-4 py-2.5">Field</th>
                    <th className="text-left px-4 py-2.5">Type</th>
                    <th className="text-left px-4 py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="text-white/60">
                  <tr>
                    <td className="px-4 py-2.5 text-[#a78bfa]">endpoint</td>
                    <td className="px-4 py-2.5">string</td>
                    <td className="px-4 py-2.5">
                      URL of your API route (e.g. "/api/chat")
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <h3 className="text-sm font-semibold text-white/70">
              ZapChatState (returned)
            </h3>
            <div className="border border-white/7 rounded-lg overflow-hidden">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-white/7 text-white/45">
                    <th className="text-left px-4 py-2.5">Field</th>
                    <th className="text-left px-4 py-2.5">Type</th>
                    <th className="text-left px-4 py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="text-white/60">
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-[#a78bfa]">messages</td>
                    <td className="px-4 py-2.5">ZapMessage[]</td>
                    <td className="px-4 py-2.5">
                      Chat history (role + content)
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-[#a78bfa]">input</td>
                    <td className="px-4 py-2.5">string</td>
                    <td className="px-4 py-2.5">Current input value</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-[#a78bfa]">setInput</td>
                    <td className="px-4 py-2.5">(input: string) =&gt; void</td>
                    <td className="px-4 py-2.5">Update input value</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-[#a78bfa]">handleSubmit</td>
                    <td className="px-4 py-2.5">(e: FormEvent) =&gt; void</td>
                    <td className="px-4 py-2.5">Submit the message</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-[#a78bfa]">isLoading</td>
                    <td className="px-4 py-2.5">boolean</td>
                    <td className="px-4 py-2.5">AI is generating a response</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-[#a78bfa]">isWaiting</td>
                    <td className="px-4 py-2.5">boolean</td>
                    <td className="px-4 py-2.5">Alias for isLoading</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* UI Components */}
        <section className="mb-16">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="text-[#a78bfa]">05</span> UI Components
          </h2>
          <div className="space-y-4">
            <div className="border border-white/7 rounded-lg p-5">
              <h3 className="text-sm font-bold text-white/80 mb-1">
                {"<ZapProvider chat={...}>"}
              </h3>
              <p className="text-[11px] text-white/38 font-mono">
                Context provider. Pass the chat state from useZapChat and all
                children can access it via useZap().
              </p>
            </div>
            <div className="border border-white/7 rounded-lg p-5">
              <h3 className="text-sm font-bold text-white/80 mb-1">
                {"<ZapWidget />"}
              </h3>
              <p className="text-[11px] text-white/38 font-mono">
                Floating chat bubble. Click to open a chat panel with messages,
                input, and streaming. Zero config — just drop it in.
              </p>
            </div>
            <div className="border border-white/7 rounded-lg p-5">
              <h3 className="text-sm font-bold text-white/80 mb-1">useZap()</h3>
              <p className="text-[11px] text-white/38 font-mono">
                Access the ZapChatState from any component inside ZapProvider.
                Use it to build custom chat UIs.
              </p>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-16">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="text-[#a78bfa]">06</span> Architecture
          </h2>
          <div className="border border-white/7 rounded-lg p-5 space-y-4 text-[11px] text-white/38 font-mono leading-7">
            <div className="flex items-start gap-3">
              <span className="text-[#a78bfa] font-bold shrink-0">1.</span>
              <span>
                <strong className="text-white/60">Browser</strong> — User types
                a message. useZapChat sends it to your API route.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#a78bfa] font-bold shrink-0">2.</span>
              <span>
                <strong className="text-white/60">API Route</strong> —
                createZapServer forwards the message to OpenRouter with your
                system prompt and tools.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#a78bfa] font-bold shrink-0">3.</span>
              <span>
                <strong className="text-white/60">OpenRouter</strong> — The AI
                responds, optionally calling tools. Tool execution happens
                server-side.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#a78bfa] font-bold shrink-0">4.</span>
              <span>
                <strong className="text-white/60">Stream back</strong> — The
                response streams to the browser in real time via the Vercel AI
                SDK.
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
