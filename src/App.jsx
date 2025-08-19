import React, { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, ChevronRight, Shield, Flame, Layers, Mail, Download, Factory, Building2, Globe } from "lucide-react";

/**
 * Artan Protech — Single‑file React site (TailwindCSS)
 * ----------------------------------------------------------------------
 * ✅ Brand theme: Red / Black / White (no mentions of other brands)
 * ✅ Navbar with Home, Products + Industries dropdowns (desktop + mobile)
 * ✅ "Explore Products" opens a mega dropdown
 * ✅ Footer with links to ALL pages (About, Contact, Products, Industries...)
 * ✅ Simple in‑app page switcher (no external router)
 * ✅ Image/render placeholders included
 */

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
    key: "aramid-yarn-thread",
    title: "Aramid Yarn & Thread",
    blurb: "Meta‑ & para‑aramid yarns and sewing threads engineered for heat and abrasion resistance.",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    key: "ppe-fabrics",
    title: "PPE Fabrics",
    blurb: "Flame‑resistant, cut‑resistant, and ballistic‑rated technical textiles.",
    icon: <Shield className="w-5 h-5" />,
  },
];

const INDUSTRY_PAGES = [
  { key: "ppe", title: "PPE", blurb: "Fire & industrial PPE, workwear, uniforms.", icon: <Shield className="w-5 h-5" /> },
  { key: "telecom", title: "Telecom", blurb: "Reinforcement yarns, FR housings & cable ancillaries.", icon: <Globe className="w-5 h-5" /> },
  { key: "infrastructure", title: "Infrastructure & Energy", blurb: "Renewables, switchgear, substations.", icon: <Building2 className="w-5 h-5" /> },
  { key: "mobility", title: "Mobility", blurb: "Automotive, rail, aerospace interiors & insulation.", icon: <Factory className="w-5 h-5" /> },
  { key: "defense", title: "Defense & Fire Safety", blurb: "Ballistics, FR apparel, high‑temp components.", icon: <Flame className="w-5 h-5" /> },
];

export default function ArtanProtechSite() {
  const [page, setPage] = useState(PAGES.HOME);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  useEffect(() => {
    setOpenDropdown("");
    setMobileOpen(false);
  }, [page]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
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
            goAbout={() => setPage(PAGES.ABOUT)}
          />
        )}

        {page === PAGES.ABOUT && <About />}
        {page === PAGES.CONTACT && <Contact />}

        {page === PAGES.PRODUCTS && (
          <Products onSelect={(key) => { setSelectedProduct(key); setPage(PAGES.PRODUCT_DETAIL); }} />
        )}

        {page === PAGES.INDUSTRIES && (
          <Industries onSelect={(key) => { setSelectedIndustry(key); setPage(PAGES.INDUSTRY_DETAIL); }} />
        )}

        {page === PAGES.PRODUCT_DETAIL && (
          <ProductDetail keyId={selectedProduct} onBack={() => setPage(PAGES.PRODUCTS)} />
        )}

        {page === PAGES.INDUSTRY_DETAIL && (
          <IndustryDetail keyId={selectedIndustry} onBack={() => setPage(PAGES.INDUSTRIES)} />
        )}
      </main>

      <Footer onNavigate={setPage} />
    </div>
  );
}

function Header({ onNavigate, onOpenDropdown, openDropdown, mobileOpen, setMobileOpen }) {
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
            <div className="w-9 h-9 rounded-full bg-red-600 text-white grid place-items-center font-bold">A</div>
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight text-red-700">Artan Protech</div>
              <div className="text-xs text-black">Advanced Protection | Engineered Performance</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 relative" ref={dropdownRef}>
            <NavLink onClick={() => onNavigate(PAGES.HOME)}>Home</NavLink>
            <NavButton onClick={() => onOpenDropdown(openDropdown === "products" ? "" : "products")} active={openDropdown === "products"}>
              Products <ChevronDown className="w-4 h-4 ml-1" />
            </NavButton>
            <NavButton onClick={() => onOpenDropdown(openDropdown === "industries" ? "" : "industries")} active={openDropdown === "industries"}>
              Industries <ChevronDown className="w-4 h-4 ml-1" />
            </NavButton>
            <NavLink onClick={() => onNavigate(PAGES.ABOUT)}>About</NavLink>
            <NavLink onClick={() => onNavigate(PAGES.CONTACT)}>Contact</NavLink>
            <a className="ml-2 inline-flex items-center gap-2 rounded-xl border border-red-600 px-3 py-2 text-sm text-red-700 hover:bg-red-50" href="#brochure" onClick={(e) => e.preventDefault()}>
              <Download className="w-4 h-4" /> Brochure
            </a>

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

          <button className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-red-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

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

function Home({ onExplore, goProducts, goAbout }) {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl/tight md:text-5xl/tight font-extrabold tracking-tight">Advanced Protection.<br />Engineered Performance.</h1>
          <p className="mt-4 text-neutral-600 max-w-xl">Artan Protech builds high‑performance materials — aramid yarns & threads and PPE fabrics for demanding environments. Trusted by OEMs and end‑users across mobility, infrastructure, telecom, and defense.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onExplore} className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3">
              Explore Products <ChevronDown className="w-4 h-4" />
            </button>
            <button onClick={goProducts} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50">
              View Catalog <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={goAbout} className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50">
              About Us
            </button>
          </div>
          {/* Trust row */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { k: "In‑house", s: "Design & QA" },
              { k: "Global", s: "Export ready" },
              { k: "OEM+EPC", s: "Vendor friendly" },
              { k: "Quality", s: "Tested performance" },
            ].map((item) => (
              <div key={item.k} className="rounded-xl border border-red-200 p-4">
                <div className="text-sm text-neutral-500">{item.s}</div>
                <div className="font-semibold">{item.k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero image placeholder */}
        <div className="relative">
          <div className="aspect-[4/3] rounded-3xl bg-neutral-100 border border-red-200 grid place-items-center">
            <div className="text-neutral-500 text-sm">Hero image / render placeholder</div>
          </div>
          <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-3xl bg-neutral-100 border border-red-200 grid place-items-center hidden md:grid">
            <span className="text-neutral-500 text-xs">Secondary visual</span>
          </div>
        </div>
      </div>

      {/* Featured cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCT_CATEGORIES.map((p) => (
            <div key={p.key} className="rounded-2xl border border-red-200 hover:border-red-300 p-5">
              <div className="flex items-center gap-3">
                <div className="text-red-700">{p.icon}</div>
                <div className="font-semibold">{p.title}</div>
              </div>
              <div className="mt-2 text-sm text-neutral-600">{p.blurb}</div>
              <button className="mt-4 inline-flex items-center gap-1 text-sm text-red-700" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Learn more <ChevronRight className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-widest text-neutral-500">{subtitle}</div>
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2">{title}</h2>
    </div>
  );
}

function Products({ onSelect }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="Products" subtitle="Catalog" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCT_CATEGORIES.map((p) => (
          <button key={p.key} onClick={() => onSelect(p.key)} className="text-left rounded-2xl border border-red-200 hover:border-red-300 p-5">
            <div className="flex items-center gap-3">
              <div className="text-red-700">{p.icon}</div>
              <div className="font-semibold">{p.title}</div>
            </div>
            <div className="mt-2 text-sm text-neutral-600">{p.blurb}</div>
            <div className="mt-4 aspect-[4/3] rounded-xl bg-neutral-100 border border-red-200 grid place-items-center">
              <span className="text-neutral-500 text-xs">Image / render placeholder</span>
            </div>
          </button>
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
        {INDUSTRY_PAGES.map((i) => (
          <button key={i.key} onClick={() => onSelect(i.key)} className="text-left rounded-2xl border border-red-200 hover:border-red-300 p-5">
            <div className="flex items-center gap-3">
              <div className="text-red-700">{i.icon}</div>
              <div className="font-semibold">{i.title}</div>
            </div>
            <div className="mt-2 text-sm text-neutral-600">{i.blurb}</div>
            <div className="mt-4 aspect-[4/3] rounded-xl bg-neutral-100 border border-red-200 grid place-items-center">
              <span className="text-neutral-500 text-xs">Industry visual placeholder</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProductDetail({ keyId, onBack }) {
  const meta = PRODUCT_CATEGORIES.find((p) => p.key === keyId);
  if (!meta) return null;
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={onBack} className="text-sm text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 mb-6">
        <ChevronRight className="-scale-x-100 w-4 h-4" /> Back to Products
      </button>
      <h3 className="text-3xl font-extrabold tracking-tight">{meta.title}</h3>
      <p className="mt-2 text-neutral-600">{meta.blurb}</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {[1,2,3,4].map((n) => (
          <div key={n} className="aspect-[4/3] rounded-xl bg-neutral-100 border border-red-200 grid place-items-center">
            <span className="text-neutral-500 text-xs">Product image {n}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-red-200 overflow-hidden">
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm font-medium">Key Specifications</div>
        <div className="p-4">
          <ul className="list-disc pl-5 text-neutral-700 space-y-1">
            <li>Performance ratings (FR, abrasion, thermal) — add your exact figures.</li>
            <li>Available counts / widths / weights.</li>
            <li>Colorways (dope‑dyed meta‑aramid available).</li>
            <li>Compliance & testing: ASTM/ISO where relevant.</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3"><Download className="w-4 h-4"/>Download Datasheet</a>
        <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50"><Mail className="w-4 h-4"/>Enquire</a>
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
      <p className="mt-2 text-neutral-600">{meta.blurb}</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {[1,2,3,4].map((n) => (
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
        <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3"><Download className="w-4 h-4"/>Industry One‑pager</a>
        <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-red-600 text-red-700 px-4 py-3 hover:bg-red-50"><Mail className="w-4 h-4"/>Talk to Sales</a>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="About Artan Protech" subtitle="Company" />
      <p className="text-neutral-700 leading-relaxed">
        Artan Protech designs and delivers high‑performance materials for harsh environments. Our portfolio spans aramid
        yarns & threads and PPE fabrics. We combine precise engineering with reliable execution to help OEMs, EPCs, and
        end‑users meet demanding performance, safety, and compliance requirements.
      </p>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {["Design & Development","Manufacturing & QA","Export Logistics"].map((k) => (
          <div key={k} className="rounded-xl border border-red-200 p-4">
            <div className="text-sm text-neutral-500">Capability</div>
            <div className="font-semibold">{k}</div>
            <div className="mt-2 text-sm text-neutral-600">Short descriptive copy placeholder. Add your certifications and references.</div>
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
          <form className="grid gap-3">
            <input className="border border-red-300 rounded-xl px-3 py-2" placeholder="Name" />
            <input className="border border-red-300 rounded-xl px-3 py-2" placeholder="Email" />
            <textarea className="border border-red-300 rounded-xl px-3 py-2 min-h-[100px]" placeholder="Tell us about your requirement" />
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white px-4 py-3">
              <Mail className="w-4 h-4"/> Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="mt-10 border-t border-red-200 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-extrabold tracking-tight">Artan Protech</div>
            <div className="text-xs text-neutral-500">Advanced Protection | Engineered Performance</div>
            <div className="mt-4 text-sm text-neutral-600">High‑performance materials for PPE, mobility, infrastructure, telecom, and defense.</div>
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
            <FooterLink onClick={() => onNavigate(PAGES.ABOUT)}>About</FooterLink>
            <FooterLink onClick={() => onNavigate(PAGES.CONTACT)}>Contact</FooterLink>
            <a href="#brochure" onClick={(e)=>e.preventDefault()} className="block text-sm text-red-700 hover:text-red-800">Download Brochure</a>
          </FooterCol>
        </div>

        <div className="mt-8 pt-6 border-t border-red-200 text-xs text-neutral-500 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Artan Protech. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-neutral-900">Privacy</a>
            <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-neutral-900">Terms</a>
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
    <button onClick={onClick} className="block text-sm text-neutral-700 hover:text-neutral-900">{children}</button>
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
