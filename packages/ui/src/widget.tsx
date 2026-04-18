"use client";

import { useState } from "react";
import { ChatPanel } from "./chat-panel";

export function ZapWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{`
        .chat-widget-toggle {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 28px rgba(124,58,237,0.45);
          transition: all 0.2s;
          z-index: 1000;
          border: none;
        }
        .chat-widget-toggle:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 36px rgba(124,58,237,0.6);
        }
        .chat-widget-toggle svg {
          width: 22px;
          height: 22px;
        }

        .chat-widget-panel {
          position: fixed;
          bottom: 92px;
          right: 28px;
          width: 340px;
          background: #111118;
          border: 0.5px solid rgba(255,255,255,0.1);
          border-radius: 18px;
          overflow: hidden;
          z-index: 999;
          display: flex;
          flex-direction: column;
          transform-origin: bottom right;
          transform: scale(0.9) translateY(12px);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.18s ease;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(124,58,237,0.15);
        }
        .chat-widget-panel.open {
          transform: scale(1) translateY(0);
          opacity: 1;
          pointer-events: all;
        }
      `}</style>

      <div className={`chat-widget-panel ${isOpen ? "open" : ""}`}>
        <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="chat-widget-toggle"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </>
  );
}
