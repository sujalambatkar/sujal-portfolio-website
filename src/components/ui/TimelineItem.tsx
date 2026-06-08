"use client";

import { motion } from "framer-motion";
import type { ExperienceItem } from "@/data/experience";
import { FiBriefcase, FiBookOpen } from "react-icons/fi";

export default function TimelineItem({ item }: { item: ExperienceItem }) {
  const Icon = item.type === "work" ? FiBriefcase : FiBookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="relative pl-10 pb-12 last:pb-0"
    >
      {/* Vertical line */}
      <div className="absolute left-[11px] top-6 bottom-0 w-px bg-card-border last:hidden" />

      {/* Dot */}
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
        <Icon size={12} className="text-accent" />
      </div>

      {/* Content */}
      <div className="bg-card border border-card-border rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <h3 className="font-heading font-semibold text-lg">{item.title}</h3>
          <span className="text-xs text-accent mt-1 sm:mt-0">
            {item.startDate} — {item.endDate}
          </span>
        </div>
        <p className="text-muted text-sm mb-3">
          {item.organization}
          {item.location && ` · ${item.location}`}
        </p>
        <ul className="space-y-1.5">
          {item.description.map((desc, i) => (
            <li key={i} className="text-sm text-muted flex gap-2">
              <span className="text-accent mt-1.5 shrink-0">&#8226;</span>
              {desc}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
