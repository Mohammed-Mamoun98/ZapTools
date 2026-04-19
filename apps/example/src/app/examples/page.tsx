import { CodeBlock, CodeBlockCopyButton } from "@/components/CodeBlock";
import Link from "next/link";

// ─── Customer Support Bot ────────────────────────────────────────────────────

const supportServerCode = `import { createZapServer } from "@zap-tools/sdk";
import { tool } from "ai";
import { z } from "zod";

const zap = createZapServer({
  apiKey: process.env.OPENROUTER_API_KEY!,
  systemPrompt: "You are a customer support agent. Help users with order issues, refunds, and ticket status. Always verify the order ID before taking action.",
  tools: {
    lookupTicket: tool({
      description: "Look up a support ticket by ID",
      parameters: z.object({
        ticketId: z.string().describe("The ticket ID, e.g. TK-1234"),
      }),
      execute: async ({ ticketId }) => {
        const ticket = await db.tickets.findById(ticketId);
        return ticket ?? { error: "Ticket not found" };
      },
    }),
    issueRefund: tool({
      description: "Issue a refund for an order",
      parameters: z.object({
        orderId: z.string().describe("The order ID to refund"),
        amount: z.number().describe("Refund amount in cents"),
        reason: z.string().describe("Reason for the refund"),
      }),
      execute: async ({ orderId, amount, reason }) => {
        const refund = await payments.refund(orderId, amount, reason);
        return { refundId: refund.id, status: refund.status };
      },
    }),
  },
});

export async function POST(req: Request) {
  return zap.handleRequest(req);
}`;

const supportClientCode = `import { useZapChat } from "@zap-tools/sdk/client";
import { ZapProvider, ZapWidget } from "@zap-tools/ui";

// Hook — app/providers.tsx
const chat = useZapChat({ endpoint: "/api/chat" });

// App — app/layout.tsx
export function App() {
  return (
    <ZapProvider chat={chat}>
      <Dashboard />
      <ZapWidget />
    </ZapProvider>
  );
}`;

// ─── Data Explorer ────────────────────────────────────────────────────────────

const dataServerCode = `import { createZapServer } from "@zap-tools/sdk";
import { tool } from "ai";
import { z } from "zod";

const zap = createZapServer({
  apiKey: process.env.OPENROUTER_API_KEY!,
  systemPrompt: "You are a data analyst. Users will ask questions about their data. Generate safe read-only SQL queries and present results clearly.",
  tools: {
    runQuery: tool({
      description: "Run a read-only SQL query against the analytics database",
      parameters: z.object({
        sql: z.string().describe("The SQL query to execute (SELECT only)"),
      }),
      execute: async ({ sql }) => {
        if (!sql.trim().toUpperCase().startsWith("SELECT")) {
          return { error: "Only SELECT queries are allowed" };
        }
        const result = await analyticsDb.query(sql);
        return { rows: result.rows, count: result.rowCount };
      },
    }),
  },
});

export async function POST(req: Request) {
  return zap.handleRequest(req);
}`;

const dataClientCode = `import { useZapChat } from "@zap-tools/sdk/client";
import { ZapProvider, useZap } from "@zap-tools/ui";

// Hook — app/providers.tsx
const chat = useZapChat({ endpoint: "/api/chat" });

// Custom chart panel instead of ZapWidget
function ChartPanel() {
  const { messages, input, setInput, handleSubmit, isLoading } = useZap();

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : ""}>
            {/* Render chart components for tool results */}
            <DataRenderer content={msg.content} />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your data..."
          className="flex-1 bg-transparent outline-none"
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}

export function App() {
  return (
    <ZapProvider chat={chat}>
      <ChartPanel />
    </ZapProvider>
  );
}`;

// ─── Docs Chat ────────────────────────────────────────────────────────────────

const docsServerCode = `import { createZapServer } from "@zap-tools/sdk";
import { tool } from "ai";
import { z } from "zod";

const zap = createZapServer({
  apiKey: process.env.OPENROUTER_API_KEY!,
  systemPrompt: "You are a documentation assistant. Help users find relevant docs and always cite your sources with links.",
  tools: {
    searchDocs: tool({
      description: "Search the documentation for relevant pages",
      parameters: z.object({
        query: z.string().describe("The search query"),
        section: z.string().optional().describe("Optional section filter, e.g. 'api', 'ui', 'sdk'"),
      }),
      execute: async ({ query, section }) => {
        const results = await docsIndex.search(query, { section });
        return results.map((r) => ({
          title: r.title,
          url: r.url,
          snippet: r.content.slice(0, 200),
        }));
      },
    }),
    citeSource: tool({
      description: "Cite a documentation source with a direct link",
      parameters: z.object({
        title: z.string().describe("Title of the doc page"),
        url: z.string().describe("Full URL to the documentation page"),
        snippet: z.string().describe("Relevant excerpt from the page"),
      }),
      execute: async ({ title, url, snippet }) => {
        return { title, url, snippet, citedAt: new Date().toISOString() };
      },
    }),
  },
});

export async function POST(req: Request) {
  return zap.handleRequest(req);
}`;

const docsClientCode = `import { useZapChat } from "@zap-tools/sdk/client";
import { ZapProvider, ZapWidget } from "@zap-tools/ui";

// Hook — app/providers.tsx
const chat = useZapChat({ endpoint: "/api/chat" });

// App — app/layout.tsx
export function App() {
  return (
    <ZapProvider chat={chat}>
      <DocsLayout />
      <ZapWidget />
    </ZapProvider>
  );
}`;

const examples = [
  {
    title: "Customer Support Bot",
    emoji: "🤖",
    description:
      "Give agents an AI assistant that looks up tickets and issues refunds — all through structured tool calls.",
    serverCode: supportServerCode,
    serverFile: "app/api/chat/route.ts",
    clientCode: supportClientCode,
    clientFile: "app/providers.tsx",
  },
  {
    title: "Data Explorer",
    emoji: "📊",
    description:
      "Non-technical users ask questions in plain English. The AI generates safe SQL and renders results in a custom chart panel.",
    serverCode: dataServerCode,
    serverFile: "app/api/chat/route.ts",
    clientCode: dataClientCode,
    clientFile: "app/providers.tsx",
  },
  {
    title: "Docs Chat",
    emoji: "📚",
    description:
      "Index your docs and let users ask questions. Tools search, retrieve sections, and cite sources with links.",
    serverCode: docsServerCode,
    serverFile: "app/api/chat/route.ts",
    clientCode: docsClientCode,
    clientFile: "app/providers.tsx",
  },
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white font-sans overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Glow Orb */}
      <div className="fixed w-[500px] h-[500px] top-[-100px] right-[15%] z-0 pointer-events-none">
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
            <Link href="/examples" className="text-white/90 transition-colors">
              Examples
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/Mohammed-Mamoun98/ZapTools"
              target="_blank"
              rel="noopener noreferrer"
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

      {/* Header */}
      <section className="relative z-10 max-w-[720px] px-5 md:px-12 py-14 md:py-[90px] pb-10 md:pb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.02] tracking-tighter mb-6">
          Real-world{" "}
          <span className="bg-gradient-to-r from-[#a78bfa] to-[#60a5fa] bg-clip-text text-transparent">
            examples
          </span>
        </h1>
        <p className="text-base leading-8 text-white/45 max-w-[480px] font-mono">
          Copy-paste server routes and client hooks for common ZapTools setups.
          Each example is a complete, working integration.
        </p>
      </section>

      {/* Examples */}
      <div className="relative z-10 px-5 md:px-12 pb-20 space-y-16 md:space-y-24">
        {examples.map((example, i) => (
          <section key={example.title}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{example.emoji}</span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                {example.title}
              </h2>
            </div>
            <p className="text-[11px] leading-7 text-white/38 font-mono max-w-[520px] mb-8">
              {example.description}
            </p>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold tracking-widest uppercase text-white/20 mb-3">
                  Server
                </div>
                <CodeBlock
                  code={example.serverCode}
                  language="ts"
                  fileName={example.serverFile}
                >
                  <CodeBlockCopyButton />
                </CodeBlock>
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest uppercase text-white/20 mb-3">
                  Client
                </div>
                <CodeBlock
                  code={example.clientCode}
                  language="tsx"
                  fileName={example.clientFile}
                >
                  <CodeBlockCopyButton />
                </CodeBlock>
              </div>
            </div>

            {i < examples.length - 1 && (
              <div className="border-t border-white/7 mt-16 md:mt-24" />
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
