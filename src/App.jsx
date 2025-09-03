'use client';

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { motion } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

// Do NOT import './index.css' here; keep Tailwind in src/main.jsx to avoid build errors.

/***********************************
 * Artan Protec — Red/White/Black (Light theme + optional Dark toggle)
 * - BrowserRouter (Netlify SPA needs /public/_redirects → "/*  /index.html  200")
 * - Desktop: Navbar dropdowns (Products, Industries)
 * - Mobile: Compact slide-down menu with nested submenus
 * - Hero background video (webm/mp4 + poster)
 * - All content: Home, Products x3, Industries index + 6 pages, About, Downloads, Contact
 * - Product/industry imagery hooks via /public/images/*.jpg (graceful onError hiding)
 ***********************************/

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
  return `mailto:artanprotec@gmail.com?subject=${encodeURIComponent(
    "Quote request - " + title
  )}&body=${encodeURIComponent(body)}`;
};

const cx = (...a) => a.filter(Boolean).join(" ");
const ThemeCtx = createContext({ isLight: true, toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);

/************** Local SVG Icons (no extra deps) **************/
const Icon = {
  Thread: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M4 7c4 0 4-3 8-3s4 3 8 3" />
      <path d="M4 12c4 0 4-3 8-3s4 3 8 3" />
      <path d="M4 17c4 0 4-3 8-3s4 3 8 3" />
      <path d="M4 21h16" />
    </svg>
  ),
  Fabric: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M3 12l9 4 9-4" />
      <path d="M3 17l9 4 9-4" />
    </svg>
  ),
  Shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Menu: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  ),
  Download: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" />
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M4 6h16v12H4z" /><path d="M22 6l-10 7L2 6" />
    </svg>
  ),
  Phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2 4.18 2 2 0 0 1 4 2h4.09a2 2 0 0 1 2 1.72c.12.9.3 1.78.54 2.65a2 2 0 0 1-.45 2.11L9 9a16 16 0 0 0 6 6l.52-1.18a2 2 0 0 1 2.11-.45c.87.24 1.75.42 2.65.54A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
};

/************** Shared atoms **************/
const Container = ({ className = "", children }) => (
  <div className={cx("mx-auto w-full max-w-7xl px-6", className)}>{children}</div>
);

const Pill = ({ children, className = "" }) => (
  <span className={cx("rounded-full border px-3 py-1 text-xs", className)}>{children}</span>
);

const Card = ({ children, className = "" }) => (
  <div className={cx("relative rounded-2xl p-[1px] bg-gradient-to-br from-red-200/70 via-slate-200/40 to-red-100/70 shadow-sm", className)}>
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-6">{children}</div>
  </div>
);

// Reusable Button (solid/outline + handles external/file/mailto)
function Button({ href, children, variant = "solid", newTab = false, type = "button", onClick }) {
  const cls =
    variant === "outline"
      ? "inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50"
      : "inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3 hover:brightness-110";
  if (href) {
    const isExternal =
      /^https?:/i.test(href) ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      /\.(pdf|docx?|xlsx?)$/i.test(href);
    return (
      <a
        href={href}
        target={newTab || isExternal ? "_blank" : undefined}
        rel={newTab || isExternal ? "noopener noreferrer" : undefined}
        className={cls}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease: "easeOut", delay }}
  >
    {children}
  </motion.div>
);

/************** Navbar with desktop dropdowns + mobile menu + theme toggle **************/
function Navbar() {
  const { isLight, toggle } = useTheme();
  const location = useLocation();
  const [openProd, setOpenProd] = useState(false);
  const [openInd, setOpenInd] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = useCallback(
    (path) =>
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path)),
    [location.pathname]
  );

  const linkBase = "relative group px-2 py-1";
  const underline = (active) =>
    cx(
      "absolute left-0 -bottom-1 h-0.5 bg-red-600 transition-all duration-300",
      active ? "w-full" : "w-0 group-hover:w-full"
    );

  const MenuGroup = ({ label, active, onEnter, onLeave, children }) => (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <span className={linkBase}>
        <span className={cx("cursor-default", active && "font-bold text-red-600")}>
          {label}
        </span>
        <span className={underline(active)} />
      </span>
      {children}
    </div>
  );

  const Drop = ({ items, onClick }) => (
    <div className="absolute mt-2 w-72 rounded-xl bg-white ring-1 ring-slate-200 shadow-xl p-2">
      {items.map((it) => (
        <Link
          key={it.to}
          to={it.to}
          onClick={onClick}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-700 ring-1 ring-red-100">
            {it.icon}
          </span>
          <span>
            <div className="font-medium">{it.title}</div>
            {it.sub && <div className="text-xs text-slate-500">{it.sub}</div>}
          </span>
        </Link>
      ))}
    </div>
  );

  const productItems = [
    {
      to: "/products/corethread",
      title: "CoreThread",
      sub: "Aramid yarns & sewing threads",
      icon: <Icon.Thread className="h-4 w-4" />,
    },
    {
      to: "/products/armorweave",
      title: "ArmorWeave",
      sub: "FR fabrics for PPE shells/liners",
      icon: <Icon.Fabric className="h-4 w-4" />,
    },
    {
      to: "/products/armorshield",
      title: "ArmorShield",
      sub: "PPE gear & components",
      icon: <Icon.Shield className="h-4 w-4" />,
    },
  ];

  const industryItems = [
    { to: "/industries/ppe", title: "PPE", sub: "Apparel, gloves, hoods, jackets", icon: <Icon.Shield className="h-4 w-4" /> },
    { to: "/industries/filtration", title: "Filtration", sub: "Hot-end/industrial filtration", icon: <Icon.Fabric className="h-4 w-4" /> },
    { to: "/industries/telecom", title: "Telecom", sub: "Thermal barriers & safety gear", icon: <Icon.Thread className="h-4 w-4" /> },
    { to: "/industries/utilities", title: "Utilities", sub: "Arc-rated programs", icon: <Icon.Shield className="h-4 w-4" /> },
    { to: "/industries/oilgas", title: "Oil & Gas", sub: "FR apparel & barriers", icon: <Icon.Fabric className="h-4 w-4" /> },
    { to: "/industries/fireservices", title: "Fire Services", sub: "Jackets, hoods, liners", icon: <Icon.Shield className="h-4 w-4" /> },
  ];

  return (
    <header
      className={cx(
        "fixed top-0 inset-x-0 z-50 border-b",
        isLight
          ? "bg-white/80 border-slate-200 backdrop-blur"
          : "bg-black/80 border-white/10 backdrop-blur"
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/artan-protec-logo.png"
            alt="Artan Protec"
            className="h-8 w-auto"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="leading-tight">
            <p className={cx("font-semibold", isLight ? "text-slate-900" : "text-white")}>
              Artan Protec
            </p>
            <p className={cx("text-[11px]", isLight ? "text-slate-500" : "text-slate-400")}>
              Advanced Protection | Engineered Performance
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className={linkBase}>
            <span className={cx(isActive("/") && "font-bold text-red-600", isLight ? "text-slate-700" : "text-slate-200")}>Home</span>
            <span className={underline(isActive("/"))} />
          </Link>

          <MenuGroup
            label={<span className={cx(isLight ? "text-slate-700" : "text-slate-200")}>Products</span>}
            active={isActive("/products")}
            onEnter={() => setOpenProd(true)}
            onLeave={() => setOpenProd(false)}
          >
            {openProd && <Drop items={productItems} onClick={() => setOpenProd(false)} />}
          </MenuGroup>

          <MenuGroup
            label={<span className={cx(isLight ? "text-slate-700" : "text-slate-200")}>Industries</span>}
            active={isActive("/industries")}
            onEnter={() => setOpenInd(true)}
            onLeave={() => setOpenInd(false)}
          >
            {openInd && <Drop items={industryItems} onClick={() => setOpenInd(false)} />}
          </MenuGroup>

          <Link to="/downloads" className={linkBase}>
            <span className={cx(isActive("/downloads") && "font-bold text-red-600", isLight ? "text-slate-700" : "text-slate-200")}>
              Downloads
            </span>
            <span className={underline(isActive("/downloads"))} />
          </Link>
          <Link to="/about" className={linkBase}>
            <span className={cx(isActive("/about") && "font-bold text-red-600", isLight ? "text-slate-700" : "text-slate-200")}>About</span>
            <span className={underline(isActive("/about"))} />
          </Link>
          <Link to="/contact" className={linkBase}>
            <span className={cx(isActive("/contact") && "font-bold text-red-600", isLight ? "text-slate-700" : "text-slate-200")}>
              Contact
            </span>
            <span className={underline(isActive("/contact"))} />
          </Link>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className={cx(
              "rounded-lg px-3 py-2 text-xs border",
              isLight ? "border-slate-300 text-slate-700 hover:bg-slate-50" : "border-white/15 text-white hover:bg-white/10"
            )}
          >
            {isLight ? "Light" : "Dark"}
          </button>
          <button
            className={cx("md:hidden rounded-lg p-2 border", isLight ? "border-slate-300 text-slate-700" : "border-white/15 text-white")}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
          >
            {mobileOpen ? <Icon.Close className="h-5 w-5" /> : <Icon.Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className={cx("md:hidden border-t", isLight ? "bg-white border-slate-200" : "bg-black border-white/10")}>
          <Container className="py-3 space-y-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>Home</Link>
            <details className={cx("px-3 py-2 rounded-lg", isLight ? "bg-white" : "bg-white/5")}>
              <summary className="cursor-pointer">Products</summary>
              <div className="mt-2 ml-3 space-y-2">
                <Link to="/products/corethread" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>CoreThread</Link>
                <Link to="/products/armorweave" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>ArmorWeave</Link>
                <Link to="/products/armorshield" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>ArmorShield</Link>
              </div>
            </details>
            <details className={cx("px-3 py-2 rounded-lg", isLight ? "bg-white" : "bg-white/5")}>
              <summary className="cursor-pointer">Industries</summary>
              <div className="mt-2 ml-3 space-y-2">
                <Link to="/industries/ppe" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>PPE</Link>
                <Link to="/industries/filtration" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>Filtration</Link>
                <Link to="/industries/telecom" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>Telecom</Link>
                <Link to="/industries/utilities" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>Utilities</Link>
                <Link to="/industries/oilgas" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>Oil & Gas</Link>
                <Link to="/industries/fireservices" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>Fire Services</Link>
              </div>
            </details>
            <Link to="/downloads" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>Downloads</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>About</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className={cx("block px-3 py-2 rounded-lg", isLight ? "hover:bg-slate-50" : "hover:bg-white/10")}>Contact</Link>
          </Container>
        </div>
      )}
    </header>
  );
}

/************** Section **************/
const Section = ({ id, eyebrow, title, lead, children, className = "" }) => {
  const { isLight } = useTheme();
  return (
    <section id={id} className={cx("py-16", className)}>
      <Container>
        <div className="mb-8">
          {eyebrow && (
            <p className={cx("text-[11px] uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-slate-400")}>{eyebrow}</p>
          )}
          <h2 className={cx("mt-2 text-2xl sm:text-4xl font-semibold", isLight ? "text-slate-900" : "text-white")}>{title}</h2>
          {lead && <p className={cx("mt-3 max-w-3xl", isLight ? "text-slate-600" : "text-slate-300")}>{lead}</p>}
        </div>
        {children}
      </Container>
    </section>
  );
};

/************** Home **************/
function Home() {
  const { isLight } = useTheme();
  const cases = [
    { title: "Firefighter Jackets", bullets: ["Outer shell with ripstop ArmorWeave", "CoreThread seams maintain integrity under heat", "Optional moisture/comfort finishes"] },
    { title: "Industrial Gloves", bullets: ["Para-aramid blends for cut/heat resistance", "Cone-wound CoreThread for stitch consistency", "Program sizing and private labeling"] },
    { title: "Thermal Barriers", bullets: ["Targeted GSM fabrics for insulation", "Liner options for comfort and moisture", "Batch traceability for audits"] },
  ];
  const [caseIdx, setCaseIdx] = useState(0);

  return (
    <div className={cx(isLight ? "bg-gradient-to-b from-white via-slate-50 to-red-50/20 text-slate-900" : "bg-slate-950 text-white")}>
      {/* HERO with background video */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster="/hero-poster.jpg">
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className={cx("absolute inset-0", isLight ? "bg-gradient-to-b from-white/70 via-white/70 to-white/85" : "bg-black/40")} />
        </div>
        <Container className="pt-24 pb-24">
          <div className="max-w-3xl">
            <div
              className={cx(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]",
                isLight ? "border border-red-200 bg-red-50/60 text-red-700" : "border border-red-500/30 bg-red-900/20 text-red-200"
              )}
            >
              Aramid Materials • FRR Fabrics • Industrial PPE
            </div>
            <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight">
              Advanced Protection. Engineered Performance.
            </h1>
            <p className={cx("mt-5 text-lg", isLight ? "text-slate-700" : "text-slate-300")}>
              Aramid yarns, threads, and protective solutions for demanding environments — specified for reliability, safety, and durability across PPE, filtration, utilities, telecom, and fire services.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* Products dropdown CTA */}
              <div className="relative group">
                <Button>Explore Products</Button>
                <div className="absolute hidden group-hover:block bg-white text-black mt-2 rounded-xl shadow-xl ring-1 ring-slate-200 w-72 p-2 z-10">
                  <Link to="/products/corethread" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-50">
                    <Icon.Thread className="h-4 w-4" /> CoreThread
                  </Link>
                  <Link to="/products/armorweave" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-50">
                    <Icon.Fabric className="h-4 w-4" /> ArmorWeave
                  </Link>
                  <Link to="/products/armorshield" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-50">
                    <Icon.Shield className="h-4 w-4" /> ArmorShield
                  </Link>
                </div>
              </div>
              <Button href="/downloads" variant="outline">
                <Icon.Download className="h-4 w-4" /> Tech Sheets
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Pill className={cx(isLight ? "border-red-200 text-red-700 bg-red-50" : "border-red-500/30 text-red-200 bg-red-900/20")}>Spec-driven sourcing</Pill>
              <Pill className={cx(isLight ? "border-red-200 text-red-700 bg-red-50" : "border-red-500/30 text-red-200 bg-red-900/20")}>Low-CAPEX phase-in</Pill>
              <Pill className={cx(isLight ? "border-red-200 text-red-700 bg-red-50" : "border-red-500/30 text-red-200 bg-red-900/20")}>Export-ready</Pill>
            </div>
          </div>
        </Container>
      </section>

      {/* ABOUT */}
      <Section
        id="about"
        eyebrow="About"
        title="Artan Protec"
        lead="A specialized brand focused on aramid inputs and FR protective solutions — built for reliability, documentation, and scale."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <p className={cx("text-sm", isLight ? "text-slate-600" : "text-slate-200")}>
              Artan Protec delivers high-performance aramid-based products engineered for industries where safety, reliability, and durability are critical. We convert technical fibers into performance components — yarns and threads for high-temperature seams, FR fabrics for shells, liners and barriers, and selected PPE assemblies to accelerate pilots. Our process emphasizes application fit, quality control, documentation, and consistent supply.
            </p>
            <ul className={cx("mt-4 grid grid-cols-2 gap-3 text-sm", isLight ? "text-slate-700" : "text-slate-200")}>
              <li className="flex items-center gap-2">✔ Meta/para-aramid expertise</li>
              <li className="flex items-center gap-2">✔ Batch documentation</li>
              <li className="flex items-center gap-2">✔ Shade and logo customization</li>
              <li className="flex items-center gap-2">✔ Export logistics ready</li>
            </ul>
          </Card>
          <Card>
            <h4 className={cx("font-semibold mb-3", isLight ? "text-slate-900" : "text-white")}>Photography / Renders</h4>
            <div className="grid grid-cols-2 gap-3">
              <picture>
                <img
                  src="/images/product-corethread.jpg"
                  alt="CoreThread sample"
                  className="h-28 w-full object-cover rounded-lg ring-1 ring-slate-200"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </picture>
              <picture>
                <img
                  src="/images/product-armorweave.jpg"
                  alt="ArmorWeave sample"
                  className="h-28 w-full object-cover rounded-lg ring-1 ring-slate-200"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </picture>
              <picture>
                <img
                  src="/images/product-armorshield.jpg"
                  alt="ArmorShield sample"
                  className="h-28 w-full object-cover rounded-lg ring-1 ring-slate-200"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </picture>
              <picture>
                <img
                  src="/images/product-lab.jpg"
                  alt="Lab or testing"
                  className="h-28 w-full object-cover rounded-lg ring-1 ring-slate-200"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </picture>
            </div>
            <p className={cx("mt-2 text-xs", isLight ? "text-slate-500" : "text-slate-400")}>
              Drop your own images into /public/images/ with the same names to replace these placeholders.
            </p>
          </Card>
        </div>
      </Section>

      {/* PRODUCT LINES OVERVIEW */}
      <Section id="products" eyebrow="Products" title="Product Lines" lead="Open a product line to view detailed specs, variants, and downloads.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="hover:shadow-[0_20px_60px_-20px_rgba(239,68,68,0.25)] transition">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-black text-white ring-1 ring-red-300/40">
                <Icon.Thread className="h-5 w-5" />
              </span>
              <div>
                <h3 className={cx("text-lg font-semibold", isLight ? "text-slate-900" : "text-white")}>
                  CoreThread — Aramid Yarns & Threads
                </h3>
                <p className={cx("text-sm mt-1", isLight ? "text-slate-600" : "text-slate-300")}>
                  Industrial aramid yarns and sewing threads engineered for heat/FR, strength and durability in PPE seams, hot-end filtration and thermal assemblies.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/products/corethread" className="text-red-700 hover:underline">
                Learn more →
              </Link>
            </div>
          </Card>
          <Card className="hover:shadow-[0_20px_60px_-20px_rgba(239,68,68,0.25)] transition">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-black text-white ring-1 ring-red-300/40">
                <Icon.Fabric className="h-5 w-5" />
              </span>
              <div>
                <h3 className={cx("text-lg font-semibold", isLight ? "text-slate-900" : "text-white")}>
                  ArmorWeave — FRR & PPE Fabrics
                </h3>
                <p className={cx("text-sm mt-1", isLight ? "text-slate-600" : "text-slate-300")}>FR fabrics for coveralls, jackets, gloves, hoods and thermal liners. Targeted GSM and weaves for shell, liner and barrier layers.</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/products/armorweave" className="text-red-700 hover:underline">
                Learn more →
              </Link>
            </div>
          </Card>
          <Card className="hover:shadow-[0_20px_60px_-20px_rgba(239,68,68,0.25)] transition">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-black text-white ring-1 ring-red-300/40">
                <Icon.Shield className="h-5 w-5" />
              </span>
              <div>
                <h3 className={cx("text-lg font-semibold", isLight ? "text-slate-900" : "text-white")}>
                  ArmorShield — Industrial PPE & Components
                </h3>
                <p className={cx("text-sm mt-1", isLight ? "text-slate-600" : "text-slate-300")}>Select PPE gear and components leveraging our aramid inputs to accelerate pilots and early adoption.</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/products/armorshield" className="text-red-700 hover:underline">
                Learn more →
              </Link>
            </div>
          </Card>
        </div>
      </Section>

      {/* DIFFERENTIATORS */}
      <Section id="why" eyebrow="Why Artan" title="What sets us apart">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: <Icon.Shield className="h-5 w-5" />, t: "Proven performance", d: "Materials field-tested in PPE, utilities, oil & gas, and fire services programs." },
            { icon: <Icon.Thread className="h-5 w-5" />, t: "Engineered reliability", d: "From fiber selection to thread constructions and fabric weaves tuned to spec." },
            { icon: <Icon.Fabric className="h-5 w-5" />, t: "Advanced R&D", d: "Application-aligned testing and documentation paths to meet standards." },
            { icon: <Icon.Shield className="h-5 w-5" />, t: "Global reach", d: "Export-ready programs and partner network for fast scale-up." },
            { icon: <Icon.Thread className="h-5 w-5" />, t: "Sustainable manufacturing", d: "Process controls focused on consistency, waste reduction, and yield." },
            { icon: <Icon.Fabric className="h-5 w-5" />, t: "Custom solutions", d: "Logos, shades, and specs tailored to program requirements." },
          ].map((item, i) => (
            <Card key={item.t}>
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-black text-white ring-1 ring-red-300/40">
                  {item.icon}
                </span>
                <div>
                  <h4 className={cx("font-semibold", isLight ? "text-slate-900" : "text-white")}>{item.t}</h4>
                  <p className={cx("text-sm mt-1", isLight ? "text-slate-600" : "text-slate-300")}>{item.d}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* INDUSTRIES quick tiles */}
      <Section id="industries" eyebrow="Industries" title="Where we fit" lead="Solutions aligned to sector requirements and safety expectations.">
        <div className="grid gap-4 md:grid-cols-6 text-sm">
          {["PPE","Filtration","Telecom","Utilities","Oil & Gas","Fire Services"].map((name) => (
            <Link
              key={name}
              to={`/industries/${name.toLowerCase().replace(/ & /g, "").replace(/\s+/g, "")}`}
              className={cx(
                "text-center rounded-xl px-4 py-3 ring-1",
                isLight ? "ring-slate-200 bg-white hover:bg-slate-50 text-slate-700" : "ring-white/10 bg-white/5 hover:bg-white/10 text-slate-200"
              )}
            >
              {name}
            </Link>
          ))}
        </div>
      </Section>

      {/* STANDARDS */}
      <Section id="standards" eyebrow="Standards" title="Certifications and standards">
        <Card>
          <div className={cx("grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", isLight ? "text-slate-700" : "text-slate-300")}>
            <div className="rounded-lg bg-white px-3 py-2 text-center ring-1 ring-slate-200">ISO (process)</div>
            <div className="rounded-lg bg-white px-3 py-2 text-center ring-1 ring-slate-200">ASTM / NFPA (application-specific)</div>
            <div className="rounded-lg bg-white px-3 py-2 text-center ring-1 ring-slate-200">BIS (where applicable)</div>
            <div className="rounded-lg bg-white px-3 py-2 text-center ring-1 ring-slate-200">Documentation support</div>
          </div>
        </Card>
      </Section>

      {/* USE CASES */}
      <Section id="use-cases" eyebrow="Use cases" title="Applications in the field">
        <Card>
          <div className="flex items-start justify-between gap-6">
            <div>
              <h4 className={cx("font-semibold", isLight ? "text-slate-900" : "text-white")}>{cases[caseIdx].title}</h4>
              <ul className={cx("mt-2 list-disc pl-5 text-sm", isLight ? "text-slate-700" : "text-slate-200")}>
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
                  className={cx("h-2.5 w-2.5 rounded-full", i === caseIdx ? "bg-red-600" : "bg-red-200")}
                />
              ))}
            </div>
          </div>
        </Card>
      </Section>

      {/* TECH DIAGRAM */}
      <Section id="tech" eyebrow="Tech" title="Cross-section: protective layer stack" lead="Hover layers to see composition and function.">
        <Card>
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
                <text x="50" y="165" fill="#374151" fontSize="10">Liner: comfort and moisture options</text>
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
            <div className={cx("space-y-3 text-sm", isLight ? "text-slate-700" : "text-slate-200")}>
              <div className="flex items-start gap-3">
                <div className="h-3 w-3 rounded-sm" style={{ background: "linear-gradient(90deg,#fecaca88,#ef444488)" }} />
                <div>
                  <p className={cx("font-medium", isLight ? "text-slate-900" : "text-white")}>ArmorWeave outer shell</p>
                  <p className={cx(isLight ? "text-slate-500" : "text-slate-400")}>Ripstop or twill, shade options, abrasion resistance.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-3 w-3 rounded-sm" style={{ background: "linear-gradient(90deg,#e5e7eb88,#9ca3af88)" }} />
                <div>
                  <p className={cx("font-medium", isLight ? "text-slate-900" : "text-white")}>Comfort liner</p>
                  <p className={cx(isLight ? "text-slate-500" : "text-slate-400")}>Moisture and comfort finishes for extended wear.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-3 w-3 rounded-sm" style={{ background: "linear-gradient(90deg,#fde68a90,#f8717190)" }} />
                <div>
                  <p className={cx("font-medium", isLight ? "text-slate-900" : "text-white")}>Thermal/arc barrier</p>
                  <p className={cx(isLight ? "text-slate-500" : "text-slate-400")}>Higher GSM or blends to meet protection targets.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-3 w-3 rounded-sm bg-slate-800/40" />
                <div>
                  <p className={cx("font-medium", isLight ? "text-slate-900" : "text-white")}>CoreThread seams</p>
                  <p className={cx(isLight ? "text-slate-500" : "text-slate-400")}>Aramid threads and constructions for seam integrity.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* CTA */}
      <Section id="get-started" eyebrow="Get started" title="Spec a material or request a pilot">
        <div className="flex flex-wrap gap-3">
          <Button href="/downloads" variant="outline">
            <Icon.Download className="h-4 w-4" /> Download brochures
          </Button>
          <Button href="/contact">
            <Icon.Mail className="h-4 w-4" /> Contact sales
          </Button>
        </div>
      </Section>
    </div>
  );
}

/************** Product data and tables **************/
const tableCls = "w-full text-sm";
const Th = ({ children }) => <th className="py-2 pr-4 text-left">{children}</th>;
const Td = ({ children }) => <td className="py-2 pr-4 align-top">{children}</td>;
const VariantTable = ({ rows }) => (
  <div className="overflow-x-auto">
    <table className={tableCls}>
      <thead className="bg-slate-50 text-slate-600">
        <tr className="border-b border-slate-200">
          <Th>Variant</Th>
          <Th>Spec</Th>
          <Th>Suited For</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} className="border-b border-slate-200 last:border-0">
            <Td>
              <span className="font-medium text-slate-900">{r.name}</span>
            </Td>
            <Td className="text-slate-700">{r.spec}</Td>
            <Td className="text-slate-700">{r.suited}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

function ProductGallery({ id }) {
  const images = [
    `/images/${id}-hero.jpg`,
    `/images/${id}-detail-1.jpg`,
    `/images/${id}-detail-2.jpg`,
  ];
  return (
    <div className="space-y-3">
      <div className="aspect-[16/9] w-full overflow-hidden rounded-xl ring-1 ring-slate-200 bg-slate-100">
        <img src={images[0]} alt={`${id} hero`} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {images.slice(1).map((src) => (
          <div key={src} className="aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-slate-200 bg-slate-100">
            <img src={src} alt={`${id} detail`} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Place your product renders or photos in <code>/public/images/</code> with the filenames above.
      </p>
    </div>
  );
}

function ProductPage({ fam }) {
  const { isLight } = useTheme();
  return (
    <main className={cx(isLight ? "bg-white text-slate-900" : "bg-slate-950 text-white")}>
      <Section eyebrow="Products" title={fam.name} lead={fam.summary}>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <h3 className={cx("font-semibold mb-2", isLight ? "text-slate-900" : "text-white")}>Key details</h3>
            <ul className={cx("list-disc pl-5 space-y-1 text-sm", isLight ? "text-slate-700" : "text-slate-200")}>
              {fam.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <h3 className={cx("font-semibold mt-6 mb-2", isLight ? "text-slate-900" : "text-white")}>Available variants</h3>
            <VariantTable rows={fam.variants} />
          </Card>
          <Card>
            <h3 className={cx("font-semibold mb-3", isLight ? "text-slate-900" : "text-white")}>Downloads</h3>
            <div className="flex flex-wrap gap-2">
              {fam.downloads.map((d) => (
                <a
                  key={d.href}
                  href={d.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-800 hover:bg-slate-50"
                >
                  <Icon.Download className="h-4 w-4" /> {d.label}
                </a>
              ))}
            </div>
            <div className="mt-6">
              <ProductGallery id={fam.id} />
            </div>
          </Card>
        </div>
      </Section>
    </main>
  );
}

const FAMILIES = [
  {
    id: "corethread",
    path: "/products/corethread",
    name: "CoreThread — Aramid Yarns & Threads",
    summary:
      "Industrial aramid yarns and sewing threads engineered for heat/FR, strength and durability in PPE seams, hot-end filtration and thermal assemblies.",
    details: [
      "Constructions: 2–8 ply staple-based; tex/dtex/denier per application (e.g., 750 ±25 denier 4-ply).",
      "Performance: breaking strength ≥60 N (spec-dependent); elongation 3.0–4.4%; high modulus.",
      "Chemistry: meta-aramid and para-aramid blends; dope-dyed meta-aramid colors available.",
      "Finish: sewing lubricant, anti-wick, soft-hand; cone winding and doubling in-house.",
    ],
    variants: [
      { name: "CT-750/4P", spec: "750 ±25 denier, 4-ply", suited: "PPE seams, filtration sewing" },
      { name: "CT-1000/3P", spec: "~1000 denier class, 3-ply", suited: "Heavy protective gear, gloves" },
      { name: "CT-MetaDyed", spec: "Dope-dyed meta-aramid colors", suited: "Brand-matched FR apparel" },
    ],
    downloads: [{ label: "CoreThread Datasheet (PDF)", href: "/brochures/artan-corethread.pdf" }],
  },
  {
    id: "armorweave",
    path: "/products/armorweave",
    name: "ArmorWeave — FRR & PPE Fabrics",
    summary:
      "FR fabrics for coveralls, jackets, gloves, hoods and thermal liners. Targeted GSM and weaves for shell, liner and barrier layers.",
    details: [
      "Fiber systems: meta/para-aramid; optional antistatic grids; ripstop/twill constructions.",
      "Weights: typical 150–280 GSM for apparel; higher GSM for barrier layers.",
      "Finishes: comfort and moisture options; shade ranges aligned with industry norms.",
      "Compliance: application-specific testing pathways and documentation guidance.",
    ],
    variants: [
      { name: "AW-Shell180", spec: "180 GSM ripstop shell", suited: "FR coveralls and jackets" },
      { name: "AW-Liner150", spec: "150 GSM liner", suited: "Comfort liner for PPE" },
      { name: "AW-Barrier260", spec: "260 GSM barrier", suited: "Thermal barrier / added protection" },
    ],
    downloads: [{ label: "ArmorWeave Catalog (PDF)", href: "/brochures/artan-armorweave.pdf" }],
  },
  {
    id: "armorshield",
    path: "/products/armorshield",
    name: "ArmorShield — Industrial PPE & Components",
    summary: "Select PPE gear and components leveraging our aramid inputs to accelerate pilots and early adoption.",
    details: [
      "Cut/heat resistant gloves and sleeves; FR hoods and jackets with aramid seams.",
      "Partnered manufacturing with QA; traceability and batch documentation available.",
      "Customization: logos, shade matching, size grading per program needs.",
    ],
    variants: [
      { name: "AS-GlovePro", spec: "Cut/heat-resistant glove", suited: "Foundry, welding, hot-process handling" },
      { name: "AS-HoodFR", spec: "FR hood with aramid seams", suited: "Fire safety and industrial" },
      { name: "AS-JacketAR", spec: "Arc-rated jacket (program)", suited: "Utilities and electrical maintenance" },
    ],
    downloads: [{ label: "PPE Program Overview (PDF)", href: "/brochures/artan-ppe.pdf" }],
  },
];

/************** Non-product pages **************/
function ProductsIndex() {
  return (
    <main>
      <Section eyebrow="Products" title="All product lines" lead="Choose a family to view specs, variants, and downloads.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FAMILIES.map((f) => (
            <Card key={f.id}>
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-black text-white ring-1 ring-red-300/40">
                  {f.id === "corethread" && <Icon.Thread className="h-5 w-5" />}
                  {f.id === "armorweave" && <Icon.Fabric className="h-5 w-5" />}
                  {f.id === "armorshield" && <Icon.Shield className="h-5 w-5" />}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{f.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{f.summary}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to={f.path} className="text-red-700 hover:underline">
                  Open →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}

function IndustriesIndex() {
  const items = [
    { slug: "ppe", name: "PPE", copy: "Apparel, gloves, hoods, jackets" },
    { slug: "filtration", name: "Filtration", copy: "Hot-end/industrial filtration" },
    { slug: "telecom", name: "Telecom", copy: "Thermal barriers and safety gear" },
    { slug: "utilities", name: "Utilities", copy: "Arc-rated programs" },
    { slug: "oilgas", name: "Oil & Gas", copy: "FR apparel and barriers" },
    { slug: "fireservices", name: "Fire Services", copy: "Jackets, hoods, liners" },
  ];
  return (
    <main>
      <Section eyebrow="Industries" title="Sectors we support" lead="Spec-driven solutions aligned to safety and performance expectations.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it) => (
            <Card key={it.slug}>
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl ring-1 ring-slate-200 bg-slate-100 mb-3">
                <img
                  src={`/images/ind-${it.slug}.jpg`}
                  alt={`${it.name} hero`}
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <h3 className="text-lg font-semibold">{it.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{it.copy}</p>
              <div className="mt-4">
                <Link to={`/industries/${it.slug}`} className="text-red-700 hover:underline">
                  View →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}

const toSlug = (s) => s.toLowerCase().replace(/ & /g, "").replace(/\s+/g, "");

const IndustryPage = ({ name }) => {
  const slug = toSlug(name);
  return (
    <main>
      <Section eyebrow="Industries" title={name} lead={`Applications, material choices and program options for ${name}.`}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl ring-1 ring-slate-200 bg-slate-100 mb-3">
              <img
                src={`/images/ind-${slug}.jpg`}
                alt={`${name} hero`}
                className="h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            <h4 className="font-semibold mb-2">Where {name} uses Artan materials</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Representative use case 1 for {name}</li>
              <li>Representative use case 2 for {name}</li>
              <li>Representative use case 3 for {name}</li>
            </ul>
          </Card>
          <Card>
            <h4 className="font-semibold mb-2">Recommended product families</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>
                <Link to="/products/corethread" className="text-red-700 hover:underline">
                  CoreThread
                </Link>{" "}
                — seam integrity at temperature
              </li>
              <li>
                <Link to="/products/armorweave" className="text-red-700 hover:underline">
                  ArmorWeave
                </Link>{" "}
                — FR shells, liners and barriers
              </li>
              <li>
                <Link to="/products/armorshield" className="text-red-700 hover:underline">
                  ArmorShield
                </Link>{" "}
                — pilot PPE assemblies
              </li>
            </ul>
          </Card>
        </div>
      </Section>
    </main>
  );
};

function Downloads() {
  return (
    <main>
      <Section eyebrow="Downloads" title="Brochures and spec sheets">
        <div className="flex flex-wrap gap-3">
          <Button href="/brochures/artan-corethread.pdf" variant="outline" newTab>
            <Icon.Download className="h-4 w-4" /> CoreThread
          </Button>
          <Button href="/brochures/artan-armorweave.pdf" variant="outline" newTab>
            <Icon.Download className="h-4 w-4" /> ArmorWeave
          </Button>
          <Button href="/brochures/artan-ppe.pdf" variant="outline" newTab>
            <Icon.Download className="h-4 w-4" /> PPE Program
          </Button>
        </div>
      </Section>
    </main>
  );
}

function About() {
  return (
    <main>
      <Section eyebrow="About" title="About Artan Protec" lead="Focused on engineered FR performance from fiber to finished gear.">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <p className="text-sm text-slate-700">
              Artan Protec delivers high-performance aramid yarns, threads, fabrics and PPE components. Our teams align material properties with application realities to enable reliable, documented and scalable programs.
            </p>
          </Card>
          <Card>
            <h4 className="font-semibold mb-2">At a glance</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                <p className="text-slate-500">Product families</p>
                <p className="font-semibold">3</p>
              </div>
              <div>
                <p className="text-slate-500">Target GSM range</p>
                <p className="font-semibold">150–280 (apparel)</p>
              </div>
              <div>
                <p className="text-slate-500">Thread constructions</p>
                <p className="font-semibold">2–8 ply staple</p>
              </div>
              <div>
                <p className="text-slate-500">Customization</p>
                <p className="font-semibold">Logos and shades</p>
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </main>
  );
}

function Contact() {
  return (
    <main>
      <Section
        eyebrow="Contact"
        title="Talk to our team"
        lead="Submit specs or drawings. We will respond with the right thread, fabric or PPE program."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="flex items-center gap-2 font-semibold">
              <Icon.Mail className="h-5 w-5" /> Emails
            </div>
            <ul className="mt-2 text-slate-700 text-sm space-y-2">
              <li>
                <strong>Primary:</strong>{" "}
                <a className="hover:underline" href="mailto:artanprotec@gmail.com">
                  artanprotec@gmail.com
                </a>
              </li>
            </ul>
            <p className="text-xs text-slate-500 mt-3">
              Enable Netlify form notifications → Forms → contact → Notifications → Email to this address.
            </p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 font-semibold">
              <Icon.Phone className="h-5 w-5" /> Phone
            </div>
            <p className="mt-2 text-slate-700 text-sm">USA: +1 470 445 0578</p>
          </Card>
        </div>
        <Card className="mt-6">
          <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" className="grid md:grid-cols-3 gap-4">
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Do not fill this out if you are human: <input name="bot-field" />
              </label>
            </p>
            <input
              required
              name="name"
              placeholder="Name"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400"
            />
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400"
            />
            <input
              name="company"
              placeholder="Company"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400"
            />
            <textarea
              required
              name="message"
              placeholder="Project / Specs"
              className="md:col-span-3 rounded-xl border border-slate-300 bg-white px-4 py-3 min-h-[120px] text-slate-900 placeholder:text-slate-400"
            />
            <div className="md:col-span-3">
              <Button type="submit">
                <Icon.Mail className="h-4 w-4" /> Submit
              </Button>
            </div>
          </form>
        </Card>
      </Section>
    </main>
  );
}

/************** Industries page components generator **************/
const Ind = {
  PPE: () => <IndustryPage name="PPE" />,
  Filtration: () => <IndustryPage name="Filtration" />,
  Telecom: () => <IndustryPage name="Telecom" />,
  Utilities: () => <IndustryPage name="Utilities" />,
  OilGas: () => <IndustryPage name="Oil & Gas" />,
  FireServices: () => <IndustryPage name="Fire Services" />,
};

/************** Footer **************/
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <Container className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/artan-protec-logo-mark.png" alt="Artan mark" className="h-7 w-7" onError={(e) => (e.currentTarget.style.display = "none")} />
            <span className="font-semibold">Artan Protec</span>
          </div>
          <p className="text-sm text-slate-600">Advanced Protection | Engineered Performance</p>
        </div>
        <div>
          <h5 className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-3">Products</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:underline">All Products</Link></li>
            <li><Link to="/products/corethread" className="hover:underline">CoreThread</Link></li>
            <li><Link to="/products/armorweave" className="hover:underline">ArmorWeave</Link></li>
            <li><Link to="/products/armorshield" className="hover:underline">ArmorShield</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-3">Industries</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/industries" className="hover:underline">Overview</Link></li>
            <li><Link to="/industries/ppe" className="hover:underline">PPE</Link></li>
            <li><Link to="/industries/filtration" className="hover:underline">Filtration</Link></li>
            <li><Link to="/industries/telecom" className="hover:underline">Telecom</Link></li>
            <li><Link to="/industries/utilities" className="hover:underline">Utilities</Link></li>
            <li><Link to="/industries/oilgas" className="hover:underline">Oil & Gas</Link></li>
            <li><Link to="/industries/fireservices" className="hover:underline">Fire Services</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-3">Company</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/downloads" className="hover:underline">Downloads</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-slate-200">
        <Container className="py-4 text-xs text-slate-500 flex items-center justify-between">
          <span>© {year} Artan Protec. All rights reserved.</span>
          <span>Made for performance-critical applications.</span>
        </Container>
      </div>
    </footer>
  );
}

/************** Routes **************/
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductsIndex />} />
      <Route path="/products/corethread" element={<ProductPage fam={FAMILIES[0]} />} />
      <Route path="/products/armorweave" element={<ProductPage fam={FAMILIES[1]} />} />
      <Route path="/products/armorshield" element={<ProductPage fam={FAMILIES[2]} />} />
      <Route path="/industries" element={<IndustriesIndex />} />
      <Route path="/industries/ppe" element={<Ind.PPE />} />
      <Route path="/industries/filtration" element={<Ind.Filtration />} />
      <Route path="/industries/telecom" element={<Ind.Telecom />} />
      <Route path="/industries/utilities" element={<Ind.Utilities />} />
      <Route path="/industries/oilgas" element={<Ind.OilGas />} />
      <Route path="/industries/fireservices" element={<Ind.FireServices />} />
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

/************** Dev sanity checks (non-blocking) **************/
function DevDiagnostics() {
  try {
    const famPathsOk = FAMILIES.every((f) => typeof f.path === "string" && f.path.startsWith("/products/"));
    const dlOk = FAMILIES.every((f) => f.downloads.every((d) => /^\/(brochures|images)\//.test(d.href) || /^https?:\/\//.test(d.href)));
    if (import.meta && import.meta.env && import.meta.env.DEV) {
      console.log("Diagnostics:", { famPathsOk, dlOk });
    }
  } catch (e) {
    console.warn("Diagnostics error", e);
  }
  return null;
}

/************** App Shell with theme provider **************/
export default function App() {
  const [isLight, setIsLight] = useState(true);
  const toggle = useCallback(() => setIsLight((v) => !v), []);
  const ctx = useMemo(() => ({ isLight, toggle }), [isLight, toggle]);
  return (
    <ThemeCtx.Provider value={ctx}>
      <Router>
        <Navbar />
        <div className="pt-16">{/* spacer for fixed navbar */}
          <AppRoutes />
          <Footer />
        </div>
        <DevDiagnostics />
      </Router>
    </ThemeCtx.Provider>
  );
}
