"use client";

import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { FiGithub, FiExternalLink } from "react-icons/fi";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-card border border-card-border rounded-2xl overflow-hidden transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 flex flex-col h-full"
    >
      {/* Color bar at top */}
      <div className="h-1 bg-gradient-to-r from-accent to-purple-600" />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-heading text-xl font-semibold group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          {project.featured && (
            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full shrink-0 ml-2">
              Featured
            </span>
          )}
        </div>

        <p className="text-muted text-sm leading-relaxed mb-6 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-background px-3 py-1 rounded-full text-muted border border-card-border"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-card-border text-muted hover:border-accent/50 hover:text-foreground transition-all"
          >
            <FiGithub size={15} />
            Code
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-white transition-all font-medium"
            >
              <FiExternalLink size={15} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
