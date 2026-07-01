"use client";

import Image from "next/image";

type InspirationItem = {
  id: string;
  label: string;
  image: string;
  size?: "xsmall" | "small" | "medium" | "large";
  tags: string[];
};

type ProductItem = {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  tags: string[];
};

type Props = {
  product: ProductItem;
  inspirations: InspirationItem[];
};

const SIZE_DIMS: Record<string, { w: number; h: number }> = {
  xsmall: { w: 10, h: 70  },
  small:  { w: 13, h: 90  },
  medium: { w: 16, h: 115 },
  large:  { w: 24, h: 180 },
};

// Slot positions (x/y as % of container); size comes from the inspiration itself
// Right slots start at x=78%+ to ensure ≥32px gap from product right edge (71%).
// Top slots are staggered so no two inspirations share the same top alignment.
const SLOTS = [
  { x: 2,  y: 6  }, // top-left
  { x: 76, y: 18 }, // top-right
  { x: 79, y: 64 }, // bottom-right
  { x: 8,  y: 58 }, // bottom-left
];

const CENTER = { cx: 50, w: 42 };

function seededMatch(id: string): string {
  const hash = id.split("").reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 3) * 31, 0);
  const pct = 91 + (hash % 8) + ((hash * 13) % 10) / 10;
  return pct.toFixed(1);
}

export default function MoodboardCanvas({ product, inspirations }: Props) {
  const matchPct = seededMatch(product.id);

  // Small images always go to bottom slots (2 & 3) so lines from top don't cross their labels
  const sortedInspirations = [...inspirations].sort((a, b) => {
    const order = { large: 0, medium: 1, small: 2, xsmall: 3 };
    return (order[a.size ?? "medium"] ?? 1) - (order[b.size ?? "medium"] ?? 1);
  });

  return (
    <div className="relative w-full isolate rounded-2xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", minHeight: "720px" }}>
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="flex flex-col items-end text-right">
          <span className="text-xs font-bold text-zinc-900 leading-tight">MY ARRAY</span>
          <span className="text-xs font-bold text-zinc-900 leading-tight">{matchPct}% MATCH</span>
        </div>
        <Image src="/images/MS-logomark-onwhite.svg" alt="MS" width={32} height={32} />
      </div>

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {SLOTS.slice(0, sortedInspirations.length).map((slot, i) => {
          const insp = sortedInspirations[i];
          const dims = SIZE_DIMS[insp.size ?? "medium"];
          const containerH = 560;
          const imgHeightPct = (dims.h / containerH) * 100;
          const isCircle = insp.size === "xsmall" || insp.size === "small";
          // For circle images, run the line to image center (transparent/circular edges let it show through)
          const inspMx = slot.x + dims.w / 2;
          const inspMy = slot.y + imgHeightPct / 2;
          return (
            <line
              key={i}
              x1={inspMx}
              y1={inspMy}
              x2={50}
              y2={50}
              stroke="#5eead4"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* Center product */}
      <div
        className="absolute flex flex-col gap-2 z-10"
        style={{
          left: `${CENTER.cx}%`,
          top: "50%",
          width: `${CENTER.w}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="relative w-full bg-white rounded-lg overflow-hidden shadow-[0_4px_32px_0_rgba(0,0,0,0.06)]" style={{ paddingBottom: "120%" }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="42vw"
          />
        </div>
        <div className="flex flex-col gap-0.5 mt-1">
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">{product.brand}</span>
          <span className="text-base font-bold text-zinc-900 leading-tight">{product.name}</span>
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-900">{product.price}</span>
        </div>
      </div>

      {/* Inspiration cards */}
      {sortedInspirations.slice(0, 4).map((insp, i) => {
        const slot = SLOTS[i];
        const dims = SIZE_DIMS[insp.size ?? "medium"];
        return (
          <div
            key={insp.id}
            className="absolute flex flex-col gap-1.5 z-10"
            style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${dims.w}%` }}
          >
            {(() => {
              const isCircle = insp.size === "xsmall" || insp.size === "small";
              const radius = isCircle ? "50%" : "8px";
              return (
                <div
                  className="bg-transparent overflow-hidden flex items-center justify-center"
                  style={{ width: `${dims.h}px`, height: `${dims.h}px`, borderRadius: radius }}
                >
                  <Image
                    src={insp.image}
                    alt={insp.label}
                    width={dims.h}
                    height={dims.h}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: radius }}
                    sizes="24vw"
                  />
                </div>
              );
            })()}
            <span className="text-[9px] font-mono font-semibold tracking-widest text-zinc-700 uppercase leading-tight whitespace-pre-line">
              {insp.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
