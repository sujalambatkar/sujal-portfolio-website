"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "@/data/personal";
import { FiGithub } from "react-icons/fi";

function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy);
      const spacing = 32;

      for (let x = spacing / 2; x < w; x += spacing) {
        for (let y = spacing / 2; y < h; y += spacing) {
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          // t = 1 at center, 0 at ~65% of max distance
          const t = Math.max(0, 1 - dist / (maxDist * 0.65));
          if (t <= 0) continue;
          const radius = 0.4 + t * 1.8;   // 0.4px edge → 2.2px center
          const alpha  = 0.12 + t * 0.55; // 0.12 edge  → 0.67 center
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99,102,241,${alpha})`;
          ctx.fill();
        }
      }
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Background layers ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        {/* 1. Dot grid — large at center, shrinks toward edges */}
        <DotGrid />

        {/* 2. Slow aurora band sweeping diagonally */}
        <motion.div
          className="absolute -inset-[50%] opacity-[0.07]"
          style={{
            background:
              "conic-gradient(from 200deg at 50% 60%, #6366f1, #a855f7, #3b82f6, #6366f1)",
            filter: "blur(60px)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        {/* 3. Gradient blobs (existing, slightly more vivid) */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent/25 blur-[100px]"
          animate={{ x: [0, 50, -30, 0], y: [0, -40, 30, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-purple-600/25 blur-[100px]"
          animate={{ x: [0, -50, 30, 0], y: [0, 30, -40, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full bg-blue-600/20 blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 4. Bottom edge fade to blend into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--background))",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-accent font-medium mb-4"
        >
          Hello, I&apos;m
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-foreground via-accent-light to-accent bg-clip-text text-transparent">
            {personalInfo.name}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10"
        >
          {personalInfo.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href="#projects"
            className="px-8 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-full transition-all hover:shadow-lg hover:shadow-accent/25"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-card-border hover:border-accent text-foreground font-medium rounded-full transition-all"
          >
            Contact Me
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-6"
        >
          {personalInfo.socialLinks.github && (
            <a
              href={personalInfo.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <FiGithub size={22} />
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
