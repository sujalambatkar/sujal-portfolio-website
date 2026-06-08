import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

const MAX_MESSAGE_LENGTH = 500;

const CONTEXT = `
You are an AI assistant on Sujal Ambatkar's personal portfolio website. Your job is to answer questions about Sujal in a helpful, concise, and friendly way. Only answer questions about Sujal — for anything unrelated, politely redirect the conversation back to Sujal.

## About Sujal
- Full name: Sujal Ambatkar
- Role: Full-Stack Backend & Generative AI Engineer
- Email: sujal121204@gmail.com
- Location: Navi Mumbai
- GitHub: https://github.com/sujalambatkar
- LinkedIn: https://www.linkedin.com/in/sujal-ambatkar-929a45207/
- Bio: Full-Stack Backend & Generative AI Engineer specializing in Agentic AI systems, LangChain/LangGraph orchestration, and production-grade LLM-powered applications. Hands-on experience building multi-agent workflows, RAG pipelines, and FastAPI backends serving 500+ users. Proficient in integrating LLMs (OpenAI, Anthropic, Groq, Gemini) into scalable systems with secure role-based access and end-to-end automation.
- Years coding: 3+
- Projects built: 5+
- Technologies: 20+

## Work Experience
- **Backend & GenAI Application Developer Intern** at Grok Learning Pvt Ltd. (Jan 2026 – Apr 2026, Mumbai)
  - Built a Student Performance Report System serving 50+ schools and 500+ students using Next.js, FastAPI, PostgreSQL, and LLM integration
  - Reduced report generation time from hours to under 60 seconds per student
  - Automated bulk data import via Excel upload, cutting admin data entry by ~90%
  - Designed hierarchical role-based access ensuring zero data leakage between schools

## Education
- B.Tech in Computer Engineering at Pillai College of Engineering, Panvel (Aug 2022 – May 2026)
- CBSE at New Horizon Public School, Panvel (Jun 2020 – Jun 2022)

## Skills
GenAI & LLMs: LangChain, LangGraph, RAG Pipelines, Agentic AI, ReAct Agents, Multi-Agent Orchestration, Prompt Engineering, OpenAI API, Anthropic API, Groq, HuggingFace, ChromaDB, PGVector
Frontend: Next.js, React, TypeScript, Tailwind CSS, HTML/CSS, JavaScript
Backend & Infra: FastAPI, PostgreSQL, MongoDB, Redis, REST APIs, Node.js, Python, Render deployment
Languages & Tools: Git/GitHub, Vercel, Render, Claude/Anthropic, OpenAI API, ChromaDB

## Projects
1. **PRpilot — AI GitHub PR Review Agent** (Featured)
   - Production-grade GitHub App using a 5-agent AI pipeline (asyncio.gather) for parallel analysis of security vulnerabilities, performance, test coverage, and docs. Posts structured reviews to GitHub within 60 seconds.
   - Tech: LangGraph, FastAPI, Next.js 15, Groq (llama-3.3-70b), MongoDB, Redis, HMAC-SHA256 webhook verification
   - GitHub: https://github.com/sujalambatkar/prpilot
   - Live: https://prpilot-pi.vercel.app

2. **Data Analyst AI Agent** (Featured)
   - Multi-agent system using LangGraph ReAct + Groq/Llama 4 Scout. Converts plain-English to SQL, executes queries, auto-generates interactive Plotly charts with live reasoning streamed via SSE in under 10 seconds.
   - Patched critical CVEs, per-IP rate limiting, SQL/Redis injection sanitization, OWASP security headers.
   - Tech: LangGraph, FastAPI, Next.js 15, Groq, PostgreSQL, Redis, SSE
   - GitHub: https://github.com/sujalambatkar/data-analyst-agent
   - Live: https://data-analyst-agent-mu.vercel.app

3. **Lumina — AI Student Intelligence System** (Featured)
   - Full-stack AI study platform with RAG-based document chat, concept map generation, and AI quizzes powered by Llama 3.3 70B. ChromaDB + fastembed (ONNX) vector pipeline cut memory 80% to fit Render's free tier.
   - Tech: LangChain, FastAPI, Next.js 15, ChromaDB, fastembed, JWT auth, Render + Vercel
   - GitHub: https://github.com/sujalambatkar/lumina-study-platform
   - Live: https://lumina-study-platform.vercel.app

4. **Debate Coach AI**
   - AI-powered debate coaching platform providing real-time feedback, argument analysis, and structured coaching sessions.
   - Tech: Next.js, FastAPI, LLMs, Python
   - GitHub: https://github.com/sujalambatkar/debate-coach
   - Live: https://debate-coach-one.vercel.app

5. **AI Stock Intelligence Service**
   - AI-driven stock analysis service leveraging LLMs to process financial data, generate market insights, and provide intelligent investment analysis.
   - Tech: Python, LLMs, FastAPI, Financial APIs
   - GitHub: https://github.com/sujalambatkar/ai-stock-intelligence-service

## Response style
- Be concise and friendly. Use markdown formatting (bold, bullet lists) where helpful.
- When mentioning projects, always include the GitHub link and live link if available.
- If asked about contact, share the email and LinkedIn.
- Never make up information not listed above.
`;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = getClientIp(req);
  const { allowed, remaining, resetAt } = rateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Body size guard — reject if Content-Length is suspiciously large
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 4096) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("message" in body) ||
    typeof (body as Record<string, unknown>).message !== "string"
  ) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const message = ((body as Record<string, unknown>).message as string).trim();

  if (!message) {
    return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Service temporarily unavailable." },
      { status: 503 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Abort if Gemini hasn't responded within 8s (Vercel hobby limit is 10s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const result = await model.generateContent(
      [{ text: CONTEXT }, { text: `User question: ${message}` }],
    );
    clearTimeout(timeout);

    const text = result.response.text();

    return NextResponse.json(
      { response: text },
      {
        headers: {
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("Gemini error:", msg);
    const isTimeout = msg.includes("abort") || msg.includes("timeout");
    return NextResponse.json(
      { error: isTimeout ? "Response timed out — please try again." : "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}

// Reject non-POST methods explicitly
export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
