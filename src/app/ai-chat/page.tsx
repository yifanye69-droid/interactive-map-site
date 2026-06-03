"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const presetQuestions = [
  {
    question: "贵州赛马都是怎么训练的？",
    gif: "/贵州赛马都是怎么训练的.GIF",
  },
  {
    question: "水族拦门酒度数？",
    gif: "/水族拦门酒度数.GIF",
  },
  {
    question: "水族端节放几天？",
    gif: "/水族端节放几天.GIF",
  },
  {
    question: "马尾绣是怎么绣的？",
    gif: "/马尾绣是怎么绣的.GIF",
  },
  {
    question: "水族的音乐有哪些？",
    gif: "/水族的音乐有哪些.GIF",
  },
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/doubao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "抱歉，出现了错误，请稍后再试。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetQuestion = async (question: string) => {
    if (isLoading) return;
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/doubao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "抱歉，出现了错误，请稍后再试。" }]);
    } finally {
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
    <div className="ai-chat-page">
      <div className="ai-chat-page-header">
        <Link href="/" className="ai-chat-back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回地图
        </Link>
        <div className="ai-chat-page-title">
          <img src="/ai/bee.gif" alt="bee" className="ai-chat-page-gif" />
          <h1>马bee AI助手</h1>
        </div>
      </div>

      <div className="ai-chat-page-messages">
        {messages.length === 0 && (
          <>
            <div className="ai-chat-page-welcome">
              <p>你好！我是马bee AI助手，可以为你解答水族相关知识。</p>
            </div>
            <div className="ai-chat-page-presets">
              {presetQuestions.map((item, index) => (
                <motion.button
                  key={index}
                  className="ai-chat-page-preset-card"
                  onClick={() => handlePresetQuestion(item.question)}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img src={item.gif} alt={item.question} className="ai-chat-page-preset-gif" />
                  <span className="ai-chat-page-preset-text">{item.question}</span>
                </motion.button>
              ))}
            </div>
          </>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`ai-chat-page-message ai-chat-page-message--${msg.role}`}
          >
            <div className="ai-chat-page-message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="ai-chat-page-message ai-chat-page-message--assistant">
            <div className="ai-chat-page-message-content ai-chat-page-loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-page-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="询问水族相关知识..."
          rows={3}
          className="ai-chat-page-textarea"
        />
        <button
          className="ai-chat-page-send"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <svg className="ai-chat-page-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
