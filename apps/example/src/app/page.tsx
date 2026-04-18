import Link from "next/link";
import { CodeBlock, CodeBlockCopyButton } from "@/components/CodeBlock";

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
  clientTools: ['alert'],
})
export POST = (req) => zap.handleRequest(req)

// Client — providers.tsx
const chat = useZapChat({
  endpoint: '/api/chat',
  clientTools: {
    alert: tool({ execute: ({ msg }) => alert(msg) }),
  },
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
        <nav className="relative z-10 flex items-center justify-between px-12 py-6 border-b border-white/7">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] rounded-lg flex items-center justify-center text-sm font-bold">
              ⚡
            </div>
            <span className="text-lg font-bold tracking-tight">ZapTools</span>
          </div>
          <ul className="flex gap-7 list-none text-sm font-medium text-white/45">
            <li>
              <Link href="#" className="hover:text-white/90 transition-colors">
                Docs
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white/90 transition-colors">
                Examples
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white/90 transition-colors">
                GitHub
              </Link>
            </li>
          </ul>
          <button
            type="button"
            className="px-4 py-2 rounded-md text-sm font-semibold transition-all hover:bg-[#7c3aed]/25 border border-white/10 hover:border-[#7c3aed]/45 bg-[#7c3aed]/12 text-[#a78bfa] font-mono tracking-tight"
          >
            npm install @zap-tools/sdk
          </button>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 max-w-[680px] px-12 py-[90px] pb-16">
          <div className="inline-flex items-center gap-2.5 bg-[#7c3aed]/10 border border-[#7c3aed]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#a78bfa] mb-7 tracking-widest uppercase animate-fade-in">
            <div className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full animate-pulse" />
            SDK — Open Beta
          </div>
          <h1 className="text-6xl font-extrabold leading-[1.02] tracking-tighter mb-6">
            Drop-in AI chat
            <br />
            for your{" "}
            <span className="bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] bg-clip-text text-transparent">
              React app
            </span>
          </h1>
          <p className="text-base leading-8 text-white/45 max-w-[420px] font-mono">
            Server-side key. Client-side tools. Full streaming. Built on Vercel AI SDK and
            OpenRouter.
          </p>
          <div className="flex gap-3 mt-9">
            <button
              type="button"
              className="flex items-center gap-1 bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-6 py-3 rounded-md text-sm font-semibold text-white hover:opacity-88 hover:-translate-y-0.5 transition-all"
            >
              Get started <span className="font-[Syne]">→</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-5.5 py-3 rounded-md text-sm font-semibold border border-white/10 text-white/45 hover:border-white/22 hover:text-white/80 transition-all"
            >
              View on GitHub
            </button>
          </div>
        </section>

        {/* Code Block Section */}
        <div className="relative z-10 px-12 py-1 border-t border-white/5">
          <div className="text-xs font-bold tracking-widest uppercase text-white/20 mb-6">
            How it works
          </div>
          <CodeBlock code={codeExample} language="tsx" fileName="page.tsx">
            <CodeBlockCopyButton />
          </CodeBlock>
        </div>

        {/* Features Section */}
        <div className="relative z-10 grid grid-cols-3 gap-px border-t border-white/5 mt-14">
          <div className="bg-[#0a0a0f] p-8 transition-colors hover:bg-white/2">
            <div className="w-9.5 h-9.5 mb-4 rounded-lg flex items-center justify-center bg-[#7c3aed]/10 text-xs">
              🔌
            </div>
            <h3 className="text-xs font-bold mb-2.5">Tool-aware AI</h3>
            <p className="text-[11px] leading-7 text-white/38 font-mono">
              Split tools between server and client. The AI calls them automatically, up to
              maxSteps loops.
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
              API key never touches the browser. Secure by default, no proxy needed.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
