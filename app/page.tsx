"use client";

import { useState } from "react";
import Link from "next/link";
import ChatInput from "./components/ChatInput";
import MoodboardCanvas from "./components/MoodboardCanvas";
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
  product: ProductItem;
  inspirations: InspirationItem[];
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
    <div className="min-h-screen flex flex-col items-center px-6 py-12" style={{ backgroundColor: "#f2f2f2" }}>
      <div className="w-full max-w-4xl flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Moodboard Generator</h1>
            <Link href="/mapping" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" y1="3" x2="9" y2="18"/>
                <line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
              View Mapping
            </Link>
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
            <MoodboardCanvas product={result.product} inspirations={result.inspirations} />
          </div>
        )}
      </div>
    </div>
  );
}
