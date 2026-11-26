// S9 · spotlight-hero-card (adapted from demos/opening/spotlight-hero-card/SpotlightHeroCard.tsx)
// Kept: roving spotlight through intermediate stations (4→48f) locking on the hero card, pool
// 620→420→360 with +6% lock pulse, vignette 0.16→0.42; camera straight-on until 32f then 16f push
// (bezier .35,0,.2,1) to a LEFT-side oblique (rotY 34° dominant, rotX 8°, rotZ 2°, persp 1200), focus
// 30px left of card centre, locked to the end; rise 48→58 bezier(.2,1.25,.3,1) → 54f sin bob (4px,
// 40f) → reseat 112→130 with 0.997 press; two-lap perimeter beam (lap1 60→74 bright 5+2.5,
// lap2 80→100 weaker 3.5+1.75 @0.62) + fading ring; vacated slot patch with breathing outline;
// 3D annotation on the left (translateZ 92, 44f bob, highlighter bar 74→86).
// Adapted: hero = the "Phổ biến" plan card (centre x = 960, as the card requires), the page is
// live DOM (crisp under CSS zoom), zoom 1.6 instead of 2.6 because the hero card is larger
// (framing rule: card fills the frame, not a fixed number), cool brand-blue light instead of amber.
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { PageCam2D, CamKey2D } from '../lib/PageCam2D';
import { C, FONT } from '../theme';
import { useLayout } from '../layout';

const RADIUS = 36;
// 16:9: three cards side by side (hero centre x = 960). 9:16: three cards stacked inside the
// TikTok safe band, hero in the middle (centre x = 540), card content laid out in two columns.
const geo = (V: boolean) => {
  const CW = V ? 780 : 480, CH = V ? 290 : 560;
  const CARDS = V
    ? [0, 1, 2].map((i) => ({ x: 150, y: 400 + i * (CH + 24), w: CW, h: CH }))
    : [0, 1, 2].map((i) => ({ x: 960 - CW / 2 + (i - 1) * (CW + 60), y: 300, w: CW, h: CH }));
  const CARD = CARDS[1];
  const MCX = CARD.x + CARD.w / 2;
  const MCY = CARD.y + CARD.h / 2;
  const W = V ? 1080 : 1920, H = V ? 1920 : 1080;
  const keys: CamKey2D[] = V
    ? [
        { frame: 0, cx: 540, cy: 960, zoom: 1, rotX: 0, rotY: 0, rotZ: 0, persp: 1400 },
        { frame: 40, cx: 540, cy: 960, zoom: 1, rotX: 0, rotY: 0, rotZ: 0, persp: 1400 },
        { frame: 56, cx: 540, cy: 960, zoom: 1, rotX: 0, rotY: 0, rotZ: 0, persp: 1400 },
        { frame: 145, cx: 540, cy: 960, zoom: 1, rotX: 0, rotY: 0, rotZ: 0, persp: 1400 },
      ]
    : [
        { frame: 0, cx: 960, cy: 560, zoom: 0.92, rotX: 0, rotY: 0, rotZ: 0, persp: 1200 },
        { frame: 40, cx: 960, cy: 560, zoom: 0.92, rotX: 0, rotY: 0, rotZ: 0, persp: 1200 },
        { frame: 56, cx: MCX - 30, cy: MCY, zoom: 1.6, rotX: 8, rotY: 34, rotZ: 2, persp: 1200 },
        { frame: 145, cx: MCX - 30, cy: MCY, zoom: 1.6, rotX: 8, rotY: 34, rotZ: 2, persp: 1200 },
      ];
  return { CW, CH, CARDS, CARD, MCX, MCY, W, H, keys, V };
};
const BEAM = C.blue;
const BEAM_CORE = 'rgba(240,248,255,0.98)';

type Plan = { name: string; price: string; desc: string; feats: string[]; hot?: boolean };
export const S9_DEFAULTS = {
  title: 'Chi phí rõ ràng, chọn gói vừa sức',
  plans: [
    { name: 'Gói hỗ trợ', price: '270K', desc: 'Kinh doanh nhỏ, vận hành đơn giản', feats: ['1 chi nhánh', 'Tối đa 3 tài khoản', '5.000 HĐĐT/năm'] },
    { name: 'Gói chuyên nghiệp', price: '330K', desc: 'Chuyên nghiệp, chuyên môn hóa quy trình', feats: ['Thêm chi nhánh 270K', 'Không giới hạn tài khoản', 'Website · Chấm công'], hot: true },
    { name: 'Gói cao cấp', price: '490K', desc: 'Mô hình lớn, cần dịch vụ cao cấp', feats: ['Thêm chi nhánh 375K', 'Kết nối API', 'Chấm công 50 NV'] },
  ] as Plan[],
  chips: ['Miễn phí khởi tạo', 'Hóa đơn điện tử miễn phí', 'Chữ ký số miễn phí'],
  note: ['Gói phổ biến,', 'mở rộng chuỗi.'],
};

const PlanCard: React.FC<{ plan: Plan; V?: boolean }> = ({ plan, V }) => {
  const hot = !!plan.hot;
  if (V)
    return (
      <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS, background: hot ? C.blue : '#fff', padding: '20px 40px', boxSizing: 'border-box', fontFamily: FONT, display: 'flex', gap: 30, boxShadow: hot ? 'none' : '0 18px 44px rgba(12,45,94,.08)' }}>
        <div style={{ width: 290, flexShrink: 0 }}>
          <div style={{ height: 32 }}>
            {hot && <div style={{ display: 'inline-block', padding: '3px 14px', borderRadius: 999, background: '#F3E8FF', color: '#6B21A8', fontSize: 22, fontWeight: 800 }}>Phổ biến</div>}
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: hot ? '#fff' : C.navy, marginTop: 2, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{plan.name}</div>
          <div style={{ fontSize: 100, fontWeight: 900, letterSpacing: -3, color: hot ? '#fff' : C.navy, lineHeight: 1.0, marginTop: 4 }}>{plan.price}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: hot ? '#DCEBFF' : C.muted, marginTop: 4 }}>đồng / tháng</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, borderLeft: `2px solid ${hot ? 'rgba(255,255,255,.3)' : C.line}`, paddingLeft: 26 }}>
          {plan.feats.map((f) => (
            <div key={f} style={{ fontSize: 26, fontWeight: 700, color: hot ? '#fff' : C.text, lineHeight: 1.4, whiteSpace: 'nowrap' }}>✓ {f}</div>
          ))}
        </div>
      </div>
    );
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS, background: hot ? C.blue : '#fff', padding: '44px 44px', boxSizing: 'border-box', fontFamily: FONT, boxShadow: hot ? 'none' : '0 18px 44px rgba(12,45,94,.08)' }}>
      <div style={{ height: 40 }}>
        {hot && <div style={{ display: 'inline-block', padding: '6px 18px', borderRadius: 999, background: '#F3E8FF', color: '#6B21A8', fontSize: 24, fontWeight: 800 }}>Phổ biến</div>}
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, color: hot ? '#fff' : C.navy, marginTop: 10 }}>{plan.name}</div>
      <div style={{ marginTop: 6 }}>
        <div style={{ fontSize: 112, fontWeight: 900, letterSpacing: -3, color: hot ? '#fff' : C.navy, lineHeight: 1.0 }}>{plan.price}</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: hot ? '#DCEBFF' : C.muted, marginTop: 4 }}>đồng / tháng</div>
      </div>
      <div style={{ fontSize: 25, fontWeight: 500, color: hot ? '#DCEBFF' : C.muted, marginTop: 10, lineHeight: 1.35 }}>{plan.desc}</div>
      <div style={{ height: 2, background: hot ? 'rgba(255,255,255,.3)' : C.line, margin: '18px 0 14px' }} />
      {plan.feats.map((f) => (
        <div key={f} style={{ fontSize: 28, fontWeight: 700, color: hot ? '#fff' : C.text, lineHeight: 1.6, whiteSpace: 'nowrap' }}>
          ✓ {f}
        </div>
      ))}
    </div>
  );
};

const PUSH_EASE = Easing.bezier(0.35, 0, 0.2, 1);
const POP_EASE = Easing.bezier(0.2, 1.25, 0.3, 1);
const RESEAT_EASE = Easing.bezier(0.4, 0, 0.3, 1.05);
const cl = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

export const S9Spotlight: React.FC<Partial<typeof S9_DEFAULTS>> = (p) => {
  const { title, plans, chips, note } = { ...S9_DEFAULTS, ...p };
  const frame = useCurrentFrame();
  const { CW, CH, CARDS, CARD, MCX, MCY, W, H, keys: CAM_KEYS, V } = geo(useLayout().vertical);
  const macroIn = interpolate(frame, [0, 8], [0, 1], { ...cl, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const spotEase = Easing.bezier(0.4, 0, 0.3, 1);
  const spotX = interpolate(frame, [4, 10, 20, 28, 36, 56], [22, 22, 78, 40, 50, 50], { ...cl, easing: spotEase });
  const spotY = interpolate(frame, [4, 10, 20, 28, 36, 56], [55, 55, 50, 60, 52, 50], { ...cl, easing: spotEase });
  const spotOn = interpolate(frame, [2, 10], [0, 1], cl);
  const poolBase = interpolate(frame, [28, 40, 56], [620, 420, 360], { ...cl, easing: Easing.bezier(0.4, 0, 0.3, 1) });
  const poolPulse = interpolate(frame, [40, 44, 49], [0, 0.06, 0], cl);
  const poolRx = poolBase * (1 + poolPulse);
  const poolRy = poolBase * 0.8 * (1 + poolPulse);
  const vignette = interpolate(frame, [28, 40, 56], [0.16, 0.34, 0.42], cl);
  const rise = interpolate(frame, [56, 66], [0, 1], { ...cl, easing: POP_EASE });
  const reseat = interpolate(frame, [112, 130], [0, 1], { ...cl, easing: RESEAT_EASE });
  const lift = rise * (1 - reseat);
  const bob = Math.sin(((frame - 66) / 40) * Math.PI * 2) * 4 * lift;
  const z = (V ? 50 : 110) * lift + bob;
  const landed = frame >= 130;
  const press = interpolate(frame, [126, 129, 130], [1, 0.997, 1], cl);
  const shadow = `0 ${8 * lift}px ${10 + 12 * lift}px rgba(12,45,94,${0.2 * lift}), 0 ${46 * lift}px ${90 * lift}px rgba(12,45,94,${0.25 * lift})`;
  const slotVis = Math.min(1, rise * 2) * (1 - reseat);
  const landPulse = interpolate(frame, [126, 130, 134], [0, 1, 0], cl);
  const slotEdge = Math.min(1, 0.4 * (1 - reseat)) + landPulse * 0.6;
  const beam1Prog = interpolate(frame, [68, 82], [0, 1], cl);
  const beam1On = frame >= 67 && frame <= 83;
  const beam2Prog = interpolate(frame, [86, 104], [0, 1], { ...cl, easing: Easing.bezier(0.4, 0, 0.4, 1) });
  const beam2On = frame >= 85 && frame <= 105;
  const beamTrail = interpolate(frame, [104, 112], [0.35, 0], cl);
  const bw = CARD.w + 6;
  const bh = CARD.h + 6;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ opacity: macroIn }}>
        <PageCam2D pageH={H} W={W} H={H} keys={CAM_KEYS} ease={PUSH_EASE} bg={C.bg}>
          {/* live pricing page */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, background: C.bg, fontFamily: FONT }}>
            <div style={{ position: 'absolute', top: V ? 230 : 150, left: V ? 90 : 0, width: V ? 900 : 1920, textAlign: 'center', fontSize: V ? 62 : 68, fontWeight: 800, color: C.navy, lineHeight: 1.15, whiteSpace: V ? 'pre-line' : 'normal' }}>{V ? title.replace(', ', ',\n') : title}</div>
            {CARDS.map((c, i) =>
              i === 1 ? null : (
                <div key={i} style={{ position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h }}>
                  <PlanCard plan={plans[i]} V={V} />
                </div>
              ),
            )}
            {!V && <div style={{ position: 'absolute', top: 300 + CH + 50, width: 1920, display: 'flex', justifyContent: 'center', gap: 22 }}>
              {chips.map((t) => (
                <div key={t} style={{ padding: '14px 30px', borderRadius: 999, background: '#fff', boxShadow: '0 10px 30px rgba(12,45,94,.08)', fontSize: 28, fontWeight: 700, color: C.navy }}>
                  {t}
                </div>
              ))}
            </div>}
            {V && <div style={{ position: 'absolute', top: 1330, left: 90, width: 900, textAlign: 'center', fontSize: 32, fontWeight: 700, color: C.muted }}>Miễn phí khởi tạo &amp; HĐĐT</div>}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, background: 'rgba(255,255,255,0.85)', filter: 'blur(6px)', opacity: 0.6 * Math.min(1, lift + Math.max(0, (frame - 40) / 16)) }} />
          <div style={{ transformStyle: 'preserve-3d' }}>
            {slotVis > 0.02 ? (
              <div style={{ position: 'absolute', left: CARD.x - 2, top: CARD.y - 2, width: CARD.w + 4, height: CARD.h + 4, background: '#E9EDF4', borderRadius: RADIUS, boxShadow: `inset 0 0 26px rgba(0,111,255,${0.12 * slotEdge})`, opacity: slotVis }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS, border: `2px solid ${C.blue}`, opacity: slotEdge }} />
              </div>
            ) : null}
            <div style={{ position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, transform: `translateZ(${z}px) scale(${press})`, transformOrigin: 'center center', transformStyle: 'preserve-3d' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS, overflow: 'hidden', boxShadow: landed ? '0 18px 44px rgba(0,111,255,.25)' : shadow }}>
                <PlanCard plan={plans[1]} V={V} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,0.35), transparent 40%)', opacity: lift }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS, boxShadow: `inset 0 0 0 1px rgba(255,255,255,${0.7 * lift})` }} />
              {(beam1On || beam2On) && lift > 0.4 ? (
                <svg width={bw} height={bh} viewBox={`0 0 ${bw} ${bh}`} style={{ position: 'absolute', left: -3, top: -3, overflow: 'visible', opacity: beam1On ? 1 : 0.62, filter: `drop-shadow(0 0 6px ${BEAM}) drop-shadow(0 0 18px rgba(170,210,255,0.6))` }}>
                  <rect x={2} y={2} width={bw - 4} height={bh - 4} rx={RADIUS} fill="none" stroke="#7FB8FF" strokeWidth={beam1On ? 5 : 3.5} strokeLinecap="round" pathLength={1} strokeDasharray="0.14 1" strokeDashoffset={-(beam1On ? beam1Prog : beam2Prog)} />
                  <rect x={2} y={2} width={bw - 4} height={bh - 4} rx={RADIUS} fill="none" stroke={BEAM_CORE} strokeWidth={beam1On ? 2.5 : 1.75} strokeLinecap="round" pathLength={1} strokeDasharray="0.14 1" strokeDashoffset={-(beam1On ? beam1Prog : beam2Prog)} />
                </svg>
              ) : null}
              {beamTrail > 0.01 ? <div style={{ position: 'absolute', inset: -3, borderRadius: RADIUS + 3, border: '2px solid #7FB8FF', opacity: beamTrail }} /> : null}
            </div>
          </div>
          {!V && frame >= 68 && frame <= 130
            ? (() => {
                const noteIn = interpolate(frame, [68, 78], [0, 1], { ...cl, easing: Easing.bezier(0.2, 0.75, 0.3, 1) });
                const noteOut = interpolate(frame, [116, 126], [1, 0], cl);
                const noteVis = noteIn * noteOut;
                const noteZ = 92 + Math.sin(((frame - 68) / 44) * Math.PI * 2) * 3;
                const hl = interpolate(frame, [80, 92], [0, 1], { ...cl, easing: Easing.bezier(0.3, 0, 0.2, 1) });
                const NX = V ? CARD.x + 40 : CARD.x - 330;
                const NY = V ? CARD.y - 150 : MCY - 80;
                return (
                  <div style={{ transformStyle: 'preserve-3d' }}>
                    <div style={{ position: 'absolute', left: NX + 10, top: NY + 80, width: 250, height: 74, transform: 'translateZ(2px)', background: 'radial-gradient(ellipse at 50% 50%, rgba(12,45,94,0.3), transparent 70%)', filter: 'blur(12px)', opacity: 0.55 * noteVis }} />
                    <div style={{ position: 'absolute', left: NX, top: NY, width: 270, transform: `translateZ(${noteZ}px) translateY(${(1 - noteIn) * 26}px)`, opacity: noteVis, filter: `blur(${(1 - noteIn) * 4}px)`, fontFamily: FONT, background: '#F0F2F6', borderRadius: 18, padding: '16px 20px', boxShadow: '0 12px 30px rgba(12,45,94,.12)' }}>
                      <div style={{ fontSize: 38, fontWeight: 800, color: C.navy, lineHeight: 1.2 }}>{note[0]}</div>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div style={{ position: 'absolute', left: -5, top: '12%', bottom: '4%', width: `calc(${hl} * (100% + 10px))`, background: '#CFE5FF', borderRadius: 4 }} />
                        <div style={{ position: 'relative', fontSize: 38, fontWeight: 800, color: C.blue, lineHeight: 1.2 }}>{note[1]}</div>
                      </div>
                    </div>
                  </div>
                );
              })()
            : null}
        </PageCam2D>
        <AbsoluteFill style={{ background: `radial-gradient(${poolRx}px ${poolRy}px at ${spotX}% ${spotY}%, rgba(235,245,255,0.45), rgba(235,245,255,0.10) 45%, rgba(10,26,51,${vignette * spotOn}) 100%)`, opacity: spotOn }} />
        <AbsoluteFill style={{ background: `radial-gradient(300px 220px at ${spotX - 6}% ${spotY + 10}%, rgba(245,250,255,0.18), transparent 70%)`, opacity: spotOn * 0.7 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
