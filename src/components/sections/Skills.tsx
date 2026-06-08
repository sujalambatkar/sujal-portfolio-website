"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

// ─── Layout constants ─────────────────────────────────────────────────────────
const CX = 500, CY = 390;

const COLORS = {
  frontend: "#6366f1",
  backend:  "#10b981",
  genai:    "#a855f7",
  tools:    "#f97316",
};

interface TNode {
  id: string; label: string; x: number; y: number;
  type: "center" | "category" | "skill";
  parent?: string; color: string; delay: number;
}
interface TEdge {
  id: string; from: string; to: string; color: string; delay: number;
}

// ─── Compact fan layout — skills fan like fingers from each category ──────────
const NODES: TNode[] = [
  { id:"center",      label:"Skills",       x:500, y:390, type:"center",   color:"#ffffff",       delay:0.1  },

  // TOP — Frontend, 6 skills arc upward
  { id:"frontend",    label:"Frontend",     x:500, y:272, type:"category", color:COLORS.frontend, delay:0.55 },
  { id:"htmlcss",     label:"HTML/CSS",     x:318, y:175, type:"skill", parent:"frontend", color:COLORS.frontend, delay:1.2  },
  { id:"react",       label:"React",        x:392, y:153, type:"skill", parent:"frontend", color:COLORS.frontend, delay:1.3  },
  { id:"nextjs",      label:"Next.js",      x:463, y:146, type:"skill", parent:"frontend", color:COLORS.frontend, delay:1.4  },
  { id:"javascript",  label:"JavaScript",   x:537, y:146, type:"skill", parent:"frontend", color:COLORS.frontend, delay:1.5  },
  { id:"typescript",  label:"TypeScript",   x:608, y:153, type:"skill", parent:"frontend", color:COLORS.frontend, delay:1.6  },
  { id:"tailwind",    label:"Tailwind",     x:682, y:175, type:"skill", parent:"frontend", color:COLORS.frontend, delay:1.7  },

  // LEFT — Backend, 6 skills arc left (shifted right to keep labels in viewBox)
  { id:"backend",     label:"Backend",      x:340, y:390, type:"category", color:COLORS.backend,  delay:0.70 },
  { id:"python",      label:"Python",       x:210, y:255, type:"skill", parent:"backend",  color:COLORS.backend,  delay:1.30 },
  { id:"nodejs",      label:"Node.js",      x:185, y:315, type:"skill", parent:"backend",  color:COLORS.backend,  delay:1.40 },
  { id:"mongodb",     label:"MongoDB",      x:168, y:380, type:"skill", parent:"backend",  color:COLORS.backend,  delay:1.50 },
  { id:"postgresql",  label:"PostgreSQL",   x:168, y:448, type:"skill", parent:"backend",  color:COLORS.backend,  delay:1.60 },
  { id:"redis",       label:"Redis",        x:185, y:510, type:"skill", parent:"backend",  color:COLORS.backend,  delay:1.70 },
  { id:"fastapi",     label:"FastAPI",      x:215, y:562, type:"skill", parent:"backend",  color:COLORS.backend,  delay:1.80 },

  // RIGHT — GenAI, 5 skills arc right
  { id:"genai",       label:"GenAI",        x:660, y:390, type:"category", color:COLORS.genai,    delay:0.85 },
  { id:"langchain",   label:"LangChain",    x:820, y:278, type:"skill", parent:"genai",    color:COLORS.genai,    delay:1.50 },
  { id:"rag",         label:"RAG",          x:848, y:348, type:"skill", parent:"genai",    color:COLORS.genai,    delay:1.60 },
  { id:"llm",         label:"LLMs",         x:850, y:420, type:"skill", parent:"genai",    color:COLORS.genai,    delay:1.70 },
  { id:"prompteng",   label:"Prompt Eng.",  x:833, y:490, type:"skill", parent:"genai",    color:COLORS.genai,    delay:1.80 },
  { id:"groqhf",      label:"Groq / HF",    x:795, y:550, type:"skill", parent:"genai",    color:COLORS.genai,    delay:1.90 },

  // BOTTOM — Tools, 5 skills arc downward (symmetric around x=500)
  { id:"tools",       label:"Tools",        x:500, y:510, type:"category", color:COLORS.tools,    delay:1.00 },
  { id:"git",         label:"Git",          x:345, y:628, type:"skill", parent:"tools",    color:COLORS.tools,    delay:1.65 },
  { id:"vercel",      label:"Vercel",       x:422, y:648, type:"skill", parent:"tools",    color:COLORS.tools,    delay:1.75 },
  { id:"anthropic",   label:"Claude",       x:500, y:655, type:"skill", parent:"tools",    color:COLORS.tools,    delay:1.85 },
  { id:"chromadb",    label:"ChromaDB",     x:578, y:648, type:"skill", parent:"tools",    color:COLORS.tools,    delay:1.95 },
  { id:"openai",      label:"OpenAI API",   x:655, y:628, type:"skill", parent:"tools",    color:COLORS.tools,    delay:2.05 },
];

const NODE_MAP = new Map(NODES.map(n => [n.id, n]));

const EDGES: TEdge[] = [
  { id:"c-f",  from:"center",   to:"frontend",   color:COLORS.frontend, delay:0.35 },
  { id:"c-b",  from:"center",   to:"backend",    color:COLORS.backend,  delay:0.50 },
  { id:"c-g",  from:"center",   to:"genai",      color:COLORS.genai,    delay:0.65 },
  { id:"c-t",  from:"center",   to:"tools",      color:COLORS.tools,    delay:0.80 },
  // Frontend
  { id:"f-h",  from:"frontend", to:"htmlcss",    color:COLORS.frontend, delay:1.05 },
  { id:"f-r",  from:"frontend", to:"react",      color:COLORS.frontend, delay:1.15 },
  { id:"f-n",  from:"frontend", to:"nextjs",     color:COLORS.frontend, delay:1.25 },
  { id:"f-js", from:"frontend", to:"javascript", color:COLORS.frontend, delay:1.35 },
  { id:"f-ts", from:"frontend", to:"typescript", color:COLORS.frontend, delay:1.45 },
  { id:"f-tw", from:"frontend", to:"tailwind",   color:COLORS.frontend, delay:1.55 },
  // Backend
  { id:"b-py", from:"backend",  to:"python",     color:COLORS.backend,  delay:1.15 },
  { id:"b-nd", from:"backend",  to:"nodejs",     color:COLORS.backend,  delay:1.25 },
  { id:"b-mo", from:"backend",  to:"mongodb",    color:COLORS.backend,  delay:1.35 },
  { id:"b-pg", from:"backend",  to:"postgresql", color:COLORS.backend,  delay:1.45 },
  { id:"b-rd", from:"backend",  to:"redis",      color:COLORS.backend,  delay:1.55 },
  { id:"b-fa", from:"backend",  to:"fastapi",    color:COLORS.backend,  delay:1.65 },
  // GenAI
  { id:"g-lc", from:"genai",    to:"langchain",  color:COLORS.genai,    delay:1.35 },
  { id:"g-rg", from:"genai",    to:"rag",        color:COLORS.genai,    delay:1.45 },
  { id:"g-ll", from:"genai",    to:"llm",        color:COLORS.genai,    delay:1.55 },
  { id:"g-pe", from:"genai",    to:"prompteng",  color:COLORS.genai,    delay:1.65 },
  { id:"g-gh", from:"genai",    to:"groqhf",     color:COLORS.genai,    delay:1.75 },
  // Tools
  { id:"t-gi", from:"tools",    to:"git",        color:COLORS.tools,    delay:1.50 },
  { id:"t-vc", from:"tools",    to:"vercel",     color:COLORS.tools,    delay:1.60 },
  { id:"t-an", from:"tools",    to:"anthropic",  color:COLORS.tools,    delay:1.70 },
  { id:"t-ch", from:"tools",    to:"chromadb",   color:COLORS.tools,    delay:1.80 },
  { id:"t-oa", from:"tools",    to:"openai",     color:COLORS.tools,    delay:1.90 },
];

// ─── Highlight logic ──────────────────────────────────────────────────────────
type HState = "normal" | "highlighted" | "dimmed";

function nodeHState(id: string, hov: string | null): HState {
  if (!hov) return "normal";
  if (id === hov) return "highlighted";
  const h = NODE_MAP.get(hov);
  if (!h) return "normal";
  if (h.type === "center") return "highlighted";
  if (h.type === "category") {
    if (id === "center" || NODE_MAP.get(id)?.parent === hov) return "highlighted";
    return "dimmed";
  }
  if (h.type === "skill") {
    if (id === "center" || id === h.parent) return "highlighted";
    return "dimmed";
  }
  return "dimmed";
}

function edgeHState(e: TEdge, hov: string | null): HState {
  if (!hov) return "normal";
  const h = NODE_MAP.get(hov);
  if (!h) return "normal";
  if (h.type === "center") return "highlighted";
  if (h.type === "category") {
    if ((e.from === "center" && e.to === hov) || e.from === hov) return "highlighted";
    return "dimmed";
  }
  if (h.type === "skill") {
    if ((e.from === "center" && e.to === h.parent) || (e.from === h.parent && e.to === hov))
      return "highlighted";
    return "dimmed";
  }
  return "dimmed";
}

const OPC: Record<HState, number> = { highlighted: 1, normal: 0.75, dimmed: 0.07 };

// Organic branch curve: cubic bezier where both control points follow the
// outward direction from center→category. CP1 leaves the category pointing
// outward; CP2 arrives at the skill from the same axis. Produces smooth,
// natural-looking branches like calligraphy strokes.
function edgePath(from: TNode, to: TNode): string {
  if (from.type === "center" || to.type === "center") {
    return `M ${from.x},${from.y} L ${to.x},${to.y}`;
  }
  const cat   = from.type === "category" ? from : to;
  const skill = from.type === "category" ? to   : from;

  // Unit vector pointing outward from center through this category
  const dx = cat.x - CX, dy = cat.y - CY;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ox = dx / len, oy = dy / len;

  const t = 72; // tension — controls how pronounced the curve is
  const cp1x = cat.x   + ox * t;
  const cp1y = cat.y   + oy * t;
  const cp2x = skill.x - ox * t;
  const cp2y = skill.y - oy * t;

  return `M ${from.x},${from.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${to.x},${to.y}`;
}

// Dynamically compute label offset direction from parent → skill node
function skillLabelOffset(node: TNode): { dx: number; dy: number; anchor: "middle" | "start" | "end" } {
  if (!node.parent) return { dx: 0, dy: 0, anchor: "middle" };
  const par = NODE_MAP.get(node.parent)!;
  const ddx = node.x - par.x, ddy = node.y - par.y;
  const len = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
  const nx = ddx / len, ny = ddy / len;
  const r = 11, gap = 9;
  if (Math.abs(nx) >= Math.abs(ny)) {
    return nx > 0
      ? { dx: r + gap,      dy: 4, anchor: "start" }
      : { dx: -(r + gap),   dy: 4, anchor: "end"   };
  }
  return ny < 0
    ? { dx: 0, dy: -(r + gap + 2),      anchor: "middle" }
    : { dx: 0, dy:   r + gap + 12,      anchor: "middle" };
}

// ─── Single node component (owns "appeared" state to remove appear delay) ─────
function NodeItem({
  node, hovered, inView, onHover,
}: {
  node: TNode; hovered: string | null; inView: boolean;
  onHover: (id: string | null) => void;
}) {
  const [appeared, setAppeared] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setAppeared(true), (node.delay + 0.6) * 1000);
    return () => clearTimeout(t);
  }, [inView, node.delay]);

  const st  = nodeHState(node.id, hovered);
  const opc = OPC[st];
  const r   = node.type === "center" ? 32 : node.type === "category" ? 22 : 11;
  const lp  = skillLabelOffset(node);

  // Fast transition after initial appear; slow staggered only during reveal
  const tr = appeared
    ? { opacity: { duration: 0.15 }, scale: { type: "spring" as const, stiffness: 320, damping: 22 } }
    : { opacity: { duration: 0.4, delay: node.delay }, scale: { type: "spring" as const, stiffness: 260, damping: 18, delay: node.delay } };

  return (
    <motion.g
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: inView ? opc : 0,
        scale:   inView ? (st === "highlighted" ? 1.18 : 1) : 0,
      }}
      transition={tr}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer"
    >
      {/* Expanding pulse ring when highlighted */}
      {st === "highlighted" && (
        <motion.circle
          cx={node.x} cy={node.y} r={r}
          fill="none" stroke={node.color} strokeWidth={1.2}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Outer halo ring */}
      <circle
        cx={node.x} cy={node.y} r={r + 6}
        fill="none"
        stroke={node.color}
        strokeWidth={0.6}
        opacity={st === "highlighted" ? 0.35 : 0.1}
      />

      {/* Main circle */}
      <circle
        cx={node.x} cy={node.y} r={r}
        fill={node.color}
        fillOpacity={st === "highlighted" ? 0.2 : 0.08}
        stroke={node.color}
        strokeWidth={st === "highlighted" ? 2 : 1.2}
        filter={st === "highlighted" ? "url(#node-glow)" : undefined}
      />

      {/* Tiny center dot for skill nodes */}
      {node.type === "skill" && (
        <circle cx={node.x} cy={node.y} r={3} fill={node.color} opacity={0.9} />
      )}

      {/* Center label — inside circle */}
      {node.type === "center" && (
        <text
          x={node.x} y={node.y}
          textAnchor="middle" dominantBaseline="middle"
          fill="#ffffff" fontSize={11} fontWeight="bold"
          fontFamily="Space Grotesk, sans-serif"
          style={{ pointerEvents: "none" }}
        >
          {node.label}
        </text>
      )}

      {/* Category label — bold text outside the circle, in outward direction */}
      {node.type === "category" && (() => {
        // Position label outward from center
        const dx = node.x - CX, dy = node.y - CY;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / len, ny = dy / len;
        const offset = r + 22;
        const lx = node.x + nx * offset;
        const ly = node.y + ny * offset;
        const anchor = Math.abs(nx) > 0.5
          ? (nx > 0 ? "start" : "end")
          : "middle";
        return (
          <>
            {/* Small icon dot inside circle */}
            <circle cx={node.x} cy={node.y} r={4} fill={node.color} opacity={0.9} />
            {/* Readable label — dark stroke behind text knocks out any edges */}
            <text
              x={lx} y={ly}
              textAnchor={anchor} dominantBaseline="middle"
              fill={node.color}
              fontSize={14}
              fontWeight="800"
              fontFamily="Space Grotesk, sans-serif"
              stroke="#09090b"
              strokeWidth={5}
              strokeLinejoin="round"
              paintOrder="stroke"
              style={{ pointerEvents: "none" }}
              filter={st === "highlighted" ? "url(#node-glow)" : undefined}
            >
              {node.label}
            </text>
          </>
        );
      })()}

      {/* Label outside circle for skill nodes */}
      {node.type === "skill" && (
        <text
          x={node.x + lp.dx}
          y={node.y + lp.dy}
          textAnchor={lp.anchor}
          dominantBaseline="middle"
          fill={st === "highlighted" ? node.color : "#d4d4d8"}
          fontSize={10}
          fontFamily="Inter, sans-serif"
          stroke="#09090b"
          strokeWidth={3}
          strokeLinejoin="round"
          paintOrder="stroke"
          style={{ pointerEvents: "none" }}
        >
          {node.label}
        </text>
      )}
    </motion.g>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Ambient orbs */}
      <motion.div
        className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-accent/10 blur-[80px] pointer-events-none"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-72 h-72 rounded-full bg-purple-600/10 blur-[80px] pointer-events-none"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeading
          label="Skills"
          title="What I Work With"
          subtitle="My technology universe — hover a node to explore"
        />

        <div ref={ref} className="overflow-x-auto pb-4 -mx-4 px-4">
          <div style={{ minWidth: 700 }}>
            <svg viewBox="100 110 800 570" className="w-full h-auto select-none" style={{ overflow: "visible" }}>
              <defs>
                <filter id="node-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Sonar rings from center */}
              {[0, 1, 2].map(i => (
                <motion.circle
                  key={i}
                  cx={500} cy={390}
                  fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={1}
                  initial={{ r: 30, opacity: 0.5 }}
                  animate={{ r: 220, opacity: 0 }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.15, ease: "easeOut" }}
                />
              ))}

              {/* Edges */}
              {EDGES.map(e => {
                const from = NODE_MAP.get(e.from)!;
                const to   = NODE_MAP.get(e.to)!;
                const st   = edgeHState(e, hovered);
                return (
                  <motion.path
                    key={e.id}
                    d={edgePath(from, to)}
                    stroke={e.color}
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView
                      ? { pathLength: 1, opacity: OPC[st], strokeWidth: st === "highlighted" ? 2 : 1.2 }
                      : { pathLength: 0, opacity: 0 }
                    }
                    transition={{
                      pathLength:  { duration: 0.7, delay: e.delay, ease: "easeInOut" },
                      opacity:     { duration: 0.2 },
                      strokeWidth: { duration: 0.2 },
                    }}
                  />
                );
              })}

              {/* Nodes */}
              {NODES.map(node => (
                <NodeItem
                  key={node.id}
                  node={node}
                  hovered={hovered}
                  inView={inView}
                  onHover={setHovered}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
