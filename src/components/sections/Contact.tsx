"use client";

import { personalInfo } from "@/data/personal";
import { motion } from "framer-motion";
import { FiMail, FiGithub, FiLinkedin, FiArrowUpRight } from "react-icons/fi";

const LINKS = [
  {
    icon: FiMail,
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    color: "#6366f1",
  },
  {
    icon: FiGithub,
    label: "GitHub",
    value: "github.com/sujalambatkar",
    href: personalInfo.socialLinks.github,
    color: "#a855f7",
  },
  {
    icon: FiLinkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/sujal-ambatkar",
    href: personalInfo.socialLinks.linkedin,
    color: "#818cf8",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="max-w-3xl mx-auto px-6">

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
            <span className="text-accent font-medium text-sm uppercase tracking-widest">Contact</span>
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
              {["Get", "In", "Touch"].map((word) => (
                <motion.span
                  key={word}
                  className="inline-block mr-[0.25em] last:mr-0"
                  variants={{
                    hidden:  { y: "110%", opacity: 0 },
                    visible: { y: "0%",   opacity: 1 },
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  style={
                    word === "Touch"
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
            className="text-muted mt-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            I&apos;m always open to new opportunities and collaborations.
          </motion.p>
        </motion.div>

        {/* Pulsing gradient border card */}
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
                  "radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.10) 0%, transparent 55%), " +
                  "radial-gradient(ellipse at 90% 90%, rgba(168,85,247,0.10) 0%, transparent 55%)",
              }}
            />

            <div className="relative p-8 md:p-12">
              <motion.p
                className="text-muted text-base leading-relaxed mb-10 text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Have a project in mind or just want to say hello? Pick a channel below.
              </motion.p>

              {/* Link cards — staggered entrance */}
              <motion.div
                className="flex flex-col gap-3 max-w-sm mx-auto w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
              >
                {LINKS.map(({ icon: Icon, label, value, href, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={label !== "Email" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    variants={{
                      hidden:  { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="group flex items-center gap-4 bg-white/[0.02] border border-white/8 hover:border-accent/50 rounded-2xl px-5 py-4 transition-colors"
                  >
                    <motion.div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
                      whileHover={{ scale: 1.1, backgroundColor: `${color}30` }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon size={18} style={{ color }} />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted uppercase tracking-wider">{label}</p>
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                        {value}
                      </p>
                    </div>

                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      initial={{ rotate: 0 }}
                      whileHover={{ rotate: 45 }}
                    >
                      <FiArrowUpRight size={16} className="text-accent" />
                    </motion.div>
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
