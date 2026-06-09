"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { FiSend, FiUser, FiCpu, FiLoader } from "react-icons/fi";

const PRESET_QUESTIONS = [
  "What projects has Sujal built?",
  "What are Sujal's GenAI skills?",
  "Tell me about Sujal's background",
  "What tech stack does Sujal use?",
  "How can I contact Sujal?",
  "What is Sujal's education?",
];

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

function MarkdownText({ text }: { text: string }) {
  // Minimal markdown: bold, links, bullet lists, line breaks
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        // Bullet list
        if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-accent mt-1 shrink-0">•</span>
              <span>{renderInline(line.trim().slice(2))}</span>
            </div>
          );
        }
        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Handle **bold**, [text](url), and bare https:// URLs
  const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((https?:\/\/[^\)]+)\)|(https?:\/\/[^\s,)]+))/g;
  let last = 0;
  let match;
  let idx = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[0].startsWith("**")) {
      parts.push(<strong key={idx++} className="text-white font-semibold">{match[2]}</strong>);
    } else if (match[0].startsWith("[")) {
      parts.push(
        <a key={idx++} href={match[4]} target="_blank" rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors">
          {match[3]}
        </a>
      );
    } else {
      // bare URL
      parts.push(
        <a key={idx++} href={match[5]} target="_blank" rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors break-all">
          {match[5]}
        </a>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function AskMe() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content:
        "Hi! I'm Sujal's AI assistant. Ask me anything about his projects, skills, background, or how to get in touch. 👋",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: idRef.current++, role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      let res: Response | null = null;
      let data: { response?: string; error?: string } = {};

      // Auto-retry once on failure
      for (let attempt = 0; attempt < 2; attempt++) {
        res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
        data = await res.json();
        if (res.ok) break;
        if (attempt === 0) await new Promise((r) => setTimeout(r, 1500));
      }

      const reply = res?.ok
        ? (data.response ?? "Sorry, something went wrong.")
        : (data.error ?? "Sorry, something went wrong.");
      setMessages((m) => [...m, { id: idRef.current++, role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: idRef.current++, role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="ask" className="py-24 relative overflow-hidden">
      {/* Ambient orbs */}
      <motion.div
        className="absolute top-1/4 -right-24 w-72 h-72 rounded-full bg-accent/10 blur-[80px] pointer-events-none"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -left-24 w-64 h-64 rounded-full bg-purple-600/10 blur-[80px] pointer-events-none"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <SectionHeading
          label="Ask AI"
          title="Ask About Sujal"
          subtitle="Powered by Gemini — ask anything about projects, skills, or background"
        />

        {/* Preset question chips */}
        <motion.div
          className="flex flex-wrap gap-2 mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {PRESET_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-card-border hover:border-accent hover:text-accent text-muted transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </motion.div>

        {/* Chat window */}
        <motion.div
          className="rounded-2xl border border-card-border bg-card/40 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Messages */}
          <div ref={chatContainerRef} className="h-80 overflow-y-auto p-5 space-y-4 scrollbar-thin">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                      msg.role === "user"
                        ? "bg-accent/20 text-accent"
                        : "bg-purple-600/20 text-purple-400"
                    }`}
                  >
                    {msg.role === "user" ? <FiUser size={14} /> : <FiCpu size={14} />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent/15 text-foreground rounded-tr-sm"
                        : "bg-white/5 text-muted rounded-tl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <MarkdownText text={msg.content} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-600/20 text-purple-400">
                    <FiCpu size={14} />
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                    <FiLoader size={14} className="animate-spin text-muted" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="border-t border-card-border p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Ask anything about Sujal…"
                disabled={loading}
                maxLength={500}
                className="flex-1 bg-white/5 border border-card-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-accent hover:bg-accent/80 flex items-center justify-center text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <FiSend size={15} />
              </button>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted/60 mt-4">
          Powered by Google Gemini 1.5 Flash · Answers are AI-generated
        </p>
      </div>
    </section>
  );
}
