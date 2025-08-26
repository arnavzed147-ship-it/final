"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Head from "next/head";
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
  Search,
  Sun,
  Moon,
  CheckCircle,
  AlertCircle,
  FileUp,
} from "lucide-react";

/**
 * Artan Protec — Single‑file React site (TailwindCSS + Framer Motion)
 * ----------------------------------------------------------------------
 * Brand: Artan Protec only — no mentions of other brands.
 * Colors: Red / Black / White theme. Supports dark mode.
 * Navbar: Home, Products, Industries, About, Contact + dark mode + language.
 * Animations: Scroll‑reveal + subtle hero parallax + hover lifts.
 * Logo: place /public/artan-protec-logo.png OR set LOGO_SRC to your asset path.
 * Hero: place /public/hero.jpg OR set HERO_SRC.
 * Product images & brochures: drop files into /public/images and /public/brochures
 *   - /images/aramid-yarn.jpg
 *   - /images/ppe-fabrics.jpg
 *   - /images/ballistic.jpg
 *   - /brochures/aramid-yarn-thread.pdf
 *   - /brochures/ppe-fabrics.pdf
 *   - /brochures/ballistic-systems.pdf
 */

const LOGO_SRC = "/artan-protec-logo.png"; // place this file in your public/ folder
const HERO_SRC = "/hero.jpg"; // place this file in your public/ folder

// --- Minimal i18n scaffold --------------------------------------------------
const I18N = {
  en: {
    nav: { home: "Home", products: "Products", industries: "Industries", about: "About", contact: "Contact", brochure: "Brochure" },
    heroTitle: "Advanced Protection.\nEngineered Performance.",
    heroBody:
      "Artan Protec builds high‑performance materials for demanding environments — from aramid yarns & threads and PPE fabrics to ballistic UHMWPE UD sheets.",
    ctas: { explore: "Explore Products", catalog: "View Catalog", about: "Who We Are", contactSales: "Contact Sales", getQuote: "Get Quote", enquire: "Enquire", download: "Download Catalogue" },
    sections: { industries: "Industries we serve", scope: "Scope", products: "Products", catalog: "Catalog", commonApps: "Common Applications", who: "Who we are" },
    contact: { title: "Contact", subtitle: "Let’s build together", name: "Name", email: "Email", message: "Tell us about your requirement", send: "Send", altEmail: "Use email instead" },
    searchPlaceholder: "Search products or subcategories",
  },
  hi: {
    nav: { home: "होम", products: "उत्पाद", industries: "उद्योग", about: "हमारे बारे में", contact: "संपर्क", brochure: "ब्रोशर" },
    heroTitle: "एडवांस्ड प्रोटेक्शन.\nइंजीनियर्ड परफ़ॉर्मेंस.",
    heroBody:
      "आर्टन प्रोटेक उच्च‑प्रदर्शन सामग्री बनाता है — एरामिड यार्न/थ्रेड, PPE फैब्रिक और बैलिस्टिक UHMWPE UD शीट्स तक।",
    ctas: { explore: "उत्पाद देखें", catalog: "कैटलॉग", about: "कौन हैं हम", contactSales: "सेल्स से संपर्क", getQuote: "कोट माँगें", enquire: "पूछताछ", download: "कैटलॉग डाउनलोड" },
    sections: { industries: "हम किन उद्योगों की सेवा करते हैं", scope: "क्षेत्र", products: "उत्पाद", catalog: "कैटलॉग", commonApps: "सामान्य उपयोग", who: "हम कौन हैं" },
    contact: { title: "संपर्क", subtitle: "मिलकर काम करें", name: "नाम", email: "ई‑मेल", message: "अपनी आवश्यकता बताएं", send: "भेजें", altEmail: "ई‑मेल से भेजें" },
    searchPlaceholder: "उत्पाद या उपश्रेणियाँ खोजें",
  },
};

// --- Helpers ----------------------------------------------------------------
function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);
  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };
  return { dark, toggle };
}

function useLang() {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    const saved = localStorage.getItem("lang") || "en";
    setLang(saved);
    document.documentElement.lang = saved;
  }, []);
  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem("lang", l);
    document.documentElement.lang = l;
  };
  const t = (path) => {
    const parts = path.split(".");
    let cur = I18N[lang] || I18N.en;
    for (const p of parts) cur = cur?.[p];
    return cur || I18N.en;
  };
  return { lang, switchLang, t };
}

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
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const { dark, toggle } = useTheme();
  const { lang, switchLang, t } = useLang();

  useEffect(() => {
    setOpenDropdown("");
    setMobileOpen(false);
  }, [page]);

  const metaTitle = "Artan Protec — Advanced Protection Materials";
  const metaDesc =
    "Aramid yarns & threads, PPE fabrics, and UHMWPE UD sheets for ballistic applications. Export‑ready, engineered performance.";

  const goToQuote = () => setPage(PAGES.CONTACT);

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 flex flex-col">
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={HERO_SRC} />
        <meta name="theme-color" content={dark ? "#0a0a0a" : "#ffffff"} />
      </Head>

      <Header
        page={page}
        onNavigate={setPage}
        onOpenDropdown={setOpenDropdown}
        openDropdown={openDropdown}
        setMobileOpen={setMobileOpen}
        mobileOpen={mobileOpen}
        dark={dark}
        toggleDark={toggle}
        lang={lang}
        switchLang={switchLang}
        t={t}
      />

      <main className="flex-1">
        {page === PAGES.HOME && (
          <Home
            t={t}
            onExplore={() => setOpenDropdown("products")}
            goProducts={() => setPage(PAGES.PRODUCTS)}
            goAbout={() => setPage(PAGES.ABOUT)}
            goIndustries={() => setPage(PAGES.INDUSTRIES)}
          />
        )}

        {page === PAGES.ABOUT && <About t={t} />}
        {page === PAGES.CONTACT && <Contact t={t} />}

        {page === PAGES.PRODUCTS && (
          <Products
            t={t}
            onSelect={(key) => {
              setSelectedProduct(key);
              setPage(PAGES.PRODUCT_DETAIL);
            }}
          />
        )}

        {page === PAGES.INDUSTRIES && (
          <Industries
            t={t}
            onSelect={(key) => {
              setSelectedIndustry(key);
              setPage(PAGES.INDUSTRY_DETAIL);
            }}
          />
        )}

        {page === PAGES.PRODUCT_DETAIL && (
          <ProductDetail t={t} keyId={selectedProduct} onBack={() => setPage(PAGES.PRODUCTS)} />
        )}

        {page === PAGES.INDUSTRY_DETAIL && (
          <IndustryDetail t={t} keyId={selectedIndustry} onBack={() => setPage(PAGES.INDUSTRIES)} />
        )}
      </main>

      {page === PAGES.HOME && <StickyQuote onClick={goToQuote} t={t} />}

      <Footer onNavigate={setPage} t={t} page={page} />
    </div>
  );
}

function Header({ page, onNavigate, onOpenDropdown, openDropdown, mobileOpen, setMobileOpen, dark, toggleDark, lang, switchLang, t }) {
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
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Logo */}
            {LOGO_SRC ? (
              <img src={LOGO_SRC} alt="Artan Protec" className="w-9 h-9 rounded" />
            ) : (
              <div className="w-9 h-9 rounded bg-black text-white grid place-items-center font-bold">A</div>
            )}
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight text-red-700">Artan Protec</div>
              <div className="text-xs text-black dark:text-white/80">Advanced Protection | Engineered Performance</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 relative" ref={dropdownRef}>
            <NavLink active={page===PAGES.HOME} onClick={() => onNavigate(PAGES.HOME)}>
              <HomeIcon className="w-4 h-4 mr-1" /> {t("nav.home")}
            </NavLink>
            <NavButton
              onClick={() => onOpenDropdown(openDropdown === "products" ? "" : "products")}
              active={openDropdown === "products" || page===PAGES.PRODUCTS || page===PAGES.PRODUCT_DETAIL}
            >
              {t("nav.products")} <ChevronDown className="w-4 h-4 ml-1" />
            </NavButton>
            <NavButton
              onClick={() => onOpenDropdown(openDropdown === "industries" ? "" : "industries")}
              active={openDropdown === "industries" || page===PAGES.INDUSTRIES || page===PAGES.INDUSTRY_DETAIL}
            >
              {t("nav.industries")} <ChevronDown className="w-4 h-4 ml-1" />
            </NavButton>
            <NavLink active={page===PAGES.ABOUT} onClick={() => onNavigate(PAGES.ABOUT)}>{t("nav.about")}</NavLink>
            <NavLink active={page===PAGES.CONTACT} onClick={() => onNavigate(PAGES.CONTACT)}>{t("nav.contact")}</NavLink>
            <a
              className="ml-2 inline-flex items-center gap-2 rounded-xl border border-red-600 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
              href="/brochures/artan-protec-brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4" /> {t("nav.brochure")}
            </a>

            {/* Dark mode */}
            <button
              onClick={toggleDark}
              className="ml-2 inline-flex items-center justify-center w-10 h-10 rounded-lg border border-red-600 hover:bg-red-50 dark:hover:bg-neutral-800"
              aria-label="Toggle theme"
              title="Toggle dark mode"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Lang switch */}
            <div className="ml-2 inline-flex items-center gap-1">
              <button
                onClick={() => switchLang(lang === "en" ? "hi" : "en")}
                className="inline-flex items-center gap-1 rounded-lg border border-red-600 px-3 py-2 text-sm text-red-700 hover:bg-red-50 dark:hover:bg-neutral-800"
                title="Language"
              >
                <Globe className="w-4 h-4" /> {lang.toUpperCase()}
              </button>
            </div>

            {/* Dropdown panels */}
            {openDropdown === "products" && (
              <MegaDropdown title="Explore Products">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {PRODUCT_CATEGORIES.map((p) => (
                    <DropdownCard key={p.key} title={p.title} blurb={p.blurb} icon={p.icon} onClick={() => onNavigate(PAGES.PRODUCTS)} />
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
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-red-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-red-600 bg-white dark:bg-neutral-900">
          <div className="px-4 py-3 space-y-1">
            <button className={`w-full text-left px-2 py-2 rounded-lg hover:bg-red-50 ${page===PAGES.HOME?"underline font-semibold":""}`} onClick={() => onNavigate(PAGES.HOME)}>
              {t("nav.home")}
            </button>
            <MobileDisclosure label={t("nav.products")}>
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

            <MobileDisclosure label={t("nav.industries")}>
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

            <button className={`w-full text-left px-2 py-2 rounded-lg hover:bg-red-50 ${page===PAGES.ABOUT?"underline font-semibold":""}`} onClick={() => onNavigate(PAGES.ABOUT)}>
              {t("nav.about")}
            </button>
            <button className={`w-full text-left px-2 py-2 rounded-lg hover:bg-red-50 ${page===PAGES.CONTACT?"underline font-semibold":""}`} onClick={() => onNavigate(PAGES.CONTACT)}>
              {t("nav.contact")}
            </button>
            <a className="block px-2 py-2 text-red-700" href="/brochures/artan-protec-brochure.pdf" target="_blank" rel="noopener noreferrer">
              {t("nav.brochure")}
            </a>

            {/* Dark + Lang */}
            <div className="flex items-center gap-2 pt-2">
              <button onClick={toggleDark} className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-red-600">
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={() => switchLang(lang === "en" ? "hi" : "en")} className="inline-flex items-center gap-1 rounded-lg border border-red-600 px-3 py-2 text-sm text-red-700">
                <Globe className="w-4 h-4" /> {lang.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavButton({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-2 rounded-xl text-sm border transition ${
        active ? "bg-red-600 text-white border-red-600" : "border-red-600 text-red-700 hover:bg-red-50 dark:hover:bg-neutral-800"
      }`}
    >
      {children}
    </button>
  );
}
function NavLink({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-sm text-red-700 hover:bg-red-50 dark:hover:bg-neutral-800 ${active?"underline font-semibold":""}`}
    >
      {children}
    </button>
  );
}

function MegaDropdown({ title, children }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] w-[min(100%,960px)]">
      <div className="rounded-2xl border border-red-200 bg-white dark:bg-neutral-900 shadow-xl p-6">
        <div className="mb-4 text-xs uppercase tracking-wider text-red-600">{title}</div>
        {children}
      </div>
    </div>
  );
}

function DropdownCard({ title, blurb, icon, onClick }) {
  return (
    <button onClick={onClick} className="group text-left rounded-2xl border border-red-200 p-4 hover:border-red-400 hover:bg-red-50 dark:hover:bg-neutral-800 transition shadow-sm hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="text-red-700">{icon}</div>
        <div className="font-semibold">{title}</div>
      </div>
      <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{blurb}</div>
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

function SectionSeparator() {
  return <div className="h-10 bg-gradient-to-r from-red-50 via-red-100 to-transparent dark:from-neutral-800 dark:via-neutral-800" />;
}

function Home({ t, onExplore, goProducts, goAbout, goIndustries }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 30]);

  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <h1 className="text-4xl/tight md:text-5xl/tight font-extrabold tracking-tight whitespace-pre-line">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 max-w-xl">{t("heroBody")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3" onClick={onExplore}>
              {t("ctas.explore")} <ChevronDown className="w-4 h-4" />
            </button>
            <button onClick={goProducts} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50 dark:hover:bg-neutral-800">
              {t("ctas.catalog")} <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={goAbout} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50 dark:hover:bg-neutral-800">
              {t("ctas.about")}
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
                <div className="rounded-xl border border-red-200 dark:border-neutral-700 p-4 hover:shadow-sm transition">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">{item.s}</div>
                  <div className="font-semibold">{item.k}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Hero image with subtle parallax */}
        <Reveal>
          <motion.div style={{ y }} className="relative">
            <img src={HERO_SRC} alt="Artan Protec hero" className="aspect-[4/3] w-full h-auto object-cover rounded-3xl border border-red-200 dark:border-neutral-700" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-3xl overflow-hidden border border-red-200 dark:border-neutral-700 hidden md:block">
              <img src={HERO_SRC} alt="Artan Protec secondary" className="w-full h-full object-cover opacity-80" />
            </div>
          </motion.div>
        </Reveal>
      </div>

      <SectionSeparator />

      {/* Products strip as cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <SectionHeader title={t("sections.products")} subtitle={t("sections.catalog")} />
        <Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {PRODUCT_CATEGORIES.slice(0,3).map((p, idx) => (
              <Reveal delay={idx * 0.05} key={p.key}>
                <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-red-200 dark:border-neutral-700 p-5 hover:shadow-md transition">
                  <div className="flex items-center gap-3">
                    <div className="text-red-700">{p.icon}</div>
                    <div className="font-semibold">{p.title}</div>
                  </div>
                  <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{p.blurb}</div>
                  <div className="mt-4">
                    <img src={PRODUCT_IMAGES[p.key] || "/images/placeholder.jpg"} alt={p.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200 dark:border-neutral-700" />
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm text-red-700 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    {t("ctas.catalog")} <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-800 border-y border-red-100 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SectionHeader title={t("sections.industries")} subtitle={t("sections.scope")} />
          <Reveal>
            <div className="flex flex-wrap gap-3">
              {INDUSTRY_PAGES.map((i, idx) => (
                <Reveal delay={idx * 0.04} key={i.key}>
                  <button className="px-4 py-2 rounded-full border border-red-200 dark:border-neutral-700 text-sm hover:bg-red-50 dark:hover:bg-neutral-700">
                    {i.title}
                  </button>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-6 items-center">
          <Reveal>
            <div className="lg:col-span-2 rounded-2xl border border-red-200 dark:border-neutral-700 p-6">
              <div className="text-xs uppercase tracking-widest text-red-700/80">{t("sections.who")}</div>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight">Engineering materials for protection and performance</h3>
              <p className="mt-2 text-neutral-700 dark:text-neutral-300">
                We focus on aramid‑based yarns & threads, PPE fabrics, and UHMWPE UD sheets for ballistic applications. Built for high heat, abrasion, and impact environments — with documentation and export logistics dialed in.
              </p>
              <div className="mt-4">
                <a className="inline-flex items-center gap-2 text-red-700 hover:underline cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Learn more about Artan Protec <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="aspect-[4/3] rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-red-200 dark:border-neutral-700 grid place-items-center">
              <span className="text-neutral-500 text-sm">Team / facility visual</span>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-6 items-center">
          <Reveal>
            <h3 className="text-2xl font-extrabold tracking-tight">Have a spec? Send it across.</h3>
            <p className="mt-2 text-white/80">Share drawings or application details — we’ll respond with feasible constructions, lead times, and MOQs.</p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="flex md:justify-end">
              <a href="mailto:artanprotec@gmail.com" className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3">
                {t("ctas.contactSales")} <Mail className="w-4 h-4" />
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

function Products({ onSelect, t }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return PRODUCT_CATEGORIES;
    return PRODUCT_CATEGORIES.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(query) || p.blurb.toLowerCase().includes(query);
      const subs = (PRODUCT_SUBCATS[p.key] || []).join(" ").toLowerCase().includes(query);
      return inTitle || subs;
    });
  }, [q]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title={t("sections.products")} subtitle={t("sections.catalog")} />

      {/* Search / filter bar */}
      <div className="mb-6 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-red-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            placeholder={t("searchPlaceholder")}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, idx) => (
          <motion.div
            key={p.key}
            className="text-left rounded-2xl border border-red-200 dark:border-neutral-700 p-5 hover:border-red-300 hover:shadow-md transition"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
          >
            <div className="flex items-center gap-3">
              <div className="text-red-700">{p.icon}</div>
              <div className="font-semibold">{p.title}</div>
            </div>
            <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{p.blurb}</div>
            <div className="mt-3">
              <img src={PRODUCT_IMAGES?.[p.key] || "/images/placeholder.jpg"} alt={p.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200 dark:border-neutral-700" />
            </div>
            {/* Cards over lists */}
            {typeof PRODUCT_SUBCATS !== "undefined" && (
              <div className="mt-4 grid grid-cols-1 gap-2">
                {(PRODUCT_SUBCATS[p.key] || []).filter((s) => s.toLowerCase().includes(q.toLowerCase()) || !q).map((s) => (
                  <div key={s} className="rounded-xl border border-red-200 dark:border-neutral-700 p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-neutral-800 transition">
                    <span className="text-sm text-neutral-800 dark:text-neutral-200">{s}</span>
                    <a
                      href={`mailto:artanprotec@gmail.com?subject=${encodeURIComponent('Quote request - ' + p.title)}&body=${encodeURIComponent('Interested in: ' + s)}`}
                      className="inline-flex items-center gap-1 text-xs text-red-700 hover:underline"
                    >
                      <Mail className="w-3 h-3" /> {t("ctas.getQuote")}
                    </a>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1 text-sm text-red-700" onClick={() => onSelect(p.key)}>
                Explore <ChevronRight className="w-4 h-4" />
              </button>
              <a
                href={`mailto:artanprotec@gmail.com?subject=${encodeURIComponent('Quote request - ' + p.title)}`}
                className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-3 py-2 hover:bg-red-50 dark:hover:bg-neutral-800 text-sm"
              >
                <Mail className="w-4 h-4" /> {t("ctas.getQuote")}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Industries({ onSelect, t }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title={t("nav.industries")} subtitle={t("sections.scope")} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INDUSTRY_PAGES.map((i, idx) => (
          <motion.button
            key={i.key}
            onClick={() => onSelect(i.key)}
            className="text-left rounded-2xl border border-red-200 dark:border-neutral-700 hover:border-red-300 p-5 hover:shadow-md transition"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
          >
            <div className="flex items-center gap-3">
              <div className="text-red-700">{i.icon}</div>
              <div className="font-semibold">{i.title}</div>
            </div>
            <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{i.blurb}</div>
            <div className="mt-4 aspect-[4/3] rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-red-200 dark:border-neutral-700 grid place-items-center">
              <span className="text-neutral-500 text-xs">Industry visual placeholder</span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function ProductDetail({ keyId, onBack, t }) {
  const meta = PRODUCT_CATEGORIES.find((p) => p.key === keyId);
  if (!meta) return null;
  const subs = PRODUCT_SUBCATS[keyId] || [];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={onBack} className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 inline-flex items-center gap-1 mb-6">
        <ChevronRight className="-scale-x-100 w-4 h-4" /> Back to {t("nav.products")}
      </button>
      <h3 className="text-3xl font-extrabold tracking-tight">{meta.title}</h3>
      <p className="mt-2 text-neutral-700 dark:text-neutral-300">{meta.blurb}</p>

      {/* Gallery */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <img src={PRODUCT_IMAGES?.[keyId] || "/images/placeholder.jpg"} alt={meta.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200 dark:border-neutral-700" />
        {[2, 3, 4].map((n) => (
          <div key={n} className="aspect-[4/3] rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-red-200 dark:border-neutral-700 grid place-items-center">
            <span className="text-neutral-500 text-xs">Product visual {n}</span>
          </div>
        ))}
      </div>

      {/* Catalogue items as cards */}
      <div className="mt-8 rounded-2xl border border-red-200 dark:border-neutral-700 overflow-hidden">
        <div className="px-4 py-3 bg-red-50 dark:bg-neutral-800 border-b border-red-200 dark:border-neutral-700 text-sm font-medium">Catalogue Items</div>
        <div className="p-4 grid sm:grid-cols-2 gap-3">
          {subs.map((s) => (
            <div key={s} className="rounded-xl border border-red-200 dark:border-neutral-700 p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-neutral-800 transition">
              <span className="text-sm text-neutral-800 dark:text-neutral-200">{s}</span>
              <a href={`mailto:artanprotec@gmail.com?subject=${encodeURIComponent('Quote request - ' + meta.title)}&body=${encodeURIComponent('Interested in: ' + s)}`} className="inline-flex items-center gap-1 text-xs text-red-700 hover:underline">
                <Mail className="w-3 h-3" /> {t("ctas.getQuote")}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={PRODUCT_BROCHURES?.[keyId] || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-3">
          <Download className="w-4 h-4" /> {t("ctas.download")}
        </a>
        <a href="mailto:artanprotec@gmail.com" className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50 dark:hover:bg-neutral-800">
          <Mail className="w-4 h-4" /> {t("ctas.enquire")}
        </a>
      </div>
    </section>
  );
}

function IndustryDetail({ keyId, onBack, t }) {
  const meta = INDUSTRY_PAGES.find((i) => i.key === keyId);
  if (!meta) return null;
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={onBack} className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 inline-flex items-center gap-1 mb-6">
        <ChevronRight className="-scale-x-100 w-4 h-4" /> Back to {t("nav.industries")}
      </button>
      <h3 className="text-3xl font-extrabold tracking-tight">{meta.title}</h3>
      <p className="mt-2 text-neutral-700 dark:text-neutral-300">{meta.blurb}</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="aspect-[4/3] rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-red-200 dark:border-neutral-700 grid place-items-center">
            <span className="text-neutral-500 text-xs">Use‑case visual {n}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-red-200 dark:border-neutral-700 overflow-hidden">
        <div className="px-4 py-3 bg-red-50 dark:bg-neutral-800 border-b border-red-200 dark:border-neutral-700 text-sm font-medium">{t("sections.commonApps")}</div>
        <div className="p-4 grid md:grid-cols-2 gap-3 text-neutral-700 dark:text-neutral-300">
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
          <Download className="w-4 h-4" /> Industry One‑pager
        </a>
        <a href="mailto:artanprotec@gmail.com" className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50 dark:hover:bg-neutral-800">
          <Mail className="w-4 h-4" /> Talk to Sales
        </a>
      </div>
    </section>
  );
}

function About({ t }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="About Artan Protec" subtitle="Company" />
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        Artan Protec designs and delivers high‑performance materials for harsh environments. Our portfolio spans aramid yarns & threads, PPE fabrics, and UHMWPE UD sheets for ballistic applications. We combine precise engineering with reliable execution to help OEMs, EPCs, and end‑users meet demanding performance, safety, and compliance requirements.
      </p>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {["Design & Development", "Manufacturing & QA", "Export Logistics"].map((k) => (
          <div key={k} className="rounded-xl border border-red-200 dark:border-neutral-700 p-4 hover:shadow-sm transition">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">Capability</div>
            <div className="font-semibold">{k}</div>
            <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Short descriptive copy placeholder. Add your certifications and references.</div>
          </div>
        ))}
      </div>

      <div className="mt-8 aspect-[5/2] rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-red-200 dark:border-neutral-700 grid place-items-center">
        <span className="text-neutral-500 text-sm">Team / facility photo placeholder</span>
      </div>
    </section>
  );
}

function Contact({ t }) {
  const [status, setStatus] = useState("idle"); // idle | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(Object.fromEntries(formData)).toString(),
      });
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title={t("contact.title")} subtitle={t("contact.subtitle")} />
      <div className="rounded-2xl border border-red-200 dark:border-neutral-700 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">Email</div>
            <a className="font-medium" href="mailto:artanprotec@gmail.com">artanprotec@gmail.com</a>
            <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Phone</div>
            <a className="font-medium" href="tel:+14704450578">+1 (470) 445‑0578</a>
            <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">HQ</div>
            <div className="font-medium">Mumbai, India</div>
          </div>

          {/* Netlify‑compatible form */}
          <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-3">
            <input type="hidden" name="form-name" value="contact" />
            <input type="hidden" name="context" value="website-contact" />
            <p className="hidden">
              <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
            </p>
            <input className="border border-red-300 dark:border-neutral-700 rounded-xl px-3 py-2 bg-white dark:bg-neutral-900" placeholder={t("contact.name")} name="name" required />
            <input type="email" className="border border-red-300 dark:border-neutral-700 rounded-xl px-3 py-2 bg-white dark:bg-neutral-900" placeholder={t("contact.email")} name="email" required />
            <textarea className="border border-red-300 dark:border-neutral-700 rounded-xl px-3 py-2 min-h-[100px] bg-white dark:bg-neutral-900" placeholder={t("contact.message")} name="message" />
            <div>
              <label className="text-sm text-neutral-600 dark:text-neutral-300 inline-flex items-center gap-2">
                <FileUp className="w-4 h-4" /> Attachment (PDF/JPG/PNG)
              </label>
              <input type="file" name="attachment" accept=".pdf,.jpg,.jpeg,.png" className="mt-1 block w-full text-sm" />
            </div>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3">
              <Mail className="w-4 h-4" /> {t("contact.send")}
            </button>
            {status === "success" && (
              <div className="mt-2 inline-flex items-center gap-2 text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800 px-3 py-2 rounded-xl">
                <CheckCircle className="w-4 h-4" /> Thanks — we received your request.
              </div>
            )}
            {status === "error" && (
              <div className="mt-2 inline-flex items-center gap-2 text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800 px-3 py-2 rounded-xl">
                <AlertCircle className="w-4 h-4" /> Something went wrong. Please try again or use email.
              </div>
            )}
            <a href="mailto:artanprotec@gmail.com?subject=Website%20contact" className="text-sm text-red-700 hover:underline mt-1">
              {t("contact.altEmail")}
            </a>
          </form>
        </div>
      </div>
    </section>
  );
}

function StickyQuote({ onClick, t }) {
  return (
    <button onClick={onClick} className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-red-600 text-white px-5 py-3 shadow-lg hover:brightness-110" aria-label="Get Quote">
      <Mail className="w-4 h-4" /> {t("ctas.getQuote")}
    </button>
  );
}

function Footer({ onNavigate, t, page }) {
  return (
    <footer className="mt-10 border-t border-red-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-extrabold tracking-tight">Artan Protec</div>
            <div className="text-xs text-neutral-500">Advanced Protection | Engineered Performance</div>
            <div className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">High‑performance materials for PPE, mobility, infrastructure, telecom, and defense.</div>
          </div>

          <FooterCol title={t("nav.products")}> 
            {PRODUCT_CATEGORIES.map((p) => (
              <FooterLink key={p.key} onClick={() => onNavigate(PAGES.PRODUCTS)}>{p.title}</FooterLink>
            ))}
          </FooterCol>

          <FooterCol title={t("nav.industries")}>
            {INDUSTRY_PAGES.map((i) => (
              <FooterLink key={i.key} onClick={() => onNavigate(PAGES.INDUSTRIES)}>{i.title}</FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Company">
            <FooterLink onClick={() => onNavigate(PAGES.HOME)}>{t("nav.home")}</FooterLink>
            <FooterLink onClick={() => onNavigate(PAGES.ABOUT)}>{t("nav.about")}</FooterLink>
            <FooterLink onClick={() => onNavigate(PAGES.CONTACT)}>{t("nav.contact")}</FooterLink>
            <a href="/brochures/artan-protec-brochure.pdf" target="_blank" rel="noopener noreferrer" className="block text-sm text-red-700 hover:text-red-800">
              {t("nav.brochure")}
            </a>
          </FooterCol>
        </div>

        <div className="mt-8 pt-6 border-t border-red-200 dark:border-neutral-800 text-xs text-neutral-500 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Artan Protec. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-neutral-900 dark:hover:text-white">Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-neutral-900 dark:hover:text-white">Terms</a>
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
    <button onClick={onClick} className="block text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white">
      {children}
    </button>
  );
}

function MobileDisclosure({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full inline-flex items-center justify-between px-2 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-neutral-800">
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-2 pb-3 space-y-2">{children}</div>}
    </div>
  );
}
