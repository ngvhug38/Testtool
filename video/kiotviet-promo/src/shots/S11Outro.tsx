// S11 · outro-group-photo-launch (adapted from demos/outro/outro-group-photo-launch/OutroGroupPhotoLaunch.tsx)
// Kept: one representative element per shown feature flies in from all sides (cue 4 + 3f each,
// 12f flight, FLY_EASE bezier(0.34,1.4,0.44,1) real overshoot, rot ×2 → settled ±5°, scale 1.12→1,
// 8% ghost trail blur 8px, 6f accent glow on landing), render order = cue order; background page
// blurs 0→14 over 24f; crane perspective(1400) rotateX 4°→0 + scale 1.06→1 over 40f then +0.035
// push; light sweep 2–14f; stage light 42→50→58f; 20 deterministic dust motes; wordmark letters
// delay 42 + i·1.8 (8f, blur/scale-in) with recede (−12% opacity, −8% saturate) 42–50f; rule 58→70f
// with 190px extension lines; sign-off hold ≥30f.
// Adapted: real KiotViet logo (mark + 8 wordmark glyphs) instead of serif text, the tagline line is
// the user's CTA (dùng thử miễn phí · liên hệ Hưng · số điện thoại · kiotviet.vn), cool blue accents,
// no final fade-out (the contact card must stay readable to the last frame; hold ≈ 4s).
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import { C, FONT } from '../theme';

const FLY_EASE = Easing.bezier(0.34, 1.4, 0.44, 1);
const CRANE_EASE = Easing.bezier(0.3, 0, 0.2, 1);
const cl = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

type El = { key: string; w: number; h: number; cx: number; cy: number; rot: number; dx: number; dy: number; radius: number; cue: number; node: React.ReactNode };

const pill = (text: string, color = C.navy) => (
  <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontSize: 30, fontWeight: 800, color }}>{text}</div>
);

const ELS: El[] = [
  { key: 'stat', w: 540, h: 92, cx: 960, cy: 110, rot: 0, dx: 0, dy: -140, radius: 999, cue: 4, node: pill('300.000+ nhà bán hàng tin dùng') },
  {
    key: 'qr', w: 290, h: 290, cx: 250, cy: 390, rot: -5, dx: -500, dy: 0, radius: 26, cue: 7,
    node: <Img src={staticFile('img/qr-card.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />,
  },
  {
    key: 'price', w: 300, h: 330, cx: 1670, cy: 400, rot: 4, dx: 500, dy: 0, radius: 26, cue: 10,
    node: (
      <div style={{ width: '100%', height: '100%', background: C.blue, padding: 30, boxSizing: 'border-box', fontFamily: FONT, color: '#fff' }}>
        <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 999, background: '#F3E8FF', color: '#6B21A8', fontSize: 20, fontWeight: 800 }}>Phổ biến</div>
        <div style={{ fontSize: 28, fontWeight: 800, marginTop: 16 }}>Gói chuyên nghiệp</div>
        <div style={{ fontSize: 86, fontWeight: 900, letterSpacing: -2, lineHeight: 1.1 }}>330K</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: '#DCEBFF' }}>đ/tháng</div>
      </div>
    ),
  },
  {
    key: 'bento', w: 400, h: 200, cx: 1610, cy: 850, rot: -3, dx: 450, dy: 260, radius: 22, cue: 13,
    node: (
      <div style={{ width: '100%', height: '100%', background: '#fff', padding: '28px 30px', boxSizing: 'border-box', fontFamily: FONT }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: C.navy }}>Tối ưu vận hành</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.text, marginTop: 12, lineHeight: 1.5 }}>Bán hàng · Trả hàng · Đặt hàng<br />Thanh toán · Kết ca</div>
      </div>
    ),
  },
  {
    key: 'device', w: 270, h: 260, cx: 300, cy: 830, rot: 3, dx: -400, dy: 300, radius: 24, cue: 16,
    node: (
      <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: FONT }}>
        <Img src={staticFile('img/dev-pos-d68-dual.png')} style={{ height: 150, width: 'auto' }} />
        <div style={{ fontSize: 22, fontWeight: 800, color: C.navy }}>Máy POS D68</div>
      </div>
    ),
  },
  {
    key: 'logos', w: 600, h: 120, cx: 960, cy: 980, rot: 2, dx: 0, dy: 320, radius: 22, cue: 19,
    node: (
      <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 18px', boxSizing: 'border-box' }}>
        {['00-masan', '02-grab', '03-vietnampost'].map((l) => (
          <Img key={l} src={staticFile(`logos/${l}.png`)} style={{ height: 80, maxWidth: 170, objectFit: 'contain' }} />
        ))}
      </div>
    ),
  },
  { key: 'pillqr', w: 360, h: 84, cx: 560, cy: 175, rot: -1.5, dx: 0, dy: -240, radius: 999, cue: 22, node: pill('Thanh toán QR', C.blue) },
  { key: 'pillfree', w: 440, h: 84, cx: 1390, cy: 175, rot: 2.5, dx: 360, dy: -200, radius: 999, cue: 25, node: pill('Hóa đơn điện tử · Miễn phí', C.green) },
];

const DUST = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 439 + 137) % 1920,
  y0: (i * 613 + 271) % 1080,
  rise: 0.3 + (i % 5) * 0.11,
  swayAmp: 9 + (i % 4) * 5,
  swayFreq: 0.022 + (i % 3) * 0.008,
  phase: (i * 0.83) % (Math.PI * 2),
  size: 2 + (i % 3) * 0.5,
  opacity: 0.18 + ((i * 7) % 5) * 0.05,
}));

const MARK_H = 130;
const WORD_H = MARK_H * (216 / 470);
const WORD_W = WORD_H * (1027 / 216);
const GAP = MARK_H * (140 / 470);
const CUTS = [0, 166, 228, 394, 503, 695, 756, 915, 1027];

export const S11_DEFAULTS = {
  cta: 'Dùng thử miễn phí',
  contact: 'Liên hệ Hưng (KiotViet) · 0327 012 877',
  site: 'kiotviet.vn',
};

export const S11Outro: React.FC<Partial<typeof S11_DEFAULTS>> = (p) => {
  const { cta, contact, site } = { ...S11_DEFAULTS, ...p };
  const frame = useCurrentFrame();
  const blur = interpolate(frame, [0, 24], [0, 14], { ...cl, easing: Easing.bezier(0.4, 0, 0.4, 1) });
  const rule = interpolate(frame, [58, 70], [0, 1], { ...cl, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const tag = interpolate(frame, [68, 80], [0, 1], cl);
  const recede = interpolate(frame, [42, 50], [0, 1], cl);
  const craneT = interpolate(frame, [0, 40], [0, 1], { ...cl, easing: CRANE_EASE });
  const pushT = interpolate(frame, [40, 145], [0, 1], cl);
  const camScale = 1.06 - 0.06 * craneT + 0.035 * pushT;
  const camTilt = 4 * (1 - craneT);
  const sweepX = interpolate(frame, [2, 14], [-700, 2020], { ...cl, easing: Easing.bezier(0.4, 0, 0.6, 1) });
  const sweepOpacity = interpolate(frame, [2, 5, 11, 14], [0, 0.14, 0.14, 0], cl);
  const stageLight = interpolate(frame, [42, 50, 58], [0, 0.5, 0.25], cl);
  const vignette = interpolate(frame, [42, 54], [0, 0.1], cl);
  const ruleExt = interpolate(frame, [58, 66], [0, 1], { ...cl, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const ruleExtFade = interpolate(frame, [66, 72], [1, 0], cl);
  const letter = (i: number) => {
    const delay = Math.round(42 + i * 1.8);
    return interpolate(frame, [delay, delay + 8], [0, 1], { ...cl, easing: Easing.bezier(0.2, 0.75, 0.3, 1) });
  };
  const letterStyle = (t: number): React.CSSProperties => ({ opacity: t, transform: `translateY(${(1 - t) * 28}px) scale(${1.35 - 0.35 * t})`, filter: `blur(${(1 - t) * 8}px)` });
  const sw = WORD_W / 1027;

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ transform: `perspective(1400px) rotateX(${camTilt}deg) scale(${camScale})`, transformOrigin: '50% 45%' }}>
        <AbsoluteFill style={{ filter: `blur(${blur}px)` }}>
          <Img src={staticFile('img/still-counter.jpg')} style={{ width: 1920, height: 1080, objectFit: 'cover' }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: 'radial-gradient(1200px 800px at 50% 48%, rgba(240,242,246,0.93), rgba(240,242,246,0.75) 60%, rgba(240,242,246,0.55))' }} />
        <AbsoluteFill>
          {ELS.map((el) => {
            if (frame < el.cue) return null;
            const t = interpolate(frame, [el.cue, el.cue + 12], [0, 1], { ...cl, easing: FLY_EASE });
            const opacity = interpolate(frame, [el.cue, el.cue + 3], [0, 1], cl);
            const x = el.dx * (1 - t);
            const y = el.dy * (1 - t);
            const rot = el.rot * (2 - t);
            const scale = 1.12 - 0.12 * t;
            const air = Math.max(0, 1 - t);
            const shadow = `0 ${10 + 26 * air}px ${24 + 46 * air}px rgba(12,45,94,${0.16 + 0.1 * air}), 0 2px 6px rgba(12,45,94,.08)`;
            const linT = interpolate(frame, [el.cue, el.cue + 12], [0, 1], cl);
            const showGhost = linT > 0.05 && linT < 0.95;
            const glow = interpolate(frame, [el.cue + 12, el.cue + 18], [0.35, 0], cl);
            const showGlow = frame >= el.cue + 12 && frame < el.cue + 18;
            const glowR = el.w * 0.5;
            const base: React.CSSProperties = { position: 'absolute', left: el.cx - el.w / 2, top: el.cy - el.h / 2, width: el.w, height: el.h, transformOrigin: 'center center', borderRadius: el.radius, overflow: 'hidden' };
            return (
              <div key={el.key}>
                {showGhost ? (
                  <div style={{ ...base, transform: `translate(${x + el.dx * 0.08}px, ${y + el.dy * 0.08}px) rotate(${rot}deg) scale(${scale})`, opacity: 0.2 * Math.max(0, 1 - linT), filter: 'blur(8px)' }}>{el.node}</div>
                ) : null}
                <div style={{ ...base, transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`, boxShadow: shadow, opacity: opacity * (1 - 0.12 * recede), filter: `saturate(${1 - 0.08 * recede})` }}>{el.node}</div>
                {showGlow ? (
                  <div style={{ position: 'absolute', left: el.cx - glowR, top: el.cy - glowR, width: glowR * 2, height: glowR * 2, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,178,255,0.75), rgba(0,178,255,0) 70%)', opacity: glow, mixBlendMode: 'screen' }} />
                ) : null}
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>

      <AbsoluteFill>
        {DUST.map((d, i) => {
          const y = (((d.y0 - frame * d.rise) % 1080) + 1080) % 1080;
          const x = d.x + Math.sin(frame * d.swayFreq + d.phase) * d.swayAmp;
          return <div key={i} style={{ position: 'absolute', left: x, top: y, width: d.size, height: d.size, borderRadius: '50%', background: '#6FB3FF', opacity: d.opacity }} />;
        })}
      </AbsoluteFill>
      {sweepOpacity > 0 ? (
        <AbsoluteFill style={{ mixBlendMode: 'overlay' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: sweepX - 300, width: 600, background: 'linear-gradient(90deg, rgba(235,245,255,0), rgba(235,245,255,1) 50%, rgba(235,245,255,0))', opacity: sweepOpacity }} />
        </AbsoluteFill>
      ) : null}
      {stageLight > 0 ? (
        <AbsoluteFill style={{ background: 'radial-gradient(760px 420px at 960px 520px, rgba(250,252,255,0.97), rgba(250,252,255,0.4) 55%, rgba(250,252,255,0) 75%)', opacity: stageLight * 1.6 }} />
      ) : null}
      {vignette > 0 ? <AbsoluteFill style={{ background: 'radial-gradient(1400px 900px at 50% 50%, rgba(12,45,94,0) 55%, rgba(12,45,94,0.6) 100%)', opacity: vignette }} /> : null}

      {/* sign-off: logo letterpress + rule + CTA */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', fontFamily: FONT }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: GAP }}>
            <Img src={staticFile('img/logo-mark.png')} style={{ width: MARK_H, height: MARK_H, ...letterStyle(letter(0)) }} />
            <div style={{ position: 'relative', width: WORD_W, height: WORD_H }}>
              {CUTS.slice(0, -1).map((x0, i) => (
                <div key={i} style={{ position: 'absolute', left: x0 * sw, top: 0, width: (CUTS[i + 1] - x0) * sw, height: WORD_H, overflow: 'hidden', ...letterStyle(letter(i + 1)) }}>
                  <Img src={staticFile('img/logo-word.png')} style={{ position: 'absolute', left: -x0 * sw, top: 0, width: WORD_W, height: WORD_H }} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', height: 6, width: 260, margin: '40px auto 0' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 3, background: C.blue, transform: `scaleX(${rule})` }} />
            {ruleExt > 0 && ruleExtFade > 0 ? (
              <>
                <div style={{ position: 'absolute', top: 2.5, height: 1, right: '100%', width: 190 * ruleExt, background: C.blue, opacity: ruleExtFade }} />
                <div style={{ position: 'absolute', top: 2.5, height: 1, left: '100%', width: 190 * ruleExt, background: C.blue, opacity: ruleExtFade }} />
              </>
            ) : null}
          </div>
          <div style={{ opacity: tag, transform: `translateY(${(1 - tag) * 10}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 34 }}>
            <div style={{ fontSize: 60, fontWeight: 900, color: C.blue }}>{cta}</div>
            <div style={{ fontSize: 46, fontWeight: 800, color: C.navy, marginTop: 14 }}>{contact}</div>
            <div style={{ fontSize: 42, fontWeight: 800, color: C.navy, marginTop: 14, letterSpacing: 1 }}>{site}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
