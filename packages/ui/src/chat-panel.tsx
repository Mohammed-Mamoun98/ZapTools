"use client";

import type { ChatStreamChunk } from "@zap-tools/sdk";
import { BotIcon, SendIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useZap } from "./context";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  toolName?: string;
}

function TypingIndicator() {
  return (
    <div className="typing">
      <span/>
      <span/>
      <span/>
    </div>
  );
}

function ToolBadge({ toolName }: { toolName: string }) {
  return (
    <div className="tool-badge">
      <div className="tool-dot"/>
      calling {toolName}
    </div>
  );
}

function Message({ role, content, toolName }: MessageProps) {
  const isUser = role === "user";

  return (
    <div className={`msg ${isUser ? "user" : "ai"}`}>
      {toolName && <ToolBadge toolName={toolName} />}
      <div className="msg-bubble">{content}</div>
    </div>
  );
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function ChatPanel({ isOpen, onClose, className }: ChatPanelProps) {
  const { client } = useZap();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; toolName?: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !client) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const stream = client.chat([
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage },
      ]);

      let assistantContent = "";
      let currentToolName: string | undefined;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", toolName: undefined },
      ]);

      for await (const chunk of stream) {
        const streamChunk = chunk as ChatStreamChunk;

        switch (streamChunk.type) {
          case "text": {
            assistantContent += streamChunk.content;
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: "assistant", content: assistantContent, toolName: currentToolName },
            ]);
            break;
          }
          case "tool_call": {
            currentToolName = streamChunk.toolName;
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: "assistant", content: assistantContent, toolName: currentToolName },
            ]);
            break;
          }
          case "tool_result": {
            currentToolName = undefined;
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: "assistant", content: assistantContent, toolName: undefined },
            ]);
            break;
          }
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${errorMessage}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.28; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        .typing {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 11px 13px;
          background: rgba(255,255,255,0.04);
          border-radius: 13px;
          border-bottom-left-radius: 4px;
          width: fit-content;
        }
        .typing span {
          width: 5px;
          height: 5px;
          background: rgba(255,255,255,0.28);
          border-radius: 50%;
          animation: bounce 1.2s infinite;
        }
        .typing span:nth-child(2) { animation-delay: 0.15s; }
        .typing span:nth-child(3) { animation-delay: 0.3s; }
        .msg-bubble {
          padding: 9px 13px;
          border-radius: 13px;
          font-size: 13px;
          line-height: 1.55;
        }
        .msg.ai .msg-bubble {
          background: rgba(255,255,255,0.055);
          border: 0.5px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.82);
          border-bottom-left-radius: 4px;
        }
        .msg.user .msg-bubble {
          background: rgba(124,58,237,0.22);
          border: 0.5px solid rgba(124,58,237,0.32);
          color: #c4b5fd;
          border-bottom-right-radius: 4px;
        }
        .tool-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(99,102,241,0.1);
          border: 0.5px solid rgba(99,102,241,0.28);
          padding: 3px 9px;
          border-radius: 5px;
          font-size: 10px;
          font-family: 'DM Mono', monospace;
          color: #818cf8;
          margin-bottom: 4px;
        }
        .tool-dot {
          width: 5px;
          height: 5px;
          background: #818cf8;
          border-radius: 50%;
          animation: pulse 1.2s infinite;
        }
        .message-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .message-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .message-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 3px;
        }
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 0.5px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
        }
        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .chat-avatar {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }
        .chat-name {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.2px;
        }
        .chat-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          font-family: 'DM Mono', monospace;
          margin-top: 1px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        .close-btn {
          width: 26px;
          height: 26px;
          background: rgba(255,255,255,0.05);
          border: none;
          border-radius: 7px;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          transition: all 0.15s;
          font-family: 'Syne', sans-serif;
        }
        .close-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .chat-messages {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 220px;
          max-height: 300px;
          overflow-y: auto;
        }
        .msg {
          display: flex;
          flex-direction: column;
          max-width: 85%;
          gap: 4px;
        }
        .msg.user {
          align-self: flex-end;
          align-items: flex-end;
        }
        .msg.ai {
          align-self: flex-start;
        }
        .chat-input-area {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          border-top: 0.5px solid rgba(255,255,255,0.06);
        }
        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.09);
          border-radius: 9px;
          padding: 9px 13px;
          font-size: 13px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          outline: none;
          transition: border-color 0.15s;
        }
        .chat-input::placeholder {
          color: rgba(255,255,255,0.18);
        }
        .chat-input:focus {
          border-color: rgba(124,58,237,0.48);
        }
        .send-btn {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border: none;
          border-radius: 9px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .send-btn:hover {
          transform: scale(1.06);
        }
        .send-btn svg {
          width: 14px;
          height: 14px;
        }
        .powered {
          text-align: center;
          font-size: 10px;
          font-family: 'DM Mono', monospace;
          color: rgba(255,255,255,0.13);
          padding: 7px;
          border-top: 0.5px solid rgba(255,255,255,0.04);
        }
        .powered span {
          color: rgba(124,58,237,0.55);
        }
      `}</style>
      <div ref={chatPanelRef} className={className}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-avatar">⚡</div>
            <div>
              <div className="chat-name">Zap Assistant</div>
              <div className="chat-status">
                <div className="status-dot"/> online · zap-tools/sdk
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="close-btn"
            aria-label="Close chat"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages message-scrollbar">
          {messages.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>
                Hi there! How can I help you today?
              </p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <Message
              key={`${msg}-m`}
              role={msg.role}
              content={msg.content}
              toolName={msg.toolName}
            />
          ))}
          {isLoading && (
            <div className="msg ai">
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            className="chat-input"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
            disabled={!input.trim() || isLoading}
            className="send-btn"
            aria-label="Send message"
          >
            <SendIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Footer */}
        <div className="powered">
          powered by <span>@zap-tools/sdk</span> + OpenRouter
        </div>
      </div>
    </>
  );
}

export { useZap };
