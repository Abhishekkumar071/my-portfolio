import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

import {
  GitBranch, CircleUser, Mail, MapPin, Code2,
  Brain, Wrench, Terminal, ChevronDown, Download, Menu, X,
  Trophy, Star, Zap, Server, BookOpen, Award
} from "lucide-react";

// Portfolio facts are kept together so resume updates stay consistent across sections.
const DATA = {
  name: "Abhishek Kumar",
  title: "Backend Engineer",
  subtitle: "Java · Spring Boot · AI systems",
  summary: "Computer Science undergraduate focused on dependable backends and useful AI applications. I build secure REST APIs, transaction-aware services, and LLM workflows with structured outputs, retrieval, and tests.",
  location: "Greater Noida, India",
  email: "aksinghbgp1230@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/abhishek-kumar-416134301/",
    github: "https://github.com/Abhishekkumar071",
    leetcode: "https://leetcode.com/u/Abhishek670/",
    codeforces: "https://codeforces.com/profile/abhishek_670",
  },
  stats: [
    { label: "LeetCode Rating", value: "1,758", sub: "Top 9.68% globally", color: "#f59e0b", icon: "trophy" },
    { label: "Problems Solved", value: "1,000+", sub: "Across DSA platforms", color: "#22d3ee", icon: "zap" },
    { label: "Codeforces", value: "1,494", sub: "Specialist · max rating", color: "#a78bfa", icon: "star" },
    { label: "CGPA", value: "8.9", sub: "CSE (AI & ML) · NIET", color: "#34d399", icon: "award" },
  ],
  projects: [
    {
      title: "TalentPilot",
      org: "AI recruitment · Featured",
      desc: "An agentic hiring flow from role request to offer, with HR approval at key decisions. It combines checkpointed LangGraph runs, anonymized hybrid resume screening, policy-grounded RAG, and an offline fake-LLM test mode.",
      tech: ["Python", "FastAPI", "LangGraph", "Pydantic", "React", "PostgreSQL", "MediaPipe"],
      github: "https://github.com/Abhishekkumar071/TalentPilot",
      accent: "#22d3ee",
      image: "/TilentPilot.jpg",
    },
    {
      title: "ChatLens",
      org: "Chat analytics · Data product",
      desc: "Parses WhatsApp and Telegram exports into interactive NLP and activity dashboards, handling varied date formats and malformed input. Caching keeps 50K+ message datasets responsive; pytest and GitHub Actions automate checks and delivery.",
      tech: ["Python", "Pandas", "NLTK", "Streamlit", "Docker", "Pytest"],
      github: "https://github.com/Abhishekkumar071",
      githubLabel: "GitHub profile",
      accent: "#34d399",
    },
    {
      title: "Document Q&A Engine",
      org: "Retrieval-augmented generation",
      desc: "A document question-answering app that combines PDF ingestion, chunking, Hugging Face embeddings, ChromaDB retrieval, and Groq-hosted Llama 3.3. FastAPI and SQLAlchemy support chat history across sessions.",
      tech: ["Python", "FastAPI", "LangChain", "ChromaDB", "Groq"],
      github: "https://github.com/Abhishekkumar071/document-qa-engine",
      accent: "#f59e0b",
      image: "/doc_qa.png",
    },
    {
      title: "InsurAI",
      org: "Infosys Springboard · Internship project",
      desc: "A full-stack insurance platform for policies, applications, and customer workflows. Built 50+ REST APIs with JWT and RBAC, plus an AI support chatbot and personalized policy recommendations.",
      tech: ["Java", "Spring Boot", "MySQL", "React", "JWT", "JUnit 5"],
      github: "https://github.com/Abhishekkumar071/InsurAI",
      accent: "#a78bfa",
      image: "/InsurAI.png",
    },
    {
      title: "Secure Bank & Payment System",
      org: "Backend engineering",
      desc: "A payment-focused banking backend built around safe fund transfers, ACID transactions, and idempotent requests so retries do not charge twice. Also addresses Hibernate N+1 queries with JOIN FETCH.",
      tech: ["Java", "Spring Boot", "PostgreSQL", "Transactions", "Idempotency"],
      github: "https://github.com/Abhishekkumar071/Secure-Bank-management-and-payment-processing-System",
      accent: "#fb7185",
      image: "/bank_management.png",
    },
  ],
  skills: [
    { category: "Languages", icon: "code", items: ["Java", "Python", "SQL", "C"], color: "#22d3ee" },
    { category: "Backend & Testing", icon: "server", items: ["Spring Boot", "FastAPI", "REST APIs", "JWT", "Pytest", "JUnit 5", "Mockito", "Postman"], color: "#34d399" },
    { category: "AI & LLMs", icon: "brain", items: ["LangChain", "LangGraph", "RAG", "Pydantic", "ChromaDB", "NLP"], color: "#f59e0b" },
    { category: "Data, Cloud & Tools", icon: "wrench", items: ["PostgreSQL", "MySQL", "MongoDB", "Pandas", "NLTK", "Docker", "GitHub Actions", "AWS EC2 / S3", "Streamlit"], color: "#a78bfa" },
  ],
  timeline: [
    {
      year: "2023 – 2027",
      title: "B.Tech, Computer Science & Engineering (AI & ML)",
      org: "Noida Institute of Engineering and Technology · Greater Noida",
      detail: "CGPA: 8.9",
      type: "edu",
    },
    {
      year: "Oct – Dec 2025",
      title: "Java Full Stack Developer Intern",
      org: "Infosys Springboard Virtual Internship 6.0",
      detail: "Built InsurAI with Spring Boot, MySQL, and React; developed 50+ JWT/RBAC-secured APIs, added backend tests, and deployed the backend to AWS EC2 and frontend to S3.",
      type: "work",
    },
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const StatIcon = ({ name, color }) => {
  const props = { size: 22, color };
  if (name === "trophy") return <Trophy {...props} />;
  if (name === "zap") return <Zap {...props} />;
  if (name === "star") return <Star {...props} />;
  return <Award {...props} />;
};

const SkillIcon = ({ name, color, size = 20 }) => {
  const p = { size, color };
  if (name === "code") return <Code2 {...p} />;
  if (name === "server") return <Server {...p} />;
  if (name === "brain") return <Brain {...p} />;
  return <Wrench {...p} />;
};

// ─── NOISE OVERLAY ────────────────────────────────────────────────────────────
const Noise = () => (
  <div
    style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.025,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    }}
  />
);

// ─── GRID BACKGROUND ─────────────────────────────────────────────────────────
const GridBg = () => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage: `linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)`,
    backgroundSize: "48px 48px",
  }} />
);

// ─── GLOW ─────────────────────────────────────────────────────────────────────
const Glow = ({ color = "#22d3ee", top, left, right, opacity = 0.12 }) => (
  <div style={{
    position: "absolute", width: 500, height: 500,
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    top, left, right, opacity, pointerEvents: "none", zIndex: 0,
    filter: "blur(60px)", transform: "translate(-50%, -50%)",
  }} />
);

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0, y = 30 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const NAV = ["About", "Stats", "Approach", "Projects", "Skills", "Experience", "Contact"];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const scroll = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(5,8,15,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(34,211,238,0.08)" : "none",
        transition: "all 0.4s ease",
        padding: "0 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#22d3ee", fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>
          AK<span style={{ color: "#fff" }}>.</span>dev
        </span>
        {/* Desktop */}
        <div style={{ display: "flex", gap: 32 }} className="nav-desktop">
          {NAV.map(n => (
            <button key={n} onClick={() => scroll(n)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#22d3ee"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}
            >
              {n}
            </button>
          ))}
        </div>
        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "none" }} className="nav-mobile-btn">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ background: "rgba(5,8,15,0.97)", borderTop: "1px solid rgba(34,211,238,0.1)", padding: "16px 24px 24px" }}>
            {NAV.map(n => (
              <div key={n} style={{ padding: "12px 0" }}>
                <button onClick={() => scroll(n)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 15, fontFamily: "'JetBrains Mono', monospace" }}>{n}</button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @media (max-width: 768px) { .nav-desktop { display: none !important; } .nav-mobile-btn { display: block !important; } }
      `}</style>
    </motion.nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 80]);
  return (
    <section id="about" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "120px 24px 80px" }}>
      <Glow color="#22d3ee" top="30%" left="20%" opacity={0.1} />
      <Glow color="#a78bfa" top="60%" left="80%" opacity={0.08} />
      <motion.div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", y }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center" }} className="hero-grid">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", borderRadius: 999, padding: "6px 14px", marginBottom: 24 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 8px #22d3ee" }} />
                <span style={{ color: "#22d3ee", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>OPEN TO SDE INTERNSHIPS</span>
              </div>
              <h1 style={{ fontSize: "clamp(2.8rem,6vw,5rem)", fontFamily: "'Space Grotesk', 'Sora', sans-serif", fontWeight: 800, lineHeight: 1.05, color: "#fff", margin: "0 0 8px" }}>
                {DATA.name}
              </h1>
              <h2 style={{ fontSize: "clamp(1rem,2.5vw,1.4rem)", fontFamily: "'JetBrains Mono', monospace", color: "#22d3ee", fontWeight: 400, margin: "0 0 16px", letterSpacing: 0.5 }}>
                {DATA.title}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", margin: "0 0 24px", letterSpacing: 0.5 }}>
                {DATA.subtitle}
              </p>
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 16, lineHeight: 1.8, maxWidth: 650, margin: "0 0 24px" }}>
                {DATA.summary}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 32, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                <MapPin size={14} /> <span>{DATA.location}</span>
              </div>
              {/* Highlight banner */}
              <div style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.08), rgba(167,139,250,0.08))", border: "1px solid rgba(34,211,238,0.15)", borderRadius: 12, padding: "14px 20px", marginBottom: 36, display: "inline-flex", alignItems: "center", gap: 12 }}>
                <Trophy size={20} color="#f59e0b" />
                <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>1,000+ Problems Solved</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>· LeetCode 1,758 · Top 9.68%</span>
              </div>
              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  href="/Abhishek_Kumar_Resume.pdf" 
                  download="Abhishek_Kumar_Resume.pdf"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#22d3ee", color: "#030712", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", textDecoration: "none", letterSpacing: 0.5 }}>
                  <Download size={16} /> Download Resume
                </motion.a>
                <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  href={DATA.links.github} target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", padding: "12px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                  <GitBranch size={16} /> GitHub
                </motion.a>
              </div>
              {/* Social row */}
              <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
                {[
                  { href: DATA.links.linkedin, icon: <CircleUser size={18} />, label: "LinkedIn" },
                  { href: DATA.links.leetcode, icon: <Terminal size={18} />, label: "LeetCode" },
                  { href: DATA.links.codeforces, icon: <Code2 size={18} />, label: "Codeforces" },
                  { href: DATA.links.gfg, icon: <BookOpen size={18} />, label: "GFG" },
                  { href: `mailto:${DATA.email}`, icon: <Mail size={18} />, label: "Email" },
                ].map(({ href, icon, label }) => (
                  <motion.a key={label} href={href} target="_blank" rel="noreferrer" whileHover={{ y: -3, color: "#22d3ee" }}
                    style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}>
                    {icon} {label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
          {/* Avatar */}
          {/* Avatar */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
            style={{ position: "relative" }} className="hero-avatar">
            
            {/* FIX: Inner div ko motion.div banaya aur liquid animation add kiya */}
            <motion.div 
              animate={{ 
                borderRadius: [
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                  "50% 50% 30% 70% / 50% 50% 70% 30%",
                  "30% 70% 70% 30% / 30% 30% 70% 70%"
                ] 
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ 
                width: 320, /* Agar aur bada chahiye toh isko 320 kar lena */
                height: 320, 
                background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.15))", 
                border: "2px solid rgba(34,211,238,0.2)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                position: "relative", 
                overflow: "hidden",
                boxShadow: "0 0 30px rgba(34,211,238,0.15)"
              }}>
              
              <img src="/ProfileP.jpg" alt="Abhishek Kumar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            
            </motion.div>
            
            {/* Floating badge (Pehle jaisa hi hai) */}
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              style={{ position: "absolute", bottom: -10, right: -10, background: "rgba(5,8,15,0.9)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 10, padding: "8px 14px", whiteSpace: "nowrap" }}>
                  <span style={{ color: "#22d3ee", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>1,758 · LeetCode</span>
            </motion.div>

          </motion.div>

        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.2)" }}>
        <ChevronDown size={24} />
      </motion.div>

      {/* FIX 2: Mobile par avatar hide hone wala code hata diya aur center align kar diya */}
      <style>{`
        @media(max-width:768px){
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-avatar { margin: 0 auto; }
        }
      `}</style>
    </section>
  );
  //         {/* Avatar */}
          
  //         <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
  //           style={{ position: "relative" }} className="hero-avatar">
  //           <div style={{ width: 220, height: 220, borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.15))", border: "2px solid rgba(34,211,238,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
  //             <img src="/ProfileP.jpg" alt="Abhishek Kumar" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0 }} />
  //             <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
  //               <div style={{ fontSize: 56, lineHeight: 1 }}>👨‍💻</div>
  //               <span style={{ color: "rgba(34,211,238,0.6)", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>AK</span>
  //             </div>
  //           </div>
  //           {/* Floating badge */}
  //           <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
  //             style={{ position: "absolute", bottom: -10, right: -10, background: "rgba(5,8,15,0.9)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 10, padding: "8px 14px", whiteSpace: "nowrap" }}>
  //             <span style={{ color: "#22d3ee", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>1758 ⚡ LeetCode</span>
  //           </motion.div>
  //         </motion.div>
  //       </div>
  //     </motion.div>
  //     {/* Scroll cue */}
  //     <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
  //       style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.2)" }}>
  //       <ChevronDown size={24} />
  //     </motion.div>
  //     <style>{`@media(max-width:768px){.hero-grid{grid-template-columns:1fr!important;}.hero-avatar{display:none!important;}}`}</style>
  //   </section>
  // );
}

// ─── STATS DASHBOARD ─────────────────────────────────────────────────────────
function Stats() {
  return (
    <section id="stats" style={{ padding: "80px 24px", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <SectionTitle label="PROOF, NOT JUST CLAIMS" title="Numbers & milestones" />
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginTop: 40 }}>
          {DATA.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6, boxShadow: `0 0 30px ${s.color}22` }}
                style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${s.color}22`, borderRadius: 16, padding: "28px 24px", position: "relative", overflow: "hidden", transition: "box-shadow 0.3s" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle, ${s.color}18, transparent 70%)` }} />
                <div style={{ marginBottom: 16 }}><StatIcon name={s.icon} color={s.color} /></div>
                <div style={{ fontSize: "2.4rem", fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: "#fff", fontWeight: 600, marginTop: 8, fontSize: 14 }}>{s.label}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 4 }}>{s.sub}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
        {/* CP Links */}
        <Reveal delay={0.3}>
          <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
            {[
              { href: DATA.links.leetcode, label: "LeetCode Profile →", color: "#f59e0b" },
              { href: DATA.links.codeforces, label: "Codeforces Profile →", color: "#a78bfa" },
              { href: DATA.links.gfg, label: "GeeksforGeeks →", color: "#34d399" },
            ].map(l => (
              <motion.a key={l.label} href={l.href} target="_blank" rel="noreferrer" whileHover={{ scale: 1.04 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${l.color}12`, border: `1px solid ${l.color}30`, color: l.color, padding: "10px 18px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
                {l.label}
              </motion.a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 32 }}>
            <div style={{ borderLeft: "2px solid #f59e0b", padding: "4px 0 4px 16px" }}>
              <div style={{ color: "#f59e0b", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>GLOBAL PRELIMS · 2026</div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>IICPC CodeFest · rank 3,545 of 13,000+</div>
            </div>
            <div style={{ borderLeft: "2px solid #22d3ee", padding: "4px 0 4px 16px" }}>
              <div style={{ color: "#22d3ee", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>LEADERSHIP & COMMUNITY</div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>IEEE Membership Chair · NEST For Coders top 29</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── ENGINEERING APPROACH ─────────────────────────────────────────────────────
function Approach() {
  const principles = [
    {
      number: "01",
      title: "Retries should be safe",
      detail: "Idempotency and database constraints keep a repeated payment request from charging twice.",
      source: "SECURE BANK SYSTEM",
      color: "#34d399",
    },
    {
      number: "02",
      title: "Model output needs a contract",
      detail: "Pydantic validation, provider fallback, and fake-LLM tests make AI workflows more dependable.",
      source: "TALENTPILOT",
      color: "#f59e0b",
    },
    {
      number: "03",
      title: "Long workflows must recover",
      detail: "Checkpointed LangGraph runs persist in PostgreSQL, resume after restarts, and retry failed steps.",
      source: "TALENTPILOT",
      color: "#22d3ee",
    },
  ];

  return (
    <section id="approach" style={{ padding: "64px 24px 80px", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <SectionTitle label="THE DETAILS THAT MATTER" title="Reliable is a feature." />
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 0, marginTop: 36 }}>
          {principles.map((item, index) => (
            <Reveal key={item.number} delay={index * 0.1}>
              <div style={{ minHeight: 196, padding: "20px 24px 12px 0", marginRight: 24, borderTop: `2px solid ${item.color}80` }}>
                <div style={{ color: item.color, font: "700 12px 'JetBrains Mono', monospace", marginBottom: 18 }}>{item.number} / {item.source}</div>
                <h3 style={{ color: "#fff", fontSize: 18, margin: "0 0 10px", lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.52)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects() {
  return (
    <section id="projects" style={{ padding: "80px 24px", position: "relative" }}>
      <Glow color="#a78bfa" top="50%" left="90%" opacity={0.07} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <SectionTitle label="ENGINEERING" title="Core Projects" />
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 24, marginTop: 40 }}>
          {DATA.projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12}>
              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${p.accent}20`, borderRadius: 16, padding: 28, position: "relative", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Top accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${p.accent}, transparent)` }} />
                {/* Project image placeholder */}
                {/* <div style={{ width: "100%", height: 140, background: `linear-gradient(135deg, ${p.accent}10, rgba(5,8,15,0.8))`, borderRadius: 10, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${p.accent}15` }}>
                  <Layers size={32} color={`${p.accent}60`} />
                </div>
                 */}
                {/* 👇 YAHAN CHANGE KIYA HAI (Placeholder hata kar Image lagayi hai) 👇 */}
                {p.image ? (
                  <div style={{ width: "100%", height: 160, borderRadius: 10, marginBottom: 20, overflow: "hidden", border: `1px solid ${p.accent}30` }}>
                    <img src={p.image} alt={`${p.title} project`} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"} />
                  </div>
                ) : (
                  <div style={{ width: "100%", height: 160, borderRadius: 10, marginBottom: 20, border: `1px solid ${p.accent}30`, background: `linear-gradient(135deg, ${p.accent}18, rgba(5,8,15,0.9))`, display: "flex", alignItems: "flex-end", padding: 20 }}>
                    <span style={{ color: p.accent, font: "700 13px 'JetBrains Mono', monospace", letterSpacing: 1 }}>CHAT DATA / 50K+ MESSAGES</span>
                  </div>
                )}
                {/* 👆 YAHAN TAK 👆 */}

                <div style={{ fontSize: 11, color: p.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 8 }}>{p.org.toUpperCase()}</div>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 12px" }}>{p.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.65, margin: "0 0 20px", flex: 1 }}>{p.desc}</p>
                {/* Tech tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  {p.tech.map(t => (
                    <span key={t} style={{ background: `${p.accent}10`, border: `1px solid ${p.accent}25`, color: p.accent, fontSize: 11, padding: "3px 10px", borderRadius: 999, fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>
                  ))}
                </div>
                {/* Links */}
                <div style={{ display: "flex", gap: 12 }}>
                  <motion.a href={p.github} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "7px 14px" }}>
                    <GitBranch size={14} /> {p.githubLabel || "Code"}
                  </motion.a>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 32, paddingTop: 18, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
          <span style={{ color: "#22d3ee", font: "700 11px 'JetBrains Mono', monospace", marginRight: 8 }}>CURRENTLY EXPLORING</span>
          <span style={{ color: "rgba(255,255,255,0.58)", fontSize: 13 }}>System design · Distributed systems · Kubernetes</span>
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────
function Skills() {
  return (
    <section id="skills" style={{ padding: "80px 24px", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <SectionTitle label="TECHNICAL STACK" title="Skills & Expertise" />
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginTop: 40 }}>
          {DATA.skills.map((s, i) => (
            <Reveal key={s.category} delay={i * 0.1}>
              <motion.div whileHover={{ borderColor: `${s.color}40` }}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24, transition: "border-color 0.3s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SkillIcon name={s.icon} color={s.color} />
                  </div>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{s.category}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {s.items.map(item => (
                    <motion.span key={item} whileHover={{ scale: 1.07, background: `${s.color}20` }}
                      style={{ background: `${s.color}08`, border: `1px solid ${s.color}20`, color: "rgba(255,255,255,0.75)", fontSize: 12, padding: "5px 12px", borderRadius: 7, fontFamily: "'JetBrains Mono', monospace", cursor: "default", transition: "background 0.2s" }}>
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── EXPERIENCE / TIMELINE ────────────────────────────────────────────────────
function Experience() {
  return (
    <section id="experience" style={{ padding: "80px 24px", position: "relative" }}>
      <Glow color="#34d399" top="50%" left="10%" opacity={0.07} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <SectionTitle label="BACKGROUND" title="Education & Experience" />
        </Reveal>
        <div style={{ marginTop: 48, position: "relative" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 24, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom, #22d3ee, #a78bfa, transparent)" }} />
          {DATA.timeline.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.15}>
              <div style={{ display: "flex", gap: 32, marginBottom: 40, paddingLeft: 0 }}>
                {/* Dot */}
                <div style={{ flexShrink: 0, width: 50, display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 4 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: t.type === "edu" ? "#22d3ee" : "#a78bfa", boxShadow: `0 0 12px ${t.type === "edu" ? "#22d3ee" : "#a78bfa"}`, border: "2px solid #030712", zIndex: 1 }} />
                </div>
                {/* Card */}
                <motion.div whileHover={{ x: 4 }}
                  style={{ flex: 1, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px" }}>
                  <div style={{ color: t.type === "edu" ? "#22d3ee" : "#a78bfa", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>{t.year}</div>
                  <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: "0 0 4px" }}>{t.title}</h3>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 10, fontWeight: 500 }}>{t.org}</div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{t.detail}</p>
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  // 👇 Yahan daalna hai wo naya submit function 👇
  const submit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    // Apni Access Key zaroor daal dena yahan
    formData.append("access_key", "79415c8b-52e7-4db6-bad7-fc1045db404a"); 
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("message", form.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSent(true);
        setTimeout(() => setSent(false), 3000);
        setForm({ name: "", email: "", message: "" });
      } else {
        alert("Bhai, message send nahi hua. Phir se try karo.");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Internet connection check karo bhai.");
    }
  };
  
  const inp = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", padding: "13px 16px", width: "100%", fontSize: 14, outline: "none", fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box", transition: "border-color 0.2s" };
  return (
    <section id="contact" style={{ padding: "80px 24px 120px", position: "relative" }}>
      <Glow color="#22d3ee" top="50%" left="50%" opacity={0.06} />
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <Reveal>
          <SectionTitle label="GET IN TOUCH" title="Contact Me" centered />
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ color: "rgba(255,255,255,0.45)", textAlign: "center", fontSize: 14, margin: "12px 0 40px", lineHeight: 1.7 }}>
            Looking for an SDE internship where I can contribute to backend systems, learn from a strong engineering team, and ship useful software.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Name" style={inp}
              onFocus={e => e.target.style.borderColor = "#22d3ee"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Your Email" style={inp}
              onFocus={e => e.target.style.borderColor = "#22d3ee"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Your message..." style={{ ...inp, resize: "vertical" }}
              onFocus={e => e.target.style.borderColor = "#22d3ee"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: sent ? "#34d399" : "#22d3ee", color: "#030712", padding: "14px 28px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", transition: "background 0.3s", letterSpacing: 0.5 }}>
              {sent ? "✓ Message Sent!" : "Send Message →"}
            </motion.button>
          </form>
        </Reveal>
        {/* Direct contact */}
        <Reveal delay={0.3}>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 36 }}>
            <a href={`mailto:${DATA.email}`} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13 }}>
              <Mail size={15} /> {DATA.email}
            </a>
            <a href={DATA.links.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13 }}>
              <CircleUser size={15} /> LinkedIn
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SECTION TITLE ────────────────────────────────────────────────────────────
function SectionTitle({ label, title, centered = false }) {
  return (
    <div style={{ textAlign: centered ? "center" : "left" }}>
      <div style={{ color: "#22d3ee", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 3, marginBottom: 10 }}>{label}</div>
      <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, margin: 0, lineHeight: 1.1 }}>{title}</h2>
      <div style={{ width: 40, height: 3, background: "linear-gradient(90deg, #22d3ee, #a78bfa)", borderRadius: 999, marginTop: 14, ...(centered ? { marginLeft: "auto", marginRight: "auto" } : {}) }} />
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
      Built by Abhishek Kumar · {new Date().getFullYear()} · React · Tailwind · Framer Motion
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background: "#05080f", minHeight: "100vh", color: "#fff", fontFamily: "'Sora', 'Segoe UI', sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #05080f; }
        ::-webkit-scrollbar-thumb { background: #22d3ee33; border-radius: 999px; }
        ::selection { background: #22d3ee33; }
        a { transition: color 0.2s, opacity 0.2s; }
      `}</style>
      <GridBg />
      <Noise />
      <Navbar />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <Stats />
        <Approach />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}