import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { Caption, Footage } from '../components';
import { CLAMP, T } from '../theme';
import { Pair, resolveSubs, ACT } from './timeline';

// ── Cold open — trailer-grammar-moves A "trailer-bumper" (demos/rhythm/trailer-grammar-moves/
// TrailerBumper.tsx): three shots, equal 9f each, zero transitions, each with a 1→1.04 linear
// micro-push; 27–33f pure black silence; title from 33f with a 16f fade + 44px out-cubic rise.
const BUMPER = [
  { src: 'clips/c9.mp4', at: 54.0, origin: '30% 30%' },
  { src: 'clips/c4.mp4', at: 1.0, origin: '35% 45%' },
  { src: 'clips/c8.mp4', at: 1.0, origin: '40% 35%' },
];
export const ColdOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const tIn = interpolate(f, [33, 49], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const out = interpolate(f, [dur - 8, dur], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {BUMPER.map((b, i) => (
        <Sequence key={i} from={i * 9} durationInFrames={9}>
          <Footage src={b.src} at={b.at} dur={9} muted push={[i === 2 ? 1.5 : 1.25, i === 2 ? 1.56 : 1.3]} origin={b.origin} />
        </Sequence>
      ))}
      {f >= 33 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: tIn * out, transform: `translateY(${(1 - tIn) * 44}px)` }}>
          <div style={{ fontFamily: T.font, fontWeight: 900, color: T.white, fontSize: 104, lineHeight: 1.15, textAlign: 'center' }}>
            Đàn ông…
            <br />
            <span style={{ color: T.gold }}>có dám không?</span>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ── HUD: pair badge + tactic title (top) and the "MỨC ĐỘ NGẠI" meter (right).
// Meter eases from the previous pair's value to this pair's in 20f (out-cubic).
export const Meter: React.FC<{ from: number; to: number; burst?: number; left?: number; top?: number; inline?: boolean }> = ({ from, to, burst, left = 56, top = 372, inline = false }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [6, 26], [from, to], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const W_ = 430;
  const col = v < 70 ? T.gold : v < 90 ? '#FF8A3D' : T.red;
  const broken = burst !== undefined && f >= burst;
  const pop = burst !== undefined ? interpolate(f, [burst, burst + 10], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(2)) }) : 0;
  return (
    <div style={{ ...(inline ? { position: 'relative' as const } : { position: 'absolute' as const, left, top }), fontFamily: T.font, display: 'flex', alignItems: 'center', gap: 18 }}>
      <div style={{ color: T.white, fontWeight: 800, fontSize: 34, letterSpacing: 2, textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>MỨC ĐỘ NGẠI</div>
      <div style={{ position: 'relative', width: W_, height: 34, borderRadius: 17, background: 'rgba(8,20,40,0.72)', border: '4px solid rgba(255,255,255,0.85)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${v}%`, background: col, borderRadius: 13 }} />
      </div>
      <div style={{ color: T.white, fontWeight: 900, fontSize: 40, minWidth: 100, textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>{Math.round(v)}%</div>
      {broken ? (
        <div
          style={{
            position: 'absolute',
            right: 40,
            top: -30,
            transform: `scale(${pop}) rotate(-10deg)`,
            background: T.red,
            color: T.white,
            fontWeight: 900,
            fontSize: 58,
            padding: '6px 20px',
            borderRadius: 14,
            boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
            whiteSpace: 'nowrap',
          }}
        >
          VỠ!
        </div>
      ) : null}
    </div>
  );
};

export const PairBadge: React.FC<{ n: number; tactic: string }> = ({ n, tactic }) => {
  const f = useCurrentFrame();
  const e = interpolate(f, [0, 12], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.5)) });
  return (
    <div style={{ position: 'absolute', left: 56, top: 120, fontFamily: T.font, transform: `translateX(${(1 - e) * -60}px)`, opacity: Math.min(1, e * 1.4) }}>
      <div style={{ display: 'inline-block', background: T.gold, color: T.navy, fontWeight: 900, fontSize: 46, padding: '8px 24px', borderRadius: 12, letterSpacing: 3 }}>
        CẶP {n}/6
      </div>
      <div style={{ marginTop: 14, color: T.white, fontWeight: 900, fontSize: 64, lineHeight: 1.08, maxWidth: 820, textShadow: '0 4px 20px rgba(0,0,0,0.55)' }}>
        Chiến thuật:
        <br />
        <span style={{ color: T.gold }}>{tactic}</span>
      </div>
    </div>
  );
};

// Top scrim so the HUD reads over bright office ceilings.
const TopScrim: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 560, background: 'linear-gradient(to bottom, rgba(8,20,40,0.78), rgba(8,20,40,0))' }} />
);

// ── One pair act: sequential sub-shots + HUD + commentary caption.
// cleanFrom: local frame from which the HUD + commentary fade out (8f) and stay hidden — used
// for the freeze so the circled face + one label are the only graphics on screen.
export const PairAct: React.FC<{ pair: Pair; prevNgai: number; tail?: React.ReactNode; burstAt?: number; cleanFrom?: number }> = ({
  pair,
  prevNgai,
  tail,
  burstAt,
  cleanFrom,
}) => {
  const lf = useCurrentFrame();
  const hud = cleanFrom === undefined ? 1 : interpolate(lf, [cleanFrom, cleanFrom + 8], [1, 0], CLAMP);
  const act = ACT[pair.key];
  const dur = act.to - act.from;
  const subs = resolveSubs(pair);
  const used = subs.reduce((a, s) => a + s.dur, 0);
  return (
    <AbsoluteFill>
      {subs.map((s, i) => (
        <Sequence key={i} from={s.from - act.from} durationInFrames={s.dur}>
          <Footage src={s.src} at={s.at} dur={s.dur} playbackRate={s.rate ?? 1} volume={s.volume ?? 0.55} muted={s.volume === 0} push={s.push} origin={s.origin} />
          {s.rate && s.rate < 1 ? <SlowBadge /> : null}
        </Sequence>
      ))}
      {tail ? (
        <Sequence from={used} durationInFrames={dur - used}>
          {tail}
        </Sequence>
      ) : null}
      <AbsoluteFill style={{ opacity: hud }}>
        <TopScrim />
        <PairBadge n={pair.n} tactic={pair.tactic} />
        <Meter from={prevNgai} to={pair.ngai} burst={burstAt} />
        <Caption kicker="BÌNH LUẬN VIÊN" line={pair.comment} dur={cleanFrom ?? dur} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SlowBadge: React.FC = () => {
  const f = useCurrentFrame();
  const blink = Math.floor(f / 10) % 2 === 0 ? 1 : 0.55;
  return (
    <div style={{ position: 'absolute', left: 56, top: 450, fontFamily: T.font, fontWeight: 900, fontSize: 44, color: T.white, background: T.red, padding: '6px 20px', borderRadius: 10, opacity: blink, letterSpacing: 3 }}>
      SLOW-MO 0.35×
    </div>
  );
};

// ── Rules graphic: three numbered rules + a schematic "two faces, one snack" that bites inward.
export const Rules: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const pop = (a: number) => interpolate(f, [a, a + 12], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.7)) });
  const bite = interpolate(f, [52, 118], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const gap = interpolate(bite, [0, 1], [560, 232]); // face centres; ends with faces just touching (2R + 22), no overlap
  const stick = interpolate(bite, [0, 1], [340, 46]);
  const blush = interpolate(bite, [0.55, 1], [0, 0.8], CLAMP);
  const cx = 540;
  const cy = 810;
  const R = 105;
  const face = (x: number, flip: boolean) => (
    <g transform={`translate(${x} ${cy}) scale(${flip ? -1 : 1} 1)`}>
      <circle r={R} fill={T.navySoft} stroke={T.white} strokeWidth={8} />
      <circle cx={-30} cy={-22} r={11} fill={T.white} />
      <circle cx={30} cy={-22} r={11} fill={T.white} />
      <ellipse cx={-48} cy={26} rx={22} ry={12} fill="#FF7A8A" opacity={blush} />
      <ellipse cx={48} cy={26} rx={22} ry={12} fill="#FF7A8A" opacity={blush} />
      <circle cx={R - 6} cy={22} r={14} fill={T.white} />
    </g>
  );
  const lines = [
    { a: 10, n: '1', t: '2 anh em · 1 món ăn' },
    { a: 40, n: '2', t: 'Cắn từ 2 đầu vào giữa' },
    { a: 96, n: '3', t: 'Còn ngắn nhất = THẮNG' },
  ];
  const out = interpolate(f, [dur - 8, dur], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ background: T.navy, opacity: out }}>
      <div style={{ position: 'absolute', top: 410, left: 0, right: 0, textAlign: 'center', fontFamily: T.font, color: T.gold, fontWeight: 900, fontSize: 64, letterSpacing: 12, paddingLeft: 12, opacity: pop(0) }}>
        LUẬT CHƠI
      </div>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <rect x={cx - stick / 2} y={cy + 8} width={stick} height={28} rx={14} fill="#E8B86D" stroke="#C98F3D" strokeWidth={4} opacity={pop(10)} />
        <g opacity={pop(10)}>
          {face(cx - gap / 2, false)}
          {face(cx + gap / 2, true)}
        </g>
      </svg>
      <div style={{ position: 'absolute', top: 1090, left: 0, right: 0, display: 'flex', justifyContent: 'center', fontFamily: T.font }}>
        <div>
        {lines.map((l) => {
          const p = pop(l.a);
          return (
            <div key={l.n} style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 44, opacity: Math.min(1, p * 1.4), transform: `translateX(${(1 - p) * 60}px)` }}>
              <div style={{ width: 92, height: 92, borderRadius: 46, background: T.gold, color: T.navy, fontWeight: 900, fontSize: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{l.n}</div>
              <div style={{ color: T.white, fontWeight: 900, fontSize: 64, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                {l.n === '3' ? (
                  <>
                    Còn ngắn nhất = <span style={{ color: T.gold }}>THẮNG</span>
                  </>
                ) : (
                  l.t
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── The problem beat: text only, meter spikes.
export const Problem: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 12], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const b = interpolate(f, [18, 28], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill style={{ background: T.navy, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: T.font, textAlign: 'center', color: T.white, fontWeight: 900, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: 80, opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>…càng cắn,</div>
        <div style={{ fontSize: 80, opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>môi càng</div>
        <div style={{ fontSize: 230, lineHeight: 1, marginTop: 48, color: T.gold, transform: `scale(${0.6 + 0.4 * b})`, opacity: Math.min(1, b * 1.4) }}>GẦN</div>
        <div style={{ marginTop: 110 }}>
          <Meter from={0} to={99} inline />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Result: no ranking is claimed (no measured data) — everyone gets the bravery medal.
export const Result: React.FC<{ dur: number }> = ({ dur }) => (
  <AbsoluteFill>
    <Footage src="clips/c4.mp4" at={4.5} dur={dur} push={[1, 1]} />
    <Caption kicker="CHUNG CUỘC" line="6 cặp · 6 người hùng · ai cũng dũng cảm" dur={dur} />
  </AbsoluteFill>
);

export const Organisers: React.FC<{ dur: number }> = ({ dur }) => (
  <AbsoluteFill>
    <Footage src="clips/c10.mp4" at={0.5} dur={dur} push={[1, 1.32]} origin="78% 42%" volume={0.4} />
    <Caption kicker="BAN TỔ CHỨC" line="Chị em DSHN1" dur={dur} />
  </AbsoluteFill>
);
