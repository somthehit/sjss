"use client";

import React from "react";

export default function DhakaDivider() {
  return (
    <div className="w-full flex items-center justify-center py-6 no-print">
      <div className="flex-grow h-[1px] bg-gradient-to-r from-transparent via-[#c9a227] to-transparent opacity-50" />
      <div className="mx-6 flex items-center gap-1">
        {/* Repeating Dhaka motif (diamonds and circles in traditional colors) */}
        <svg
          width="120"
          height="16"
          viewBox="0 0 120 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#c9a227]"
        >
          {/* Diamond Motif Left */}
          <path
            d="M8 8L16 0L24 8L16 16Z"
            fill="var(--color-primary, #1a3a2a)"
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* Central Pattern */}
          <circle cx="36" cy="8" r="4" fill="var(--color-highlight, #8b1a1a)" />
          <path
            d="M60 8L68 0L76 8L68 16Z"
            fill="currentColor"
            stroke="var(--color-highlight, #8b1a1a)"
            strokeWidth="1.5"
          />
          <circle cx="84" cy="8" r="4" fill="var(--color-highlight, #8b1a1a)" />
          {/* Diamond Motif Right */}
          <path
            d="M96 8L104 0L112 8L104 16Z"
            fill="var(--color-primary, #1a3a2a)"
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* Connecting lines */}
          <line x1="24" y1="8" x2="32" y2="8" stroke="currentColor" strokeWidth="1" />
          <line x1="40" y1="8" x2="60" y2="8" stroke="currentColor" strokeWidth="1" />
          <line x1="76" y1="8" x2="80" y2="8" stroke="currentColor" strokeWidth="1" />
          <line x1="88" y1="8" x2="96" y2="8" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="flex-grow h-[1px] bg-gradient-to-r from-transparent via-[#c9a227] to-transparent opacity-50" />
    </div>
  );
}
