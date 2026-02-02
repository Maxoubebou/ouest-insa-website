// src/common/ribbon-background.tsx
import React from "react";

export const RibbonBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none h-full w-full bg-surface-primary dark:bg-dark-surface-primary">
      <svg
        className="absolute inset-0 w-full h-full opacity-70 dark:opacity-80"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Dégradés */}
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="redGradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
            <stop offset="50%" stopColor="#dc2626" stopOpacity="1" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
          </linearGradient>

          <filter id="heavyBlur" >
            <feGaussianBlur in="SourceGraphic" stdDeviation="80" result="blur" />
          </filter>
        </defs>

        <g filter="url(#heavyBlur)">
          {/* 1. BLEU */}
          <path
            d="M-100,0 C300,200 100,500 1200,100"
            fill="none"
            stroke="url(#blueGradient)"
            strokeWidth="100"
            strokeLinecap="round"
            className="mix-blend-screen"
          />

          {/* 2. ROUGE */}
          <path
            d="M-200,400 C400,200 600,900 1200,300"
            fill="none"
            stroke="url(#redGradient)"
            strokeWidth="100"
            strokeLinecap="round"
            className="mix-blend-screen"
          />

          {/* 3. BLEU */}
          <path
            d="M-100,600 C400,400 500,1000 1200,500"
            fill="none"
            stroke="url(#blueGradient)"
            strokeWidth="100"
            strokeLinecap="round"
            className="mix-blend-screen"
          />

          {/* 4. ROUGE */}
          <path
            d="M-100,900 C300,700 600,1100 1200,800"
            fill="none"
            stroke="url(#redGradient)"
            strokeWidth="100"
            strokeLinecap="round"
            className="mix-blend-screen"
          />

          {/* 5. BLEU */}
          <path
            d="M200,-100 C-100,300 1000,600 800,1200"
            fill="none"
            stroke="url(#blueGradient)"
            strokeWidth="100"
            strokeLinecap="round"
            className="mix-blend-screen"
          />
        </g>
      </svg>
    </div>
  );
};