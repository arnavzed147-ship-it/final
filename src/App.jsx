"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Shield,
  Flame,
  Layers,
  Mail,
  Download,
  Factory,
  Building2,
  Globe,
  Home as HomeIcon,
} from "lucide-react";

/**
 * Artan Protec — Single‑file React site (TailwindCSS + Framer Motion)
 * ----------------------------------------------------------------------
 * Brand: Artan Protec only — no mentions of other brands.
 * Colors: Red / Black / White theme (light variant).
 * Navbar: Home, Products, Industries, About, Contact.
 * Animations: Scroll‑reveal + subtle hero parallax.
 * Logo: place /public/artan-protec-logo.png OR set LOGO_SRC to your asset path.
 * Hero: place /public/hero.jpg OR set HERO_SRC.
 * Product images & brochures: drop files into /public/images and /public/brochures
 *   - /images/aramid-yarn.jpg
 *   - /images/ppe-fabrics.jpg
 *   - /images/ballistic.jpg
 *   - /brochures/aramid-yarn-thread.pdf
 *   - /brochures/ppe-fabrics.pdf
 *   - /brochures/ballistic-systems.pdf
 *
 *  Notes:
 *  - Keep Tailwind import in src/main.jsx (import "./index.css").
 *  - Requires deps: framer-motion, lucide-react.
 */

const LOGO_SRC = "/artan-protec-logo.png"; // place this file in your public/ folder
const HERO_SRC = "/hero.jpg"; // place this file in your public/ folder

// util: slug + quote mail builder
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
  return `mailto:artanprotec@gmail.com?subject=${encodeURIComponent(
    "Quote request - " + title
  )}&body=${encodeURIComponent(body)}`;
};

// Image & brochure maps (drop files with these names and paths)
const PRODUCT_IMAGES = {
  "aramid-fibres-yarns": "/images/aramid-yarn.jpg",
  "aramid-sewing-threads": "/images/aramid-yarn.jpg",
  "aramid-fabrics": "/images/ppe-fabrics.jpg",
  "technical-fabric-conversions": "/images/ppe-fabrics.jpg",
  "ppe-frr-products": "/images/ppe-fabrics.jpg",
  "specialized-aramid-applications": "/images/ballistic.jpg",
};

const PRODUCT_BROCHURES = {
  "aramid-fibres-yarns": "/brochures/aramid-yarn-thread.pdf",
  "aramid-sewing-threads": "/brochures/aramid-yarn-thread.pdf",
  "aramid-fabrics": "/brochures/ppe-fabrics.pdf",
  "technical-fabric-conversions": "/brochures/ppe-fabrics.pdf",
  "ppe-frr-products": "/brochures/ppe-fabrics.pdf",
  "specialized-aramid-applications": "/brochures/ballistic-systems.pdf",
};

const PAGES = {
  HOME: "home",
  ABOUT: "about",
  CONTACT: "contact",
  PRODUCTS: "products",
  INDUSTRIES: "industries",
  PRODUCT_DETAIL: "product_detail",
  SUB_DETAIL: "sub_detail",
  INDUSTRY_DETAIL: "industry_detail",
};

const PRODUCT_CATEGORIES = [
  {
    key: "aramid-fibres-yarns",
    title: "Aramid Fibres & Yarns",
    blurb: "Meta & para aramid fibres and yarns for technical textiles.",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    key: "aramid-sewing-threads",
    title: "Aramid Sewing Threads",
    blurb: "High‑performance threads for heat and high‑tensile applications.",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    key: "aramid-fabrics",
    title: "Aramid Fabrics – Woven & Nonwoven",
    blurb: "Woven, needlefelt, blends, coated and laminated aramid fabrics.",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    key: "technical-fabric-conversions",
    title: "Technical Fabric Conversions",
    blurb: "Converted media for filtration and specialized use.",
    icon: <Factory className="w-5 h-5" />,
  },
  {
    key: "ppe-frr-products",
    title: "PPE & FRR Products",
    blurb: "Protective fabrics for turnout gear, arc‑flash, gloves and shells.",
    icon: <Flame className="w-5 h-5" />,
  },
  {
    key: "specialized-aramid-applications",
    title: "Specialized Aramid Applications",
    blurb: "Composites reinforcement, insulation felts, aramid paper and more.",
    icon: <Building2 className="w-5 h-5" />,
  },
];

const PRODUCT_SUBCATS = {
  "aramid-fibres-yarns": [
    "Meta-aramid staple fibre",
    "Para-aramid staple fibre",
    "Dope-dyed meta-aramid fibres (various colors)",
    "Aramid filament yarns",
    "Aramid spun yarns (meta, para, blends)",
    "Hybrid yarns (aramid + P84, aramid + glass, aramid + FR polyester)",
  ],
  "aramid-sewing-threads": [
    "2-ply to 6-ply aramid threads",
    "Meta-aramid threads for heat resistance",
    "Para-aramid threads for high tensile applications",
    "Bonded aramid threads for sewing heavy PPE",
    "PTFE-coated aramid threads (chemical resistance)",
  ],
  "aramid-fabrics": [
    "Woven meta-aramid fabrics (plain, twill, satin)",
    "Woven para-aramid fabrics (ballistic, high-strength)",
    "Needlefelt aramid fabrics (industrial filtration use)",
    "Aramid blends (aramid + P84, aramid + PPS)",
    "Coated aramid fabrics (silicone, PTFE, PU)",
    "Laminated aramid fabrics for PPE",
    "Aramid scrim",
  ],
  "technical-fabric-conversions": [
    "Filter press cloths (meta/para-aramid blends)",
    "Antistatic aramid filter media",
    "Food-grade aramid filter materials",
  ],
  "ppe-frr-products": [
    "Firefighter turnout gear fabrics",
    "Arc flash protective fabrics",
    "Cut-resistant fabrics (aramid + UHMWPE blends)",
    "Heat-resistant gloves & mitt fabrics",
    "Industrial PPE outer shells (jackets, coveralls)",
  ],
  "specialized-aramid-applications": [
    "Reinforcement fabrics for composites (UHMWPE)",
    "High-temp conveyor belts (aramid core)",
    "Aramid felts for insulation",
    "Aramid paper (for electrical insulation)",
  ],
};

const SUB_BENCHMARK_SPECS = {
  [slugify("Meta-aramid staple fibre")]: [
    { k: "Polymer", v: "Meta-aramid" },
    { k: "Cut lengths", v: "38 / 51 mm" },
    { k: "Fineness", v: "1.5–2.0 dtex" },
    { k: "LOI", v: ">= 28" },
    { k: "Thermal", v: "No melt/drip; chars > 370°C" },
  ],
  [slugify("Para-aramid staple fibre")]: [
    { k: "Polymer", v: "Para-aramid" },
    { k: "Tensile strength", v: "~3.0–3.6 GPa (fiber)" },
    { k: "Modulus", v: "~60–130 GPa" },
    { k: "Elongation", v: "~2.5–4%" },
    { k: "Thermal", v: "Decomposes > 500°C" },
  ],
  [slugify("Para-aramid threads for high tensile applications")]: [
    { k: "Composition", v: "100% para-aramid" },
    { k: "Tex range", v: "20–200 tex (ticket 20–2)" },
    { k: "Breaking strength", v: "≥ 60 N (Tex 40), increases with tex" },
    { k: "Elongation", v: "3.0–4.5%" },
    { k: "Heat resistance", v: "Service to ~200°C, chars > 450°C" },
  ],
  [slugify("Woven meta-aramid fabrics (plain, twill, satin)")]: [
    { k: "Areal weight", v: "150–260 g/m²" },
    { k: "Weaves", v: "plain / twill / satin" },
    { k: "LOI", v: ">= 28 (self‑extinguishing)" },
    { k: "Tensile (MD/CD)", v: ">= 600 / 400 N @ 200 g/m²" },
    { k: "Standards", v: "Typically used to meet ISO 15025 A/B once finished" },
  ],
  [slugify("Reinforcement fabrics for composites (UHMWPE)")]: [
    { k: "Form", v: "UD sheets or woven" },
    { k: "Areal density", v: "120–300 g/m² (UD typical)" },
    { k: "Use", v: "Soft/hard armor layups; laminates" },
    { k: "Note", v: "NIJ performance depends on layup design & test plan" },
  ],
};

const INDUSTRY_PAGES = [
  { key: "ppe", title: "PPE", blurb: "Fire & industrial PPE, workwear, uniforms.", icon: <Shield className="w-5 h-5" /> },
  { key: "defense", title: "Defense & Security", blurb: "Ballistics, FR apparel, high‑temp components.", icon: <Flame className="w-5 h-5" /> },
  { key: "mobility", title: "Mobility", blurb: "Automotive, rail, aerospace interiors & insulation.", icon: <Factory className="w-5 h-5" /> },
  { key: "infrastructure", title: "Infrastructure & Energy", blurb: "Renewables, switchgear, substations.", icon: <Building2 className="w-5 h-5" /> },
  { key: "telecom", title: "Telecom", blurb: "Reinforcement yarns, FR housings & cable ancillaries.", icon: <Globe className="w-5 h-5" /> },
];

export default function ArtanProtechSite() {
  const [page, setPage] = useState(PAGES.HOME);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(""); // "products" | "industries"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  useEffect(() => {
    setOpenDropdown("");
    setMobileOpen(false);
  }, [page]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Header
        onNavigate={setPage}
        onOpenDropdown={setOpenDropdown}
        openDropdown={openDropdown}
        setMobileOpen={setMobileOpen}
        mobileOpen={mobileOpen}
      />

      <main className="flex-1">
        {page === PAGES.HOME && (
          <Home
            onExplore={() => setOpenDropdown("products")}
            goProducts={() => setPage(PAGES.PRODUCTS)}
            goProductDetail={(key) => {
              setSelectedProduct(key);
              setPage(PAGES.PRODUCT_DETAIL);
            }}
            goAbout={() => setPage(PAGES.ABOUT)}
            goIndustries={() => setPage(PAGES.INDUSTRIES)}
          />
        )}

        {page === PAGES.ABOUT && <About />}
        {page === PAGES.CONTACT && <Contact />}

        {page === PAGES.PRODUCTS && (
          <Products
            onSelect={(key) => {
              setSelectedProduct(key);
              setPage(PAGES.PRODUCT_DETAIL);
            }}
          />
        )}

        {page === PAGES.INDUSTRIES && (
          <Industries
            onSelect={(key) => {
              setSelectedIndustry(key);
              setPage(PAGES.INDUSTRY_DETAIL);
            }}
          />
        )}

        {page === PAGES.PRODUCT_DETAIL && selectedProduct && (
          <ProductDetail
            keyId={selectedProduct}
            onBack={() => setPage(PAGES.PRODUCTS)}
            onSelectSub={(name) => {
              setSelectedSub(name);
              setPage(PAGES.SUB_DETAIL);
            }}
          />
        )}

        {page === PAGES.SUB_DETAIL && selectedProduct && selectedSub && (
          <SubProductDetail
            catKey={selectedProduct}
            subName={selectedSub}
            onBackToCat={() => setPage(PAGES.PRODUCT_DETAIL)}
          />
        )}

        {page === PAGES.INDUSTRY_DETAIL && (
          <IndustryDetail
            keyId={selectedIndustry}
            onBack={() => setPage(PAGES.INDUSTRIES)}
          />
        )}
      </main>

      {/* Sticky mailto "Get Quote" on home */}
      {page === PAGES.HOME && <StickyQuote />}

      <Footer onNavigate={setPage} />
    </div>
  );
}

function Header({
  onNavigate,
  onOpenDropdown,
  openDropdown,
  mobileOpen,
  setMobileOpen,
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onOpenDropdown("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onOpenDropdown]);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Logo */}
            {LOGO_SRC ? (
              <img src={LOGO_SRC} alt="Artan Protec" className="w-9 h-9 rounded" />
            ) : (
              <div className="w-9 h-9 rounded bg-black text-white grid place-items-center font-bold">
                A
              </div>
            )}
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight text-red-700">Artan Protec</div>
              <div className="text-xs text-black">Advanced Protection | Engineered Performance</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 relative" ref={dropdownRef}>
            <NavLink onClick={() => onNavigate(PAGES.HOME)}>
              <HomeIcon className="w-4 h-4 mr-1" /> Home
            </NavLink>
            <NavButton onClick={() => onOpenDropdown(openDropdown === "products" ? "" : "products")} active={openDropdown === "products"}>
              Products <ChevronDown className="w-4 h-4 ml-1" />
            </NavButton>
            <NavButton onClick={() => onOpenDropdown(openDropdown === "industries" ? "" : "industries")} active={openDropdown === "industries"}>
              Industries <ChevronDown className="w-4 h-4 ml-1" />
            </NavButton>
            <NavLink onClick={() => onNavigate(PAGES.ABOUT)}>About</NavLink>
            <NavLink onClick={() => onNavigate(PAGES.CONTACT)}>Contact</NavLink>
            <a className="ml-2 inline-flex items-center gap-2 rounded-xl border border-red-600 px-3 py-2 text-sm text-red-700 hover:bg-red-50" href="/brochures/artan-protec-brochure.pdf" target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4" /> Brochure
            </a>

            {/* Dropdown panels */}
            {openDropdown === "products" && (
              <MegaDropdown title="Explore Products">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {PRODUCT_CATEGORIES.map((p) => (
                    <DropdownCard
                      key={p.key}
                      title={p.title}
                      blurb={p.blurb}
                      icon={p.icon}
                      onClick={() => onNavigate(PAGES.PRODUCTS)}
                    />
                  ))}
                </div>
              </MegaDropdown>
            )}

            {openDropdown === "industries" && (
              <MegaDropdown title="Browse by Industry">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {INDUSTRY_PAGES.map((i) => (
                    <DropdownCard key={i.key} title={i.title} blurb={i.blurb} icon={i.icon} onClick={() => onNavigate(PAGES.INDUSTRIES)} />
                  ))}
                </div>
              </MegaDropdown>
            )}
          </nav>

          {/* Mobile */}
          <button className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-red-600" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-red-600 bg-white">
          <div className="px-4 py-3 space-y-1">
            <button className="w-full text-left px-2 py-2 rounded-lg hover:bg-red-50" onClick={() => onNavigate(PAGES.HOME)}>Home</button>
            <MobileDisclosure label="Products">
              {PRODUCT_CATEGORIES.map((p) => (
                <button key={p.key} onClick={() => onNavigate(PAGES.PRODUCTS)} className="flex items-start gap-3 text-left rounded-xl border border-red-200 p-3 hover:bg-red-50">
                  <div className="mt-1 text-red-700">{p.icon}</div>
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-neutral-500">{p.blurb}</div>
                  </div>
                </button>
              ))}
            </MobileDisclosure>

            <MobileDisclosure label="Industries">
              {INDUSTRY_PAGES.map((i) => (
                <button key={i.key} onClick={() => onNavigate(PAGES.INDUSTRIES)} className="flex items-start gap-3 text-left rounded-xl border border-red-200 p-3 hover:bg-red-50">
                  <div className="mt-1 text-red-700">{i.icon}</div>
                  <div>
                    <div className="font-medium">{i.title}</div>
                    <div className="text-sm text-neutral-500">{i.blurb}</div>
                  </div>
                </button>
              ))}
            </MobileDisclosure>

            <button className="w-full text-left px-2 py-2 rounded-lg hover:bg-red-50" onClick={() => onNavigate(PAGES.ABOUT)}>About</button>
            <button className="w-full text-left px-2 py-2 rounded-lg hover:bg-red-50" onClick={() => onNavigate(PAGES.CONTACT)}>Contact</button>
            <a className="block px-2 py-2 text-red-700" href="/brochures/artan-protec-brochure.pdf" target="_blank" rel="noopener noreferrer">Download Brochure</a>
          </div>
        </div>
      )}
    </header>
  );
}

function NavButton({ children, onClick, active }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center px-3 py-2 rounded-xl text-sm border ${active ? "bg-red-600 text-white border-red-600" : "border-red-600 text-red-700 hover:bg-red-50"}`}>
      {children}
    </button>
  );
}
function NavLink({ children, onClick }) {
  return (
    <button onClick={onClick} className="px-3 py-2 rounded-xl text-sm text-red-700 hover:bg-red-50">
      {children}
    </button>
  );
}

function MegaDropdown({ title, children }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] w-[min(100%,960px)]">
      <div className="rounded-2xl border border-red-200 bg-white shadow-xl p-6">
        <div className="mb-4 text-xs uppercase tracking-wider text-red-600">{title}</div>
        {children}
      </div>
    </div>
  );
}

function DropdownCard({ title, blurb, icon, onClick }) {
  return (
    <button onClick={onClick} className="group text-left rounded-2xl border border-red-200 p-4 hover:border-red-400 hover:bg-red-50">
      <div className="flex items-center gap-3">
        <div className="text-red-700">{icon}</div>
        <div className="font-semibold">{title}</div>
      </div>
      <div className="mt-2 text-sm text-neutral-600">{blurb}</div>
      <div className="mt-3 inline-flex items-center gap-1 text-sm text-red-700">
        Explore <ChevronRight className="w-4 h-4" />
      </div>
    </button>
  );
}

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: "easeOut", delay }}>
      {children}
    </motion.div>
  );
}

function Home({ onExplore, goProducts, goAbout, goIndustries, goProductDetail }) {
  // Subtle parallax for the hero visual
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 30]);

  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <h1 className="text-4xl/tight md:text-5xl/tight font-extrabold tracking-tight">
            Advanced Protection.
            <br />
            Engineered Performance.
          </h1>
          <p className="mt-4 text-neutral-700 max-w-xl">
            Artan Protec builds high‑performance materials for demanding
            environments — from aramid yarns & threads and PPE fabrics to
            ballistic UHMWPE UD sheets. Trusted by OEMs and end‑users across
            mobility, infrastructure & energy, telecom, and defense.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3" onClick={onExplore}>
              Explore Products <ChevronDown className="w-4 h-4" />
            </button>
            <button onClick={goProducts} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50">
              View Catalog <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={goAbout} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50">
              Who We Are
            </button>
          </div>

          {/* Quick stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { k: "Design‑led", s: "Materials engineering" },
              { k: "Export‑ready", s: "Global paperwork" },
              { k: "OEM + EPC", s: "Vendor friendly" },
              { k: "QA", s: "Tested performance" },
            ].map((item, idx) => (
              <Reveal delay={idx * 0.05} key={item.k}>
                <div className="rounded-xl border border-red-200 p-4">
                  <div className="text-sm text-neutral-500">{item.s}</div>
                  <div className="font-semibold">{item.k}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Hero image with subtle parallax */}
        <Reveal>
          <motion.div style={{ y }} className="relative">
            <img src={HERO_SRC} alt="Artan Protec hero" className="aspect-[4/3] w-full h-auto object-cover rounded-3xl border border-red-200" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-3xl overflow-hidden border border-red-200 hidden md:block">
              <img src={HERO_SRC} alt="Artan Protec secondary" className="w-full h-full object-cover opacity-80" />
            </div>
          </motion.div>
        </Reveal>
      </div>

      {/* Products strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {PRODUCT_CATEGORIES.map((p, idx) => (
              <Reveal delay={idx * 0.05} key={p.key}>
                <div className="rounded-2xl border border-red-200 hover:border-red-300 p-5">
                  <div className="flex items-center gap-3">
                    <div className="text-red-700">{p.icon}</div>
                    <div className="font-semibold">{p.title}</div>
                  </div>
                  <div className="mt-2 text-sm text-neutral-600">{p.blurb}</div>
                  <div className="mt-4">
                    <img src={PRODUCT_IMAGES[p.key] || "/images/placeholder.jpg"} alt={p.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="inline-flex items-center gap-1 text-sm text-red-700" onClick={() => goProductDetail(p.key)}>
                      Learn more <ChevronRight className="w-4 h-4" />
                    </button>
                    <a href={buildQuoteHref(p.title)} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-3 py-2 hover:bg-red-50 text-sm">
                      <Mail className="w-4 h-4" /> Get Quote
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Industries band */}
      <div className="bg-neutral-50 border-y border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SectionHeader title="Industries we serve" subtitle="Scope" />
          <Reveal>
            <div className="flex flex-wrap gap-3">
              {INDUSTRY_PAGES.map((i, idx) => (
                <Reveal delay={idx * 0.04} key={i.key}>
                  <button onClick={goIndustries} className="px-4 py-2 rounded-full border border-red-200 text-sm hover:bg-red-50">
                    {i.title}
                  </button>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Who we are teaser */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-6 items-center">
          <Reveal>
            <div className="lg:col-span-2 rounded-2xl border border-red-200 p-6">
              <div className="text-xs uppercase tracking-widest text-red-700/80">Who we are</div>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight">
                Engineering materials for protection and performance
              </h3>
              <p className="mt-2 text-neutral-700">
                We focus on aramid‑based yarns & threads, PPE fabrics, and UHMWPE
                UD sheets for ballistic applications. Built for high heat,
                abrasion, and impact environments — with documentation and export
                logistics dialed in.
              </p>
              <div className="mt-4">
                <a onClick={goAbout} className="inline-flex items-center gap-2 text-red-700 hover:underline cursor-pointer">
                  Learn more about Artan Protec
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="aspect-[4/3] rounded-2xl bg-neutral-100 border border-red-200 grid place-items-center">
              <span className="text-neutral-500 text-sm">Team / facility visual</span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* CTA band */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-6 items-center">
          <Reveal>
            <h3 className="text-2xl font-extrabold tracking-tight">Have a spec? Send it across.</h3>
            <p className="mt-2 text-white/80">
              Share drawings or application details — we’ll respond with
              feasible constructions, lead times, and MOQs.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="flex md:justify-end">
              <a href="mailto:artanprotec@gmail.com" className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3">
                Contact Sales <Mail className="w-4 h-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-widest text-red-700/80">{subtitle}</div>
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2">{title}</h2>
    </div>
  );
}

function Products({ onSelect }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="Products" subtitle="Catalog" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCT_CATEGORIES.map((p, idx) => (
          <motion.div key={p.key} className="text-left rounded-2xl border border-red-200 hover:border-red-300 p-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: idx * 0.05 }}>
            <div className="flex items-center gap-3">
              <div className="text-red-700">{p.icon}</div>
              <div className="font-semibold">{p.title}</div>
            </div>
            <div className="mt-2 text-sm text-neutral-600">{p.blurb}</div>
            <div className="mt-3">
              <img src={PRODUCT_IMAGES?.[p.key] || "/images/placeholder.jpg"} alt={p.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200" />
            </div>
            <ul className="mt-4 space-y-1 text-sm list-disc pl-5">
              {(PRODUCT_SUBCATS[p.key] || []).map((s) => (
                <li key={s} className="text-neutral-700">{s}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1 text-sm text-red-700" onClick={() => onSelect(p.key)}>
                Explore <ChevronRight className="w-4 h-4" />
              </button>
              <a href={buildQuoteHref(p.title)} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-3 py-2 hover:bg-red-50 text-sm">
                <Mail className="w-4 h-4" /> Get Quote
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Industries({ onSelect }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="Industries" subtitle="Where we fit" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INDUSTRY_PAGES.map((i, idx) => (
          <motion.button key={i.key} onClick={() => onSelect(i.key)} className="text-left rounded-2xl border border-red-200 hover:border-red-300 p-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: idx * 0.05 }}>
            <div className="flex items-center gap-3">
              <div className="text-red-700">{i.icon}</div>
              <div className="font-semibold">{i.title}</div>
            </div>
            <div className="mt-2 text-sm text-neutral-600">{i.blurb}</div>
            <div className="mt-4 aspect-[4/3] rounded-xl bg-neutral-100 border border-red-200 grid place-items-center">
              <span className="text-neutral-500 text-xs">Industry visual placeholder</span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function ProductDetail({ keyId, onBack, onSelectSub }) {
  const meta = PRODUCT_CATEGORIES.find((p) => p.key === keyId);
  if (!meta) return null;
  const subs = PRODUCT_SUBCATS[keyId] || [];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={onBack} className="text-sm text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 mb-6">
        <ChevronRight className="-scale-x-100 w-4 h-4" /> Back to Products
      </button>

      <h3 className="text-3xl font-extrabold tracking-tight">{meta.title}</h3>
      <p className="mt-2 text-neutral-700">{meta.blurb}</p>

      {/* Gallery */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <img src={PRODUCT_IMAGES?.[keyId] || "/images/placeholder.jpg"} alt={meta.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200" />
        {[2, 3, 4].map((n) => (
          <div key={n} className="aspect-[4/3] rounded-xl bg-neutral-100 border border-red-200 grid place-items-center">
            <span className="text-neutral-500 text-xs">Product visual {n}</span>
          </div>
        ))}
      </div>

      {/* Catalogue items */}
      <div className="mt-8 rounded-2xl border border-red-200 overflow-hidden">
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm font-medium">Catalogue Items</div>
        <div className="p-4">
          <ul className="list-disc pl-5 text-neutral-700 space-y-1">
            {subs.map((s) => (
              <li key={s}>
                <button className="text-red-700 hover:underline" onClick={() => onSelectSub(s)}>{s}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA row */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={PRODUCT_BROCHURES?.[keyId] || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-3">
          <Download className="w-4 h-4" /> Download Catalogue
        </a>
        <a href="mailto:artanprotec@gmail.com" className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50">
          <Mail className="w-4 h-4" /> Enquire
        </a>
      </div>
    </section>
  );
}

function SubProductDetail({ catKey, subName, onBackToCat }) {
  const specs = SUB_BENCHMARK_SPECS[slugify(subName)] || [];
  const cat = PRODUCT_CATEGORIES.find((c) => c.key === catKey);
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={onBackToCat} className="text-sm text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 mb-6">
        <ChevronRight className="-scale-x-100 w-4 h-4" /> Back to {cat?.title}
      </button>

      <h3 className="text-2xl font-extrabold tracking-tight">{subName}</h3>
      <p className="mt-2 text-neutral-700">Representative benchmark specifications (typical industry values).</p>

      <div className="mt-6 rounded-2xl border border-red-200 overflow-hidden">
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm font-medium">Technical Specifications</div>
        <div className="p-4">
          {specs.length ? (
            <table className="w-full text-sm">
              <tbody>
                {specs.map((row) => (
                  <tr key={row.k} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-medium text-neutral-800">{row.k}</td>
                    <td className="py-2 text-neutral-700">{row.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-neutral-600">Add specific data for this item to replace the generic example.</div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={buildQuoteHref(cat?.title || "Product", subName)} className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-3">
          <Mail className="w-4 h-4" /> Request Quote
        </a>
      </div>
    </section>
  );
}

function IndustryDetail({ keyId, onBack }) {
  const meta = INDUSTRY_PAGES.find((i) => i.key === keyId);
  if (!meta) return null;
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={onBack} className="text-sm text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 mb-6">
        <ChevronRight className="-scale-x-100 w-4 h-4" /> Back to Industries
      </button>
      <h3 className="text-3xl font-extrabold tracking-tight">{meta.title}</h3>
      <p className="mt-2 text-neutral-700">{meta.blurb}</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="aspect-[4/3] rounded-xl bg-neutral-100 border border-red-200 grid place-items-center">
            <span className="text-neutral-500 text-xs">Use‑case visual {n}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-red-200 overflow-hidden">
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm font-medium">Common Applications</div>
        <div className="p-4 grid md:grid-cols-2 gap-3 text-neutral-700">
          <ul className="list-disc pl-5 space-y-1">
            <li>OEM components & spares</li>
            <li>Maintenance, repair & overhaul (MRO)</li>
            <li>Vendor registration & pilot lots</li>
          </ul>
          <ul className="list-disc pl-5 space-y-1">
            <li>Long‑term supply frameworks</li>
            <li>Export‑ready documentation</li>
            <li>Testing & compliance support</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={`/brochures/industry-${keyId}.pdf`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-3">
          <Download className="w-4 h-4" />Industry One‑pager
        </a>
        <a href="mailto:artanprotec@gmail.com" className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50">
          <Mail className="w-4 h-4" />Talk to Sales
        </a>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="About Artan Protec" subtitle="Company" />
      <p className="text-neutral-700 leading-relaxed">
        Artan Protec designs and delivers high‑performance materials for harsh
        environments. Our portfolio spans aramid yarns & threads, PPE fabrics,
        and UHMWPE UD sheets for ballistic applications. We combine precise
        engineering with reliable execution to help OEMs, EPCs, and end‑users
        meet demanding performance, safety, and compliance requirements.
      </p>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {["Design & Development", "Manufacturing & QA", "Export Logistics"].map((k) => (
          <div key={k} className="rounded-xl border border-red-200 p-4">
            <div className="text-sm text-neutral-500">Capability</div>
            <div className="font-semibold">{k}</div>
            <div className="mt-2 text-sm text-neutral-600">
              Short descriptive copy placeholder. Add your certifications and
              references.
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 aspect-[5/2] rounded-2xl bg-neutral-100 border border-red-200 grid place-items-center">
        <span className="text-neutral-500 text-sm">Team / facility photo placeholder</span>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="Contact" subtitle="Let’s build together" />
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

          {/* Netlify static form */}
          <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" className="grid gap-3">
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Don’t fill this out: <input name="bot-field" />
              </label>
            </p>
            <input className="border border-red-300 rounded-xl px-3 py-2" placeholder="Name" name="name" required />
            <input className="border border-red-300 rounded-xl px-3 py-2" placeholder="Email" type="email" name="email" required />
            <textarea className="border border-red-300 rounded-xl px-3 py-2 min-h-[100px]" placeholder="Tell us about your requirement" name="message" required />
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3">
              <Mail className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function StickyQuote() {
  return (
    <a href={buildQuoteHref("Artan Protec")} className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-red-600 text-white px-5 py-3 shadow-lg hover:brightness-110" aria-label="Get Quote">
      <Mail className="w-4 h-4" /> Get Quote
    </a>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="mt-10 border-t border-red-200 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-extrabold tracking-tight">Artan Protec</div>
            <div className="text-xs text-neutral-500">Advanced Protection | Engineered Performance</div>
            <div className="mt-4 text-sm text-neutral-700">High‑performance materials for PPE, mobility, infrastructure, telecom, and defense.</div>
          </div>

          <FooterCol title="Products">
            {PRODUCT_CATEGORIES.map((p) => (
              <FooterLink key={p.key} onClick={() => onNavigate(PAGES.PRODUCTS)}>{p.title}</FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Industries">
            {INDUSTRY_PAGES.map((i) => (
              <FooterLink key={i.key} onClick={() => onNavigate(PAGES.INDUSTRIES)}>{i.title}</FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Company">
            <FooterLink onClick={() => onNavigate(PAGES.HOME)}>Home</FooterLink>
            <FooterLink onClick={() => onNavigate(PAGES.ABOUT)}>About</FooterLink>
            <FooterLink onClick={() => onNavigate(PAGES.CONTACT)}>Contact</FooterLink>
            <a href="/brochures/artan-protec-brochure.pdf" target="_blank" rel="noopener noreferrer" className="block text-sm text-red-700 hover:text-red-800">Download Brochure</a>
          </FooterCol>
        </div>

        <div className="mt-8 pt-6 border-t border-red-200 text-xs text-neutral-500 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Artan Protec. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-neutral-900">Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-neutral-900">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}
function FooterLink({ children, onClick }) {
  return (
    <button onClick={onClick} className="block text-sm text-neutral-700 hover:text-neutral-900">
      {children}
    </button>
  );
}

function MobileDisclosure({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full inline-flex items-center justify-between px-2 py-2 rounded-lg hover:bg-red-50">
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-2 pb-3 space-y-2">{children}</div>}
    </div>
  );
}

// ---- Dev smoke tests (console only) ----
if (typeof window !== "undefined") {
  try {
    const href = buildQuoteHref("Foo", "Bar");
    console.assert(href.startsWith("mailto:"), "buildQuoteHref returns mailto:");
    console.assert(href.includes(encodeURIComponent("Quote request - Foo")), "subject encoded");
    console.assert(href.includes("%0A"), "newline encoded via join(\\n)");
    console.assert(slugify("Meta-aramid staple fibre") === "meta-aramid-staple-fibre", "slugify basic");
    // Extra tests
    const href2 = buildQuoteHref("X");
    console.assert(href2.includes(encodeURIComponent("Quote request - X")), "subject encoded for no-item");
    console.assert(!href2.includes("undefined"), "no undefined in body when item omitted");
  } catch (_) {
    // no-op
  }
}
