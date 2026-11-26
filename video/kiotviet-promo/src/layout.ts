import { createContext, useContext } from 'react';

// Output layout: 16:9 master (1920×1080) or TikTok 9:16 (1080×1920).
// TikTok safe zone (UI overlays): keep key content inside x 64–956 (right rail of buttons ≈124px),
// y 210–1440 (top bar ≈210px, caption/music/CTA stack ≈480px at the bottom).
export type Layout = { vertical: boolean; W: number; H: number; safe: { l: number; r: number; t: number; b: number } };
export const LANDSCAPE: Layout = { vertical: false, W: 1920, H: 1080, safe: { l: 0, r: 1920, t: 0, b: 1080 } };
export const PORTRAIT: Layout = { vertical: true, W: 1080, H: 1920, safe: { l: 64, r: 956, t: 210, b: 1440 } };
export const LayoutCtx = createContext<Layout>(LANDSCAPE);
export const useLayout = () => useContext(LayoutCtx);

// Map a point of 1920×1080 footage to screen space when the footage is drawn object-fit: cover.
export const footageMap = (L: Layout) => {
  if (!L.vertical) return (x: number, y: number) => [x, y] as const;
  const k = L.H / 1080; // 1.7778
  const off = (1920 * k - L.W) / 2;
  return (x: number, y: number) => [x * k - off, y * k] as const;
};
