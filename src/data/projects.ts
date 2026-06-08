export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "PRpilot — AI GitHub PR Review Agent",
    description:
      "Production-grade GitHub App that auto-reviews pull requests using a 5-agent AI pipeline running in parallel via asyncio.gather. Analyzes security vulnerabilities, performance bottlenecks, test coverage gaps, and documentation issues, posting structured reviews to GitHub within 60 seconds.",
    tags: ["LangGraph", "FastAPI", "Next.js 15", "Groq", "MongoDB", "Redis"],
    githubUrl: "https://github.com/sujalambatkar/prpilot",
    liveUrl: "https://prpilot-pi.vercel.app",
    featured: true,
  },
  {
    id: "project-2",
    title: "Data Analyst AI Agent",
    description:
      "Multi-agent AI system using LangGraph ReAct orchestration + Groq/Llama 4 Scout that converts plain-English questions into SQL, executes queries, and auto-generates interactive Plotly charts with live reasoning streamed via SSE in under 10 seconds.",
    tags: ["LangGraph", "FastAPI", "Next.js 15", "Groq", "PostgreSQL", "Redis", "SSE"],
    githubUrl: "https://github.com/sujalambatkar/data-analyst-agent",
    liveUrl: "https://data-analyst-agent-mu.vercel.app",
    featured: true,
  },
  {
    id: "project-3",
    title: "Lumina — AI Student Intelligence System",
    description:
      "Full-stack AI study platform featuring RAG-based document chat, concept map generation, and AI quizzes powered by Llama 3.3 70B. Built with a vector search pipeline using ChromaDB and fastembed (ONNX), cutting memory usage 80% to meet cloud deployment constraints.",
    tags: ["LangChain", "FastAPI", "Next.js 15", "ChromaDB", "RAG", "Llama 3.3"],
    githubUrl: "https://github.com/sujalambatkar/lumina-study-platform",
    liveUrl: "https://lumina-study-platform.vercel.app",
    featured: true,
  },
  {
    id: "project-4",
    title: "Debate Coach AI",
    description:
      "AI-powered debate coaching platform that provides real-time feedback, argument analysis, and structured coaching sessions to help users build stronger argumentation and public speaking skills.",
    tags: ["Next.js", "FastAPI", "LLMs", "Python"],
    githubUrl: "https://github.com/sujalambatkar/debate-coach",
    liveUrl: "https://debate-coach-one.vercel.app",
    featured: false,
  },
  {
    id: "project-5",
    title: "AI Stock Intelligence Service",
    description:
      "AI-driven stock analysis service that leverages LLMs to process financial data, generate market insights, and provide intelligent investment analysis with automated report generation.",
    tags: ["Python", "LLMs", "FastAPI", "Financial APIs"],
    githubUrl: "https://github.com/sujalambatkar/ai-stock-intelligence-service",
    featured: false,
  },
];
