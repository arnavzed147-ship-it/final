import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({ items, allowMultiple=false }) {
  const [open, setOpen] = useState({});

  const toggle = (i) => {
    setOpen((prev) => {
      if (allowMultiple) return { ...prev, [i]: !prev[i] };
      return { [i]: !prev[i] };
    });
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = !!open[i];
        return (
          <div key={i} className="border rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-zinc-50"
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                {item.subtitle && <p className="text-xs text-zinc-600">{item.subtitle}</p>}
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="px-4 pb-4">
                {typeof item.content === "function" ? item.content() : item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
