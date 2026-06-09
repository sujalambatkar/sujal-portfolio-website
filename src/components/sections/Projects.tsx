"use client";

import { projects } from "@/data/projects";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import ProjectCard from "@/components/ui/ProjectCard";
import { motion } from "framer-motion";

export default function Projects() {
  const sorted = [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured)
  );
  const featured = sorted.filter((p) => p.featured);
  const rest = sorted.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Animated heading */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
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
            <span className="text-accent font-medium text-sm uppercase tracking-widest">Projects</span>
            <motion.span
              className="h-px bg-accent/50"
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              className="font-heading text-3xl md:text-5xl font-bold"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}
            >
              {["What", "I've", "Built"].map((word) => (
                <motion.span
                  key={word}
                  className="inline-block mr-[0.25em] last:mr-0"
                  variants={{
                    hidden:  { y: "110%", opacity: 0 },
                    visible: { y: "0%",   opacity: 1 },
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  style={
                    word === "Built"
                      ? { background: "linear-gradient(135deg, #6366f1, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
                      : {}
                  }
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
          </div>

          <motion.p
            className="text-muted mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            A selection of projects that showcase my skills and experience
          </motion.p>
        </motion.div>

        {/* Gradient border container */}
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
            {/* Ambient mesh */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 15% 15%, rgba(99,102,241,0.08) 0%, transparent 55%), " +
                  "radial-gradient(ellipse at 85% 85%, rgba(168,85,247,0.08) 0%, transparent 55%)",
              }}
            />

            <div className="relative p-6 md:p-8">
              {/* Featured projects */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((project, i) => (
                  <AnimateOnScroll key={project.id} delay={i * 0.1}>
                    <ProjectCard project={project} />
                  </AnimateOnScroll>
                ))}
              </div>

              {/* Non-featured projects */}
              {rest.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
                  {rest.map((project, i) => (
                    <AnimateOnScroll key={project.id} delay={i * 0.1}>
                      <ProjectCard project={project} />
                    </AnimateOnScroll>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
