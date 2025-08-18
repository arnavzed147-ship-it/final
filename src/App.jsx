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
 * Artan Protec — Advanced/Technical visual style (Multipage, URL‑safe, no Router deps)
 * -------------------------------------------------------------------------------
 * Fix for: `TypeError: Failed to construct 'URL': Invalid URL`
 * Root cause: Some environments/sandboxes choke on `react-router-dom`'s internal
 * URL resolution (e.g., `new URL(to, base)` when base isn't set). To make this
 * bulletproof everywhere (including Netlify, local dev, and code runners), we
 * implement a very small **hash-based router** instead of using Link/NavLink.
 *
 * - Navigation uses anchors like `href="#/corethread"`.
 * - The current page is derived from `window.location.hash`.
 * - No `react-router-dom` required. (You can remove it from package.json if you want.)
 * - Keep Tailwind import in `src/main.jsx` (e.g., `import './index.css'`).
 * - Public assets: `/artan-protec-logo.png`, `/artan-protec-logo-mark.png`, and
 *   PDFs in `/brochures/...`.
 */

// ----------------------------- UI Primitives ------------------------------
const Container = ({ className = "", children }) => (
  <div className={`mx-auto w-full max-w-7xl px-6 ${className}`}>{children}</div>
);

const Section = ({ id, eyebrow, title, lead, children }) => (
  <section id={id} className="py-20 sm:py-24">
    <Container>
      <div className="mb-8">
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{eyebrow}</p>
        )}
        <h2 className="mt-2 text-2xl sm:text-4xl font-semibold text-white">{title}</h2>
        {lead && <p className="mt-3 max-w-3xl text-slate-300">{lead}</p>}
      </div>
      {children}
    </Container>
  </section>
);

// Convert arbitrary hrefs into safe anchors.
function toHref(href) {
  if (!href) return undefined;
  // External or file download → use as-is
  if (/^https?:\/\//i.test(href) || /\.(pdf|zip|docx?|xlsx?)($|\?)/i.test(href) || href.startsWith("/brochures/")) {
    return href;
  }
  // Internal app routes → hash
  if (href.startsWith("/")) return `#${href}`; // e.g. "/corethread" => "#/corethread"
  if (href.startsWith("#")) return href; // already a hash
  // Fallback: treat as relative route
  return `#/${href.replace(/^#?\/?/, "")}`;
}

const GlowButton = ({ href, children, variant = "primary" }) => {
  const base =
    "relative inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none";
  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)]",
    ghost: "border border-white/20 bg-white/5 text-white hover:bg-white/10",
  };
  const content = <span className={`${base} ${variants[variant]}`}>{children}</span>;
  const safeHref = toHref(href);
  if (!safeHref) return <button>{content}</button>;
  const isExternal = /^https?:\/\//i.test(safeHref);
  return (
    <a href={safeHref} className="no-underline" target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined}>
      {content}
    </a>
  );
};

const GCard = ({ children, className = "" }) => (
  <div className={`relative rounded-2xl p-[1px] bg-gradient-to-br from-white/20 via-white/5 to-white/20 shadow-lg shadow-black/20 ${className}`}>
    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl ring-1 ring-white/10 p-6">{children}</div>
  </div>
);

const Pill = ({ children }) => (
  <span className="rounded-full bg-white/10 text-white/90 border border-white/15 px-3 py-1 text-xs">{children}</span>
);

const Feature = ({ icon: Icon, title, children }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/80 to-blue-600/80 text-white ring-1 ring-white/20">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h4 className="text-white font-semibold">{title}</h4>
      <p className="text-slate-300 text-sm mt-1">{children}</p>
    </div>
  </div>
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
          <div key={i} className="rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left text-white/90 hover:bg-white/10 transition"
            >
              <span className="font-medium">{it.title}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <div className="px-4 pb-4 text-slate-200 text-sm">{it.content}</div>}
          </div>
        );
      })}
    </div>
  );
};

const VariantTable = ({ rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="text-left text-slate-300">
        <tr className="border-b border-white/10">
          <th className="py-2 pr-4">Variant</th>
          <th className="py-2 pr-4">Spec</th>
          <th className="py-2">Suited For</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} className="border-b border-white/5 last:border-0">
            <td className="py-2 pr-4 text-white font-medium">{r.name}</td>
            <td className="py-2 pr-4 text-slate-200">{r.spec}</td>
            <td className="py-2 text-slate-200">{r.suited}</td>
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <Container className="flex h-16 items-center justify-between">
        <a href="#/" className="flex items-center gap-3">
          <img
            src="/artan-protec-logo.png"
            alt="Artan Protec"
            className="h-8 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="leading-tight">
            <p className="font-semibold">Artan Protec</p>
            <p className="text-[11px] text-slate-400">Advanced Protection | Engineered Performance</p>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <div className="relative">
            <button onClick={() => setOpen((v) => !v)} className="text-slate-300 hover:text-white inline-flex items-center gap-1">
              Catalog
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div onMouseLeave={() => setOpen(false)} className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900/90 ring-1 ring-white/10 backdrop-blur shadow-xl p-2">
                {FAMILIES.map((f) => (
                  <a key={f.id} href={toHref(f.path)} className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-white/10">
                    {f.name}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="#/why" className="text-slate-300 hover:text-white">Why Artan</a>
          <a href="#/downloads" className="text-slate-300 hover:text-white">Downloads</a>
          <GlowButton href="/contact"> <Mail className="h-4 w-4"/> Contact</GlowButton>
        </nav>
      </Container>
    </header>
  );
}

function SiteFrame({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* BG gradient layers */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(56,189,248,0.15),transparent),radial-gradient(1000px_500px_at_80%_10%,rgba(37,99,235,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_120%,rgba(255,255,255,0.08),transparent)]" />
      </div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-slate-950 to-slate-950/95 py-10 mt-20">
      <Container className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/artan-protec-logo-mark.png"
            alt="Artan mark"
            className="h-8 w-8"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div>
            <p className="font-semibold">Artan Protec</p>
            <p className="text-xs text-slate-400">Advanced Protection | Engineered Performance</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} Artan Protec. All rights reserved.</p>
      </Container>
    </footer>
  );
}

// --------------------------- Pages --------------------------------------
function Home() {
  return (
    <>
      <section id="home" className="relative overflow-hidden">
        <Container className="pt-16 pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
              Aramid Materials • FRR Fabrics • Industrial PPE
            </div>
            <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight">
              Engineered FR performance from fiber to finished gear
            </h1>
            <p className="mt-5 text-lg text-slate-300">
              High‑strength, heat‑resistant yarns & threads (CoreThread), FR fabrics (ArmorWeave), and select PPE assemblies (ArmorShield) for critical environments.
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
              <Pill>Advanced Materials Expertise</Pill>
              <Pill>End-to-End Reliability</Pill>
              <Pill>Innovative Performance Design</Pill>
            </div>
          </div>
        </Container>
      </section>

      <Section eyebrow="Catalog" title="Artan Protec Product Lines" lead="Open a product line to view detailed specs, variants, and downloads.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FAMILIES.map((fam) => (
            <GCard key={fam.id} className="hover:shadow-[0_0_60px_-10px_rgba(56,189,248,0.25)] transition">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white ring-1 ring-white/20">
                  <fam.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{fam.name}</h3>
                  <p className="text-slate-300 text-sm mt-1">{fam.summary}</p>
                </div>
              </div>
              <div className="mt-4">
                <GlowButton href={fam.path} variant="ghost">Open</GlowButton>
              </div>
            </GCard>
          ))}
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
            <h3 className="text-white font-semibold mb-3">Key details</h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-200 text-sm">
              {fam.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <h3 className="text-white font-semibold mt-6 mb-3">Available variants</h3>
            <VariantTable rows={fam.variants} />
          </GCard>
          <GCard>
            <h3 className="text-white font-semibold mb-3">Downloads</h3>
            <div className="flex flex-wrap gap-2">
              {fam.downloads.map((d) => (
                <a key={d.href} href={d.href} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white hover:bg-white/10">
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
        <GlowButton href="/brochures/artan-corethread.pdf" variant="ghost">
          <Download className="h-4 w-4" /> CoreThread
        </GlowButton>
        <GlowButton href="/brochures/artan-armorweave.pdf" variant="ghost">
          <Download className="h-4 w-4" /> ArmorWeave
        </GlowButton>
        <GlowButton href="/brochures/artan-ppe.pdf" variant="ghost">
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
            <div className="flex items-center gap-2 text-white font-semibold"><Mail className="h-5 w-5"/> Emails</div>
            <ul className="mt-2 text-slate-300 text-sm space-y-2">
              <li>
                <strong>Primary:</strong> <a className="hover:underline" href="mailto:artanprotec@gmail.com">artanprotec@gmail.com</a>
              </li>
            </ul>
            <p className="text-xs text-slate-400 mt-3">Enable Netlify form notifications → Forms → contact → Notifications → Email to this address.</p>
          </GCard>
          <GCard>
            <div className="flex items-center gap-2 text-white font-semibold"><Phone className="h-5 w-5"/> Phone</div>
            <p className="mt-2 text-slate-300 text-sm">USA: +1 470 445 0578</p>
          </GCard>
        </div>
        <GCard className="mt-6">
          <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" className="grid md:grid-cols-3 gap-4">
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden"><label>Don’t fill this out if you're human: <input name="bot-field" /></label></p>
            <input required name="name" placeholder="Name" className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400" />
            <input required type="email" name="email" placeholder="Email" className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400" />
            <input name="company" placeholder="Company" className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400" />
            <textarea required name="message" placeholder="Project / Specs" className="md:col-span-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 min-h-[120px] text-white placeholder:text-slate-400" />
            <div className="md:col-span-3"><GlowButton><Mail className="h-5 w-5" /> Submit</GlowButton></div>
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
    const path = raw.replace(/^#/, "");
    return path || "/"; // default to root
  };
  const [path, setPath] = useState(getPath);
  useEffect(() => {
    const onHash = () => setPath(getPath());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
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
  return <Home />; // fallback
}

// ---------------------------- Dev sanity checks --------------------------
function runSimpleTests() {
  const cases = [
    ["/corethread", "#/corethread"],
    ["downloads", "#/downloads"],
    ["/brochures/artan-corethread.pdf", "/brochures/artan-corethread.pdf"],
    ["https://example.com", "https://example.com"],
    ["#/_directHash", "#/_directHash"],
  ];
  let pass = 0;
  for (const [input, expected] of cases) {
    const out = toHref(input);
    if (out === expected) pass++; else console.warn("toHref FAIL", { input, out, expected });
  }
  // eslint-disable-next-line no-console
  console.log(`toHref tests: ${pass}/${cases.length} passed`);
}

if (typeof window !== "undefined" && import.meta && import.meta.env && import.meta.env.DEV) {
  try { runSimpleTests(); } catch (e) { console.warn("self-tests error", e); }
}

// ------------------------------- App ------------------------------------
export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteFrame>
        <RouterView />
      </SiteFrame>
    </div>
  );
}
