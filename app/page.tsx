"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ChatInput from "./components/ChatInput";
import MoodboardCanvas from "./components/MoodboardCanvas";
import ProductGrid from "./components/ProductGrid";
import ProfileSwitcher, { type Profile } from "./components/ProfileSwitcher";

type InspirationItem = {
  id: string;
  label: string;
  image: string;
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

type MoodboardResult = {
  product?: ProductItem;
  inspirations?: InspirationItem[];
  products?: ProductItem[];
  queryTags: string[];
};

export default function Home() {
  const [activeProfile, setActiveProfile] = useState<Profile>("marcus");
  const [result, setResult] = useState<MoodboardResult | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleQuery(query: string) {
    setSubmittedQuery(query);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/moodboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, profile: activeProfile }),
      });
      if (!res.ok) throw new Error("Failed to generate moodboard");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleProfileChange(profile: Profile) {
    setActiveProfile(profile);
    setResult(null);
    setSubmittedQuery(null);
    setError(null);
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12 relative" style={{ backgroundColor: "#f2f2f2" }}>
      <div className="absolute top-4 right-6 z-10">
        <Link href="/mapping" className="flex items-center gap-1 text-xs font-semibold text-zinc-900 uppercase rounded-lg pl-3 pr-3 py-2 bg-black/10 [&>span]:pl-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" y1="3" x2="9" y2="18"/>
            <line x1="15" y1="6" x2="15" y2="21"/>
          </svg>
          <span>View Mapping</span>
        </Link>
      </div>
      <div className="w-full max-w-4xl flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Moodboard Generator</h1>
          </div>
          <ProfileSwitcher active={activeProfile} onChange={handleProfileChange} />
        </div>

        <ChatInput onSubmit={handleQuery} loading={loading} />

        {submittedQuery && (
          <div className="flex justify-end">
            <div className="bg-zinc-900 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm max-w-sm">
              {submittedQuery}
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {loading && (
          <div className="flex items-center justify-center py-24 text-sm text-zinc-400 tracking-widest uppercase">
            Generating…
          </div>
        )}

        {result && !loading && (
          <div className="flex flex-col gap-4">
            {result.product && result.inspirations ? (
              <div className="flex flex-col">
                <MoodboardCanvas
                  product={result.product}
                  inspirations={result.inspirations}
                  label={activeProfile === "olivia" ? "MY ARRAY - OLIVIA" : "MY ARRAY"}
                  roundedBottom={!(result.products && result.products.length > 0)}
                  scale={activeProfile === "olivia" ? 0.8 : 1}
                />
                {result.products && result.products.length > 0 && (
                  <ProductGrid products={result.products} variant="embedded" />
                )}
              </div>
            ) : result.products ? (
              <ProductGrid products={result.products} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
