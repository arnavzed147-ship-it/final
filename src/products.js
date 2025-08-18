export const productFamilies = [
  {
    id: "corethread",
    name: "CoreThread — Aramid Yarns & Threads",
    summary:
      "Industrial aramid yarns & sewing threads engineered for heat/FR, strength, and durability in PPE, filtration stitching, and high‑temperature assemblies.",
    details: [
      "Constructions: 2–8 ply staple-based threads; tex/dtex and denier tailored to application (e.g., 750 ±25 denier 4‑ply).",
      "Performance: breaking strength ≥ 60 N (spec‑dependent); elongation 3.0–4.4%; high modulus; excellent thermal stability.",
      "Chemistry: meta‑aramid (Nomex®‑type) & para‑aramid blends; dope‑dyed meta‑aramid colors available.",
      "Finish options: lubricant for sewing, anti‑wick, soft‑hand for seam integrity; cone winding and doubling in‑house.",
      "Use cases: FR apparel seams, firefighter gear, hot‑end filtration stitching, thermal shields, and specialty industrial.",
    ],
    variants: [
      { name: "CT‑750/4P", spec: "750 ±25 denier, 4‑ply, target 60 N break", suitedFor: "PPE seams, filtration sewing" },
      { name: "CT‑1000/3P", spec: "1000 denier class, 3‑ply", suitedFor: "Heavy protective gear, gloves" },
      { name: "CT‑MetaDyed", spec: "Dope‑dyed meta‑aramid (colors)", suitedFor: "Brand‑matched FR apparel" },
    ],
    downloads: [{ label: "CoreThread Datasheet (PDF)", href: "/brochures/artan-corethread.pdf" }],
  },
  {
    id: "armorweave",
    name: "ArmorWeave — FRR & PPE Fabrics",
    summary:
      "FR textiles for coveralls, jackets, gloves, hoods, and thermal liners. Engineered weights and weaves for shell, liner, and barrier layers.",
    details: [
      "Fiber systems: meta‑/para‑aramid, blends with antistatic grids; optional ripstop/twill constructions.",
      "Weight targets: typical 150–280 GSM for apparel; higher GSM for specific PPE layers and reinforcements.",
      "Finishes: comfort & moisture transport options; shade ranges aligned with industry norms; color fastness tested.",
      "Compliance support: application‑specific testing pathways and documentation guidance.",
      "Cut plans & sampling support for pilot programs.",
    ],
    variants: [
      { name: "AW‑Shell180", spec: "180 GSM ripstop shell", suitedFor: "FR coveralls & jackets" },
      { name: "AW‑Liner150", spec: "150 GSM liner", suitedFor: "Comfort liner for PPE" },
      { name: "AW‑Barrier260", spec: "260 GSM barrier", suitedFor: "Thermal barrier/added protection" },
    ],
    downloads: [{ label: "ArmorWeave Catalog (PDF)", href: "/brochures/artan-armorweave.pdf" }],
  },
  {
    id: "ppe",
    name: "ArmorShield — Industrial PPE & Components",
    summary:
      "Select PPE gear and components built on our CoreThread and ArmorWeave inputs to accelerate adoption and trials.",
    details: [
      "Gloves/sleeves with cut/heat resistance; FR hoods, jackets, and coveralls with aramid seams.",
      "Partnered manufacturing with compliance‑oriented QA; traceability and batch documentation available.",
      "Customization: logos, shade matching, and size grading per program needs.",
      "Pilot runs for validation before scale‑up.",
    ],
    variants: [
      { name: "AS‑GlovePro", spec: "Cut‑/heat‑resistant glove", suitedFor: "Foundry, welding, hot‑process handling" },
      { name: "AS‑HoodFR", spec: "FR hood with aramid seams", suitedFor: "Fire safety & industrial" },
      { name: "AS‑JacketAR", spec: "Arc‑rated jacket (program)", suitedFor: "Utilities & electrical maintenance" },
    ],
    downloads: [{ label: "PPE Program Overview (PDF)", href: "/brochures/artan-ppe.pdf" }],
  },
];
