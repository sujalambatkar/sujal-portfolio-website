"use client";

import { useState, useEffect } from "react";
import { navLinks } from "@/data/personal";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
      {/* Glassy pill container */}
      <nav
        className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(9,9,11,0.65)"
            : "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: scrolled
            ? "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 2px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm text-muted hover:text-foreground hover:bg-white/8 px-4 py-1.5 rounded-full transition-all duration-200"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Mobile toggle — top right */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center text-foreground transition-all"
        style={{
          background: "rgba(9,9,11,0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-background/95 backdrop-blur-md z-40 flex items-center justify-center">
          <ul className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-2xl font-heading text-muted hover:text-foreground transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
