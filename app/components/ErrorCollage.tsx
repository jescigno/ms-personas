"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const CONTAINER_W = 896;
const CONTAINER_H = 600;

export default function ErrorCollage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="relative rounded-2xl overflow-hidden mx-auto"
      style={{ backgroundColor: "#FFFFFF", width: `${CONTAINER_W}px`, height: `${CONTAINER_H}px`, maxWidth: "100%" }}
    >
      <Image
        src="/images/error/Error-Bgrd.png"
        alt=""
        fill
        className={`object-cover transition-opacity duration-700 ease-out ${visible ? "opacity-100" : "opacity-0"}`}
        sizes="896px"
      />

      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-6">
        <span className="font-bold text-zinc-900 tracking-tight text-center leading-tight" style={{ fontSize: "32px" }}>
          Something went wrong.
          <br />
          Please try again.
        </span>
      </div>

      <div className="absolute z-30" style={{ left: "175px", right: "175px", bottom: "34px" }}>
        <Image src="/images/MS-bar.svg" alt="" width={CONTAINER_W - 350} height={Math.round(((CONTAINER_W - 350) * 57) / 597)} className="w-full h-auto" />
      </div>
    </div>
  );
}
