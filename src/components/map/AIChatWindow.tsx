"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/doubao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message || "抱歉，我无法处理您的请求。",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error("AI API error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "抱歉，发生了错误，请稍后再试。",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="ai-chat-mobile-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "展开AI助手" : "收起AI助手"}
      >
        <img src="/ai/bee.gif" alt="bee" className="ai-chat-mobile-toggle__gif" />
        <span className="ai-chat-mobile-toggle__text">马bee AI</span>
        <svg
          className={`ai-chat-mobile-toggle__icon ${isCollapsed ? "ai-chat-mobile-toggle__icon--collapsed" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="ai-chat-window"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="ai-chat-header"
              onClick={() => setIsCollapsed(true)}
            >
              <div className="ai-chat-title">
                <img src="/ai/bee.gif" alt="bee" className="ai-chat-gif" />
                <h3>马bee AI助手</h3>
              </div>
              <div className="ai-chat-header-actions">
                <Link href="/ai-chat" className="ai-chat-expand" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="ai-chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`ai-chat-message ai-chat-message--${msg.role}`}
                >
                  <div className="ai-chat-message-content">{msg.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="ai-chat-message ai-chat-message--assistant">
                  <div className="ai-chat-message-content ai-chat-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="ai-chat-input">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="询问水族相关知识..."
                rows={5}
                className="ai-chat-textarea"
              />
              <button
                className="ai-chat-send"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                <svg className="ai-chat-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
