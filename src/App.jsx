"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
 * Artan Protec — Coats‑inspired site (single file)
 * TailwindCSS + Framer Motion + hash routing
 * Theme: Red / Black / White (light)
 * Pages: Home, Products (facets), PDP, Industries, Industry Detail, About, Insights (blog + posts), Contact
 * Notes:
 *  - Keep assets in /public
 *  - Replace PRODUCT_DB, INDUSTRY_DB, BLOG_DB with live content later
 *
 * === Upload assets now (exact paths) ===
 * Logo & hero:
 *   /artan-protec-logo.png
 *   /hero.jpg
 *
 * Product images (1 per product):
 *   /images/products/shieldlite-soft-ud.jpg
 *   /images/products/shieldlite-hard-ud.jpg
 *   /images/products/armorstitch-para-thread.jpg
 *   /images/products/ripcore-telecom-ripcord.jpg
 *   /images/products/metaspin-1p5d-yarn.jpg
 *   /images/products/metaspin-2d-yarn.jpg
 *   /images/products/paraspin-staple-yarn.jpg
 *   /images/products/pps-needlefelt.jpg
 *   /images/products/ptfe-needlefelt.jpg
 *   /images/products/thermaguard-fr-fabrics.jpg
 *   /images/products/thermaguard-fr-blends.jpg
 *
 * Product brochures (1 per product, same slug):
 *   /brochures/products/shieldlite-soft-ud.pdf
 *   /brochures/products/shieldlite-hard-ud.pdf
 *   /brochures/products/armorstitch-para-thread.pdf
 *   /brochures/products/ripcore-telecom-ripcord.pdf
 *   /brochures/products/metaspin-1p5d-yarn.pdf
 *   /brochures/products/metaspin-2d-yarn.pdf
 *   /brochures/products/paraspin-staple-yarn.pdf
 *   /brochures/products/pps-needlefelt.pdf
 *   /brochures/products/ptfe-needlefelt.pdf
 *   /brochures/products/thermaguard-fr-fabrics.pdf
 *   /brochures/products/thermaguard-fr-blends.pdf
 *
 * Industry images & brochures (1 each):
 *   /images/industries/ppe.jpg
 *   /images/industries/defense.jpg
 *   /images/industries/telecom.jpg
 *   /images/industries/mobility.jpg
 *   /images/industries/infrastructure.jpg
 *   /images/industries/filtration.jpg
 *   /brochures/industries/ppe.pdf
 *   /brochures/industries/defense.pdf
 *   /brochures/industries/telecom.pdf
 *   /brochures/industries/mobility.pdf
 *   /brochures/industries/infrastructure.pdf
 *   /brochures/industries/filtration.pdf
 */

const LOGO_SRC = "/artan-protec-logo.png";
const HERO_SRC = "/hero.jpg";

// ---------------- utils ----------------
const slugify = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
  INSIGHT: (slug) => `#/insights/${slug}`,
  CONTACT: "#/contact",
};
function parseHash() {
  const raw = typeof window !== "undefined" ? window.location.hash : "#/";
  const seg = raw.replace(/^#\//, "").split("/").filter(Boolean);
  if (seg.length === 0) return { page: "home" };
  if (seg[0] === "products" && seg.length === 1) return { page: "products" };
  if (seg[0] === "products" && seg[1]) return { page: "pdp", product: seg[1] };
  if (seg[0] === "industries" && seg.length === 1) return { page: "industries" };
  if (seg[0] === "industries" && seg[1]) return { page: "industry", industry: seg[1] };
  if (seg[0] === "about") return { page: "about" };
  if (seg[0] === "insights" && seg.length === 1) return { page: "insights" };
  if (seg[0] === "insights" && seg[1]) return { page: "post", slug: seg[1] };
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

// --------------- data model ---------------
// Families:
//  - ArmorStitch™ (aramid sewing threads)
//  - RipCore™ (telecom ripcord yarns)
//  - MetaSpin™ (meta‑aramid staple yarns)
//  - ParaSpin™ (para‑aramid staple yarns)
//  - ShieldLite™ (UHMWPE UD sheets)
//  - Thermaguard™ (FR fabrics & laminates)

const PRODUCT_DB = [
  // —— UHMWPE UD Sheets ——
  {
    slug: "shieldlite-soft-ud",
    title: "ShieldLite™ Soft Armour UD Sheets (AS Series)",
    summary: "UHMWPE unidirectional sheets for soft armor layups; controlled resin, consistent ply areal density.",
    hero: "/images/products/shieldlite-soft-ud.jpg",
    brochure: "/brochures/products/shieldlite-soft-ud.pdf",
    group: "UD Sheets",
    tags: ["uhmwpe","ud","soft-armor"],
    facets: { substrate:["uHMWPE"], feature:["high-tenacity"], industry:["defense","mobility"] },
    bullets: [
      "AS series codes (e.g., AS-120, AS-150…) — numeral = gsm per ply (to be confirmed)",
      "Stable resin content for repeatable layups",
      "0°/90° layup (typical); multi‑ax options on request"
    ],
    specs: [
      ["Series codes","AS-120, AS-150, AS-200, AS-240, AS-300 (placeholder, share final)"] ,
      ["Fiber","UHMWPE"],
      ["Ply orientation","0°/90° (typical)"],
      ["Resin content","Nominal 18–22% (program‑dependent)"],
      ["Roll width","Up to 1.5 m (typical)"],
      ["Areal density per ply","120–300 g/m²"],
      ["Note","Ballistic performance depends on layup & test plan"],
    ],
    usecases: ["Soft armor panels","Helmet preform layers","Composite reinforcement"],
  },
  {
    slug: "shieldlite-hard-ud",
    title: "ShieldLite™ Hard Armour UD Sheets (AH Series)",
    summary: "UHMWPE UD sheets for hot‑press consolidation into hard armor plates and vehicle panels.",
    hero: "/images/products/shieldlite-hard-ud.jpg",
    brochure: "/brochures/products/shieldlite-hard-ud.pdf",
    group: "UD Sheets",
    tags: ["uhmwpe","ud","hard-armor"],
    facets: { substrate:["uHMWPE"], feature:["high-tenacity"], industry:["defense","mobility"] },
    bullets: [
      "Hard series codes confirmed: AH‑120 / AH‑240 (Shield); AHX‑115 / AHX‑230 (Guard); AHY‑110 (Prime); AHZ‑110 / AHZ‑220 (Ultra)",
      "Numeral denotes GSM per ply",
      "Designed for press consolidation; consistent resin films"
    ],
    specs: [
      ["Series mapping","Shield (AH‑120, AH‑240); Guard (AHX‑115, AHX‑230); Prime (AHY‑110); Ultra (AHZ‑110, AHZ‑220)"],
      ["Fiber","UHMWPE"],
      ["Process","Hot press consolidation (temp/time/pressure per program)"],
      ["Panel formats","Flat; curvature via tool"],
      ["Note","Ballistic performance depends on layup & test plan"],
    ],
    variants: [
      { code: "AH-120", gsm: 120, series: "Shield" },
      { code: "AH-240", gsm: 240, series: "Shield" },
      { code: "AHX-115", gsm: 115, series: "Guard" },
      { code: "AHX-230", gsm: 230, series: "Guard" },
      { code: "AHY-110", gsm: 110, series: "Prime" },
      { code: "AHZ-110", gsm: 110, series: "Ultra" },
      { code: "AHZ-220", gsm: 220, series: "Ultra" }
    ],
    usecases: ["Hard armor plates","Vehicle armor panels","Composite laminates"],
  },

  // —— Threads / Ripcord ——
  {
    slug: "armorstitch-para-thread",
    title: "ArmorStitch™ Para‑aramid Sewing Thread",
    summary: "High‑tenacity, heat‑resistant thread for PPE seams, filtration, and technical stitch lines.",
    hero: "/images/products/armorstitch-para-thread.jpg",
    brochure: "/brochures/products/armorstitch-para-thread.pdf",
    group: "Threads",
    tags: ["para-aramid","thread","bonded","ptfe-coated"],
    facets: { substrate:["para-aramid"], feature:["high-tenacity","heat-resistant"], industry:["ppe","defense","telecom","infrastructure","filtration"] },
    bullets: [
      "2–6 ply; available soft‑lube, bonded, PTFE‑coated",
      "Service to ~200°C; chars > 450°C",
      "Ticket sizes: 20–2 (20–200 tex)"
    ],
    specs: [
      ["Available tex / ticket","20–200 tex (Ticket 20–2)"],
      ["Constructions","2–6 ply; bonded / PTFE / soft‑lube"],
      ["Typical elongation","3.0–4.5%"],
      ["Breaking strength (Tex 40)","≥ 60 N (increases with tex)"]
    ],
    usecases: [
      "PPE outer shells, gloves, turnout gear",
      "Industrial filtration bag seams",
      "Telecom cable binding / ripcord",
      "Heat shields and FR composites tack"
    ],
  },
  {
    slug: "ripcore-telecom-ripcord",
    title: "RipCore™ Telecom Ripcord",
    summary: "Para‑aramid ripcord yarn for optical cable access — optimized diameter vs. pull strength; optional abrasion finishes.",
    hero: "/images/products/ripcore-telecom-ripcord.jpg",
    brochure: "/brochures/products/ripcore-telecom-ripcord.pdf",
    group: "Threads",
    tags: ["para-aramid","ripcord","telecom"],
    facets: { substrate:["para-aramid"], feature:["high-tenacity"], industry:["telecom"] },
    bullets: [
      "Linear density tuned for jacket tear without core damage",
      "Optional PU / PTFE surface for abrasion",
      "Tight diameter tolerance for stable splicing windows"
    ],
    specs: [
      ["Linear density","custom (e.g., 110–440 dtex)"],
      ["Finish","dry / PU / PTFE"],
      ["Abrasion","per IEC 60794 guidance (typical)"]
    ],
    usecases: ["FTTx / backbone cable access","Hybrid power‑data jackets","Aerial/duct cables"],
  },

  // —— Staple yarns ——
  {
    slug: "metaspin-1p5d-yarn",
    title: "MetaSpin™ 1.5D Meta‑aramid Staple Yarn",
    summary: "Spun from 1.5 denier meta‑aramid fibre for FR fabrics, threads base and felts.",
    hero: "/images/products/metaspin-1p5d-yarn.jpg",
    brochure: "/brochures/products/metaspin-1p5d-yarn.pdf",
    group: "Yarns",
    tags: ["meta-aramid","yarn","staple"],
    facets: { substrate:["meta-aramid"], feature:["heat-resistant"], industry:["ppe","infrastructure","mobility","filtration"] },
    bullets: ["Counts and blends on request","Continuous heat ~200°C; LOI ≥ 28 (fiber typical)","Cut lengths 38/51 mm"],
    specs: [["Fibre fineness","1.5 d"],["Cut lengths","38 / 51 mm"],["Blend options","meta+P84, meta+PPS, meta+antistat"]],
    usecases: ["FR fabric weaving/knit","Sewing thread spinning","Needlefelt base"],
  },
  {
    slug: "metaspin-2d-yarn",
    title: "MetaSpin™ 2D Meta‑aramid Staple Yarn",
    summary: "Spun from 2.0 denier meta‑aramid fibre for robust FR constructions.",
    hero: "/images/products/metaspin-2d-yarn.jpg",
    brochure: "/brochures/products/metaspin-2d-yarn.pdf",
    group: "Yarns",
    tags: ["meta-aramid","yarn","staple"],
    facets: { substrate:["meta-aramid"], feature:["heat-resistant"], industry:["ppe","infrastructure","mobility","filtration"] },
    bullets: ["Counts and blends on request","Continuous heat ~200°C; LOI ≥ 28 (fiber typical)","Cut lengths 38/51 mm"],
    specs: [["Fibre fineness","2.0 d"],["Cut lengths","38 / 51 mm"],["Blend options","meta+P84, meta+PPS, meta+antistat"]],
    usecases: ["FR fabric weaving/knit","Sewing thread spinning","Needlefelt base"],
  },
  {
    slug: "paraspin-staple-yarn",
    title: "ParaSpin™ Para‑aramid Staple Yarn",
    summary: "High‑tenacity para‑aramid staple yarn for cut‑resistant and high‑strength applications.",
    hero: "/images/products/paraspin-staple-yarn.jpg",
    brochure: "/brochures/products/paraspin-staple-yarn.pdf",
    group: "Yarns",
    tags: ["para-aramid","yarn","staple"],
    facets: { substrate:["para-aramid"], feature:["high-tenacity"], industry:["ppe","defense","telecom"] },
    bullets: ["Counts on request; blends with UHMWPE possible","High tensile & modulus (fiber typical)","For reinforcement and cut‑resistant fabrics"],
    specs: [["Tensile strength (fiber)","~3.0–3.6 GPa"],["Modulus","~60–130 GPa"],["Elongation","~2.5–4%"]],
    usecases: ["Cut‑resistant knits","Reinforcement scrims","High‑strength threads base"],
  },

  // —— Nonwovens ——
  {
    slug: "pps-needlefelt",
    title: "PPS Needlefelt (Industrial Filtration)",
    summary: "Polyphenylene sulfide nonwoven felt — excellent chemical and thermal resistance; competitive pricing via scale buying.",
    hero: "/images/products/pps-needlefelt.jpg",
    brochure: "/brochures/products/pps-needlefelt.pdf",
    group: "Nonwovens",
    tags: ["pps","nonwoven","filtration"],
    facets: { substrate:["pps"], feature:["heat-resistant","chemical-resistant"], industry:["infrastructure","mobility","filtration"] },
    bullets: ["Areal weights 350–600 g/m² typical","Surface finishes & scrims on request","Dimensional stability under load"],
    specs: [["Polymer","PPS"],["Areal weight","350–600 g/m²"],["Finishes","calendered, singed; PTFE membrane optional"]],
    usecases: ["Baghouse filters","Hot gas filtration","Thermal insulation"],
  },
  {
    slug: "ptfe-needlefelt",
    title: "PTFE Needlefelt (Industrial Filtration)",
    summary: "PTFE nonwoven felt for aggressive chemistries and high temperatures.",
    hero: "/images/products/ptfe-needlefelt.jpg",
    brochure: "/brochures/products/ptfe-needlefelt.pdf",
    group: "Nonwovens",
    tags: ["ptfe","nonwoven","filtration"],
    facets: { substrate:["ptfe"], feature:["heat-resistant","chemical-resistant"], industry:["infrastructure","mobility","filtration"] },
    bullets: ["Areal weights 500–800 g/m² typical","PTFE membrane options","Excellent chemical resistance"],
    specs: [["Polymer","PTFE"],["Areal weight","500–800 g/m²"],["Finishes","membrane, calendered, singed"]],
    usecases: ["Chemical process filters","Stack emission control","High‑temp gasketing"],
  },

  // —— Woven / laminated aramid fabrics ——
  {
    slug: "thermaguard-fr-fabrics",
    title: "Thermaguard™ FR Fabrics (Meta‑aramid blends)",
    summary: "FR woven and nonwoven fabrics for PPE, industrial insulation and filtration. Options: silicone/PTFE/PU coatings, laminates.",
    hero: "/images/products/thermaguard-fr-fabrics.jpg",
    brochure: "/brochures/products/thermaguard-fr-fabrics.pdf",
    group: "Fabrics",
    tags: ["meta-aramid","woven","nonwoven","laminate"],
    facets: { substrate:["meta-aramid","aramid-blend"], feature:["heat-resistant","antistatic"], industry:["ppe","mobility","infrastructure","filtration"] },
    bullets: ["Plain/twill/satin; 150–260 g/m² typical","Needlefelts for filtration and insulation","Add‑ons: silicone, PTFE, PU; laminated shells"],
    specs: [["LOI","≥ 28 (self‑extinguishing)"],["Areal weight","150–260 g/m² (woven typical)"],["Standards","Designed to help meet ISO 15025 A/B when finished"]],
    usecases: ["Workwear shells","Filtration media","Heat shields"],
  },
  {
    slug: "thermaguard-fr-blends",
    title: "Thermaguard™ FR Blends (Meta/Para/Antistat)",
    summary: "Woven aramid fabrics including common blends like 93:5:2 and 50:50; engineered for PPE and industrial use.",
    hero: "/images/products/thermaguard-fr-blends.jpg",
    brochure: "/brochures/products/thermaguard-fr-blends.pdf",
    group: "Fabrics",
    tags: ["aramid-blend","woven","antistatic"],
    facets: { substrate:["aramid-blend"], feature:["heat-resistant","antistatic"], industry:["ppe","infrastructure"] },
    bullets: ["Blend examples: 93:5:2 (meta:para:antistat), 50:50","Weaves: plain / twill / satin","Coatings: silicone / PTFE / PU"],
    specs: [["Areal weight","160–280 g/m² (typical)"],["Surface resistivity","per antistat spec (on request)"],["Finishes","dyed, calendered, coated, laminated"]],
    usecases: ["Coveralls & uniforms","FR liners","Industrial insulation"],
  },
];

const INDUSTRY_DB = [
  {
    slug: "ppe",
    title: "PPE",
    icon: <Shield className="w-5 h-5" />,
    blurb: "Fire & industrial PPE, uniforms, gloves, and FR accessories.",
    img: "/images/industries/ppe.jpg",
    brochure: "/brochures/industries/ppe.pdf",
    picks: ["armorstitch-para-thread","thermaguard-fr-blends","thermaguard-fr-fabrics"],
  },
  {
    slug: "defense",
    title: "Defense & Security",
    icon: <Flame className="w-5 h-5" />,
    blurb: "Ballistics, FR apparel, and high‑temperature components.",
    img: "/images/industries/defense.jpg",
    brochure: "/brochures/industries/defense.pdf",
    picks: ["shieldlite-soft-ud","shieldlite-hard-ud","armorstitch-para-thread"],
  },
  {
    slug: "telecom",
    title: "Telecom",
    icon: <Globe className="w-5 h-5" />,
    blurb: "Ripcords, strength members, FR tapes and ancillary yarns.",
    img: "/images/industries/telecom.jpg",
    brochure: "/brochures/industries/telecom.pdf",
    picks: ["ripcore-telecom-ripcord","armorstitch-para-thread"],
  },
  {
    slug: "mobility",
    title: "Mobility",
    icon: <Factory className="w-5 h-5" />,
    blurb: "Automotive, rail, aerospace interiors & insulation.",
    img: "/images/industries/mobility.jpg",
    brochure: "/brochures/industries/mobility.pdf",
    picks: ["thermaguard-fr-fabrics","pps-needlefelt"],
  },
  {
    slug: "infrastructure",
    title: "Infrastructure & Energy",
    icon: <Building2 className="w-5 h-5" />,
    blurb: "Power, renewables, switchgear and substations.",
    img: "/images/industries/infrastructure.jpg",
    brochure: "/brochures/industries/infrastructure.pdf",
    picks: ["pps-needlefelt","ptfe-needlefelt","armorstitch-para-thread"],
  },
  {
    slug: "filtration",
    title: "Filtration",
    icon: <Leaf className="w-5 h-5" />,
    blurb: "Industrial filtration media: PPS/PTFE felts, FR scrims and threads.",
    img: "/images/industries/filtration.jpg",
    brochure: "/brochures/industries/filtration.pdf",
    picks: ["pps-needlefelt","ptfe-needlefelt","armorstitch-para-thread"],
  },
];

// Blog posts (Insights)
const BLOG_DB = [
  {
    slug: "selecting-aramid-thread",
    title: "Selecting Your Aramid Thread",
    date: "2025-09-15",
    excerpt: "Tex vs. Ticket, ply, finishes, and stitch recommendations by fabric class.",
    body: `\n### Quick guide\n\nWhen choosing aramid thread, match **tex/ticket** to seam strength and needle size. Bonded finishes increase abrasion performance; PTFE improves chemical resistance. For FR garments, balance hand with seam durability.`,
  },
  {
    slug: "ripcord-101",
    title: "Ripcord & Strength Members 101",
    date: "2025-08-22",
    excerpt: "Choosing para‑aramid ripcords: abrasion finishes, diameter vs. pull strength.",
    body: `\n### Cable access basics\n\nRipcord linear density must open the jacket cleanly without harming core tubes. Consider **PU/PTFE** finishes when jacket abrasiveness is high.`,
  },
  {
    slug: "uhmwpe-hard-soft",
    title: "UHMWPE UD: Soft vs Hard Armor",
    date: "2025-07-02",
    excerpt: "How ply GSM and resin content interact with layup design and press cycles.",
    body: `\n### Design considerations\n\nSoft UD (AS series) optimizes drape and multi‑hit; Hard UD (AH series) targets stiffness after consolidation. Performance is a system property — validate via your NIJ test plan.`,
  },
];

// ---------------- app ----------------
export default function App() {
  const { route, go } = useHashRouter();
  const [mobile, setMobile] = useState(false);
  useEffect(() => { if (!window.location.hash) go(R.HOME); }, []);
  useEffect(() => { setMobile(false); }, [route.page]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Header onGo={go} route={route} />
      <main className="flex-1" id="main">
        {route.page === "home" && <Home onGo={go} />}
        {route.page === "products" && <Products onGo={go} />}
        {route.page === "pdp" && <PDP slug={route.product} onGo={go} />}
        {route.page === "industries" && <Industries onGo={go} />}
        {route.page === "industry" && <IndustryDetail slug={route.industry} onGo={go} />}
        {route.page === "about" && <About />}
        {route.page === "insights" && <Insights onGo={go} />}
        {route.page === "post" && <PostPage slug={route.slug} onGo={go} />}
        {route.page === "contact" && <Contact />}
      </main>
      {route.page === "home" && <StickyQuote />}
      <Footer onGo={go} />
    </div>
  );
}

// --------------- Header with hover mega‑menus ---------------
function Header({ onGo, route }) {
  const [open, setOpen] = useState(""); // "products" | "industries" | ""
  const navRef = useRef(null);
  useEffect(() => {
    const out = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setOpen(""); };
    document.addEventListener("mousemove", out);
    return () => document.removeEventListener("mousemove", out);
  }, []);

  // mobile toggle kept simple
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-red-600" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onGo(R.HOME)}>
            <img {...safeImg} src={LOGO_SRC} alt="Artan Protec" className="w-9 h-9 rounded" />
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight text-red-700">Artan Protec</div>
              <div className="text-xs text-black">Advanced Protection | Engineered Performance</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 relative">
            <NavLink active={route.page==="home"} onClick={() => onGo(R.HOME)}>
              Home
            </NavLink>

            <div onMouseEnter={()=>setOpen("products")} onMouseLeave={()=>setOpen("")}> 
              <NavButton active={route.page.startsWith("product")} onClick={() => onGo(R.PRODUCTS)}>
                Products <ChevronDown className="w-4 h-4 ml-1"/>
              </NavButton>
              {open === "products" && (
                <MegaMenu title="Products">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {PRODUCT_DB.slice(0,9).map(p => (
                      <DropdownCard key={p.slug} title={p.title} blurb={p.summary} onClick={() => onGo(R.PDP(p.slug))} />
                    ))}
                  </div>
                </MegaMenu>
              )}
            </div>

            <div onMouseEnter={()=>setOpen("industries")} onMouseLeave={()=>setOpen("")}> 
              <NavButton active={route.page.startsWith("industry")} onClick={() => onGo(R.INDUSTRIES)}>
                Industries <ChevronDown className="w-4 h-4 ml-1"/>
              </NavButton>
              {open === "industries" && (
                <MegaMenu title="Industries">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {INDUSTRY_DB.map(i => (
                      <DropdownCard key={i.slug} title={i.title} blurb={i.blurb} onClick={() => onGo(R.INDUSTRY(i.slug))} />
                    ))}
                  </div>
                </MegaMenu>
              )}
            </div>

            <NavLink active={route.page==="about"} onClick={() => onGo(R.ABOUT)}>About</NavLink>
            <NavLink active={route.page.startsWith?.("insight") || route.page==="post"} onClick={() => onGo(R.INSIGHTS)}>Insights</NavLink>
            <NavLink active={route.page==="contact"} onClick={() => onGo(R.CONTACT)}>Contact</NavLink>
          </nav>

          {/* Mobile */}
          <button className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-red-600" onClick={() => setMobile(!mobile)} aria-label="Toggle menu">{mobile? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}</button>
        </div>
      </div>

      {mobile && (
        <div className="md:hidden border-t border-red-600 bg-white">
          <div className="px-4 py-3 space-y-1">
            {[["Home", R.HOME],["Products", R.PRODUCTS],["Industries", R.INDUSTRIES],["About", R.ABOUT],["Insights", R.INSIGHTS],["Contact", R.CONTACT]].map(([label, href]) => (
              <button key={label} className="w-full text-left px-2 py-2 rounded-lg hover:bg-red-50" onClick={() => setMobile(false) || onGo(href)}>{label}</button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function MegaMenu({ title, children }){
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] w-[min(100%,960px)]">
      <div className="rounded-2xl border border-red-200 bg-white shadow-xl p-6">
        <div className="mb-4 text-xs uppercase tracking-wider text-red-600">{title}</div>
        {children}
      </div>
    </div>
  );
}
function DropdownCard({ title, blurb, onClick }){
  return (
    <button onClick={onClick} className="text-left rounded-2xl border border-red-200 p-4 hover:border-red-400 hover:bg-red-50">
      <div className="font-semibold line-clamp-2">{title}</div>
      <div className="mt-2 text-sm text-neutral-600 line-clamp-3">{blurb}</div>
      <div className="mt-3 inline-flex items-center gap-1 text-sm text-red-700">Explore <ChevronRight className="w-4 h-4"/></div>
    </button>
  );
}
function NavButton({ children, onClick, active }){
  return (
    <button onClick={onClick} className={`inline-flex items-center px-3 py-2 rounded-xl text-sm border ${active? "bg-red-600 text-white border-red-600":"border-red-600 text-red-700 hover:bg-red-50"}`}>{children}</button>
  );
}
function NavLink({ children, onClick, active }){
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-xl text-sm ${active? "text-white bg-red-600":"text-red-700 hover:bg-red-50"}`}>{children}</button>
  );
}

// --------------- Home (overhauled) ---------------
function Home({ onGo }){
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0,1], [0,30]);

  // Build scrollers
  const productCards = PRODUCT_DB.slice(0,8).map(p => ({
    key: p.slug,
    node: (
      <div className="min-w-[260px] max-w-[260px] rounded-2xl border border-red-200 p-4 bg-white">
        <img {...safeImg} src={p.hero} alt={p.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200"/>
        <div className="mt-3 font-semibold line-clamp-2">{p.title}</div>
        <div className="mt-1 text-xs text-neutral-600 line-clamp-2">{p.summary}</div>
      </div>
    )
  }));
  const industryCards = INDUSTRY_DB.map(i => ({
    key: i.slug,
    node: (
      <div className="min-w-[220px] max-w-[220px] rounded-2xl border border-red-200 p-3 bg-white">
        <img {...safeImg} src={i.img} alt={i.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200"/>
        <div className="mt-2 font-medium">{i.title}</div>
        <div className="text-xs text-neutral-600 line-clamp-2">{i.blurb}</div>
      </div>
    )
  }));

  return (
    <section>
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl/tight md:text-5xl/tight font-extrabold tracking-tight">Advanced Protection.<br/>Engineered Performance.</h1>
          <p className="mt-4 text-neutral-700 max-w-xl">Inspired by global leaders, built for your programs: aramid yarns & threads, FR fabrics and UHMWPE UD systems for high heat, abrasion and impact — with export‑ready documentation.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => onGo(R.PRODUCTS)} className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3">Explore Products <ChevronRight className="w-4 h-4"/></button>
            <button onClick={() => onGo(R.INDUSTRIES)} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50">Industries</button>
            <button onClick={() => onGo(R.INSIGHTS)} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50">Insights</button>
          </div>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[ ["Performance", "Materials engineering"], ["Compliance","QA & documentation"], ["Global","Export‑ready"], ["Partnership","OEM & EPC"] ].map(([k,s],i)=> (
              <div key={k} className="rounded-xl border border-red-200 p-4"><div className="text-sm text-neutral-500">{s}</div><div className="font-semibold">{k}</div></div>
            ))}
          </div>
        </div>
        <motion.div style={{y}} className="relative">
          <img {...safeImg} src={HERO_SRC} alt="High‑performance technical textiles" className="aspect-[4/3] w-full object-cover rounded-3xl border border-red-200"/>
          <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-3xl overflow-hidden border border-red-200 hidden md:block">
            <img {...safeImg} src={HERO_SRC} alt="" className="w-full h-full object-cover opacity-80"/>
          </div>
        </motion.div>
      </div>

      {/* Moving Product overview */}
      <div className="border-y border-red-100 bg-neutral-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Product overview" subtitle="What we make" />
        </div>
        <AutoScroller items={productCards} speed={28} onClickItem={(key)=>onGo(R.PDP(key))} />
      </div>

      {/* Moving Industries overview */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Industries we serve" subtitle="Scope" />
        </div>
        <AutoScroller items={industryCards} speed={24} onClickItem={(key)=>onGo(R.INDUSTRY(key))} />
      </div>

      {/* Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-4">
        {[
          [<BadgeCheck className="w-5 h-5"/>, "Quality & Testing", "Lot traceability, vendor onboarding support, and application‑level testing."],
          [<FileText className="w-5 h-5"/>, "Documentation", "Datasheets, RoHS/REACH notes, and export paperwork guidance."],
          [<Leaf className="w-5 h-5"/>, "Responsible Sourcing", "Materials stewardship and long‑term supplier partnerships."],
        ].map(([icon, k, s]) => (
          <div key={k} className="rounded-2xl border border-red-200 p-5">
            <div className="flex items-center gap-3"><span className="text-red-700">{icon}</span><div className="font-semibold">{k}</div></div>
            <div className="mt-2 text-sm text-neutral-600">{s}</div>
          </div>
        ))}
      </div>

      {/* Blog preview */}
      <div className="bg-neutral-50 border-t border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SectionHeader title="Insights" subtitle="Latest articles" />
          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_DB.slice(0,3).map(p => (
              <div key={p.slug} className="rounded-2xl border border-red-200 p-5 bg-white">
                <div className="text-xs text-neutral-500">{new Date(p.date).toLocaleDateString()}</div>
                <div className="mt-1 font-semibold">{p.title}</div>
                <div className="mt-2 text-sm text-neutral-600 line-clamp-3">{p.excerpt}</div>
                <div className="mt-4"><button onClick={()=>onGo(R.INSIGHT(p.slug))} className="inline-flex items-center gap-1 text-red-700">Read <ChevronRight className="w-4 h-4"/></button></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight">Have a spec? Send it across.</h3>
            <p className="mt-2 text-white/80">Share drawings or application details — we’ll respond with viable constructions, lead times, and MOQs.</p>
          </div>
          <div className="flex md:justify-end">
            <a href="mailto:artanprotec@gmail.com" className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3"><Mail className="w-4 h-4"/> Contact Sales</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Auto-scrolling band (marquee‑like)
function AutoScroller({ items, speed = 30, onClickItem }){
  // Duplicate items for seamless loop
  const content = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-4 px-4 sm:px-6 lg:px-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {content.map(({ key, node }, idx) => (
          <button key={`${key}-${idx}`} onClick={() => onClickItem?.(key)} className="focus:outline-none">
            {node}
          </button>
        ))}
      </motion.div>
    </div>
  );
}

function SectionHeader({ title, subtitle }){
  return (
    <div className="mb-6">
      <div className="text-xs uppercase tracking-widest text-red-700/80">{subtitle}</div>
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2">{title}</h2>
    </div>
  );
}

// --------------- Products (facets) ---------------
function Products({ onGo }){
  const [q, setQ] = useState("");
  const [facet, setFacet] = useState({ substrate: "all", feature: "all", industry: "all", group: "all" });
  const GROUPS = ["all","UD Sheets","Threads","Yarns","Nonwovens","Fabrics"];
  const SUBSTRATES = ["all","meta-aramid","para-aramid","aramid-blend","uHMWPE","pps","ptfe"]; 
  const FEATURES = ["all","heat-resistant","high-tenacity","bonded","ptfe-coated","antistatic","chemical-resistant"]; 
  const INDUSTRIES = ["all","ppe","defense","telecom","mobility","infrastructure","filtration"]; 

  const list = useMemo(()=> PRODUCT_DB, []);
  const filtered = list.filter(p => {
    const hitQ = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.summary.toLowerCase().includes(q.toLowerCase());
    const f = (arr, v) => v==="all" || (p.facets?.[arr]||[]).includes(v);
    const g = facet.group === "all" || p.group === facet.group;
    return hitQ && f("substrate", facet.substrate) && f("feature", facet.feature) && f("industry", facet.industry) && g;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="Products" subtitle="Catalog"/>

      <div className="mb-6 grid gap-3 md:grid-cols-5 items-stretch">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"/>
          <input value={q} onChange={(e)=>setQ(e.target.value)} className="w-full border border-red-300 rounded-xl pl-9 pr-3 py-2" placeholder="Search products, specs or uses"/>
        </div>
        <select value={facet.group} onChange={(e)=>setFacet(s=>({...s, group:e.target.value}))} className="border border-red-300 rounded-xl px-3 py-2">
          {GROUPS.map(v=> <option key={v} value={v}>{v}</option>)}
        </select>
        <select value={facet.substrate} onChange={(e)=>setFacet(s=>({...s, substrate:e.target.value}))} className="border border-red-300 rounded-xl px-3 py-2">
          {SUBSTRATES.map(v=> <option key={v} value={v}>{v}</option>)}
        </select>
        <select value={facet.feature} onChange={(e)=>setFacet(s=>({...s, feature:e.target.value}))} className="border border-red-300 rounded-xl px-3 py-2">
          {FEATURES.map(v=> <option key={v} value={v}>{v}</option>)}
        </select>
        <select value={facet.industry} onChange={(e)=>setFacet(s=>({...s, industry:e.target.value}))} className="border border-red-300 rounded-xl px-3 py-2">
          {INDUSTRIES.map(v=> <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, idx) => (
          <motion.div key={p.slug} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true, amount:0.2}} transition={{duration:0.5, delay: idx*0.05}} className="rounded-2xl border border-red-200 p-5 hover:border-red-300">
            <div className="font-semibold">{p.title}</div>
            <div className="mt-2 text-sm text-neutral-600">{p.summary}</div>
            <div className="mt-3"><img {...safeImg} src={p.hero} alt={p.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200"/></div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(p.tags||[]).slice(0,4).map(t => <span key={t} className="text-xs px-2 py-1 rounded-full border border-red-200">{t}</span>)}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={()=>onGo(R.PDP(p.slug))} className="inline-flex items-center gap-1 text-sm text-red-700">Explore <ChevronRight className="w-4 h-4"/></button>
              <a href={p.brochure} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-3 py-2 text-sm"><Download className="w-4 h-4"/> Brochure</a>
              <a href={buildQuoteHref(p.title)} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-3 py-2 hover:bg-red-50 text-sm"><Mail className="w-4 h-4"/> Get Quote</a>
            </div>
          </motion.div>
        ))}
      </div>
      {filtered.length===0 && <div className="mt-8 text-sm text-neutral-600">No matches. Try clearing filters.</div>}
    </section>
  );
}

// --------------- PDP ---------------
function PDP({ slug, onGo }){
  const p = PRODUCT_DB.find(x=>x.slug===slug);
  if (!p) return <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Not found.</section>;
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={()=>onGo(R.PRODUCTS)} className="text-sm text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 mb-6"><ChevronRight className="-scale-x-100 w-4 h-4"/> Back to Products</button>
      <h3 className="text-3xl font-extrabold tracking-tight">{p.title}</h3>
      <p className="mt-2 text-neutral-700 max-w-3xl">{p.summary}</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <img {...safeImg} src={p.hero} alt={p.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200"/>
        {[2,3,4].map(n => <div key={n} className="aspect-[4/3] rounded-xl bg-neutral-100 border border-red-200 grid place-items-center"><span className="text-neutral-500 text-xs">Visual {n}</span></div>)}
      </div>

      {/* feature bullets */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {p.bullets.map((b, i) => (
          <div key={i} className="rounded-xl border border-red-200 p-4">
            <div className="text-sm text-neutral-700">{b}</div>
          </div>
        ))}
      </div>

      {/* key specs */}
      <div className="mt-8 rounded-2xl border border-red-200 overflow-hidden">
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm font-medium">Key Specifications</div>
        <div className="p-4">
          <table className="w-full text-sm">
            <tbody>
              {p.specs.map(([k,v]) => (
                <tr key={k} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-medium text-neutral-800">{k}</td>
                  <td className="py-2 text-neutral-700">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* variants table (if present) */}
      {Array.isArray(p.variants) && p.variants.length > 0 && (
        <div className="mt-8 rounded-2xl border border-red-200 overflow-hidden">
          <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm font-medium">Variants & Codes</div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3">Code</th>
                  <th className="py-2 pr-3">GSM</th>
                  <th className="py-2 pr-3">Series</th>
                </tr>
              </thead>
              <tbody>
                {p.variants.map(v => (
                  <tr key={v.code} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-medium text-neutral-800">{v.code}</td>
                    <td className="py-2 pr-3 text-neutral-700">{v.gsm}</td>
                    <td className="py-2 pr-3 text-neutral-700">{v.series}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* downloads + actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        {p.brochure && (
          <a href={p.brochure} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-3"><Download className="w-4 h-4"/> Download Brochure</a>
        )}
        <a href={buildQuoteHref(p.title)} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50"><Mail className="w-4 h-4"/> Enquire</a>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org","@type":"Product","name":p.title,
        "brand":{"@type":"Brand","name":"Artan Protec"},
        "category":"Technical textiles","description":p.summary,
        "image":p.hero,
      })}}/>
    </section>
  );
}

// --------------- Industries ---------------
function Industries({ onGo }){
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="Industries" subtitle="Where we fit"/>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INDUSTRY_DB.map((i, idx) => (
          <motion.button key={i.slug} onClick={()=>onGo(R.INDUSTRY(i.slug))} className="text-left rounded-2xl border border-red-200 hover:border-red-300 p-5" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true, amount:0.2}} transition={{duration:0.5, delay: idx*0.05}}>
            <div className="flex items-center gap-3"><span className="text-red-700">{i.icon}</span><div className="font-semibold">{i.title}</div></div>
            <div className="mt-2 text-sm text-neutral-600">{i.blurb}</div>
            <div className="mt-4"><img {...safeImg} src={i.img} alt={i.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200"/></div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={i.brochure} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-3 py-2 text-sm"><Download className="w-4 h-4"/> One‑pager</a>
              <button onClick={()=>onGo(R.INDUSTRY(i.slug))} className="inline-flex items-center gap-1 text-sm text-red-700">Explore <ChevronRight className="w-4 h-4"/></button>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function IndustryDetail({ slug, onGo }){
  const i = INDUSTRY_DB.find(x=>x.slug===slug);
  if (!i) return null;
  const picks = PRODUCT_DB.filter(p => i.picks.includes(p.slug));
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={()=>onGo(R.INDUSTRIES)} className="text-sm text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 mb-6"><ChevronRight className="-scale-x-100 w-4 h-4"/> Back to Industries</button>
      <h3 className="text-3xl font-extrabold tracking-tight">{i.title}</h3>
      <p className="mt-2 text-neutral-700">{i.blurb}</p>

      <div className="mt-6 rounded-2xl border border-red-200 overflow-hidden">
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm font-medium">Representative Applications</div>
        <div className="p-4 grid md:grid-cols-2 gap-3 text-neutral-700">
          <ul className="list-disc pl-5 space-y-1">
            <li>OEM components & spares</li>
            <li>MRO & retrofit projects</li>
            <li>Vendor registration & pilot lots</li>
          </ul>
          <ul className="list-disc pl-5 space-y-1">
            <li>Long‑term supply frameworks</li>
            <li>Export‑ready documentation</li>
            <li>Testing & compliance support</li>
          </ul>
        </div>
      </div>

      <SectionHeader title="Recommended products" subtitle="Curated" />
      <div className="grid md:grid-cols-2 gap-6">
        {picks.map(p => (
          <div key={p.slug} className="rounded-2xl border border-red-200 p-5">
            <div className="font-semibold">{p.title}</div>
            <div className="mt-2 text-sm text-neutral-600">{p.summary}</div>
            <div className="mt-3"><img {...safeImg} src={p.hero} alt={p.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200"/></div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={()=>onGo(R.PDP(p.slug))} className="inline-flex items-center gap-1 text-sm text-red-700">View <ChevronRight className="w-4 h-4"/></button>
              <a href={buildQuoteHref(p.title)} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-3 py-2 hover:bg-red-50 text-sm"><Mail className="w-4 h-4"/> Get Quote</a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <a href={i.brochure} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-3"><Download className="w-4 h-4"/> {i.title} One‑pager</a>
      </div>
    </section>
  );
}

// --------------- About ---------------
function About(){
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="About Artan Protec" subtitle="Company"/>
      <p className="text-neutral-700 leading-relaxed">Artan Protec designs and delivers high‑performance materials for harsh environments. Our portfolio spans aramid yarns & threads, FR fabrics and UHMWPE UD systems. We partner with OEMs, EPCs and end‑users to meet demanding safety and performance targets — with documentation and export logistics dialed in.</p>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {["Design & Development","Manufacturing & QA","Export Logistics"].map(k => (
          <div key={k} className="rounded-xl border border-red-200 p-4">
            <div className="text-sm text-neutral-500">Capability</div>
            <div className="font-semibold">{k}</div>
            <div className="mt-2 text-sm text-neutral-600">Short descriptive copy placeholder. Add certifications, labs, and key references.</div>
          </div>
        ))}
      </div>

      <div className="mt-8 aspect-[5/2] rounded-2xl bg-neutral-100 border border-red-200 grid place-items-center"><span className="text-neutral-500 text-sm">Team / facility photo placeholder</span></div>
    </section>
  );
}

// --------------- Insights (blog) ---------------
function Insights({ onGo }){
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="Insights" subtitle="Guides & how‑tos"/>
      <div className="grid md:grid-cols-2 gap-6">
        {BLOG_DB.map(p => (
          <div key={p.slug} className="rounded-2xl border border-red-200 p-5">
            <div className="text-xs text-neutral-500">{new Date(p.date).toLocaleDateString()}</div>
            <div className="mt-1 font-semibold">{p.title}</div>
            <div className="mt-2 text-sm text-neutral-600">{p.excerpt}</div>
            <div className="mt-4"><button onClick={()=>onGo(R.INSIGHT(p.slug))} className="inline-flex items-center gap-1 text-red-700">Read <ChevronRight className="w-4 h-4"/></button></div>
          </div>
        ))}
      </div>
    </section>
  );
}
function PostPage({ slug, onGo }){
  const p = BLOG_DB.find(x=>x.slug===slug);
  if (!p) return <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Post not found.</section>;
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={()=>onGo(R.INSIGHTS)} className="text-sm text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 mb-6"><ChevronRight className="-scale-x-100 w-4 h-4"/> Back to Insights</button>
      <div className="text-xs text-neutral-500">{new Date(p.date).toLocaleDateString()}</div>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{p.title}</h1>
      <article className="prose prose-sm max-w-none mt-4">
        <div dangerouslySetInnerHTML={{__html: markdownToHtml(p.body)}} />
      </article>
    </section>
  );
}
function markdownToHtml(md){
  // tiny markdown → HTML (headings + bold/italic + paragraphs)
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n\n/g, '<br/><br/>' );
}

// --------------- Contact ---------------
function Contact(){
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="Contact" subtitle="Let’s build together"/>
      <div className="rounded-2xl border border-red-200 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-neutral-500">Email</div>
            <a className="font-medium" href="mailto:artanprotec@gmail.com">artanprotec@gmail.com</a>
            <div className="mt-4 text-sm text-neutral-500">Phone</div>
            <a className="font-medium" href="tel:+14704450578">+1 (470) 445‑0578</a>
            <div className="mt-4 text-sm text-neutral-500">HQ</div>
            <div className="font-medium">Mumbai, India</div>
          </div>
          <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" className="grid gap-3">
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden"><label>Don’t fill this out: <input name="bot-field"/></label></p>
            <input className="border border-red-300 rounded-xl px-3 py-2" placeholder="Name" name="name" required/>
            <input className="border border-red-300 rounded-xl px-3 py-2" placeholder="Email" type="email" name="email" required/>
            <textarea className="border border-red-300 rounded-xl px-3 py-2 min-h-[100px]" placeholder="Tell us about your requirement" name="message" required/>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3"><Mail className="w-4 h-4"/> Send</button>
          </form>
        </div>
      </div>
    </section>
  );
}

// --------------- Sticky CTA & Footer ---------------
function StickyQuote(){
  return (
    <a href={buildQuoteHref("Artan Protec")} className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-red-600 text-white px-5 py-3 shadow-lg hover:brightness-110" aria-label="Get Quote"><Mail className="w-4 h-4"/> Get Quote</a>
  );
}
function Footer({ onGo }){
  return (
    <footer className="mt-10 border-t border-red-200 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-extrabold tracking-tight">Artan Protec</div>
            <div className="text-xs text-neutral-500">Advanced Protection | Engineered Performance</div>
            <div className="mt-4 text-sm text-neutral-700">High‑performance materials for PPE, mobility, telecom, infrastructure, filtration, and defense.</div>
          </div>
          <FooterCol title="Products">
            {PRODUCT_DB.slice(0,6).map(p => <FooterLink key={p.slug} onClick={()=>onGo(R.PDP(p.slug))}>{p.title}</FooterLink>)}
            <FooterLink onClick={()=>onGo(R.PRODUCTS)}>All products</FooterLink>
          </FooterCol>
          <FooterCol title="Industries">
            {INDUSTRY_DB.map(i => <FooterLink key={i.slug} onClick={()=>onGo(R.INDUSTRY(i.slug))}>{i.title}</FooterLink>)}
          </FooterCol>
          <FooterCol title="Company">
            <FooterLink onClick={()=>onGo(R.ABOUT)}>About</FooterLink>
            <FooterLink onClick={()=>onGo(R.INSIGHTS)}>Insights</FooterLink>
            <FooterLink onClick={()=>onGo(R.CONTACT)}>Contact</FooterLink>
          </FooterCol>
        </div>
        <div className="mt-8 pt-6 border-t border-red-200 text-xs text-neutral-500 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Artan Protec. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-neutral-900">Privacy</a>
            <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-neutral-900">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
function FooterCol({ title, children }){
  return (<div><div className="text-sm font-semibold">{title}</div><div className="mt-3 space-y-2">{children}</div></div>);
}
function FooterLink({ children, onClick }){
  return (
    <button onClick={onClick} className="block text-sm text-neutral-700 hover:text-neutral-900">{children}</button>
  );
}

// ---- Dev smoke tests (console only) ----
if (typeof window !== "undefined") {
  try {
    const originalHash = window.location.hash;

    const href = buildQuoteHref("Foo", "Bar");
    console.assert(href.startsWith("mailto:"), "mailto ok");
    console.assert(slugify("Meta-aramid staple fibre") === "meta-aramid-staple-fibre", "slugify ok");

    // Router tests — do not leave hash dirty
    window.location.hash = "";
    console.assert(parseHash().page === "home", "router home default");
    window.location.hash = "#/products";
    console.assert(parseHash().page === "products", "router products page");
    window.location.hash = "#/insights/abc";
    const ph2 = parseHash();
    console.assert(ph2.page === "post" && ph2.slug === "abc", "router post page");
    window.location.hash = "#/industries/filtration";
    const ph3 = parseHash();
    console.assert(ph3.page === "industry" && ph3.industry === "filtration", "router filtration page");

    window.location.hash = originalHash || "#/";
  } catch (_) {}
}
