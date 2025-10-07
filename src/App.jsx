"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Mail,
  Download,
  Search,
  Shield,
  Flame,
  Factory,
  Building2,
  Globe,
  FileText,
  BadgeCheck,
  Leaf,
} from "lucide-react";

/**
 * Artan Protec — Coats-inspired single-file site
 * TailwindCSS + Framer Motion + hash routing
 * Theme: Red / Black / White (light)
 */

const LOGO_SRC = "/artan-protec-logo.png";
const HERO_SRC = "/hero.jpg";

// ---------------- utils ----------------
const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const buildQuoteHref = (title, item) => {
  const body = [
    "Hello Artan Protec,",
    "",
    `Please share a quote for: ${title}`,
    item ? `Item(s): ${item}` : undefined,
    "Quantity: [your qty]",
    "Notes: [any specifics]",
    "",
    "Thank you.",
  ]
    .filter(Boolean)
    .join("\n");

  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "quote_click", title, item: item || null });
  }

  return `mailto:artanprotec@gmail.com?subject=${encodeURIComponent(
    "Quote request - " + title
  )}&body=${encodeURIComponent(body)}`;
};

const safeImg = { loading: "lazy", decoding: "async" };

// --------------- routing (hash) ---------------
const R = {
  HOME: "#/",
  PRODUCTS: "#/products",
  PDP: (slug) => `#/products/${slug}`,
  INDUSTRIES: "#/industries",
  INDUSTRY: (slug) => `#/industries/${slug}`,
  ABOUT: "#/about",
  INSIGHTS: "#/insights",
  CONTACT: "#/contact",
};

function parseHash() {
  const seg = (typeof window !== "undefined" ? window.location.hash : "#/")
    .replace(/^#\//, "")
    .split("/")
    .filter(Boolean);

  if (seg.length === 0) return { page: "home" };
  if (seg[0] === "products" && seg.length === 1) return { page: "products" };
  if (seg[0] === "products" && seg[1]) return { page: "pdp", product: seg[1] };
  if (seg[0] === "industries" && seg.length === 1) return { page: "industries" };
  if (seg[0] === "industries" && seg[1]) return { page: "industry", industry: seg[1] };
  if (seg[0] === "about") return { page: "about" };
  if (seg[0] === "insights") return { page: "insights" };
  if (seg[0] === "contact") return { page: "contact" };
  return { page: "home" };
}

function useHashRouter() {
  const [route, setRoute] = useState(parseHash());
  useEffect(() => {
    const h = () => setRoute(parseHash());
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  const go = (hash) => {
    if (window.location.hash !== hash) window.location.hash = hash;
    else setRoute(parseHash());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return { route, go };
}

// ---------------- sample product & industry data ----------------
const PRODUCT_DB = [
  {
    slug: "shieldlite-soft-ud",
    title: "ShieldLite™ Soft Armour UD Sheets (APS Series)",
    summary:
      "UHMWPE unidirectional sheets for soft armor layups; controlled resin and ply areal density for repeatable panels.",
    hero: "/images/ballistic.jpg",
    tags: ["UHMWPE", "UD", "soft-armor"],
    facets: { substrate: ["UHMWPE"], feature: ["high-tenacity"], industry: ["defense", "mobility"] },
    bullets: [
      "APS series: APS120–APS300 (gsm per ply)",
      "Stable resin content for uniform layups",
      "Nominal 0°/90° orientation",
    ],
    specs: [
      ["Series codes", "APS120, APS150, APS200, APS240, APS300"],
      ["Fiber", "UHMWPE"],
      ["Roll width", "Up to 1.5 m"],
    ],
    usecases: ["Soft armor vests", "Helmet preforms", "Blast blankets"],
    downloads: [{ label: "Ballistics Overview", href: "/brochures/ballistic-systems.pdf" }],
  },
  {
    slug: "shieldlite-hard-ud",
    title: "ShieldLite™ Hard Armour UD Sheets (APH Series)",
    summary:
      "UHMWPE UD sheets for hot-press consolidation into stand-alone or ICW hard armor plates and vehicle panels.",
    hero: "/images/ballistic.jpg",
    tags: ["UHMWPE", "UD", "hard-armor"],
    facets: { substrate: ["UHMWPE"], feature: ["high-tenacity"], industry: ["defense", "mobility"] },
    bullets: [
      "APH series: APH150–APH300 (gsm per ply)",
      "Press consolidation-ready surface finish",
      "Supports complex curvature tooling",
    ],
    specs: [
      ["Series codes", "APH150, APH200, APH250, APH300"],
      ["Fiber", "UHMWPE"],
      ["Format", "Flat / tooled curvature"],
    ],
    usecases: ["Hard armor plates", "Vehicle armor panels"],
    downloads: [{ label: "Ballistics Overview", href: "/brochures/ballistic-systems.pdf" }],
  },
];

const INDUSTRY_DB = [
  {
    slug: "defense",
    title: "Defense & Security",
    icon: <Flame className="w-5 h-5" />,
    blurb: "Ballistics, FR apparel, and high-temperature components.",
    picks: ["shieldlite-hard-ud", "shieldlite-soft-ud"],
  },
  {
    slug: "mobility",
    title: "Mobility",
    icon: <Factory className="w-5 h-5" />,
    blurb: "Automotive, rail, aerospace interiors & insulation.",
    picks: ["shieldlite-soft-ud"],
  },
];

// ---------------- app ----------------
export default function App() {
  const { route, go } = useHashRouter();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (!window.location.hash) go(R.HOME);
  }, []);
  useEffect(() => {
    setMobile(false);
  }, [route.page]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Header onGo={go} route={route} mobile={mobile} setMobile={setMobile} />
      <main className="flex-1" id="main">
        {route.page === "home" && <Home onGo={go} />}
        {route.page === "products" && <Products onGo={go} />}
        {route.page === "pdp" && <PDP slug={route.product} onGo={go} />}
        {route.page === "industries" && <Industries onGo={go} />}
        {route.page === "industry" && <IndustryDetail slug={route.industry} onGo={go} />}
      </main>
      {route.page === "home" && <StickyQuote />}
      <Footer onGo={go} />
    </div>
  );
}

// --------------- Header ---------------
function Header({ onGo, route, mobile, setMobile }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onGo(R.HOME)}>
            <img {...safeImg} src={LOGO_SRC} alt="Artan Protec" className="w-9 h-9 rounded" />
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight text-red-700">Artan Protec</div>
              <div className="text-xs text-black">Advanced Protection | Engineered Performance</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 relative">
            <NavLink active={route.page === "home"} onClick={() => onGo(R.HOME)}>Home</NavLink>
            <NavLink active={route.page.startsWith("product")} onClick={() => onGo(R.PRODUCTS)}>Products</NavLink>
            <NavLink active={route.page.startsWith("industry")} onClick={() => onGo(R.INDUSTRIES)}>Industries</NavLink>
            <NavLink onClick={() => onGo(R.CONTACT)}>Contact</NavLink>
          </nav>
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-red-600"
            onClick={() => setMobile(!mobile)}
            aria-label="Toggle menu"
          >
            {mobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobile && (
        <div className="md:hidden border-t border-red-600 bg-white">
          <div className="px-4 py-3 space-y-1">
            {[
              ["Home", R.HOME],
              ["Products", R.PRODUCTS],
              ["Industries", R.INDUSTRIES],
              ["Contact", R.CONTACT],
            ].map(([label, href]) => (
              <button
                key={label}
                className="w-full text-left px-2 py-2 rounded-lg hover:bg-red-50"
                onClick={() => (setMobile(false), onGo(href))}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-sm ${active ? "text-white bg-red-600" : "text-red-700 hover:bg-red-50"}`}
    >
      {children}
    </button>
  );
}

// --------------- Home ---------------
function Home({ onGo }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 30]);

  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div style={{ y }}>
          <h1 className="text-4xl md:text-5xl font-extrabold">Advanced Protection.<br />Engineered Performance.</h1>
          <p className="mt-4 text-neutral-700">
            Coats-style clarity, Artan power: engineered aramid yarns & threads, FR fabrics and UHMWPE UD systems.
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => onGo(R.PRODUCTS)} className="bg-red-600 text-white px-4 py-3 rounded-xl">
              Explore Products
            </button>
            <button onClick={() => onGo(R.INDUSTRIES)} className="border border-red-600 text-red-700 px-4 py-3 rounded-xl">
              Industries
            </button>
          </div>
        </motion.div>
        <motion.div style={{ y }}>
          <img {...safeImg} src={HERO_SRC} alt="Hero" className="rounded-3xl border border-red-200" />
        </motion.div>
      </div>
    </section>
  );
}

// --------------- Products ---------------
function Products({ onGo }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => PRODUCT_DB, []);
  const filtered = list.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.summary.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-extrabold mb-6">Products</h2>
      <div className="mb-6 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full border border-red-300 rounded-xl pl-9 pr-3 py-2"
          placeholder="Search products..."
        />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <motion.div key={p.slug} className="border border-red-200 rounded-2xl p-5">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-neutral-600 mt-2">{p.summary}</div>
            <img {...safeImg} src={p.hero} alt={p.title} className="mt-3 rounded-xl border border-red-200" />
            <div className="mt-3 flex gap-2 flex-wrap">
              <button onClick={() => onGo(R.PDP(p.slug))} className="text-sm text-red-700">
                Explore <ChevronRight className="w-4 h-4 inline" />
              </button>
              <a
                href={buildQuoteHref(p.title)}
                className="inline-flex items-center gap-1 text-sm border border-red-600 px-3 py-1 rounded-xl text-red-700"
              >
                <Mail className="w-4 h-4" /> Quote
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// --------------- PDP ---------------
function PDP({ slug, onGo }) {
  const p = PRODUCT_DB.find((x) => x.slug === slug);
  if (!p) return <section className="p-12">Product not found.</section>;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => onGo(R.PRODUCTS)} className="text-sm text-neutral-600 mb-6">
        <ChevronRight className="-scale-x-100 w-4 h-4 inline" /> Back
      </button>
      <h3 className="text-3xl font-extrabold">{p.title}</h3>
      <p className="mt-2 text-neutral-700">{p.summary}</p>
      <img {...safeImg} src={p.hero} alt={p.title} className="rounded-xl mt-4 border border-red-200" />
      <ul className="mt-4 list-disc pl-5 text-sm text-neutral-700">
        {p.bullets.map((b) => <li key={b}>{b}</li>)}
      </ul>
      <div className="mt-6">
        <table className="w-full text-sm border border-red-200">
          <tbody>
            {p.specs.map(([k, v]) => (
              <tr key={k}>
                <td className="font-medium border-b border-red-100 p-2">{k}</td>
                <td className="border-b border-red-100 p-2">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex gap-2 flex-wrap">
        {p.downloads.map((d) => (
          <a
            key={d.href}
            href={d.href}
            target="_blank"
            rel="noreferrer"
            className="bg-black text-white px-4 py-2 rounded-xl inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> {d.label}
          </a>
        ))}
        <a
          href={buildQuoteHref(p.title)}
          className="border border-red-600 text-red-700 px-4 py-2 rounded-xl inline-flex items-center gap-2"
        >
          <Mail className="w-4 h-4" /> Enquire
        </a>
      </div>
    </section>
  );
}

// --------------- Industries ---------------
function Industries({ onGo }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-extrabold mb-6">Industries</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INDUSTRY_DB.map((i) => (
          <motion.button
            key={i.slug}
            onClick={() => onGo(R.INDUSTRY(i.slug))}
            className="text-left border border-red-200 rounded-2xl p-5 hover:border-red-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-red-700">{i.icon}</
