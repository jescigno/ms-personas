"use client";

import Image from "next/image";

type ProductItem = {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  tags: string[];
};

type Props = {
  products: ProductItem[];
  /** "standalone" renders its own card chrome; "embedded" renders bare so it can sit inside another card (e.g. below a hero product). */
  variant?: "standalone" | "embedded";
};

export default function ProductGrid({ products, variant = "standalone" }: Props) {
  const grid = (
    <div className="grid grid-cols-3 gap-12">
      {products.map((product) => (
        <div key={product.id} className="flex flex-col gap-2">
          <div className="relative w-full bg-white rounded-lg overflow-hidden shadow-[0_4px_32px_0_rgba(0,0,0,0.06)]" style={{ paddingBottom: "100%" }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="30vw"
            />
          </div>
          <div className="flex flex-col gap-0.5 mt-1">
            <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">{product.brand}</span>
            <span className="text-base font-bold text-zinc-900 leading-tight">{product.name}</span>
            <span className="text-sm font-mono tracking-widest uppercase text-zinc-900">{product.price}</span>
          </div>
        </div>
      ))}
    </div>
  );

  if (variant === "embedded") {
    return (
      <div className="relative w-full rounded-b-2xl overflow-hidden px-8 pb-8" style={{ backgroundColor: "#FFFFFF" }}>
        {grid}
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden p-8" style={{ backgroundColor: "#FFFFFF", minHeight: "480px" }}>
      <div className="flex items-center justify-end gap-2 mb-8">
        <span className="text-xs font-bold text-zinc-900 tracking-widest uppercase">Picks for Olivia</span>
        <Image src="/images/MS-logomark-onwhite.svg" alt="MS" width={32} height={32} />
      </div>
      {grid}
    </div>
  );
}
