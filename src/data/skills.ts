export interface Skill {
  name: string;
  category: "frontend" | "backend" | "tools" | "languages";
  proficiency: number;
}

export const skills: Skill[] = [
  // GenAI & LLMs
  { name: "LangChain / LangGraph", category: "languages", proficiency: 88 },
  { name: "RAG Pipelines", category: "languages", proficiency: 85 },
  { name: "Agentic AI / ReAct", category: "languages", proficiency: 85 },
  { name: "Prompt Engineering", category: "languages", proficiency: 90 },
  { name: "OpenAI / Anthropic API", category: "languages", proficiency: 88 },
  { name: "Groq / HuggingFace", category: "languages", proficiency: 82 },
  { name: "ChromaDB / PGVector", category: "languages", proficiency: 78 },
  // Frontend
  { name: "Next.js", category: "frontend", proficiency: 88 },
  { name: "React", category: "frontend", proficiency: 85 },
  { name: "JavaScript", category: "frontend", proficiency: 90 },
  { name: "TypeScript", category: "frontend", proficiency: 80 },
  { name: "Tailwind CSS", category: "frontend", proficiency: 88 },
  { name: "HTML / CSS", category: "frontend", proficiency: 92 },
  // Backend & Infra
  { name: "FastAPI", category: "backend", proficiency: 88 },
  { name: "PostgreSQL", category: "backend", proficiency: 80 },
  { name: "MongoDB", category: "backend", proficiency: 78 },
  { name: "Redis", category: "backend", proficiency: 75 },
  { name: "REST APIs", category: "backend", proficiency: 88 },
  { name: "Node.js", category: "backend", proficiency: 78 },
  // Languages & Tools
  { name: "Python", category: "tools", proficiency: 90 },
  { name: "Git / GitHub", category: "tools", proficiency: 85 },
  { name: "Render / Vercel", category: "tools", proficiency: 82 },
];

export const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend & Infra",
  languages: "GenAI & LLMs",
  tools: "Languages & Tools",
};
