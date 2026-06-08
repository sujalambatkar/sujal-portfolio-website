"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  // Dot follows instantly
  const dotX = useSpring(rawX, { stiffness: 1000, damping: 50 });
  const dotY = useSpring(rawY, { stiffness: 1000, damping: 50 });

  // Bubble follows with lag
  const bubbleX = useSpring(rawX, { stiffness: 120, damping: 22 });
  const bubbleY = useSpring(rawY, { stiffness: 120, damping: 22 });

  const trailsRef = useRef<{ x: number; y: number; id: number }[]>([]);
  const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailIdRef = useRef(0);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.style.cursor = "none";

    let lastTrailTime = 0;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);

      const now = Date.now();
      if (now - lastTrailTime > 40) {
        lastTrailTime = now;
        const id = trailIdRef.current++;
        trailsRef.current = [
          ...trailsRef.current.slice(-6),
          { x: e.clientX, y: e.clientY, id },
        ];
        setTrails([...trailsRef.current]);
        setTimeout(() => {
          trailsRef.current = trailsRef.current.filter((t) => t.id !== id);
          setTrails([...trailsRef.current]);
        }, 400);
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onHoverStart = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (
        el.closest("a, button, [role='button'], input, textarea, select, label")
      ) {
        setHovering(true);
      }
    };
    const onHoverEnd = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (
        el.closest("a, button, [role='button'], input, textarea, select, label")
      ) {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onHoverStart);
    document.addEventListener("mouseout", onHoverEnd);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onHoverStart);
      document.removeEventListener("mouseout", onHoverEnd);
    };
  }, [rawX, rawY]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {/* Trails */}
      {trails.map((trail) => (
        <motion.div
          key={trail.id}
          className="absolute rounded-full bg-accent/30"
          style={{
            left: trail.x,
            top: trail.y,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ width: 10, height: 10, opacity: 0.5, scale: 1 }}
          animate={{ width: 4, height: 4, opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      ))}

      {/* Outer bubble */}
      <motion.div
        className="absolute rounded-full border border-accent/60"
        style={{
          left: bubbleX,
          top: bubbleY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hovering ? 56 : clicking ? 28 : 38,
          height: hovering ? 56 : clicking ? 28 : 38,
          opacity: visible ? 1 : 0,
          backgroundColor: hovering
            ? "rgba(99,102,241,0.12)"
            : clicking
            ? "rgba(99,102,241,0.2)"
            : "transparent",
          boxShadow: hovering
            ? "0 0 18px 4px rgba(99,102,241,0.25)"
            : clicking
            ? "0 0 10px 2px rgba(99,102,241,0.4)"
            : "0 0 8px 1px rgba(99,102,241,0.1)",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
      />

      {/* Inner dot */}
      <motion.div
        className="absolute rounded-full bg-accent"
        style={{
          left: dotX,
          top: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hovering ? 6 : clicking ? 10 : 6,
          height: hovering ? 6 : clicking ? 10 : 6,
          opacity: visible ? (hovering ? 0.5 : 1) : 0,
          boxShadow: "0 0 6px 2px rgba(99,102,241,0.7)",
          scale: clicking ? 0.6 : 1,
        }}
        transition={{ type: "spring", stiffness: 600, damping: 28 }}
      />
    </div>
  );
}
