export interface ExperienceItem {
  id: string;
  type: "work" | "education";
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export const experience: ExperienceItem[] = [
  {
    id: "exp-1",
    type: "work",
    title: "Backend & GenAI Application Developer Intern",
    organization: "Grok Learning Pvt Ltd.",
    location: "Mumbai",
    startDate: "Jan 2026",
    endDate: "Apr 2026",
    description: [
      "Built an end-to-end Student Performance Report System serving 50+ schools and 30,000+ students across multiple organizations using Next.js, FastAPI, PostgreSQL, and LLM integration.",
      "Reduced report generation time from hours of manual work to under 60 seconds per student.",
      "Automated bulk data import via Excel upload, cutting admin data entry time by ~90%.",
      "Designed hierarchical role-based access ensuring zero data leakage between schools.",
    ],
  },
  {
    id: "exp-2",
    type: "education",
    title: "B.Tech in Computer Engineering",
    organization: "Pillai College of Engineering",
    location: "Panvel",
    startDate: "Aug 2022",
    endDate: "May 2026",
    description: [
      "Specialized in AI/ML and full-stack development with a focus on Generative AI systems.",
      "Built multiple production-grade projects: multi-agent LLM pipelines, RAG platforms, and FastAPI backends.",
    ],
  },
  {
    id: "exp-3",
    type: "education",
    title: "CBSE — Higher Secondary",
    organization: "New Horizon Public School",
    location: "Panvel",
    startDate: "Jun 2020",
    endDate: "Jun 2022",
    description: [
      "Completed higher secondary education with a focus on Science (PCM + Computer Science).",
    ],
  },
];
