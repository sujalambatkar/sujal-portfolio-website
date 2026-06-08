"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({
  label,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      <span className="text-accent font-medium text-sm uppercase tracking-widest">
        {label}
      </span>
      <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2">
        {title}
      </h2>
      {subtitle && <p className="text-muted mt-3 max-w-2xl mx-auto">{subtitle}</p>}
    </motion.div>
  );
}
