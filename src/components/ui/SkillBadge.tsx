"use client";

import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import type { Skill } from "@/data/skills";

function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v) + "%";
      },
    });
    return controls.stop;
  }, [inView, value]);

  return (
    <span
      ref={ref}
      className="text-xs font-bold tabular-nums text-accent"
    >
      0%
    </span>
  );
}

export default function SkillBadge({
  skill,
  index = 0,
}: {
  skill: Skill;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="space-y-2 group/skill"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground group-hover/skill:text-accent transition-colors duration-300">
          {skill.name}
        </span>
        <AnimatedCounter value={skill.proficiency} />
      </div>

      {/* Track */}
      <div className="relative h-2 bg-background rounded-full overflow-hidden">
        {/* Glow behind bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full blur-sm opacity-60 bg-gradient-to-r from-accent to-purple-500"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: index * 0.07 + 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        />
        {/* Main bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent via-accent-light to-purple-500"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: index * 0.07 + 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
            initial={{ x: "-100%" }}
            whileInView={{ x: "200%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.07 + 1.3, ease: "easeInOut" }}
          />
        </motion.div>
        {/* Tip glow dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_2px_rgba(99,102,241,0.9)]"
          initial={{ left: "0%" }}
          whileInView={{ left: `calc(${skill.proficiency}% - 6px)` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: index * 0.07 + 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
    </motion.div>
  );
}
