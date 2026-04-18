"use client";

import { BotIcon, SendIcon, XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useZap } from "./context";

function TypingIndicator() {
  return (
    <div className="typing">
      <span />
      <span />
      <span />
    </div>
  );
}

function Message({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";

  return (
    <div className={`msg ${isUser ? "user" : "ai"}`}>
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
  const { messages, input, setInput, handleSubmit, isLoading } = useZap();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <>
      <style>{`
        .typing {
          display: flex;
          gap: 4px;
          padding: 10px 14px;
        }
        .typing span {
          width: 6px;
          height: 6px;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
          0%, 60%, 100% { opacity: 0.2; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
        .msg-bubble {
          padding: 9px 13px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.65;
          font-family: 'Syne', sans-serif;
          letter-spacing: -0.1px;
        }
        .msg.user .msg-bubble {
          background: rgba(124,58,237,0.12);
          border: 0.5px solid rgba(124,58,237,0.22);
          color: rgba(255,255,255,0.88);
        }
        .msg.ai .msg-bubble {
          background: rgba(255,255,255,0.035);
          border: 0.5px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.72);
        }
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 14px;
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
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
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .chat-name {
          font-size: 13px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
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
                <div className="status-dot" /> online · zap-tools/sdk
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
              key={`${msg.role}-${idx}`}
              role={msg.role}
              content={msg.content}
            />
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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
