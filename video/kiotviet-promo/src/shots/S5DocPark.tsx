// S5 · doc-park-left-pill-deal (adapted from demos/ui-entrance/doc-park-left-pill-deal/DocParkLeftPillDeal.tsx)
// Kept (480×270 design stage, same numbers): park window 0.06→0.24 inOutCubic, translateX 0→-55% +
// scale 1→0.92 with origin at the left edge; pills dealt at T0 = [0.26, 0.48, 0.70]; per pill
// opacity 0.035 outQuad + position 0.062 outBack (y 14→0, scale 0.94→1); caption starts at f+0.05,
// word-by-word darkening over 70% of its window, cleared before the next pill; pills stay as list.
// Adapted: the "document" is the KiotViet POS footage card (shot length = demo 174f = 12 beats),
// pill width widened to 196 for Vietnamese, brand colours/font, an eyebrow line above the pills.
// Auto-scroll is dropped: the footage itself carries the "being used" motion.
import React from 'react';
import { OffthreadVideo, staticFile } from 'remotion';
import { DesignStage, E, lerp, seg, useT } from '../lib/Motion';
import { C, FONT } from '../theme';
import { useLayout } from '../layout';

const DIM = '#C3CCD9';
const TXT = '#0C2D5E';
const LINE = '#DDE4EF';
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const h2r = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (p: number, a: string, b: string) => {
  const A = h2r(a), B = h2r(b), q = clamp01(p);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * q)},${Math.round(A[1] + (B[1] - A[1]) * q)},${Math.round(A[2] + (B[2] - A[2]) * q)})`;
};

type IconK = 'qr' | 'bolt' | 'chart';
const Icon: React.FC<{ k: IconK; size: number }> = ({ k, size }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ flex: '0 0 auto' }}>
    {k === 'qr' && (
      <g fill="none" stroke={C.blue} strokeWidth={1.4}>
        <rect x={2} y={2} width={4.5} height={4.5} rx={0.8} />
        <rect x={9.5} y={2} width={4.5} height={4.5} rx={0.8} />
        <rect x={2} y={9.5} width={4.5} height={4.5} rx={0.8} />
        <path d="M9.5 9.5h2v2M14 9.5v4.5h-4.5" />
      </g>
    )}
    {k === 'bolt' && <path d="M9 1.5 3.5 9h4l-1 5.5L12.5 7h-4l.5-5.5Z" fill="none" stroke={C.blue} strokeWidth={1.4} strokeLinejoin="round" />}
    {k === 'chart' && (
      <g fill="none" stroke={C.blue} strokeWidth={1.4} strokeLinecap="round">
        <path d="M2 14h12" />
        <path d="M4 11V8M8 11V4.5M12 11V6.5" />
      </g>
    )}
  </svg>
);

const Caption: React.FC<{ text: string; left: number; top: number; size: number; showV: number; innP: number; outP: number }> = ({ text, left, top, size, showV, innP, outP }) => {
  const words = text.split(' ');
  const n = words.length;
  const st = 0.78 / n, win = st * 1.5;
  const stw = 0.55 / n;
  const rowOpacity = outP > 0 ? clamp01(1 - (outP - 0.7) / 0.3) : showV;
  return (
    <div style={{ position: 'absolute', display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap', left, top, opacity: rowOpacity }}>
      {words.map((w, i) => {
        const q = clamp01((innP - i * st) / win);
        let color = mix(q, DIM, TXT);
        if (outP > 0) {
          const pp = clamp01((outP - i * stw) / (stw * 1.4));
          color = mix(1 - pp, DIM, TXT);
        }
        return (
          <span key={i} style={{ font: `600 ${size}px/1.25 ${FONT}`, color, letterSpacing: (-0.03 * (1 - q)).toFixed(4) + 'em', marginRight: i === n - 1 ? 0 : 3 }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const DW = 250, DH = 190;
const PX = 206, PY = 50, PH = 32, PG = 26, PW = 196; // PG widened so captions can stay on screen
const T0 = [0.26, 0.48, 0.7];

export const S5_DEFAULTS = {
  eyebrow: 'VietQRPay · VietQRGlobal',
  headline: 'Quét là trả, nhận tiền tức thì',
  items: [
    { n: 'Xuyên quốc gia', ic: 'qr' as IconK, cap: 'Khách nào cũng quét được' },
    { n: 'Tiền về tức thì', ic: 'bolt' as IconK, cap: 'Chủ quán nhận chuyển khoản ngay' },
    { n: 'Tự vào báo cáo', ic: 'chart' as IconK, cap: 'Doanh thu rõ ràng trên KiotViet' },
  ],
};

export const S5DocPark: React.FC<Partial<typeof S5_DEFAULTS>> = (p) => {
  const { eyebrow, headline, items } = { ...S5_DEFAULTS, ...p };
  const t = useT();
  const park = seg(t, 0.06, 0.24, E.inOutCubic);
  const eyebrowOp = seg(t, 0.12, 0.2, E.outQuad);
  const V = useLayout().vertical;
  // geometry: 16:9 keeps the demo's 440×240 canvas; 9:16 stacks footage card above the pill list,
  // parking upward (scale 0.8, origin top-centre) inside the TikTok safe band (design y 52–360).
  const G = V
    ? { cv: { left: 0, top: 0, w: 270, h: 480 }, card: { left: 20, top: 56, w: 230, h: 146 }, x: 30, ey: 176, hy: 188, py: 216, step: 46, ph: 28, capOff: 32,
        parkT: `translateY(${lerp(park, 0, -6)}px) scale(${lerp(park, 1, 0.8)})`, origin: '50% 0%' }
    : { cv: { left: 20, top: 15, w: 440, h: 240 }, card: { left: 34, top: (240 - DH) / 2, w: DW, h: DH }, x: PX, ey: 2, hy: 15, py: PY, step: PH + PG, ph: PH, capOff: PH + 6,
        parkT: `translateX(${lerp(park, 0, -55)}%) scale(${lerp(park, 1, 0.92)})`, origin: '0% 50%' };
  return (
    <DesignStage bg={C.bg} raster="zoom" w={V ? 270 : 480} h={V ? 480 : 270}>
      <div style={{ position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden', fontFamily: FONT }}>
        <div style={{ position: 'absolute', width: 180, height: 180, right: -40, top: -70, borderRadius: '50%', background: '#BFD9FF', filter: 'blur(30px)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', left: G.cv.left, top: G.cv.top, width: G.cv.w, height: G.cv.h }}>
          {/* footage card parks left (origin = left-edge midpoint) */}
          <div
            style={{
              position: 'absolute',
              left: G.card.left,
              top: G.card.top,
              width: G.card.w,
              height: G.card.h,
              transformOrigin: G.origin,
              transform: G.parkT,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, borderRadius: 12, overflow: 'hidden', background: '#000', boxShadow: '0 10px 30px rgba(12,45,94,.18)' }}>
              <OffthreadVideo src={staticFile('footage/tablet-slow.mp4')} muted style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
          <div style={{ position: 'absolute', left: G.x + 2, top: G.ey, font: `800 8px/1 ${FONT}`, letterSpacing: 0.6, color: C.blue, opacity: eyebrowOp }}>{eyebrow}</div>
          <div style={{ position: 'absolute', left: G.x + 2, top: G.hy, font: `800 14px/1.15 ${FONT}`, color: TXT, whiteSpace: 'nowrap', opacity: eyebrowOp, transform: `translateY(${(1 - eyebrowOp) * 6}px)` }}>{headline}</div>
          {items.map((it, k) => {
            const f = T0[k];
            const o = seg(t, f, f + 0.035, E.outQuad);
            const b = seg(t, f, f + 0.062, E.outBack);
            const cs = f + 0.05, ce = cs + 0.2; // captions persist (card note: ce>1 / no out) so each line is readable
            const showV = seg(t, cs, cs + 0.02);
            const innP = seg(t, cs, cs + (ce - cs) * 0.7);
            const outP = 0;
            return (
              <React.Fragment key={k}>
                <div
                  style={{
                    position: 'absolute',
                    left: G.x,
                    top: G.py + k * G.step,
                    width: PW,
                    height: G.ph,
                    borderRadius: G.ph / 2,
                    background: '#fff',
                    border: `1px solid ${LINE}`,
                    boxSizing: 'border-box',
                    boxShadow: '0 4px 14px rgba(12,45,94,.07)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '0 13px',
                    opacity: o,
                    transform: `translateY(${lerp(b, 14, 0).toFixed(2)}px) scale(${lerp(b, 0.94, 1).toFixed(4)})`,
                  }}
                >
                  <Icon k={it.ic} size={15} />
                  <div style={{ font: `700 11.5px/1 ${FONT}`, color: TXT, whiteSpace: 'nowrap' }}>{it.n}</div>
                </div>
                <Caption text={it.cap} left={G.x + 4} top={G.py + k * G.step + G.capOff} size={9} showV={showV} innP={innP} outP={outP} />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </DesignStage>
  );
};
