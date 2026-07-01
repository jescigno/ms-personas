"use client";

import { useState } from "react";
import inspirations from "@/data/inspirations.json";
import products from "@/data/products.json";
import Image from "next/image";
import Link from "next/link";
import MoodboardCanvas from "@/app/components/MoodboardCanvas";

type Inspiration = {
  id: string;
  label: string;
  image: string;
  size: "xsmall" | "small" | "medium" | "large";
  tags: string[];
};

type Product = {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  profile: string;
  inspirations: string[];
  tags: string[];
};

const inspirationMap = Object.fromEntries(
  (inspirations as Inspiration[]).map((i) => [i.id, i])
);

function labelLines(label: string) {
  return label.split("\n");
}

export default function MappingPage() {
  const [active, setActive] = useState<"products" | "inspirations" | "layouts">("products");

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col relative">
      <div className="absolute top-4 left-6 z-10">
        <Link href="/" className="flex items-center gap-1 text-xs font-semibold text-zinc-900 uppercase rounded-lg pl-1 pr-3 py-2 bg-black/10">
          <Image src="/images/icons/arrow.svg" alt="" width={16} height={16} />
          Back to Chat
        </Link>
      </div>

      {/* Toggle */}
      <div className="w-full px-6 mt-16">
        <div className="max-w-7xl mx-auto flex gap-8 border-b border-zinc-200">
          {([
            { key: "products", count: products.length },
            { key: "inspirations", count: inspirations.length },
            { key: "layouts", count: products.length },
          ] as const).map(({ key, count }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`py-3 flex items-center gap-2 text-sm font-semibold tracking-widest uppercase transition-colors border-b-4 -mb-[2px] ${
                active === key
                  ? "border-[#07D5A5] text-zinc-900"
                  : "border-transparent text-zinc-900"
              }`}
            >
              {key}
              <span className="text-xs font-normal normal-case tracking-normal text-zinc-400">{count} items</span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-6 pt-4 pb-12 w-full flex flex-col gap-20">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-20">

        {/* Products grouped by persona */}
        {active === "products" && <section>
          {Array.from(new Set((products as Product[]).map((p) => p.profile))).map((profile) => {
            const profileProducts = (products as Product[]).filter((p) => p.profile === profile);
            return (
              <div key={profile} className={`mb-16${profile === "marcus" ? " mt-4" : ""}`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-zinc-200">
                    <Image
                      src={`/images/profiles/${profile.charAt(0).toUpperCase() + profile.slice(1)}.png`}
                      alt={profile}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <h3 className="text-lg font-semibold tracking-widest uppercase text-zinc-900">{profile}</h3>
                  <span className="text-xs text-zinc-400">{profileProducts.length} products</span>
                </div>
                <div className="flex flex-col gap-6">
                  {profileProducts.map((product) => {
              const linkedInspirations = product.inspirations
                .map((id) => inspirationMap[id])
                .filter(Boolean);
              return (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-[0_2px_16px_0_rgba(0,0,0,0.06)]">
                  {/* Product image */}
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-zinc-100 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 192px"
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex flex-col gap-3 p-5 flex-1 min-w-0">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs tracking-widest uppercase text-zinc-400 font-medium">{product.brand}</p>
                      <h3 className="text-xl font-semibold text-zinc-900 leading-tight">{product.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag) => (
                        <span key={tag} className="text-[9px] tracking-wide uppercase bg-zinc-100 text-zinc-500 rounded px-1.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {linkedInspirations.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {linkedInspirations.map((insp) => (
                          <div key={insp.id} className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1">
                            <div className="relative w-5 h-5 rounded overflow-hidden flex-shrink-0 bg-zinc-200">
                              <Image
                                src={insp.image}
                                alt={insp.id}
                                fill
                                className="object-cover"
                                sizes="20px"
                              />
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">{insp.id}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
                  })}
                </div>
              </div>
            );
          })}
        </section>}

        {/* Inspirations grouped by size */}
        {active === "inspirations" && <section className="pt-4">
          {(["xsmall", "small", "medium", "large"] as const).map((size) => {
            const sizeItems = (inspirations as Inspiration[]).filter((i) => i.size === size);
            if (!sizeItems.length) return null;

            const gridCols: Record<string, string> = {
              xsmall: "grid-cols-4 sm:grid-cols-6 lg:grid-cols-8",
              small:  "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6",
              medium: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
              large:  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            };
            const aspectRatio: Record<string, string> = {
              xsmall: "aspect-square",
              small:  "aspect-square",
              medium: "aspect-[4/3]",
              large:  "aspect-[3/2]",
            };
            const sizeLabel: Record<string, string> = {
              xsmall: "X-Small",
              small:  "Small",
              medium: "Medium",
              large:  "Large",
            };

            return (
              <div key={size} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-sm font-semibold tracking-widest uppercase text-zinc-900">{sizeLabel[size]}</h3>
                  <span className="text-xs text-zinc-400">{sizeItems.length} items</span>
                  <div className="flex-1 h-px bg-zinc-200" />
                </div>
                <div className={`grid ${gridCols[size]} gap-3`}>
                  {sizeItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl overflow-hidden flex flex-col group shadow-[0_2px_16px_0_rgba(0,0,0,0.06)]">
                      <div className={`relative w-full ${aspectRatio[size]} bg-zinc-100 overflow-hidden`}>
                        <Image
                          src={item.image}
                          alt={item.label.replace(/\n/g, " ")}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </div>
                      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
                        <div>
                          <p className="text-sm text-zinc-400 font-mono mb-1">{item.id}</p>
                          <p className="text-[10px] tracking-wider uppercase font-semibold text-zinc-800 leading-snug">
                            {labelLines(item.label).map((line) => line.replace(/^\//, "")).join(" / ")}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-auto pt-1">
                          {item.tags.slice(0, size === "large" ? 5 : size === "medium" ? 4 : 3).map((tag) => (
                            <span key={tag} className="text-[8px] tracking-wide uppercase bg-zinc-100 text-zinc-500 rounded px-1.5 py-0.5">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > (size === "large" ? 5 : size === "medium" ? 4 : 3) && (
                            <span className="text-[8px] tracking-wide uppercase text-zinc-400">
                              +{item.tags.length - (size === "large" ? 5 : size === "medium" ? 4 : 3)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>}

        {/* Layouts */}
        {active === "layouts" && (
          <section className="flex flex-col gap-16 pt-4">
            {Array.from(new Set((products as Product[]).map((p) => p.profile))).map((profile) => {
              const profileProducts = (products as Product[]).filter((p) => p.profile === profile);
              return (
                <div key={profile} className="mb-12">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-zinc-200">
                      <Image
                        src={`/images/profiles/${profile.charAt(0).toUpperCase() + profile.slice(1)}.png`}
                        alt={profile}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <h3 className="text-lg font-semibold tracking-widest uppercase text-zinc-900">{profile}</h3>
                    <span className="text-xs text-zinc-400">{profileProducts.length} products</span>
                  </div>
                  <div className="flex flex-col gap-16">
                    {profileProducts.map((product) => {
                      const linkedInspirations = product.inspirations
                        .map((id) => inspirationMap[id])
                        .filter(Boolean) as Inspiration[];
                      return (
                        <div key={product.id} className="max-w-4xl">
                          <MoodboardCanvas product={product} inspirations={linkedInspirations} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        )}
        </div>
      </main>
    </div>
  );
}
