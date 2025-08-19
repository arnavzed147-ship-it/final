"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

// ────────────────────────────────────────────────────────────────────────────────
// Artan Protec — Red / White / Black Theme (with full content)
// ────────────────────────────────────────────────────────────────────────────────

const HERO_SRC = "/hero.jpg"; // put hero.jpg in public/

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Products", href: "#products" },
  { name: "Industries", href: "#industries" },
  { name: "About Us", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function App() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <div className="font-sans text-gray-900">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <img src="/artan-protec-logo.png" alt="Artan Protec" className="h-10" />
            <span className="font-bold text-xl text-red-600">Artan Protec</span>
          </div>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-red-600 transition"
              >
                {item.name}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
        <motion.img
          src={HERO_SRC}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          style={{ y }}
        />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Advanced Protection. Engineered Performance.</h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg">
            Welcome to Artan Protec — delivering cutting-edge aramid yarns, fabrics, PPE solutions, and ballistic systems.
          </p>
          <a
            href="#products"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition"
          >
            Explore Products <ChevronRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-red-600 mb-12">Our Products</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-2xl shadow hover:shadow-lg transition">
              <ShieldCheck className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Aramid Yarn & Thread</h3>
              <p className="text-sm mb-4">High-strength aramid yarns and threads for advanced protective textiles.</p>
              <a href="/brochures/aramid-yarn-thread.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-red-600 hover:underline">
                <FileDown className="w-4 h-4 mr-2" /> Download Brochure
              </a>
            </div>
            <div className="p-6 border rounded-2xl shadow hover:shadow-lg transition">
              <Flame className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">PPE Fabrics</h3>
              <p className="text-sm mb-4">Flame-resistant and protective fabrics engineered for industrial safety.</p>
              <a href="/brochures/ppe-fabrics.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-red-600 hover:underline">
                <FileDown className="w-4 h-4 mr-2" /> Download Brochure
              </a>
            </div>
            <div className="p-6 border rounded-2xl shadow hover:shadow-lg transition">
              <Layers3 className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Ballistic Systems</h3>
              <p className="text-sm mb-4">UHMWPE sheets and advanced ballistic materials for defense applications.</p>
              <a href="/brochures/ballistic-systems.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-red-600 hover:underline">
                <FileDown className="w-4 h-4 mr-2" /> Download Brochure
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-red-600 mb-12">Industries We Serve</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-2xl shadow">
              <h3 className="font-semibold mb-2">Defense & Military</h3>
              <p className="text-sm">Ballistic systems, protective fabrics, and aramid yarns for advanced defense gear.</p>
            </div>
            <div className="p-6 border rounded-2xl shadow">
              <h3 className="font-semibold mb-2">Industrial Safety</h3>
              <p className="text-sm">PPE solutions and flame-resistant fabrics for worker protection.</p>
            </div>
            <div className="p-6 border rounded-2xl shadow">
              <h3 className="font-semibold mb-2">Technical Textiles</h3>
              <p className="text-sm">High-performance aramid-based textiles for multiple industries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-red-600 mb-6">Who We Are</h2>
          <p className="text-lg text-gray-700">
            Artan Protec is a next-generation manufacturer and supplier of aramid yarns, protective fabrics, PPE solutions, and ballistic systems. We combine advanced technology with decades of expertise to deliver materials and solutions that save lives and enhance performance.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-red-600 mb-6">Contact Us</h2>
          <p className="mb-4">Have questions or need product details? Reach out to us anytime.</p>
          <p className="flex items-center justify-center mb-2"><Mail className="w-4 h-4 mr-2" /> artanprotec@gmail.com</p>
          <p className="flex items-center justify-center"><Phone className="w-4 h-4 mr-2" /> +91-XXXXXXXXXX</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <img src="/artan-protec-logo.png" alt="Artan Protec" className="h-10 mb-4" />
            <p className="text-sm">© {new Date().getFullYear()} Artan Protec. All rights reserved.</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-red-500">{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <p className="flex items-center mb-2"><Mail className="w-4 h-4 mr-2" /> artanprotec@gmail.com</p>
            <p className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +91-XXXXXXXXXX</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
