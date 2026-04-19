import { CodeBlock, CodeBlockCopyButton } from "@/components/CodeBlock";
import Link from "next/link";

const codeExample = `import { createZapServer } from '@zap-tools/sdk'
import { useZapChat } from '@zap-tools/sdk'
import { ZapProvider, ZapWidget } from '@zap-tools/ui'

// Server — app/api/chat/route.ts
const zap = createZapServer({
  apiKey: process.env.OPENROUTER_API_KEY,
  systemPrompt: 'You are a helpful assistant.',
  tools: {
    getUserEmail: tool({
      description: 'Get the current user email',
      execute: () => user.email,
    }),
  },
})
export POST = (req) => zap.handleRequest(req)

// Client — providers.tsx
const chat = useZapChat({
  endpoint: '/api/chat',
})

export App = () => (
  <ZapProvider chat={chat}>
    <YourApp />
    <ZapWidget />
  </ZapProvider>
)`;

export default function Home() {
  return (
    <>
      <div className="min-h-screen w-full bg-[#0a0a0f] text-white overflow-hidden font-sans">
        {/* Grid Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        {/* Glow Orb */}
        <div className="fixed w-[500px] h-[500px] top[-100px] right-[15%] z-0 pointer-events-none">
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_70%)]" />
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
              <Link
                href="/docs"
                className="hover:text-white/90 transition-colors"
              >
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
          <button
            type="button"
            className="hidden sm:block px-4 py-2 rounded-md text-sm font-semibold transition-all hover:bg-[#7c3aed]/25 border border-white/10 hover:border-[#7c3aed]/45 bg-[#7c3aed]/12 text-[#a78bfa] font-mono tracking-tight"
          >
            npm install @zap-tools/sdk
          </button>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 max-w-[680px] px-5 md:px-12 py-14 md:py-[90px] pb-10 md:pb-16">
          <div className="inline-flex items-center gap-2.5 bg-[#7c3aed]/10 border border-[#7c3aed]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#a78bfa] mb-7 tracking-widest uppercase animate-fade-in">
            <div className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full animate-pulse" />
            SDK — Open Beta
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.02] tracking-tighter mb-6">
            Drop-in AI chat
            <br />
            for your{" "}
            <span className="bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] bg-clip-text text-transparent">
              React app
            </span>
          </h1>
          <p className="text-base leading-8 text-white/45 max-w-[420px] font-mono">
            Server-side key. Client-side tools. Full streaming. Built on Vercel
            AI SDK and OpenRouter.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-9">
            <button
              type="button"
              className="flex items-center gap-1 bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-6 py-3 rounded-md text-sm font-semibold text-white hover:opacity-88 hover:-translate-y-0.5 transition-all"
            >
              Get started <span className="font-[Syne]">→</span>
            </button>
            <a
              href="https://github.com/Mohammed-Mamoun98/ZapTools" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 px-5.5 py-3 rounded-md text-sm font-semibold border border-white/10 text-white/45 hover:border-white/22 hover:text-white/80 transition-all"
            >
              View on GitHub
            </a>
          </div>
        </section>

        {/* Code Block Section */}
        <div className="relative z-10 px-5 md:px-12 py-1 border-t border-white/5">
          <div className="text-xs font-bold tracking-widest uppercase text-white/20 mb-6">
            How it works
          </div>
          <CodeBlock code={codeExample} language="tsx" fileName="page.tsx">
            <CodeBlockCopyButton />
          </CodeBlock>
        </div>

        {/* Use Cases Section */}
        <div className="relative z-10 border-t border-white/5 mt-10 md:mt-14 px-5 md:px-12 py-10 md:py-14">
          <div className="text-xs font-bold tracking-widest uppercase text-white/20 mb-10">
            Use cases
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-8 md:gap-y-10 max-w-[720px]">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-base">🤖</span>
                <h3 className="text-sm font-bold">Customer support copilot</h3>
              </div>
              <p className="text-[11px] leading-7 text-white/38 font-mono">
                Give agents an AI assistant that can look up orders, issue
                refunds, and escalate tickets — all through tool calls.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-base">🛠️</span>
                <h3 className="text-sm font-bold">
                  Internal tooling assistant
                </h3>
              </div>
              <p className="text-[11px] leading-7 text-white/38 font-mono">
                Let engineers query dashboards, restart services, or search logs
                via natural language instead of memorizing CLI flags.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-base">📚</span>
                <h3 className="text-sm font-bold">Docs &amp; knowledge chat</h3>
              </div>
              <p className="text-[11px] leading-7 text-white/38 font-mono">
                Index your docs and let users ask questions. Tools can search,
                retrieve sections, and cite sources automatically.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-base">📊</span>
                <h3 className="text-sm font-bold">Data exploration</h3>
              </div>
              <p className="text-[11px] leading-7 text-white/38 font-mono">
                Non-technical users ask questions in plain English. The AI
                generates queries, runs them, and presents results as charts or
                tables.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-base">🧩</span>
                <h3 className="text-sm font-bold">SaaS feature add-on</h3>
              </div>
              <p className="text-[11px] leading-7 text-white/38 font-mono">
                Drop a conversational interface into any SaaS product. Server
                tools access your API; the widget renders in minutes.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-base">🎮</span>
                <h3 className="text-sm font-bold">Interactive storytelling</h3>
              </div>
              <p className="text-[11px] leading-7 text-white/38 font-mono">
                Build AI-driven narratives where tools control game state,
                inventory, and world events based on player input.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-px border-t border-white/5 mt-10 md:mt-14">
          <div className="bg-[#0a0a0f] p-8 transition-colors hover:bg-white/2">
            <div className="w-9.5 h-9.5 mb-4 rounded-lg flex items-center justify-center bg-[#7c3aed]/10 text-xs">
              🔌
            </div>
            <h3 className="text-xs font-bold mb-2.5">Tool-aware AI</h3>
            <p className="text-[11px] leading-7 text-white/38 font-mono">
              Split tools between server and client. The AI calls them
              automatically, up to maxSteps loops.
            </p>
          </div>
          <div className="bg-[#0a0a0f] p-8 transition-colors hover:bg-white/2">
            <div className="w-9.5 h-9.5 mb-4 rounded-lg flex items-center justify-center bg-[#6366f1]/10 text-xs">
              ⚡
            </div>
            <h3 className="text-xs font-bold mb-2.5">Streaming first</h3>
            <p className="text-[11px] leading-7 text-white/38 font-mono">
              Vercel AI SDK powers real-time text streaming — responses feel
              instant.
            </p>
          </div>
          <div className="bg-[#0a0a0f] p-8 transition-colors hover:bg-white/2">
            <div className="w-9.5 h-9.5 mb-4 rounded-lg flex items-center justify-center bg-[#60a5fa]/8 text-xs">
              🔐
            </div>
            <h3 className="text-xs font-bold mb-2.5">Key stays server-side</h3>
            <p className="text-[11px] leading-7 text-white/38 font-mono">
              API key never touches the browser. Secure by default, no proxy
              needed.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
