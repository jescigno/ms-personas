import { NextRequest } from "next/server";
import products from "@/data/products.json";
import inspirations from "@/data/inspirations.json";

type Product = (typeof products)[number];
type Inspiration = (typeof inspirations)[number];

function scoreByTags(itemTags: string[], queryTags: string[]): number {
  return itemTags.filter((t) => queryTags.includes(t)).length;
}

function extractTags(query: string): string[] {
  const lower = query.toLowerCase();
  const allTags = [
    ...new Set([
      ...products.flatMap((p) => p.tags),
      ...inspirations.flatMap((i) => i.tags),
    ]),
  ];
  return allTags.filter((tag) => lower.includes(tag));
}

export async function POST(request: NextRequest) {
  const { query, profile } = await request.json();

  if (!query || typeof query !== "string") {
    return Response.json({ error: "query is required" }, { status: 400 });
  }

  const queryTags = extractTags(query);

  const profileProducts = profile
    ? products.filter((p) => (p as Product & { profile?: string }).profile === profile)
    : products;

  const pool = profileProducts.length > 0 ? profileProducts : products;

  // Score and rank products; pick the best match
  const scoredProducts = pool
    .map((p: Product) => ({ ...p, score: scoreByTags(p.tags, queryTags) }))
    .sort((a, b) => b.score - a.score);

  if (profile === "olivia") {
    return Response.json({ products: scoredProducts.slice(0, 3), queryTags });
  }

  const product = scoredProducts[0] ?? pool[0];

  // Use explicitly curated inspirations if defined on the product, otherwise fall back to tag-matching
  let picked: Inspiration[];
  const curatedIds = (product as Product & { inspirations?: string[] }).inspirations;

  if (curatedIds && curatedIds.length > 0) {
    picked = curatedIds
      .map((id) => inspirations.find((i) => i.id === id))
      .filter((i): i is Inspiration => i !== undefined)
      .slice(0, 4);
  } else {
    const combinedTags = [...new Set([...queryTags, ...product.tags])];
    picked = inspirations
      .map((i: Inspiration) => ({ ...i, score: scoreByTags(i.tags, combinedTags) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }

  return Response.json({ product, inspirations: picked, queryTags });
}
