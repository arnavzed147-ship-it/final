import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Flame,
  Layers3,
  Mail,
  Phone,
  Download,
  ChevronRight,
  CheckCircle2,
  FileDown,
  ChevronDown,
} from "lucide-react";

/**
 * Artan Protec — Red / White / Black Theme (Multipage, URL‑safe, no router deps)
 * --------------------------------------------------------------------------------
 * What’s included based on your requests:
 *  - **Red/White/Black** visual system (clean light UI, bold red accents)
 *  - **Hero background video** with **WebM + H.264 MP4** sources and poster
 *  - **Sticky Home sub‑nav** with **scrollspy highlighting**
 *  - **Animated section reveals** + **staggered card reveals**
 *  - Safe, dependency‑free **hash router** and **URL guard** (prevents Invalid URL)
 *
 * Requirements:
 *  - Tailwind imported once in src/main.jsx (import './index.css')
 *  - Public assets: /artan-protec-logo.png, /artan-protec-logo-mark.png
 *  - Video assets in /public: /hero.webm and /hero.mp4 (+ optional /hero-poster.jpg)
 *  - PDFs in /brochures: artan-corethread.pdf, artan-armorweave.pdf, artan-ppe.pdf
 */

// ----------------------------- UI Primitives ------------------------------
const Container = ({ className = "", children }) => (
  <div className={`mx-auto w-full max-w-7xl px-6 ${className}`}>{children}</div>
);

const Reveal = ({ children, delayMs = 0 }) => {
  const [vis, setVis] = useState(false);
  const ref = React.useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (ents) => ents.forEach((e) => e.isIntersecting && setVis(true)),
      { threshold: 0.15 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      {children}
    </div>
  );
};

const Section = ({ id, eyebrow, title, lead, children }) => (
  <section id={id} className="py-20 sm:py-24">
    <Container>
      <Reveal>
        <div className="mb-8">
          {eyebrow && (
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
          )}
          <h2 className="mt-2 text-2xl sm:text-4xl font-semibold text-slate-900">{title}</h2>
          {lead && <p className="mt-3 max-w-3xl text-slate-600">{lead}</p>}
        </div>
        {children}
      </Reveal>
    </Container>
  </section>
);

// ----------------------------- URL Helpers --------------------------------
function isExternalOrFile(href = "") {
  return (
    /^https?:\/\//i.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("data:") ||
    href.startsWith("blob:") ||
    /\.(pdf|zip|docx?|xlsx?)($|\?)/i.test(href) ||
    href.startsWith("/brochures/")
  );
}

function toHref(href) {
  if (!href || typeof href !== "string") return undefined;
  const trimmed = href.trim();
  if (!trimmed) return undefined;
  if (isExternalOrFile(trimmed)) return trimmed;
  if (trimmed.startsWith("#")) return trimmed;
  if (trimmed.startsWith("/")) return `#${trimmed}`;
  return `#/${trimmed.replace(/^#?\/?/, "")}`;
}

const GlowButton = ({ href, children, variant = "primary", newTab = false, type = "button" }) => {
  const base =
    "relative inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none";
  const variants = {
    primary:
      "text-white bg-gradient-to-r from-red-600 to-red-700 shadow hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.6)]",
    ghost: "text-slate-900 border border-slate-300 bg-white hover:bg-slate-50",
  };
  const content = <span className={`${base} ${variants[variant]}`}>{children}</span>;

  const safeHref = toHref(href);
  if (!safeHref) return <button type={type}>{content}</button>;

  const isExternal = isExternalOrFile(safeHref) && /^https?:/i.test(safeHref);
  const target = newTab || isExternal ? "_blank" : undefined;
  const rel = target ? "noreferrer" : undefined;

  return (
    <a href={safeHref} className="no-underline" target={target} rel={rel}>
      {content}
    </a>
  );
};

const GCard = ({ children, className = "" }) => (
  <div className={`relative rounded-2xl p-[1px] bg-gradient-to-br from-red-200/70 via-slate-200/40 to-red-100/70 shadow-sm ${className}`}>
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-6">{children}</div>
  </div>
);

const Pill = ({ children }) => (
  <span className="rounded-full bg-red-100 text-red-800 border border-red-200 px-3 py-1 text-xs">{children}</span>
);

const Feature = ({ icon: Icon, title, children, delay = 0 }) => (
  <Reveal delayMs={delay}>
    <div className="flex items-start gap-4">
      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-black text-white ring-1 ring-red-300/40">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="text-slate-900 font-semibold">{title}</h4>
        <p className="text-slate-600 text-sm mt-1">{children}</p>
      </div>
    </div>
  </Reveal>
);

// --------------------------- Product Data -------------------------------
const FAMILIES = [
  {
    id: "corethread",
    path: "/corethread",
    name: "CoreThread — Aramid Yarns & Threads",
    icon: Layers3,
    summary:
      "Industrial aramid yarns & sewing threads engineered for heat/FR, strength and durability in PPE seams, hot‑end filtration and thermal assemblies.",
    details: [
      "Constructions: 2–8 ply staple‑based; tex/dtex/denier per application (e.g., 750 ±25 denier 4‑ply).",
      "Performance: breaking strength ≥60 N (spec‑dependent); elongation 3.0–4.4%; high modulus.",
      "Chemistry: meta‑aramid & para‑aramid blends; dope‑dyed meta‑aramid colors available.",
      "Finish: sewing lubricant, anti‑wick, soft‑hand; cone winding & doubling in‑house.",
    ],
    variants: [
      { name: "CT‑750/4P", spec: "750 ±25 denier, 4‑ply", suited: "PPE seams, filtration sewing" },
      { name: "CT‑1000/3P", spec: "~1000 denier class, 3‑ply", suited: "Heavy protective gear, gloves" },
      { name: "CT‑MetaDyed", spec: "Dope‑dyed meta‑aramid colors", suited: "Brand‑matched FR apparel" },
    ],
    downloads: [{ label: "CoreThread Datasheet (PDF)", href: "/brochures/artan-corethread.pdf" }],
  },
  {
    id: "armorweave",
    path: "/armorweave",
    name: "ArmorWeave — FRR & PPE Fabrics",
    icon: Flame,
    summary:
      "FR fabrics for coveralls, jackets, gloves, hoods and thermal liners. Targeted GSM and weaves for shell, liner and barrier layers.",
    details: [
      "Fiber systems: meta/para‑aramid; optional antistatic grids; ripstop/twill constructions.",
      "Weights: typical 150–280 GSM for apparel; higher GSM for barrier layers.",
      "Finishes: comfort & moisture options; shade ranges aligned with industry norms.",
      "Compliance: application‑specific testing pathways and documentation guidance.",
    ],
    variants: [
      { name: "AW‑Shell180", spec: "180 GSM ripstop shell", suited: "FR coveralls & jackets" },
      { name: "AW‑Liner150", spec: "150 GSM liner", suited: "Comfort liner for PPE" },
      { name: "AW‑Barrier260", spec: "260 GSM barrier", suited: "Thermal barrier / added protection" },
    ],
    downloads: [{ label: "ArmorWeave Catalog (PDF)", href: "/brochures/artan-armorweave.pdf" }],
  },
  {
    id: "ppe",
    path: "/armorshield",
    name: "ArmorShield — Industrial PPE & Components",
    icon: ShieldCheck,
    summary:
      "Select PPE gear and components leveraging our aramid inputs to accelerate pilots and early adoption.",
    details: [
      "Cut/heat resistant gloves & sleeves; FR hoods and jackets with aramid seams.",
      "Partnered manufacturing with QA; traceability & batch documentation available.",
      "Customization: logos, shade matching, size grading per program needs.",
    ],
    variants: [
      { name: "AS‑GlovePro", spec: "Cut/heat‑resistant glove", suited: "Foundry, welding, hot‑process handling" },
      { name: "AS‑HoodFR", spec: "FR hood with aramid seams", suited: "Fire safety & industrial" },
      { name: "AS‑JacketAR", spec: "Arc‑rated jacket (program)", suited: "Utilities & electrical maintenance" },
    ],
    downloads: [{ label: "PPE Program Overview (PDF)", href: "/brochures/artan-ppe.pdf" }],
  },
];

// -------------------------- Helpers/Widgets -----------------------------
const Accordion = ({ items, allowMultiple = true }) => {
  const [open, setOpen] = useState({});
  const toggle = (i) => setOpen((p) => (allowMultiple ? { ...p, [i]: !p[i] } : { [i]: !p[i] }));
  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const isOpen = !!open[i];
        return (
          <div key={i} className="rounded-xl bg-white ring-1 ring-slate-200 overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left text-slate-800 hover:bg-slate-50 transition"
            >
              <span className="font-medium">{it.title}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <div className="px-4 pb-4 text-slate-600 text-sm">{it.content}</div>}
          </div>
        );
      })}
    </div>
  );
};

const VariantTable = ({ rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="text-left text-slate-600 bg-slate-50">
        <tr className="border-b border-slate-200">
          <th className="py-2 pr-4">Variant</th>
          <th className="py-2 pr-4">Spec</th>
          <th className="py-2">Suited For</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} className="border-b border-slate-200 last:border-0">
            <td className="py-2 pr-4 text-slate-900 font-medium">{r.name}</td>
            <td className="py-2 pr-4 text-slate-700">{r.spec}</td>
            <td className="py-2 text-slate-700">{r.suited}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ------------------------------ Layout ----------------------------------
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-16 items-center justify-between">
        <a href="#/" className="flex items-center gap-3">
          <img
            src="/artan-protec-logo.png"
            alt="Artan Protec"
            className="h-8 w-auto"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">Artan Protec</p>
            <p className="text-[11px] text-slate-500">Advanced Protection | Engineered Performance</p>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <div className="relative">
            <button onClick={() => setOpen((v) => !v)} className="text-slate-700 hover:text-slate-900 inline-flex items-center gap-1">
              Catalog
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div onMouseLeave={() => setOpen(false)} className="absolute right-0 mt-2 w-64 rounded-xl bg-white ring-1 ring-slate-200 shadow-xl p-2">
                {FAMILIES.map((f, i) => (
                  <a key={f.id} href={toHref(f.path)} className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
                    {f.name}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="#/why" className="text-slate-700 hover:text-slate-900">Why Artan</a>
          <a href="#/downloads" className="text-slate-700 hover:text-slate-900">Downloads</a>
          <GlowButton href="/contact">
            <Mail className="h-4 w-4" /> Contact
          </GlowButton>
        </nav>
      </Container>
    </header>
  );
}

function SiteFrame({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-red-50/20 text-slate-900">
      {/* Soft red radial accents */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_-5%,rgba(239,68,68,0.12),transparent),radial-gradient(900px_500px_at_85%_0%,rgba(15,23,42,0.08),transparent)]" />
      </div>
      <Navbar />
      {children}
      <DevDiagnostics />
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 mt-20">
      <Container className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/artan-protec-logo-mark.png"
            alt="Artan mark"
            className="h-8 w-8"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div>
            <p className="font-semibold text-slate-900">Artan Protec</p>
            <p className="text-xs text-slate-500">Advanced Protection | Engineered Performance</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} Artan Protec. All rights reserved.</p>
      </Container>
    </footer>
  );
}

// --------------------------- Pages --------------------------------------
function Home() {
  const cases = [
    {
      title: "Firefighter Jackets",
      bullets: [
        "Outer shell with ripstop ArmorWeave",
        "CoreThread seams maintain integrity under heat",
        "Optional moisture/comfort finishes",
      ],
    },
    {
      title: "Industrial Gloves",
      bullets: [
        "Para-aramid blends for cut/heat resistance",
        "Cone‑wound CoreThread for consistent stitch",
        "Programmatic sizing & private labeling",
      ],
    },
    {
      title: "Thermal Barriers",
      bullets: [
        "Targeted GSM fabrics for insulation",
        "Liner options for comfort & moisture",
        "Batch traceability for audits",
      ],
    },
  ];
  const [caseIdx, setCaseIdx] = useState(0);

  const links = [
    { id: "about", label: "About" },
    { id: "catalog", label: "Catalog" },
    { id: "why", label: "Why Artan" },
    { id: "industries", label: "Industries" },
    { id: "standards", label: "Standards" },
    { id: "use-cases", label: "Use Cases" },
    { id: "tech", label: "Tech" },
    { id: "get-started", label: "Get started" },
  ];

  // Scrollspy state
  const [activeId, setActiveId] = useState("about");
  useEffect(() => {
    const ids = links.map((l) => l.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0.1, 0.25, 0.6] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const SubNav = () => (
    <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="overflow-x-auto">
        <div className="flex gap-4 py-3 text-sm">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#/${l.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(l.id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`${activeId === l.id ? "text-red-700 border-b-2 border-red-600" : "text-slate-700 hover:text-slate-900"} whitespace-nowrap pb-1`}
            >
              {l.label}
            </a>
          ))}
        </div>
      </Container>
    </div>
  );

  return (
    <>
      {/* HERO with background video (WebM + H.264) */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
          >
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/70 to-white/85" />
        </div>
        <Container className="pt-16 pb-24">
          <Reveal>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-red-700">
                Aramid Materials • FRR Fabrics • Industrial PPE
              </div>
              <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight">
                Advanced Protection. Engineered Performance.
              </h1>
              <p className="mt-5 text-lg text-slate-700">
                High‑strength, heat‑resistant yarns & threads (CoreThread), FR fabrics (ArmorWeave), and select PPE assemblies (ArmorShield) for mission‑critical environments.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <GlowButton href="/corethread">
                  <ChevronRight className="h-5 w-5" /> Explore Catalog
                </GlowButton>
                <GlowButton href="/downloads" variant="ghost">
                  <FileDown className="h-5 w-5" /> Tech Sheets
                </GlowButton>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Pill>Spec‑driven sourcing</Pill>
                <Pill>Low‑CAPEX phase‑in</Pill>
                <Pill>Export‑ready</Pill>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* STICKY SUB-NAV */}
      <SubNav />

      {/* ABOUT */}
      <Section id="about" eyebrow="About" title="Artan Protec" lead="A specialized brand focused on aramid inputs and FR protective solutions — built for reliability, documentation, and scale.">
        <div className="grid gap-6 md:grid-cols-2">
          <GCard>
            <p className="text-slate-600 text-sm">
              We convert technical fibers into performance components: yarns & threads for high‑temperature seams, FR fabrics for shells/liners/barriers, and selected PPE assemblies to accelerate pilots. Our process emphasizes application fit, quality control, and consistent supply.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-red-600"/> Meta/para‑aramid expertise</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-red-600"/> Batch documentation</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-red-600"/> Shade & logo customization</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-red-600"/> Export logistics ready</li>
            </ul>
          </GCard>
          <GCard>
            <h4 className="text-slate-900 font-semibold mb-2">At a glance</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                <p className="text-slate-500">Product families</p>
                <p className="text-slate-900 font-semibold">3</p>
              </div>
              <div>
                <p className="text-slate-500">Target GSM range</p>
                <p className="text-slate-900 font-semibold">150–280 (apparel)</p>
              </div>
              <div>
                <p className="text-slate-500">Thread constructions</p>
                <p className="text-slate-900 font-semibold">2–8 ply staple</p>
              </div>
              <div>
                <p className="text-slate-500">Customization</p>
                <p className="text-slate-900 font-semibold">Logos & shades</p>
              </div>
            </div>
          </GCard>
        </div>
      </Section>

      {/* PRODUCT LINES OVERVIEW */}
      <Section id="catalog" eyebrow="Catalog" title="Product Lines" lead="Open a product line to view detailed specs, variants, and downloads.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FAMILIES.map((fam, i) => (
            <Reveal key={fam.id} delayMs={i * 90}>
              <GCard className="hover:shadow-[0_20px_60px_-20px_rgba(239,68,68,0.25)] transition">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-black text-white ring-1 ring-red-300/40">
                    <fam.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{fam.name}</h3>
                    <p className="text-slate-600 text-sm mt-1">{fam.summary}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <GlowButton href={fam.path} variant="ghost">Learn more</GlowButton>
                </div>
              </GCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* DIFFERENTIATORS */}
      <Section id="why" eyebrow="Why Artan" title="What sets us apart">
        <div className="grid gap-6 md:grid-cols-3">
          <Feature icon={Layers3} title="Materials mastery" delay={0}>
            Meta‑ & para‑aramid systems tuned from fiber to seam.
          </Feature>
          <Feature icon={CheckCircle2} title="Quality & compliance" delay={90}>
            Documentation, batch traceability, and process control.
          </Feature>
          <Feature icon={ShieldCheck} title="Program flexibility" delay={180}>
            Shade/logo customization and scalable partner network.
          </Feature>
        </div>
      </Section>

      {/* INDUSTRIES */}
      <Section id="industries" eyebrow="Industries" title="Where we fit" lead="Solutions aligned to sector requirements and safety expectations.">
        <div className="grid gap-4 md:grid-cols-5 text-sm">
          {["Defense", "Industrial PPE", "Fire Services", "Utilities & Electrical", "Oil & Gas"].map((name, i) => (
            <Reveal key={name} delayMs={i * 70}>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 text-center hover:bg-slate-50">
                {name}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CERTIFICATIONS */}
      <Section id="standards" eyebrow="Standards" title="Certifications & standards">
        <GCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-700">
            <Reveal delayMs={0}><div className="rounded-lg bg-white px-3 py-2 text-center ring-1 ring-slate-200">ISO (process)</div></Reveal>
            <Reveal delayMs={80}><div className="rounded-lg bg-white px-3 py-2 text-center ring-1 ring-slate-200">ASTM / NFPA (app‑specific)</div></Reveal>
            <Reveal delayMs={160}><div className="rounded-lg bg-white px-3 py-2 text-center ring-1 ring-slate-200">BIS (where applicable)</div></Reveal>
            <Reveal delayMs={240}><div className="rounded-lg bg-white px-3 py-2 text-center ring-1 ring-slate-200">Documentation support</div></Reveal>
          </div>
        </GCard>
      </Section>

      {/* CASE STUDIES CAROUSEL (simple) */}
      <Section id="use-cases" eyebrow="Use cases" title="Applications in the field">
        <GCard>
          <div className="flex items-start justify-between gap-6">
            <div>
              <h4 className="text-slate-900 font-semibold">{cases[caseIdx].title}</h4>
              <ul className="mt-2 list-disc pl-5 text-slate-700 text-sm">
                {cases[caseIdx].bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-2">
              {cases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCaseIdx(i)}
                  aria-label={`Show case ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full ${i === caseIdx ? "bg-red-600" : "bg-red-200"}`}
                />
              ))}
            </div>
          </div>
        </GCard>
      </Section>

      {/* INTERACTIVE TECH DIAGRAM (red/neutral palette) */}
      <Section id="tech" eyebrow="Tech" title="Cross‑section: protective layer stack" lead="Hover layers to reveal composition & function.">
        <GCard>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <svg viewBox="0 0 320 260" className="w-full h-auto">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#fecaca" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.55" />
                </linearGradient>
                <linearGradient id="g2" x1="0" x2="1">
                  <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.55" />
                </linearGradient>
                <linearGradient id="g3" x1="0" x2="1">
                  <stop offset="0%" stopColor="#fde68a" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f87171" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <rect x="10" y="220" width="300" height="20" fill="#ffffff" stroke="#e2e8f0" />
              <g className="group">
                <rect x="30" y="180" width="260" height="24" fill="url(#g1)" stroke="#ef4444" className="transition duration-200 group-hover:opacity-90" />
                <text x="40" y="196" fill="#7f1d1d" fontSize="10">ArmorWeave: Outer shell (ripstop/twill)</text>
              </g>
              <g className="group">
                <rect x="40" y="150" width="240" height="22" fill="url(#g2)" stroke="#6b7280" className="transition duration-200 group-hover:opacity-90" />
                <text x="50" y="165" fill="#374151" fontSize="10">Liner: comfort & moisture options</text>
              </g>
              <g className="group">
                <rect x="50" y="120" width="220" height="20" fill="url(#g3)" stroke="#f59e0b" className="transition duration-200 group-hover:opacity-90" />
                <text x="60" y="134" fill="#92400e" fontSize="10">Barrier: thermal/arc reinforcement</text>
              </g>
              <g className="group">
                <rect x="60" y="90" width="200" height="18" fill="#111827" opacity="0.2" stroke="#0f172a" />
                <text x="70" y="103" fill="#111827" fontSize="10">Seams: CoreThread aramid sewing</text>
              </g>
            </svg>

            <div>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 rounded-sm" style={{ background: "linear-gradient(90deg,#fecaca88,#ef444488)" }} />
                  <div>
                    <p className="text-slate-900 font-medium">ArmorWeave outer shell</p>
                    <p className="text-slate-500">Ripstop/twill, shade options, abrasion resistance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 rounded-sm" style={{ background: "linear-gradient(90deg,#e5e7eb88,#9ca3af88)" }} />
                  <div>
                    <p className="text-slate-900 font-medium">Comfort liner</p>
                    <p className="text-slate-500">Moisture/comfort finishes for extended wear.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 rounded-sm" style={{ background: "linear-gradient(90deg,#fde68a90,#f8717190)" }} />
                  <div>
                    <p className="text-slate-900 font-medium">Thermal/arc barrier</p>
                    <p className="text-slate-500">Higher GSM or blends to meet protection targets.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 rounded-sm bg-slate-800/40" />
                  <div>
                    <p className="text-slate-900 font-medium">CoreThread seams</p>
                    <p className="text-slate-500">Aramid threads and constructions for seam integrity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GCard>
      </Section>

      {/* CTA */}
      <Section id="get-started" eyebrow="Get started" title="Spec a material or request a pilot">
        <div className="flex flex-wrap gap-3">
          <GlowButton href="/downloads" variant="ghost"><Download className="h-4 w-4"/> Download brochures</GlowButton>
          <GlowButton href="/contact"><Mail className="h-4 w-4"/> Contact sales</GlowButton>
        </div>
      </Section>
    </>
  );
}

function ProductPage({ fam }) {
  return (
    <>
      <Section eyebrow="Catalog" title={fam.name} lead={fam.summary}>
        <div className="grid gap-6 md:grid-cols-3">
          <GCard className="md:col-span-2">
            <h3 className="text-slate-900 font-semibold mb-3">Key details</h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm">
              {fam.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <h3 className="text-slate-900 font-semibold mt-6 mb-3">Available variants</h3>
            <VariantTable rows={fam.variants} />
          </GCard>
          <GCard>
            <h3 className="text-slate-900 font-semibold mb-3">Downloads</h3>
            <div className="flex flex-wrap gap-2">
              {fam.downloads.map((d) => (
                <a key={d.href} href={d.href} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-800 hover:bg-slate-50">
                  <Download className="h-4 w-4" /> {d.label}
                </a>
              ))}
            </div>
          </GCard>
        </div>
      </Section>
    </>
  );
}

function Why() {
  return (
    <Section eyebrow="Why Artan" title="Built for demanding environments" lead="From seam integrity to arc and flame resistance, our inputs and assemblies are tuned to application realities.">
      <div className="grid gap-6 md:grid-cols-3">
        <GCard>
          <Feature icon={Layers3} title="Materials mastery">
            Meta‑ & para‑aramid expertise — converting fibers to threads, fabrics, and PPE components.
          </Feature>
        </GCard>
        <GCard>
          <Feature icon={CheckCircle2} title="Quality & compliance">
            Process controls and documentation aligned with FR/PPE expectations; traceability by batch.
          </Feature>
        </GCard>
        <GCard>
          <Feature icon={ShieldCheck} title="Scale‑ready network">
            Partner spinning/weaving/finishing; in‑house doubling & cone winding to reduce lead times.
          </Feature>
        </GCard>
      </div>
    </Section>
  );
}

function Downloads() {
  return (
    <Section eyebrow="Downloads" title="Brochures & spec sheets">
      <div className="flex flex-wrap gap-3">
        <GlowButton href="/brochures/artan-corethread.pdf" variant="ghost" newTab>
          <Download className="h-4 w-4" /> CoreThread
        </GlowButton>
        <GlowButton href="/brochures/artan-armorweave.pdf" variant="ghost" newTab>
          <Download className="h-4 w-4" /> ArmorWeave
        </GlowButton>
        <GlowButton href="/brochures/artan-ppe.pdf" variant="ghost" newTab>
          <Download className="h-4 w-4" /> PPE Program
        </GlowButton>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <>
      <Section eyebrow="Contact" title="Talk to our team" lead="Submit specs or drawings — we'll respond with the right thread, fabric or PPE program.">
        <div className="grid gap-6 md:grid-cols-2">
          <GCard>
            <div className="flex items-center gap-2 text-slate-900 font-semibold"><Mail className="h-5 w-5 text-red-600"/> Emails</div>
            <ul className="mt-2 text-slate-700 text-sm space-y-2">
              <li>
                <strong>Primary:</strong> <a className="hover:underline" href="mailto:artanprotec@gmail.com">artanprotec@gmail.com</a>
              </li>
            </ul>
            <p className="text-xs text-slate-500 mt-3">Enable Netlify form notifications → Forms → contact → Notifications → Email to this address.</p>
          </GCard>
          <GCard>
            <div className="flex items-center gap-2 text-slate-900 font-semibold"><Phone className="h-5 w-5 text-red-600"/> Phone</div>
            <p className="mt-2 text-slate-700 text-sm">USA: +1 470 445 0578</p>
          </GCard>
        </div>
        <GCard className="mt-6">
          <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" className="grid md:grid-cols-3 gap-4">
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden"><label>Don’t fill this out if you're human: <input name="bot-field" /></label></p>
            <input required name="name" placeholder="Name" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
            <input required type="email" name="email" placeholder="Email" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
            <input name="company" placeholder="Company" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
            <textarea required name="message" placeholder="Project / Specs" className="md:col-span-3 rounded-xl border border-slate-300 bg-white px-4 py-3 min-h-[120px] text-slate-900 placeholder:text-slate-400" />
            <div className="md:col-span-3"><GlowButton type="submit"><Mail className="h-5 w-5" /> Submit</GlowButton></div>
          </form>
        </GCard>
      </Section>
    </>
  );
}

// --------------------------- Tiny hash router ----------------------------
function useHashPath() {
  const getPath = () => {
    const raw = typeof window !== "undefined" ? window.location.hash : "";
    const path = (raw || "").replace(/^#/, "");
    return path || "/";
  };
  const [path, setPath] = useState(getPath);
  useEffect(() => {
    const onHash = () => setPath(getPath());
    if (typeof window !== "undefined") window.addEventListener("hashchange", onHash);
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("hashchange", onHash);
    };
  }, []);
  return path;
}

function RouterView() {
  const path = useHashPath();
  if (path === "/" || path === "") return <Home />;
  if (path.startsWith("/corethread")) return <ProductPage fam={FAMILIES[0]} />;
  if (path.startsWith("/armorweave")) return <ProductPage fam={FAMILIES[1]} />;
  if (path.startsWith("/armorshield")) return <ProductPage fam={FAMILIES[2]} />;
  if (path.startsWith("/why")) return <Why />;
  if (path.startsWith("/downloads")) return <Downloads />;
  if (path.startsWith("/contact")) return <Contact />;
  return <Home />;
}

// ---------------------------- Dev sanity checks --------------------------
function runSimpleTests() {
  const cases = [
    ["/corethread", "#/corethread"],
    ["downloads", "#/downloads"],
    ["/", "#/"],
    [" /downloads ", "#/downloads"],
    ["/brochures/artan-corethread.pdf", "/brochures/artan-corethread.pdf"],
    ["https://example.com", "https://example.com"],
    ["#/_directHash", "#/_directHash"],
    ["   ", undefined],
    [undefined, undefined],
    ["mailto:hello@artanprotec.com", "mailto:hello@artanprotec.com"],
    ["tel:+14704450578", "tel:+14704450578"],
    ["blob:abc", "blob:abc"],
    ["data:,", "data:,"],
  ];
  let pass = 0;
  for (const [input, expected] of cases) {
    const out = toHref(input);
    if (out === expected) pass++; else console.warn("toHref FAIL", { input, out, expected });
  }
  console.log(`toHref tests: ${pass}/${cases.length} passed`);
}

if (typeof window !== "undefined" && import.meta && import.meta.env && import.meta.env.DEV) {
  try { runSimpleTests(); } catch (e) { console.warn("self-tests error", e); }
}

function DevDiagnostics() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      const h = typeof window !== "undefined" ? window.location.hash : "";
      setShow((h || "").includes("debug"));
    } catch {/* noop */}
  }, []);
  if (!show) return null;
  const tests = [
    { name: "All product paths start with /", pass: FAMILIES.every((f) => typeof f.path === "string" && f.path.startsWith("/") && !/\s/.test(f.path)) },
    { name: "Downloads look like files or http(s)", pass: FAMILIES.every((f) => f.downloads.every((d) => isExternalOrFile(d.href))) },
  ];
  const failures = tests.filter((t) => !t.pass);
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-xs text-slate-700 shadow-lg">
      <div className="font-semibold mb-2">Dev Diagnostics</div>
      <ul className="space-y-1">
        {tests.map((t) => (
          <li key={t.name} className={t.pass ? "text-emerald-600" : "text-rose-600"}>
            {t.pass ? "✓" : "✗"} {t.name}
          </li>
        ))}
      </ul>
      {failures.length === 0 ? (
        <div className="mt-2 text-emerald-600">All tests passed.</div>
      ) : (
        <div className="mt-2 text-rose-600">{failures.length} test(s) failed.</div>
      )}
      <div className="mt-2 text-slate-500">(Hide by removing #/debug from URL)</div>
    </div>
  );
}

// ------------------------------- App ------------------------------------
export default function App() {
  return (
    <div className="min-h-screen">
      <SiteFrame>
        <RouterView />
      </SiteFrame>
    </div>
  );
}

