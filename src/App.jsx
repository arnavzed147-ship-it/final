import React from "react";
import { ShieldCheck, Flame, Layers3, Mail, Phone, Download, Sparkles, ChevronRight, Link as LinkIcon } from "lucide-react";
import "./index.css";
import Accordion from "./components/Accordion.jsx";
import { productFamilies } from "./products.js";

const Section = ({ id, eyebrow, title, lead, children }) => (
  <section id={id} className="section" aria-label={title}>
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-8">
        {eyebrow && <p className="text-xs uppercase tracking-widest text-zinc-500">{eyebrow}</p>}
        <h2 className="text-2xl md:text-4xl font-bold mt-1">{title}</h2>
        {lead && <p className="text-zinc-600 mt-3 max-w-3xl">{lead}</p>}
      </div>
      {children}
    </div>
  </section>
);

const Card = ({ children }) => <div className="card">{children}</div>;
const Pill = ({ children }) => <span className="pill">{children}</span>;

export default function App() {
  const nav = [
    { href: "#catalog", label: "Catalog" },
    { href: "#why", label: "Why Artan" },
    { href: "#downloads", label: "Downloads" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="bg-white text-zinc-900">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3">
            <img src="/artan-protec-logo.png" alt="Artan Protec logo" className="h-8 w-auto" />
            <div className="leading-tight">
              <p className="font-bold">Artan Protec</p>
              <p className="text-[11px] text-zinc-500">Advanced Protection | Engineered Performance</p>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-zinc-700">
                {n.label}
              </a>
            ))}
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2">
              <Mail className="h-4 w-4" /> Contact
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-100" />
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 relative">
          <div className="max-w-3xl">
            <div className="kicker mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Aramid Materials • FRR Fabrics • Industrial PPE
            </div>
            <h1 className="text-3xl md:text-6xl font-extrabold leading-tight">
              Engineered FR performance from fiber to finished gear
            </h1>
            <p className="mt-5 text-lg text-zinc-600">
              Artan Protec builds with aramids — delivering high‑strength, heat‑resistant yarns & threads (CoreThread),
              FR fabrics (ArmorWeave), and select PPE assemblies (ArmorShield) for critical environments.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#catalog" className="inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-3">
                <ChevronRight className="h-5 w-5" /> Explore Catalog
              </a>
              <a href="#downloads" className="inline-flex items-center gap-2 rounded-full border px-5 py-3">
                <Download className="h-5 w-5" /> Tech Sheets
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Pill>Spec‑driven sourcing</Pill>
              <Pill>Low‑CAPEX phase‑in</Pill>
              <Pill>Export‑ready</Pill>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG (Dropdown/Accordion details) */}
      <Section
        id="catalog"
        eyebrow="Catalog"
        title="Artan Protec Product Lines"
        lead="Choose a starting point: CoreThread (yarns & threads), ArmorWeave (FRR fabrics), ArmorShield (PPE & components). Each includes detailed specifications and variants."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productFamilies.map((fam) => (
            <Card key={fam.id}>
              <div className="flex items-start gap-3">
                {fam.id === "corethread" && <Layers3 className="h-6 w-6" />}
                {fam.id === "armorweave" && <Flame className="h-6 w-6" />}
                {fam.id === "ppe" && <ShieldCheck className="h-6 w-6" />}
                <div>
                  <h3 className="font-semibold">{fam.name}</h3>
                  <p className="text-sm text-zinc-600 mt-1">{fam.summary}</p>
                </div>
              </div>
              <div className="mt-4">
                <Accordion
                  allowMultiple
                  items={[
                    {
                      title: "Key details",
                      content: (
                        <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
                          {fam.details.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      ),
                    },
                    {
                      title: "Available variants",
                      content: (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="text-left">
                              <tr className="border-b">
                                <th className="py-2 pr-4">Variant</th>
                                <th className="py-2 pr-4">Spec</th>
                                <th className="py-2">Suited For</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fam.variants.map((v) => (
                                <tr key={v.name} className="border-b last:border-0">
                                  <td className="py-2 pr-4 font-medium">{v.name}</td>
                                  <td className="py-2 pr-4">{v.spec}</td>
                                  <td className="py-2">{v.suitedFor}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ),
                    },
                    {
                      title: "Downloads",
                      content: (
                        <div className="flex flex-wrap gap-2">
                          {fam.downloads.map((d) => (
                            <a key={d.href} href={d.href} className="inline-flex items-center gap-2 rounded-full border px-4 py-2">
                              <Download className="h-4 w-4" /> {d.label}
                            </a>
                          ))}
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* WHY */}
      <Section id="why" eyebrow="Why Artan" title="Built for demanding environments" lead="From seam integrity to arc and flame resistance, our inputs and assemblies are tuned to application realities.">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <h3 className="font-semibold">Materials mastery</h3>
            <p className="text-sm text-zinc-700 mt-2">Meta‑aramid & para‑aramid expertise — converting fibers into robust threads, fabrics, and PPE components.</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Quality & compliance</h3>
            <p className="text-sm text-zinc-700 mt-2">Process controls and documentation aligned with FR/PPE expectations. Traceability by batch.</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Scale‑ready network</h3>
            <p className="text-sm text-zinc-700 mt-2"> Spinning/weaving/finishing; in‑house doubling & cone winding to shorten lead times.</p>
          </Card>
        </div>
      </Section>

      {/* DOWNLOADS */}
      <Section id="downloads" eyebrow="Downloads" title="Brochures & spec sheets">
        <div className="flex flex-wrap gap-3">
          <a href="/brochures/artan-corethread.pdf" className="inline-flex items-center gap-2 rounded-full border px-4 py-2"><Download className="h-4 w-4" /> CoreThread</a>
          <a href="/brochures/artan-armorweave.pdf" className="inline-flex items-center gap-2 rounded-full border px-4 py-2"><Download className="h-4 w-4" /> ArmorWeave</a>
          <a href="/brochures/artan-ppe.pdf" className="inline-flex items-center gap-2 rounded-full border px-4 py-2"><Download className="h-4 w-4" /> PPE Program</a>
        </div>
      </Section>

      {/* CONTACT — Netlify Forms (emails go to your Netlify notifications) */}
      <Section
        id="contact"
        eyebrow="Contact"
        title="Talk to our team"
        lead="Submit specs or drawings — we'll respond with the right thread, fabric, or PPE program."
      >
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold flex items-center gap-2"><Mail className="h-5 w-5" /> Emails</h3>
            <ul className="mt-2 text-sm text-zinc-700 space-y-2">
              <li><strong>Primary:</strong> <a className="text-blue-600" href="mailto:artanprotec@gmail.com">artanprotec@gmail.com</a></li>
            </ul>
            <p className="text-xs text-zinc-500 mt-3">Tip: In Netlify, enable form notifications to forward submissions to this address.</p>
          </Card>
          <Card>
            <h3 className="font-semibold flex items-center gap-2"><Phone className="h-5 w-5" /> Phone</h3>
            <p className="mt-2 text-sm text-zinc-700">USA: +1 470 445 0578</p>
          </Card>
        </div>

        <div className="mt-8">
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            className="grid md:grid-cols-3 gap-4"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>Don’t fill this out if you're human: <input name="bot-field" /></label>
            </p>
            <input required name="name" placeholder="Name" className="rounded-xl border px-4 py-3" />
            <input required type="email" name="email" placeholder="Email" className="rounded-xl border px-4 py-3" />
            <input name="company" placeholder="Company" className="rounded-xl border px-4 py-3" />
            <textarea required name="message" placeholder="Project / Specs" className="md:col-span-3 rounded-xl border px-4 py-3 min-h-[120px]" />
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white px-5 py-3">
              <Mail className="h-5 w-5" /> Submit
            </button>
          </form>
          <p className="text-xs text-zinc-500 mt-3">After deploying on Netlify, test the form once so Netlify detects it and enables submissions.</p>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/artan-protec-logo-mark.png" alt="Artan mark" className="h-8 w-8" />
              <div>
                <p className="font-semibold">Artan Protec</p>
                <p className="text-xs text-zinc-500">Advanced Protection | Engineered Performance</p>
              </div>
            </div>
            <div className="text-sm text-zinc-600">
              <div className="flex items-center gap-3 flex-wrap">
                <a className="inline-flex items-center gap-1" href="#"><LinkIcon className="h-4 w-4"/> Artan Protec</a>
              </div>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-6">© {new Date().getFullYear()} Artan Protec. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
