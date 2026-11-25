// S1 · logo-shrink-wordmark-lockup (adapted from demos/outro/logo-shrink-wordmark-lockup/LogoShrinkWordmarkLockup.tsx)
// Kept from demo: shrink scale 5.4→1 (t 0.02–0.28 inOutCubic) + sin brake +6% (0.26–0.37),
// heal crossfade 0.10–0.28 (performance layer → clean layer), shift 0.34–0.47 inOutCubic,
// letters 0.46 + i·stagger (0.10 each, outCubic, 8px slide), tagline 0.72–0.84 whole-line fade.
// Adapted: real KiotViet mark + wordmark image (8 glyph slices), light brand background,
// shift/stagger recomputed for the KiotViet lockup width (card: "左移量与字标宽度耦合").
import React from 'react';
import { Img, staticFile } from 'remotion';
import { DesignStage, E, lerp, seg, useT } from '../lib/Motion';
import { C, FONT } from '../theme';

const ICON = 44; // design px (×4 on screen)
const WORD_H = ICON * (216 / 470); // wordmark/mark height ratio of the official logo
const WORD_W = WORD_H * (1027 / 216);
const GAP = ICON * (140 / 470);
const LOCK_W = ICON + GAP + WORD_W;
const LOCK_LEFT = 240 - LOCK_W / 2;
const SHIFT = LOCK_LEFT + ICON / 2 - 240; // mark centre moves from stage centre to its lockup slot
const WORD_LEFT = LOCK_LEFT + ICON + GAP;
// glyph boundaries in logo-word.png (px of the 1027-wide source): K i o t V i e t
const CUTS = [0, 166, 228, 394, 503, 695, 756, 915, 1027];
const STAGGER = (0.7 - 0.46 - 0.1) / (CUTS.length - 1); // card: (0.7-0.46)/n so letters finish before 0.7

export const S1_DEFAULTS = { tagline: 'Phần mềm quản lý bán hàng phổ biến nhất', accent: C.blue };

export const S1LogoLockup: React.FC<Partial<typeof S1_DEFAULTS>> = (p) => {
  const { tagline, accent } = { ...S1_DEFAULTS, ...p };
  const t = useT();
  const k = seg(t, 0.02, 0.28, E.inOutCubic);
  const brake = Math.sin(seg(t, 0.26, 0.37) * Math.PI) * 0.06;
  const s = lerp(k, 5.4, 1) * (1 + brake);
  const shift = seg(t, 0.34, 0.47, E.inOutCubic) * SHIFT;
  const heal = seg(t, 0.1, 0.28, E.inOutQuad);
  const scaleW = WORD_W / 1027;

  return (
    <DesignStage bg={C.bg} raster="zoom">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT }}>
        {/* soft brand glows (styleframe 01) */}
        <div style={{ position: 'absolute', width: 230, height: 230, left: -60, top: -90, borderRadius: '50%', background: '#BFD9FF', filter: 'blur(30px)', opacity: 0.55 }} />
        <div style={{ position: 'absolute', width: 200, height: 200, right: -50, bottom: -90, borderRadius: '50%', background: '#C9F2D2', filter: 'blur(30px)', opacity: 0.55 }} />
        {/* mark: performance layer (glow) heals into the clean mark while shrinking */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: ICON,
            height: ICON,
            margin: `${-ICON / 2}px 0 0 ${-ICON / 2}px`,
            transform: `translateX(${shift}px) scale(${s})`,
          }}
        >
          <Img
            src={staticFile('img/logo-mark.png')}
            style={{ position: 'absolute', inset: -2, width: ICON + 4, height: ICON + 4, filter: 'blur(2.5px) saturate(1.6) brightness(1.15)', opacity: 1 - heal }}
          />
          <Img src={staticFile('img/logo-mark.png')} style={{ position: 'absolute', inset: 0, width: ICON, height: ICON, opacity: 0.35 + 0.65 * heal }} />
        </div>
        {/* wordmark glyphs slide in left→right */}
        <div style={{ position: 'absolute', left: WORD_LEFT, top: 135 - WORD_H / 2 + 1, height: WORD_H, width: WORD_W }}>
          {CUTS.slice(0, -1).map((x0, i) => {
            const x1 = CUTS[i + 1];
            const st = 0.46 + i * STAGGER;
            const lk = seg(t, st, st + 0.1, E.outCubic);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x0 * scaleW,
                  top: 0,
                  width: (x1 - x0) * scaleW,
                  height: WORD_H,
                  overflow: 'hidden',
                  opacity: lk,
                  transform: `translateX(${lerp(lk, 8, 0)}px)`,
                }}
              >
                <Img src={staticFile('img/logo-word.png')} style={{ position: 'absolute', left: -x0 * scaleW, top: 0, width: WORD_W, height: WORD_H }} />
              </div>
            );
          })}
        </div>
        {/* tagline: whole-line fade (footnote level, not letter-by-letter) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 135 + ICON / 2 + 14,
            textAlign: 'center',
            color: accent,
            font: `700 12px/1.2 ${FONT}`,
            letterSpacing: 0.4,
            opacity: seg(t, 0.72, 0.84, E.outQuad),
          }}
        >
          {tagline}
        </div>
      </div>
    </DesignStage>
  );
};
