"use client";

import { FormEvent, useState } from "react";

type Props = {
  onSubmit: (query: string) => void;
  loading: boolean;
};

export default function ChatInput({ onSubmit, loading }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full bg-white rounded-full px-5 py-2 shadow-[0_2px_16px_0_rgba(0,0,0,0.08)] focus-within:shadow-[0_2px_20px_0_rgba(0,0,0,0.12)] transition-shadow">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Describe a style or product… e.g. 'effortless 70s, earth tones'"
        className="flex-1 bg-transparent text-sm text-black outline-none placeholder:text-zinc-400 py-1.5"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="ml-3 px-5 py-2 rounded-full text-white text-sm font-medium transition-colors shrink-0 translate-x-[10px]" style={{ backgroundColor: "#07D5A5" }}
      >
        {loading ? "Generating…" : "Generate"}
      </button>
    </form>
  );
}
