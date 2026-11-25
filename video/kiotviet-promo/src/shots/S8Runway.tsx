// S8 · runway-ground-skim (adapted from demos/ui-entrance/runway-ground-skim/RunwayGroundSkim.tsx v6)
// Kept: low-angle runway camera (rotateX 72→66°, perspective 1050), cards hover 560–880px in staggered
// heights and fall into their real slots: start = 6 + i·1.5f + seeded jitter ≤1.2f (order kept),
// 9f gravity fall (distance ∝ t²), stop on touchdown with zero bounce, airborne cards key-lit ≥1.35×,
// ground soft shadows grow with height, top dark band ~32%, then rise 38→94f (rotateX →0, pull back,
// easeRise bezier(0.42,0,0.16,1)) to a straight-on full page and hold.
// Adapted: the ground is a KiotViet "Thiết bị bán hàng" page (3000×1700 instead of 4600×2600) so the
// final straight-on view is readable (final z −590 instead of −1620); 8 device cards, no prices.
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import { C, FONT } from '../theme';

const easeRise = Easing.bezier(0.42, 0, 0.16, 1);
const mulberry32 = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const GW = 3000, GH = 1700;
const SIDE = 560;
const CARD_W = 520, CARD_H = 430;
const GRID_X = SIDE + 120, GRID_Y = 520, COL_GAP = CARD_W + 50, ROW_GAP = CARD_H + 50;
const slotPos = (col: number, row: number) => ({ x: GRID_X + col * COL_GAP, y: GRID_Y + row * ROW_GAP });

export const S8_DEFAULTS = {
  title: 'Thiết bị bán hàng đồng bộ',
  subtitle: 'Kết nối sẵn với phần mềm KiotViet',
  cards: [
    { name: 'Máy POS cầm tay KV88', img: 'dev-pos-kv88.png' },
    { name: 'Máy POS D68 Single', img: 'dev-pos-d68-single.png' },
    { name: 'Máy POS D68 Dual', img: 'dev-pos-d68-dual.png' },
    { name: 'Máy in hóa đơn', img: 'dev-printer-kv804.png' },
    { name: 'Máy quét mã vạch', img: 'dev-scanner-xl2302.png' },
    { name: 'Màn hình QR KV99', img: 'dev-qr-kv99.png' },
    { name: 'Loa thanh toán KV66', img: 'dev-speaker-kv66.png' },
    { name: 'Máy chấm công', img: 'dev-timeclock-n308.png' },
  ],
};

const DeviceCard: React.FC<{ name: string; img: string }> = ({ name, img }) => (
  <div style={{ width: CARD_W, height: CARD_H, borderRadius: 30, background: '#fff', border: `4px solid ${C.line}`, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '26px 24px 0', fontFamily: FONT }}>
    <div style={{ width: CARD_W - 60, height: 280, borderRadius: 20, background: '#F4F6FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Img src={staticFile(`img/${img}`)} style={{ maxWidth: 300, maxHeight: 240, width: 'auto', height: 240, objectFit: 'contain' }} />
    </div>
    <div style={{ marginTop: 26, fontSize: 40, fontWeight: 800, color: C.navy, textAlign: 'center', whiteSpace: 'nowrap' }}>{name}</div>
  </div>
);

const Ground: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div style={{ width: GW, height: GH, background: '#F6F8FB', borderRadius: 60, position: 'relative', overflow: 'hidden', fontFamily: FONT }}>
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: SIDE, background: '#EDF1F7', borderRight: `4px solid ${C.line}`, padding: '70px 56px', boxSizing: 'border-box' }}>
      <Img src={staticFile('img/logo-full.png')} style={{ width: 360, height: 'auto' }} />
      <div style={{ height: 60 }} />
      {['Tổng quan', 'Bán hàng', 'Hàng hóa', 'Thiết bị', 'Báo cáo', 'Thanh toán QR'].map((t, i) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 26, height: 96, paddingLeft: 26, background: i === 3 ? '#DCE9FF' : 'transparent', borderRadius: 20 }}>
          <div style={{ width: 30, height: 30, border: `6px solid ${i === 3 ? C.blue : '#9AA6B8'}`, borderRadius: 8 }} />
          <div style={{ fontSize: 42, color: i === 3 ? C.blue : C.text, fontWeight: i === 3 ? 800 : 600 }}>{t}</div>
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: GRID_X, top: 150 }}>
      <div style={{ fontSize: 120, fontWeight: 900, color: C.navy, letterSpacing: -2 }}>{title}</div>
      <div style={{ fontSize: 52, fontWeight: 600, color: C.muted, marginTop: 18 }}>{subtitle}</div>
    </div>
    {/* empty slots the cards land in */}
    {Array.from({ length: 8 }).map((_, i) => {
      const s = slotPos(i % 4, Math.floor(i / 4));
      return <div key={i} style={{ position: 'absolute', left: s.x, top: s.y, width: CARD_W, height: CARD_H, borderRadius: 30, border: '4px dashed #D3DBE7' }} />;
    })}
  </div>
);

export const S8Runway: React.FC<Partial<typeof S8_DEFAULTS>> = (p) => {
  const { title, subtitle, cards } = { ...S8_DEFAULTS, ...p };
  const frame = useCurrentFrame();
  const rand = mulberry32(20261125);
  const jit = cards.map(() => rand() * 1.2);
  const START0 = 6, GAP = 1.5, FALLF = 9;
  const lifts = cards.map((_, i) => {
    const t = frame - (START0 + i * GAP + jit[i]);
    const H = 560 + (i % 3) * 160;
    if (t <= 0) return H;
    const pr = t / FALLF;
    if (pr < 1) return H * (1 - pr * pr);
    return 0;
  });
  const riseP = interpolate(frame, [38, 94], [0, 1], { easing: easeRise, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const landP = interpolate(frame, [0, 34], [0, 1], { easing: Easing.bezier(0.3, 0.1, 0.6, 0.9), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rx = interpolate(landP, [0, 1], [72, 66]) - 66 * riseP;
  const z = interpolate(landP, [0, 1], [-620, -320]) + riseP * (-590 - -320);
  const bright = interpolate(frame, [0, 32, 86], [0.55, 0.85, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const anchorTop = 58 - riseP * 8;
  const perspY = 30 + riseP * 20;

  const cam = (children: React.ReactNode) => (
    <AbsoluteFill style={{ perspective: 1050, perspectiveOrigin: `50% ${perspY}%` }}>
      <div style={{ position: 'absolute', left: '50%', top: `${anchorTop}%`, width: 0, height: 0, transformStyle: 'preserve-3d', transform: `translateZ(${z}px) rotateX(${rx}deg)` }}>{children}</div>
    </AbsoluteFill>
  );

  const scene = (
    <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translate(${-GW / 2}px, ${-GH / 2}px)` }}>
      <div style={{ filter: `brightness(${bright})` }}>
        <Ground title={title} subtitle={subtitle} />
      </div>
      {cards.map((c, i) => {
        const h = lifts[i];
        if (h < 2) return null;
        const s = slotPos(i % 4, Math.floor(i / 4));
        return (
          <div
            key={'sh' + i}
            style={{
              position: 'absolute', left: s.x + 20, top: s.y + 30, width: CARD_W - 40, height: CARD_H - 60,
              transform: `translateZ(1px) translate(${h * 0.08}px, ${h * 0.12}px) scale(${1 + h * 0.0004})`,
              background: 'rgba(12,30,60,0.9)', borderRadius: 30, filter: `blur(${10 + h * 0.03}px)`, opacity: Math.max(0.12, 0.34 - h * 0.0003),
            }}
          />
        );
      })}
      {cards.map((c, i) => {
        const h = lifts[i];
        const s = slotPos(i % 4, Math.floor(i / 4));
        const airLit = h > 2 ? Math.max(1.35, bright) : bright;
        return (
          <div key={'card' + i} style={{ position: 'absolute', left: s.x, top: s.y, transform: `translateZ(${h}px)`, filter: `brightness(${airLit})`, boxShadow: h > 2 ? `0 0 ${30 + h * 0.05}px rgba(200,225,255,${Math.min(0.3, h * 0.0004)})` : 'none', borderRadius: 30 }}>
            <DeviceCard name={c.name} img={c.img} />
          </div>
        );
      })}
    </div>
  );

  const airOp = 1 - riseP;
  return (
    <AbsoluteFill style={{ background: '#0A1A33' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 14% at 50% 40%, rgba(120,180,255,${(0.16 + landP * 0.1) * airOp}), transparent 75%)` }} />
      <AbsoluteFill style={{ background: C.bg, opacity: riseP }} />
      {cam(scene)}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(6,14,30,0.9) 0%, rgba(6,14,30,0.35) 16%, transparent 32%)', opacity: airOp, pointerEvents: 'none' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 95% 90% at 50% 55%, transparent 50%, rgba(6,14,30,0.5) 85%, rgba(6,14,30,0.85) 100%)', opacity: (1 - riseP) * 1, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
