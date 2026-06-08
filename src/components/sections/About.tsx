"use client";

import { personalInfo } from "@/data/personal";
import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const FOCUS_AREAS = [
  "Agentic AI",
  "LangGraph / LangChain",
  "RAG Pipelines",
  "FastAPI",
  "Multi-Agent Systems",
  "Next.js 15",
  "LLM Integration",
  "Vector Databases",
];

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [inView, to]);

  return <span ref={ref}>{display}{suffix}</span>;
}

const STATS = [
  { to: 5,   suffix: "+", label: "Projects Built"  },
  { to: 500, suffix: "+", label: "Users Served"    },
  { to: 3,   suffix: "+", label: "Years Coding"    },
];

export default function About() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Animated section heading */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Label with expanding line */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.1 } } }}
          >
            <motion.span
              className="h-px bg-accent/50"
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <span className="text-accent font-medium text-sm uppercase tracking-widest">About Me</span>
            <motion.span
              className="h-px bg-accent/50"
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </motion.div>

          {/* Title — each word slides up */}
          <div className="overflow-hidden">
            <motion.h2
              className="font-heading text-3xl md:text-5xl font-bold"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}
            >
              {["Get", "To", "Know", "Me"].map((word) => (
                <motion.span
                  key={word}
                  className="inline-block mr-[0.25em] last:mr-0"
                  variants={{
                    hidden:   { y: "110%", opacity: 0 },
                    visible:  { y: "0%",   opacity: 1 },
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  style={
                    word === "Know"
                      ? { background: "linear-gradient(135deg, #6366f1, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
                      : {}
                  }
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
          </div>
        </motion.div>

        {/* Animated gradient border via pulsing box-shadow on a gradient wrapper */}
        <motion.div
          className="relative rounded-3xl p-[1px]"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #6366f1 100%)" }}
          animate={{
            boxShadow: [
              "0 0 22px 2px rgba(99,102,241,0.25)",
              "0 0 52px 8px rgba(168,85,247,0.40)",
              "0 0 22px 2px rgba(99,102,241,0.25)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative bg-background rounded-3xl overflow-hidden">
            {/* Ambient mesh inside card */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 15% 15%, rgba(99,102,241,0.12) 0%, transparent 55%), " +
                  "radial-gradient(ellipse at 85% 85%, rgba(168,85,247,0.12) 0%, transparent 55%)",
              }}
            />

            <div className="relative p-8 md:p-12">

              {/* Role badge with pulsing dot */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-7"
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-accent bg-accent/10 border border-accent/25 rounded-full px-4 py-1.5">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-accent inline-block"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  Full-Stack Backend &amp; Generative AI Engineer
                </span>
              </motion.div>

              {/* Bio */}
              <motion.p
                className="text-foreground/80 text-lg md:text-xl leading-relaxed mb-10 max-w-3xl"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {personalInfo.bio}
              </motion.p>

              {/* Stats with count-up */}
              <motion.div
                className="grid grid-cols-3 gap-4 mb-10"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {STATS.map((s) => (
                  <motion.div
                    key={s.label}
                    className="text-center rounded-2xl border border-white/5 bg-white/[0.02] py-5 px-2"
                    whileHover={{ borderColor: "rgba(99,102,241,0.35)", backgroundColor: "rgba(99,102,241,0.05)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-3xl md:text-4xl font-bold font-heading text-accent tabular-nums">
                      <Counter to={s.to} suffix={s.suffix} />
                    </p>
                    <p className="text-xs text-muted mt-1.5 uppercase tracking-widest">{s.label}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Divider */}
              <div className="border-t border-white/5 mb-8" />

              {/* Focus chips — staggered wave entrance */}
              <motion.div
                className="flex flex-wrap gap-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
              >
                {FOCUS_AREAS.map((area) => (
                  <motion.span
                    key={area}
                    variants={{
                      hidden:   { opacity: 0, scale: 0.75, y: 12 },
                      visible:  { opacity: 1, scale: 1,    y: 0  },
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    whileHover={{ scale: 1.07, borderColor: "rgba(99,102,241,0.6)", color: "#6366f1" }}
                    className="text-sm text-muted border border-white/10 rounded-full px-3.5 py-1 cursor-default transition-colors"
                  >
                    {area}
                  </motion.span>
                ))}
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
