"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Languages,
} from "lucide-react";

/**
 * Artan Protec — Single‑file React site (TailwindCSS + Framer Motion)
 * ----------------------------------------------------------------------
 * Brand: Artan Protec only — no mentions of other brands.
 * Colors: Red / Black / White theme.
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
 * Netlify Form: Works out-of-the-box via <form name="contact" data-netlify="true" ...>
 */

// ---------- Assets ----------
const LOGO_SRC = "/artan-protec-logo.png"; // place this file in your public/ folder
const HERO_SRC = "/hero.jpg"; // place this file in your public/ folder

// Image & brochure maps (drop files with these names and paths)
const PRODUCT_IMAGES = {
  "aramid-fibres-yarns": "/images/aramid-yarn.jpg",
  "aramid-sewing-threads": "/images/aramid-yarn.jpg",
  "aramid-fabrics": "/images/ppe-fabrics.jpg",
  "technical-fabric-conversions": "/images/ppe-fabrics.jpg",
  "ppe-frr-products": "/images/ppe-fabrics.jpg",
  "specialized-aramid-applications": "/images/ballistic.jpg",
  "ballistic-uhmwpe": "/images/ballistic.jpg",
};

const PRODUCT_BROCHURES = {
  "aramid-fibres-yarns": "/brochures/artan-protec-brochure.pdf",
  "aramid-sewing-threads": "/brochures/artan-protec-brochure.pdf",
  "aramid-fabrics": "/brochures/artan-protec-brochure.pdf",
  "technical-fabric-conversions": "/brochures/artan-protec-brochure.pdf",
  "ppe-frr-products": "/brochures/artan-protec-brochure.pdf",
  "specialized-aramid-applications": "/brochures/artan-protec-brochure.pdf",
  "ballistic-uhmwpe": "/brochures/ballistic-systems.pdf",
};

// ---------- Routing ----------
const PAGES = {
  HOME: "home",
  ABOUT: "about",
  CONTACT: "contact",
  PRODUCTS: "products",
  INDUSTRIES: "industries",
  PRODUCT_DETAIL: "product_detail",
  INDUSTRY_DETAIL: "industry_detail",
};

// ---------- Catalogue (Categories + Subcategories) ----------
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
  {
    key: "ballistic-uhmwpe",
    title: "Ballistic Systems — UHMWPE UD Sheets",
    blurb:
      "High‑performance unidirectional (UD) UHMWPE sheets for armor systems.",
    icon: <Shield className="w-5 h-5" />,
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
  "ballistic-uhmwpe": ["UHMWPE UD sheets (SB/HB class)", "Hard/soft armor layups"],
};

const INDUSTRY_PAGES = [
  { key: "ppe", title: "PPE", blurb: "Fire & industrial PPE, workwear, uniforms.", icon: <Shield className="w-5 h-5" /> },
  { key: "defense", title: "Defense & Security", blurb: "Ballistics, FR apparel, high‑temp components.", icon: <Flame className="w-5 h-5" /> },
  { key: "mobility", title: "Mobility", blurb: "Automotive, rail, aerospace interiors & insulation.", icon: <Factory className="w-5 h-5" /> },
  { key: "infrastructure", title: "Infrastructure & Energy", blurb: "Renewables, switchgear, substations.", icon: <Building2 className="w-5 h-5" /> },
  { key: "telecom", title: "Telecom", blurb: "Reinforcement yarns, FR housings & cable ancillaries.", icon: <Globe className="w-5 h-5" /> },
];

// ---------- i18n (very light) ----------
const LANGS = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "hi", label: "हिंदी", dir: "ltr" },
];

const T = {
  en: {
    title: "Advanced Protection.\nEngineered Performance.",
    subtitle:
      "Artan Protec builds high‑performance materials for demanding environments — from aramid yarns & threads and PPE fabrics to ballistic UHMWPE UD sheets.",
    who: "Who We Are",
    explore: "Explore Products",
    viewCatalog: "View Catalog",
    industriesWeServe: "Industries we serve",
    scope: "Scope",
    haveSpec: "Have a spec? Send it across.",
    contactSales: "Contact Sales",
    products: "Products",
    catalog: "Catalog",
    industries: "Industries",
    whereWeFit: "Where we fit",
    company: "Company",
    about: "About",
    contact: "Contact",
    home: "Home",
    getQuote: "Get Quote",
    searchProducts: "Search products …",
    filterAll: "All",
    contactLeadTitle: "Let’s build together",
    name: "Name",
    email: "Email",
    message: "Tell us about your requirement",
    attach: "Attach spec (optional)",
    send: "Send",
    sentThanks: "Thanks! We’ve received your message.",
    brochure: "Brochure",
  },
  es: {
    title: "Protección avanzada.\nRendimiento diseñado.",
    subtitle:
      "Artan Protec fabrica materiales de alto rendimiento para entornos exigentes.",
    who: "Quiénes somos",
    explore: "Explorar productos",
    viewCatalog: "Ver catálogo",
    industriesWeServe: "Industrias a las que servimos",
    scope: "Ámbito",
    haveSpec: "¿Tienes especificaciones? Envíalas.",
    contactSales: "Contactar ventas",
    products: "Productos",
    catalog: "Catálogo",
    industries: "Industrias",
    whereWeFit: "Dónde encajamos",
    company: "Compañía",
    about: "Acerca de",
    contact: "Contacto",
    home: "Inicio",
    getQuote: "Pedir cotización",
    searchProducts: "Buscar productos …",
    filterAll: "Todos",
    contactLeadTitle: "Construyamos juntos",
    name: "Nombre",
    email: "Correo",
    message: "Cuéntanos tu requerimiento",
    attach: "Adjuntar especificación (opcional)",
    send: "Enviar",
    sentThanks: "¡Gracias! Hemos recibido tu mensaje.",
    brochure: "Folleto",
  },
  fr: {
    title: "Protection avancée.\nPerformance conçue.",
    subtitle:
      "Artan Protec conçoit des matériaux haute performance pour des environnements exigeants.",
    who: "Qui sommes-nous",
    explore: "Explorer les produits",
    viewCatalog: "Voir le catalogue",
    industriesWeServe: "Secteurs que nous servons",
    scope: "Portée",
    haveSpec: "Vous avez un cahier des charges ? Envoyez-le.",
    contactSales: "Contacter les ventes",
    products: "Produits",
    catalog: "Catalogue",
    industries: "Secteurs",
    whereWeFit: "Où nous intervenons",
    company: "Entreprise",
    about: "À propos",
    contact: "Contact",
    home: "Accueil",
    getQuote: "Demander un devis",
    searchProducts: "Rechercher des produits …",
    filterAll: "Tous",
    contactLeadTitle: "Construisons ensemble",
    name: "Nom",
    email: "Email",
    message: "Parlez-nous de votre besoin",
    attach: "Joindre un cahier des charges (facultatif)",
    send: "Envoyer",
    sentThanks: "Merci ! Nous avons bien reçu votre message.",
    brochure: "Brochure",
  },
  ar: {
    title: "حماية متقدمة.\nأداء هندسي.",
    subtitle:
      "توفر Artan Protec مواد عالية الأداء لبيئات العمل الصعبة.",
    who: "من نحن",
    explore: "استكشاف المنتجات",
    viewCatalog: "عرض الكتالوج",
    industriesWeServe: "القطاعات التي نخدمها",
    scope: "النطاق",
    haveSpec: "لديك المواصفات؟ أرسلها.",
    contactSales: "تواصل مع المبيعات",
    products: "المنتجات",
    catalog: "الكتالوج",
    industries: "القطاعات",
    whereWeFit: "مجالات عملنا",
    company: "الشركة",
    about: "نبذة",
    contact: "اتصال",
    home: "الرئيسية",
    getQuote: "احصل على عرض",
    searchProducts: "ابحث في المنتجات …",
    filterAll: "الكل",
    contactLeadTitle: "فلننجز معًا",
    name: "الاسم",
    email: "البريد الإلكتروني",
    message: "أخبرنا عن متطلباتك",
    attach: "أرفق المواصفات (اختياري)",
    send: "إرسال",
    sentThanks: "شكرًا! استلمنا رسالتك.",
    brochure: "كتيّب",
  },
  hi: {
    title: "एडवांस्ड प्रोटेक्शन।\nइंजीनियर्ड परफ़ॉर्मेंस।",
    subtitle:
      "आर्टन प्रोटेक उच्च‑प्रदर्शन सामग्रियाँ बनाता है — एरामिड यार्न/थ्रेड, PPE फ़ैब्रिक और बैलिस्टिक UHMWPE UD शीट्स।",
    who: "हम कौन हैं",
    explore: "उत्पाद देखें",
    viewCatalog: "कैटलॉग देखें",
    industriesWeServe: "हम किन उद्योगों को सेवा देते हैं",
    scope: "दायरा",
    haveSpec: "कोई स्पेक है? भेजें।",
    contactSales: "सेल्स से संपर्क करें",
    products: "उत्पाद",
    catalog: "कैटलॉग",
    industries: "उद्योग",
    whereWeFit: "हम कहाँ फिट होते हैं",
    company: "कंपनी",
    about: "हमारे बारे में",
    contact: "संपर्क",
    home: "होम",
    getQuote: "कोट पाएं",
    searchProducts: "उत्पाद खोजें …",
    filterAll: "सब",
    contactLeadTitle: "आइए साथ बनाएँ",
    name: "नाम",
    email: "ईमेल",
    message: "अपनी आवश्यकता बताएं",
    attach: "स्पेक संलग्न करें (वैकल्पिक)",
    send: "भेजें",
    sentThanks: "धन्यवाद! हमें आपका संदेश मिल गया है।",
    brochure: "ब्रॉशर",
  },
};

// Small helper for translations
function useI18n(lang) {
  return useMemo(() => T[lang] || T.en, [lang]);
}

// ---------- Meta tags (no external deps) ----------
function MetaTags({ title, description, keywords }) {
  useEffect(() => {
    if (title) document.title = title;
    const ensure = (name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    ensure("description", description || "High‑performance aramid materials");
    ensure("keywords", keywords || "aramid, yarn, fabric, UHMWPE, PPE, ballistic");
  }, [title, description, keywords]);
  return null;
}

// ---------- App ----------
export default function ArtanProtechSite() {
  const [page, setPage] = useState(PAGES.HOME);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("ap:dark") === "1";
  });
  const [lang, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem("ap:lang") || "en";
  });

  useEffect(() => {
    setOpenDropdown("");
    setMobileOpen(false);
  }, [page]);

  // Dark mode root class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", !!dark);
    localStorage.setItem("ap:dark", dark ? "1" : "0");
  }, [dark]);

  // Language dir
  useEffect(() => {
    const cfg = LANGS.find((l) => l.code === lang) || LANGS[0];
    document.documentElement.dir = cfg.dir;
    localStorage.setItem("ap:lang", cfg.code);
  }, [lang]);

  const t = useI18n(lang);
  const goToQuote = () => setPage(PAGES.CONTACT);

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 flex flex-col">
      <MetaTags
        title="Artan Protec — Advanced Protection, Engineered Performance"
        description="Aramid yarns & threads, PPE fabrics, ballistic UHMWPE UD sheets."
      />

      <Header
        currentPage={page}
        onNavigate={setPage}
        onOpenDropdown={setOpenDropdown}
        openDropdown={openDropdown}
        setMobileOpen={setMobileOpen}
        mobileOpen={mobileOpen}
        dark={dark}
        setDark={setDark}
        lang={lang}
        setLanguage={setLanguage}
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
          <ProductDetail
            t={t}
            keyId={selectedProduct}
            onBack={() => setPage(PAGES.PRODUCTS)}
          />
        )}

        {page === PAGES.INDUSTRY_DETAIL && (
          <IndustryDetail
            t={t}
            keyId={selectedIndustry}
            onBack={() => setPage(PAGES.INDUSTRIES)}
          />
        )}
      </main>

      {page === PAGES.HOME && <StickyQuote t={t} onClick={goToQuote} />}

      <Footer t={t} onNavigate={setPage} />
    </div>
  );
}

// ---------- Header ----------
function Header({
  currentPage,
  onNavigate,
  onOpenDropdown,
  openDropdown,
  mobileOpen,
  setMobileOpen,
  dark,
  setDark,
  lang,
  setLanguage,
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
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-900/70 backdrop-blur border-b border-red-600">
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
              <div className="text-xs text-black dark:text-neutral-300">Advanced Protection | Engineered Performance</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 relative" ref={dropdownRef}>
            <NavLink onClick={() => onNavigate(PAGES.HOME)} active={currentPage===PAGES.HOME}>
              <HomeIcon className="w-4 h-4 mr-1" /> Home
            </NavLink>
            <NavButton
              onClick={() => onOpenDropdown(openDropdown === "products" ? "" : "products")}
              active={openDropdown === "products" || currentPage === PAGES.PRODUCTS || currentPage === PAGES.PRODUCT_DETAIL}
            >
              Products <ChevronDown className="w-4 h-4 ml-1" />
            </NavButton>
            <NavButton
              onClick={() => onOpenDropdown(openDropdown === "industries" ? "" : "industries")}
              active={openDropdown === "industries" || currentPage === PAGES.INDUSTRIES || currentPage === PAGES.INDUSTRY_DETAIL}
            >
              Industries <ChevronDown className="w-4 h-4 ml-1" />
            </NavButton>
            <NavLink onClick={() => onNavigate(PAGES.ABOUT)} active={currentPage===PAGES.ABOUT}>About</NavLink>
            <NavLink onClick={() => onNavigate(PAGES.CONTACT)} active={currentPage===PAGES.CONTACT}>Contact</NavLink>

            {/* Language */}
            <div className="ml-2 relative">
              <select
                value={lang}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none pl-8 pr-3 py-2 rounded-xl border border-red-600 text-sm text-red-700 hover:bg-red-50 dark:border-red-500 dark:bg-neutral-900 dark:text-red-300"
                aria-label="Select language"
              >
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <Languages className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-red-700" />
            </div>

            {/* Dark toggle */}
            <button
              className="ml-2 inline-flex items-center gap-2 rounded-xl border border-red-600 px-3 py-2 text-sm text-red-700 hover:bg-red-50 dark:text-red-300"
              onClick={() => setDark(!dark)}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {dark ? "Light" : "Dark"}
            </button>

            {/* Brochure */}
            <a
              className="ml-2 inline-flex items-center gap-2 rounded-xl border border-red-600 px-3 py-2 text-sm text-red-700 hover:bg-red-50 dark:text-red-300"
              href="/brochures/artan-protec-brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
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
                    <DropdownCard
                      key={i.key}
                      title={i.title}
                      blurb={i.blurb}
                      icon={i.icon}
                      onClick={() => onNavigate(PAGES.INDUSTRIES)}
                    />
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
            <button className="w-full text-left px-2 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-neutral-800" onClick={() => onNavigate(PAGES.HOME)}>Home</button>
            <MobileDisclosure label="Products">
              {PRODUCT_CATEGORIES.map((p) => (
                <button
                  key={p.key}
                  onClick={() => onNavigate(PAGES.PRODUCTS)}
                  className="flex items-start gap-3 text-left rounded-xl border border-red-200 p-3 hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
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
                <button
                  key={i.key}
                  onClick={() => onNavigate(PAGES.INDUSTRIES)}
                  className="flex items-start gap-3 text-left rounded-xl border border-red-200 p-3 hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  <div className="mt-1 text-red-700">{i.icon}</div>
                  <div>
                    <div className="font-medium">{i.title}</div>
                    <div className="text-sm text-neutral-500">{i.blurb}</div>
                  </div>
                </button>
              ))}
            </MobileDisclosure>

            <button className="w-full text-left px-2 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-neutral-800" onClick={() => onNavigate(PAGES.ABOUT)}>About</button>
            <button className="w-full text-left px-2 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-neutral-800" onClick={() => onNavigate(PAGES.CONTACT)}>Contact</button>
            <a className="block px-2 py-2 text-red-700" href="/brochures/artan-protec-brochure.pdf" target="_blank" rel="noopener noreferrer">Download Brochure</a>
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
      className={`inline-flex items-center px-3 py-2 rounded-xl text-sm border transition hover:-translate-y-0.5 hover:shadow ${
        active
          ? "bg-red-600 text-white border-red-600"
          : "border-red-600 text-red-700 hover:bg-red-50 dark:border-red-500 dark:text-red-300"
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
      className={`px-3 py-2 rounded-xl text-sm transition hover:-translate-y-0.5 hover:shadow ${
        active
          ? "bg-red-600 text-white"
          : "text-red-700 hover:bg-red-50 dark:hover:bg-neutral-800"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  );
}

function MegaDropdown({ title, children }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] w-[min(100%,960px)]">
      <div className="rounded-2xl border border-red-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl p-6">
        <div className="mb-4 text-xs uppercase tracking-wider text-red-600">{title}</div>
        {children}
      </div>
    </div>
  );
}

function DropdownCard({ title, blurb, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left rounded-2xl border border-red-200 dark:border-neutral-700 p-4 hover:border-red-400 hover:bg-red-50 dark:hover:bg-neutral-800 transition"
    >
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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

// ---------- Section Separator ----------
function Separator() {
  return (
    <div className="relative w-full h-10 overflow-hidden select-none" aria-hidden>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 10" preserveAspectRatio="none">
        <path d="M0,10 L100,0 L100,10 Z" fill="#fee2e2" />
      </svg>
    </div>
  );
}

// ---------- Home ----------
function Home({ t, onExplore, goProducts, goAbout, goIndustries }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const title = t.title;
  const [l1, l2 = ""] = title.split("\n");

  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <h1 className="text-4xl/tight md:text-5xl/tight font-extrabold tracking-tight">
            {l1}<br />{l2}
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 max-w-xl">{t.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3" onClick={onExplore}>
              {t.explore} <ChevronDown className="w-4 h-4" />
            </button>
            <button onClick={goProducts} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50 dark:border-red-500 dark:text-red-300">
              {t.viewCatalog} <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={goAbout} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50 dark:border-red-500 dark:text-red-300">
              {t.who}
            </button>
          </div>

          {/* Quick stats as mini cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { k: "Design‑led", s: "Materials engineering" },
              { k: "Export‑ready", s: "Global paperwork" },
              { k: "OEM + EPC", s: "Vendor friendly" },
              { k: "QA", s: "Tested performance" },
            ].map((item, idx) => (
              <Reveal delay={idx * 0.05} key={item.k}>
                <div className="rounded-xl border border-red-200 dark:border-neutral-700 p-4 hover:shadow transition">
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

      <Separator />

      {/* Products strip as cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader title={t.products} subtitle={t.catalog} />
        <Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {PRODUCT_CATEGORIES.map((p, idx) => (
              <Reveal delay={idx * 0.05} key={p.key}>
                <div className="rounded-2xl border border-red-200 dark:border-neutral-700 hover:border-red-300 p-5 transition hover:-translate-y-0.5 hover:shadow">
                  <div className="flex items-center gap-3">
                    <div className="text-red-700">{p.icon}</div>
                    <div className="font-semibold">{p.title}</div>
                  </div>
                  <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{p.blurb}</div>
                  <div className="mt-4">
                    <img src={PRODUCT_IMAGES[p.key] || "/images/placeholder.jpg"} alt={p.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200 dark:border-neutral-700" />
                  </div>
                  <div className="mt-4 flex gap-3">
                    <a
                      href={`mailto:artanprotec@gmail.com?subject=${encodeURIComponent("Quote request - " + p.title)}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-3 py-2 hover:bg-red-50 dark:border-red-500 dark:text-red-300 text-sm"
                    >
                      <Mail className="w-4 h-4" /> {t.getQuote}
                    </a>
                    <a href="#products" className="inline-flex items-center gap-1 text-sm text-red-700">
                      Learn more <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>

      <Separator />

      {/* Industries band */}
      <div className="bg-neutral-50 dark:bg-neutral-950 border-y border-red-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SectionHeader title={t.industriesWeServe} subtitle={t.scope} />
          <Reveal>
            <div className="flex flex-wrap gap-3">
              {INDUSTRY_PAGES.map((i, idx) => (
                <Reveal delay={idx * 0.04} key={i.key}>
                  <button className="px-4 py-2 rounded-full border border-red-200 dark:border-neutral-700 text-sm hover:bg-red-50 dark:hover:bg-neutral-800">
                    {i.title}
                  </button>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <Separator />

      {/* Who we are teaser */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-6 items-center">
          <Reveal>
            <div className="lg:col-span-2 rounded-2xl border border-red-200 dark:border-neutral-700 p-6">
              <div className="text-xs uppercase tracking-widest text-red-700/80">{t.who}</div>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight">Engineering materials for protection and performance</h3>
              <p className="mt-2 text-neutral-700 dark:text-neutral-300">We focus on aramid‑based yarns & threads, PPE fabrics, and UHMWPE UD sheets for ballistic applications. Built for high heat, abrasion, and impact environments — with documentation and export logistics dialed in.</p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 text-red-700">
                  Learn more about Artan Protec <ChevronRight className="w-4 h-4" />
                </span>
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

      <Separator />

      {/* CTA band */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-6 items-center">
          <Reveal>
            <h3 className="text-2xl font-extrabold tracking-tight">{t.haveSpec}</h3>
            <p className="mt-2 text-white/80">Share drawings or application details — we’ll respond with feasible constructions, lead times, and MOQs.</p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="flex md:justify-end">
              <a href="mailto:artanprotec@gmail.com" className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3">
                {t.contactSales} <Mail className="w-4 h-4" />
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

// ---------- Products with filters/search ----------
function Products({ t, onSelect }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PRODUCT_CATEGORIES.filter((c) => {
      const inFilter = filter === "all" || c.key === filter;
      if (!inFilter) return false;
      if (!needle) return true;
      const hay = [c.title, c.blurb, ...(PRODUCT_SUBCATS[c.key] || [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [q, filter]);

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title={t.products} subtitle={t.catalog} />

      {/* Filters/Search UI */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.searchProducts}
            className="pl-9 pr-3 py-2 rounded-xl border border-red-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 w-72"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-red-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        >
          <option value="all">{t.filterAll}</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>{c.title}</option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, idx) => (
          <motion.div
            key={p.key}
            className="text-left rounded-2xl border border-red-200 dark:border-neutral-700 hover:border-red-300 p-5 transition hover:-translate-y-0.5 hover:shadow"
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
            {/* Subcategories as cards */}
            <div className="mt-4 grid grid-cols-1 gap-2">
              {(PRODUCT_SUBCATS[p.key] || []).map((s) => (
                <div key={s} className="rounded-xl border border-red-200 dark:border-neutral-700 p-3 text-sm bg-white dark:bg-neutral-900 hover:bg-red-50 dark:hover:bg-neutral-800 transition">
                  {s}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1 text-sm text-red-700" onClick={() => onSelect(p.key)}>
                Explore <ChevronRight className="w-4 h-4" />
              </button>
              <a
                href={`mailto:artanprotec@gmail.com?subject=${encodeURIComponent("Quote request - " + p.title)}`}
                className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-3 py-2 hover:bg-red-50 dark:border-red-500 dark:text-red-300 text-sm"
              >
                <Mail className="w-4 h-4" /> {T.en.getQuote}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Industries({ t, onSelect }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title={t.industries} subtitle={t.whereWeFit} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INDUSTRY_PAGES.map((i, idx) => (
          <motion.button
            key={i.key}
            onClick={() => onSelect(i.key)}
            className="text-left rounded-2xl border border-red-200 dark:border-neutral-700 hover:border-red-300 p-5 transition hover:-translate-y-0.5 hover:shadow"
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

function ProductDetail({ t, keyId, onBack }) {
  const meta = PRODUCT_CATEGORIES.find((p) => p.key === keyId);
  if (!meta) return null;
  const subs = PRODUCT_SUBCATS[keyId] || [];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={onBack} className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 inline-flex items-center gap-1 mb-6">
        <ChevronRight className="-scale-x-100 w-4 h-4" /> Back to Products
      </button>

      <h3 className="text-3xl font-extrabold tracking-tight">{meta.title}</h3>
      <p className="mt-2 text-neutral-700 dark:text-neutral-300">{meta.blurb}</p>

      {/* Gallery */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <img src={PRODUCT_IMAGES?.[keyId] || "/images/placeholder.jpg"} alt={meta.title} className="aspect-[4/3] w-full object-cover rounded-xl border border-red-200 dark:border-neutral-700" />
        {[2,3,4].map((n) => (
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
            <div key={s} className="rounded-xl border border-red-200 dark:border-neutral-700 p-3 text-sm bg-white dark:bg-neutral-900">{s}</div>
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={PRODUCT_BROCHURES?.[keyId] || "/brochures/artan-protec-brochure.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-3"
        >
          <Download className="w-4 h-4" /> Download Catalogue
        </a>
        <a href="mailto:artanprotec@gmail.com" className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50 dark:border-red-500 dark:text-red-300">
          <Mail className="w-4 h-4" /> Enquire
        </a>
      </div>
    </section>
  );
}

function IndustryDetail({ t, keyId, onBack }) {
  const meta = INDUSTRY_PAGES.find((i) => i.key === keyId);
  if (!meta) return null;
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={onBack} className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 inline-flex items-center gap-1 mb-6">
        <ChevronRight className="-scale-x-100 w-4 h-4" /> Back to Industries
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
        <div className="px-4 py-3 bg-red-50 dark:bg-neutral-800 border-b border-red-200 dark:border-neutral-700 text-sm font-medium">Common Applications</div>
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
        <a href="mailto:artanprotec@gmail.com" className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50 dark:border-red-500 dark:text-red-300">
          <Mail className="w-4 h-4" /> Talk to Sales
        </a>
      </div>
    </section>
  );
}

// ---------- About ----------
function About({ t }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title={`About Artan Protec`} subtitle="Company" />
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        Artan Protec designs and delivers high‑performance materials for harsh environments. Our portfolio spans aramid yarns & threads, PPE fabrics, and UHMWPE UD sheets for ballistic applications. We combine precise engineering with reliable execution to help OEMs, EPCs, and end‑users meet demanding performance, safety, and compliance requirements.
      </p>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {["Design & Development", "Manufacturing & QA", "Export Logistics"].map((k) => (
          <div key={k} className="rounded-xl border border-red-200 dark:border-neutral-700 p-4 hover:shadow transition">
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

// ---------- Contact (Netlify form + inline confirmation + upload) ----------
function Contact({ t }) {
  const [sent, setSent] = useState(false);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title={t.contact} subtitle={t.contactLeadTitle} />
      {!sent ? (
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={() => setSent(true)}
          className="rounded-2xl border border-red-200 dark:border-neutral-700 p-6"
        >
          {/* Netlify requires these */}
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>
              Don’t fill this out: <input name="bot-field" />
            </label>
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">{t.email}</div>
              <a className="font-medium" href="mailto:artanprotec@gmail.com">artanprotec@gmail.com</a>
              <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Phone</div>
              <a className="font-medium" href="tel:+14704450578">+1 (470) 445‑0578</a>
              <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">HQ</div>
              <div className="font-medium">Mumbai, India</div>
            </div>

            <div className="grid gap-3">
              <input className="border border-red-300 dark:border-neutral-700 rounded-xl px-3 py-2" name="name" placeholder={t.name} required />
              <input className="border border-red-300 dark:border-neutral-700 rounded-xl px-3 py-2" type="email" name="email" placeholder={t.email} required />
              <textarea className="border border-red-300 dark:border-neutral-700 rounded-xl px-3 py-2 min-h-[100px]" name="message" placeholder={t.message} required />
              <div>
                <label className="text-sm text-neutral-600 dark:text-neutral-300 block mb-1">{t.attach}</label>
                <input className="block" type="file" name="attachment" />
              </div>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3">
                <Mail className="w-4 h-4" /> {t.send}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-green-300 bg-green-50 text-green-900 p-6">
          {t.sentThanks}
        </div>
      )}
    </section>
  );
}

function StickyQuote({ t, onClick }) {
  return (
    <button onClick={onClick} className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-red-600 text-white px-5 py-3 shadow-lg hover:brightness-110" aria-label="Get Quote">
      <Mail className="w-4 h-4" /> {t.getQuote}
    </button>
  );
}

// ---------- Footer ----------
function Footer({ t, onNavigate }) {
  return (
    <footer className="mt-10 border-t border-red-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-extrabold tracking-tight">Artan Protec</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Advanced Protection | Engineered Performance</div>
            <div className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">High‑performance materials for PPE, mobility, infrastructure, telecom, and defense.</div>
          </div>

          <FooterCol title={t.products}>
            {PRODUCT_CATEGORIES.map((p) => (
              <FooterLink key={p.key} onClick={() => onNavigate(PAGES.PRODUCTS)}>
                {p.title}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title={t.industries}>
            {INDUSTRY_PAGES.map((i) => (
              <FooterLink key={i.key} onClick={() => onNavigate(PAGES.INDUSTRIES)}>
                {i.title}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title={t.company}>
            <FooterLink onClick={() => onNavigate(PAGES.HOME)}>{t.home}</FooterLink>
            <FooterLink onClick={() => onNavigate(PAGES.ABOUT)}>{t.about}</FooterLink>
            <FooterLink onClick={() => onNavigate(PAGES.CONTACT)}>{t.contact}</FooterLink>
            <a href="/brochures/artan-protec-brochure.pdf" target="_blank" rel="noopener noreferrer" className="block text-sm text-red-700 hover:text-red-800">
              {t.brochure}
            </a>
          </FooterCol>
        </div>

        <div className="mt-8 pt-6 border-t border-red-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center justify-between gap-2">
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
