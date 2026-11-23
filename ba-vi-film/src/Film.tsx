import React from 'react';
import {
  AbsoluteFill, Audio, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate,
  staticFile, useCurrentFrame,
} from 'remotion';
import { CameraMotionBlur } from '@remotion/motion-blur';
import { FlashCut } from './FlashCut';
import { LightLeak, leakIntensity, LEAK_RISE, LEAK_FALL } from './LightLeak';
import { BlurWords } from './BlurWords';
import {
  BLACK_CARD, CHAPTERS, DUCK, DURATION, END_TITLE, ENDING, FPS, H, SFX, SHOTS, SKIP_BEATS, SPLICE_BEAT,
  Shot, TITLE, W, beatF,
} from './timeline';
import { TITLE_FONT, BODY_FONT, CREAM, FONT_CSS } from './fonts';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// shot-transitions C (FocusHandoffTransition.tsx): A 24→40 out + blur 0→8, B 26→42 in, 2f stagger.
const FOCUS_OUT = [-8, 8] as const; // relative to cut
const FOCUS_IN = [-6, 10] as const;
// shot-transitions E (WhipPanReal.tsx): 8f swing, ~1.67 screens (peak > 300 px/f).
const WHIP_HALF = 4;
const WHIP_SWING = 1620; // ≈1.5 screens (card E), peak ≈390 px/f; a blurred mirror strip fills the gap
const WHIP_FILL = WHIP_SWING - W;
const SETTLE = 10;

type Span = { shot: Shot; from: number; to: number; next?: Shot; prev?: Shot };
const spans: Span[] = SHOTS.map((s, i) => ({
  shot: s, from: beatF(s.b0), to: beatF(s.b1), next: SHOTS[i + 1], prev: SHOTS[i - 1],
}));

const renderWindow = (sp: Span): [number, number] => {
  let a = sp.from;
  let b = sp.to;
  if (sp.shot.seamIn === 'focus') a = sp.from + FOCUS_IN[0];
  if (sp.shot.seamIn === 'whip') a = sp.from + WHIP_HALF;
  if (sp.next && sp.next.seamIn === 'focus' && beatF(sp.next.b0) === sp.to) b = sp.to + FOCUS_OUT[1];
  if (sp.next && sp.next.seamIn === 'whip') b = sp.to - WHIP_HALF;
  if (sp.shot.id === 'F1') b = DURATION; // F1 freezes on its own last frame for the ending
  return [a, b];
};

const pushScale = (sp: Span, g: number) => {
  const m = sp.shot.move;
  if (m.kind !== 'push') return { s: 1, origin: '50% 50%' };
  const t = interpolate(g, [sp.from, sp.to], [0, 1], {
    ...clamp, easing: m.ease === 'in' ? Easing.in(Easing.quad) : Easing.inOut(Easing.sin),
  });
  return { s: m.from + (m.to - m.from) * t, origin: `${m.ox ?? 50}% ${m.oy ?? 50}%` };
};

// Media for one shot (video or photo), rendered at a given local frame offset.
const Media: React.FC<{ shot: Shot; startFrom: number; volume?: (f: number) => number }> = ({ shot, startFrom, volume }) => {
  const style: React.CSSProperties = { position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', objectPosition: `50% ${shot.objY ?? 50}%` };
  if (shot.photo) return <Img src={staticFile(shot.src)} style={style} />;
  return <OffthreadVideo src={staticFile(shot.src)} startFrom={startFrom} volume={volume ?? 0} muted={!volume} style={style} />;
};

const ShotLayer: React.FC<{ sp: Span; a: number; b: number }> = ({ sp, a, b }) => {
  const f = useCurrentFrame();
  const g = a + f; // global frame
  const { shot } = sp;
  const cut = sp.from;
  const outCut = sp.to;
  let opacity = 1;
  let blur = 0;
  let dx = 0;
  let extraScale = 1;
  let brightness = 1;

  if (shot.seamIn === 'focus') {
    const p = interpolate(g, [cut + FOCUS_IN[0], cut + FOCUS_IN[1]], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
    opacity *= p; blur += (1 - p) * 8; dx += (1 - p) * 50;
  }
  if (sp.next?.seamIn === 'focus') {
    const p = interpolate(g, [outCut + FOCUS_OUT[0], outCut + FOCUS_OUT[1]], [0, 1], { ...clamp, easing: Easing.bezier(0.45, 0, 0.3, 1) });
    opacity *= 1 - p; blur += p * 8; dx -= p * 60;
  }
  if (shot.seamIn === 'fadeBlack') {
    const len = shot.b0 === 0 ? 20 : 8;
    brightness *= interpolate(g, [cut, cut + len], [0, 1], clamp);
  }
  if (shot.id === 'D2') {
    // D-style black card: fade the night shot out into black (6–10f)
    brightness *= interpolate(g, [outCut - 9, outCut], [1, 0], clamp);
  }
  if (shot.seamIn === 'settle') {
    extraScale *= interpolate(g, [cut, cut + SETTLE], [1.06, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  }
  const { s: pushS, origin } = pushScale(sp, g);
  // Ending (tension-camera-moves D, adapted): F1 holds its own last frame and pulls back 1.12→1.0
  const frozen = shot.id === 'F1' && g >= sp.to;
  const m0 = shot.move;
  const s = frozen && m0.kind === 'push'
    ? interpolate(g - sp.to, [0, 120], [m0.to, 1.0], { ...clamp, easing: Easing.inOut(Easing.cubic) })
    : pushS;

  // Light-leak "burn": page contrast down, brightness up around the peak (transition-hidden-cut C)
  const li = leakIntensity(g);
  const filter = `blur(${blur}px) brightness(${brightness * (1 + li * 0.35)}) contrast(${1 - li * 0.45}) ${shot.grade ?? ''}`;
  // tension-camera-moves C: vignette deepens 0→0.5 on the same ease-in curve as the push
  const vignette = shot.id === 'A2' ? interpolate(g, [sp.from, sp.to], [0, 0.5], { ...clamp, easing: Easing.in(Easing.quad) }) : 0;

  // Natural audio: 4f edge fades, scaled by shot level
  const vol = shot.vol ?? 0;
  const volume = vol > 0 ? (lf: number) => {
    const gg = a + lf;
    const end = shot.id === 'F1' ? sp.to : b;
    const e = Math.min(interpolate(gg, [a, a + 4], [0, 1], clamp), interpolate(gg, [end - 6, end], [1, 0], clamp));
    return vol * e * Math.max(0.0001, opacity) * (brightness < 1 ? brightness : 1);
  } : undefined;

  let inner: React.ReactNode;
  if (shot.move.kind === 'ramp') {
    // speed-ramp-freeze (SpeedRampReal.tsx), adapted: fast segment (rate 2, motion blur) → interpolated 0.5x slow-mo
    const m = shot.move;
    inner = (
      <>
        <Sequence durationInFrames={m.fastFrames} layout="none">
          <CameraMotionBlur shutterAngle={180} samples={6}>
            <AbsoluteFill>
              <OffthreadVideo src={staticFile(shot.src)} startFrom={Math.round(shot.srcStart * FPS)} playbackRate={m.fastRate}
                volume={vol * 0.6} style={{ width: W, height: H, objectFit: 'cover' }} />
            </AbsoluteFill>
          </CameraMotionBlur>
        </Sequence>
        <Sequence from={m.fastFrames} layout="none">
          <OffthreadVideo src={staticFile(m.slowSrc)} startFrom={m.slowStart} muted
            style={{ position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover' }} />
        </Sequence>
      </>
    );
  } else {
    const startFrom = Math.round(shot.srcStart * FPS) + (a - sp.from);
    inner = shot.id === 'F1'
      ? <Freeze frame={sp.to - 1 - a} active={frozen}><Media shot={shot} startFrom={Math.max(0, startFrom)} volume={volume} /></Freeze>
      : <Media shot={shot} startFrom={Math.max(0, startFrom)} volume={volume} />;
  }

  return (
    <AbsoluteFill style={{ opacity, filter, transform: `translateX(${dx}px)` }}>
      <AbsoluteFill style={{ transform: `scale(${s * extraScale})`, transformOrigin: origin }}>
        {inner}
      </AbsoluteFill>
      {vignette > 0 ? <AbsoluteFill style={{ opacity: vignette, background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.95) 100%)' }} /> : null}
    </AbsoluteFill>
  );
};

// Whip-pan window: both clips side by side, camera swings 8f, motion blur only here.
const WhipScene: React.FC<{ prev: Span; next: Span }> = ({ prev, next }) => {
  const f = useCurrentFrame(); // must live INSIDE CameraMotionBlur so sub-frames see the motion
  const dxv = interpolate(f, [0, WHIP_HALF * 2], [0, WHIP_SWING], { ...clamp, easing: Easing.bezier(0.6, 0, 0.4, 1) });
  const cut = next.from;
  const prevStart = Math.round(prev.shot.srcStart * FPS) + (cut - WHIP_HALF - prev.from);
  const nextStart = Math.round(next.shot.srcStart * FPS) - WHIP_HALF;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#111' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-dxv}px)` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H }}>
          <Media shot={prev.shot} startFrom={prevStart} />
        </div>
        <div style={{ position: 'absolute', left: W, top: 0, width: WHIP_FILL, height: H, overflow: 'hidden', filter: 'blur(24px)' }}>
          <div style={{ position: 'absolute', left: -(W - WHIP_FILL), top: 0, width: W, height: H, transform: 'scaleX(-1)' }}>
            <Media shot={prev.shot} startFrom={prevStart} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: WHIP_SWING, top: 0, width: W, height: H }}>
          <Media shot={next.shot} startFrom={Math.max(0, nextStart)} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Whip-pan window: both clips side by side, camera swings 8f, motion blur only here.
const WhipWindow: React.FC<{ prev: Span; next: Span }> = ({ prev, next }) => (
  <CameraMotionBlur shutterAngle={200} samples={24}>
    <WhipScene prev={prev} next={next} />
  </CameraMotionBlur>
);

const Shade: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(to top, rgba(0,0,0,${strength}) 0%, rgba(0,0,0,0) 38%)` }} />
);

const TitleShade: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 20], [0, 1], clamp) * interpolate(f, [beatF(TITLE.b1) - beatF(TITLE.b0) - 14, beatF(TITLE.b1) - beatF(TITLE.b0)], [1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o, background: 'radial-gradient(ellipse 80% 22% at 50% 66%, rgba(10,14,12,0.42) 0%, rgba(10,14,12,0) 100%)' }} />;
};

const TitleBlock: React.FC<{ text: string; sub: string; start: number; end?: number; y?: number; size?: number }> = ({ text, sub, start, end, y = 1180, size = 230 }) => {
  const f = useCurrentFrame();
  const out = end ? interpolate(f, [end - 14, end], [1, 0], clamp) : 1;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: 'absolute', top: y, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <BlurWords text={text} start={start} gap={4} win={22} dy={90} blurMax={22}
          style={{ fontFamily: TITLE_FONT, fontStyle: 'italic', fontWeight: 500, fontSize: size, lineHeight: 1.05, color: CREAM, textShadow: '0 6px 40px rgba(0,0,0,0.45)' }} />
        <BlurWords text={sub} start={start + 18} gap={3} win={20} dy={58} blurMax={20}
          style={{ fontFamily: BODY_FONT, fontWeight: 300, fontSize: 64, letterSpacing: '0.12em', color: CREAM, textShadow: '0 3px 18px rgba(0,0,0,0.55)' }} />
      </div>
    </AbsoluteFill>
  );
};

const Chapter: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 12, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Shade strength={0.45} />
      <div style={{ position: 'absolute', bottom: 210, width: W, display: 'flex', justifyContent: 'center' }}>
        <BlurWords text={text} start={0} gap={4} win={20} dy={58} blurMax={20}
          style={{ fontFamily: TITLE_FONT, fontStyle: 'italic', fontWeight: 500, fontSize: 110, color: CREAM, textShadow: '0 4px 24px rgba(0,0,0,0.5)' }} />
      </div>
    </AbsoluteFill>
  );
};

const BlackCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: '#0b0c0a' }}>
      <AbsoluteFill style={{ opacity: out, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 20 }}>
        <BlurWords text={BLACK_CARD.text} start={1} gap={3} win={14} dy={70} blurMax={20}
          style={{ fontFamily: TITLE_FONT, fontStyle: 'italic', fontWeight: 500, fontSize: 120, color: CREAM }} />
        <BlurWords text={BLACK_CARD.sub} start={7} gap={3} win={14} dy={50} blurMax={18}
          style={{ fontFamily: BODY_FONT, fontWeight: 300, fontSize: 64, letterSpacing: '0.3em', color: '#cfc8b8' }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// tension-camera-moves D (pull-back isolation), adapted to footage: freeze F1's exact last
// frame with F1's exact transform (no jump), pull back 1.12→1.0 while the world darkens and a
// vignette isolates dad + child; title holds ≥1 s, then fade to black.
// Ending overlay: darken + vignette isolate dad and child over F1's freeze; title holds ≥1 s; fade to black.
const Ending: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const dark = interpolate(f, [10, 70], [0, 0.55], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const vig = interpolate(f, [10, 90], [0, 0.7], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const black = interpolate(f, [dur - 24, dur], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: '#000', opacity: dark }} />
      <AbsoluteFill style={{ opacity: vig, background: 'radial-gradient(ellipse 60% 45% at 45% 62%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.95) 100%)' }} />
      <TitleBlock text={END_TITLE.text} sub={END_TITLE.sub} start={beatF(END_TITLE.b0) - beatF(ENDING.b0)} y={700} size={250} />
      <AbsoluteFill style={{ background: '#000', opacity: black }} />
    </AbsoluteFill>
  );
};

const duckAt = (g: number) => {
  let d = 1;
  for (const [a, b] of DUCK) {
    const fa = beatF(a); const fb = beatF(b);
    d = Math.min(d, 1 - 0.5 * Math.min(interpolate(g, [fa - 8, fa], [0, 1], clamp), interpolate(g, [fb, fb + 8], [1, 0], clamp)));
  }
  return d;
};

export const Film: React.FC<{ bgm: boolean }> = ({ bgm }) => {
  const spliceF = beatF(SPLICE_BEAT);
  const part2Start = beatF(SPLICE_BEAT + SKIP_BEATS);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <style>{FONT_CSS}</style>
      {/* Footage */}
      {spans.map((sp) => {
        const [a, b] = renderWindow(sp);
        return (
          <Sequence key={sp.shot.id} from={a} durationInFrames={b - a} name={sp.shot.id}>
            <ShotLayer sp={sp} a={a} b={b} />
          </Sequence>
        );
      })}
      {spans.filter((sp) => sp.shot.seamIn === 'whip').map((sp) => {
        const prev = spans[spans.indexOf(sp) - 1];
        return (
          <Sequence key={`whip-${sp.shot.id}`} from={sp.from - WHIP_HALF} durationInFrames={WHIP_HALF * 2} name={`whip ${prev.shot.id}→${sp.shot.id}`}>
            <WhipWindow prev={prev} next={sp} />
          </Sequence>
        );
      })}
      <Sequence from={beatF(BLACK_CARD.b0)} durationInFrames={beatF(BLACK_CARD.b1) - beatF(BLACK_CARD.b0)} name="D3 black card">
        <BlackCard dur={beatF(BLACK_CARD.b1) - beatF(BLACK_CARD.b0)} />
      </Sequence>
      <Sequence from={beatF(ENDING.b0)} durationInFrames={DURATION - beatF(ENDING.b0)} name="G ending">
        <Ending dur={DURATION - beatF(ENDING.b0)} />
      </Sequence>

      {/* Transitions overlays */}
      <Sequence from={beatF(64) - 5} durationInFrames={10} name="flash-cut b64"><FlashCut duration={10} /></Sequence>
      <Sequence from={beatF(140) - LEAK_RISE} durationInFrames={LEAK_RISE + LEAK_FALL} name="light leak b140"><LightLeak /></Sequence>

      {/* Text */}
      <Sequence from={beatF(TITLE.b0)} durationInFrames={beatF(TITLE.b1) - beatF(TITLE.b0)} name="title">
        <TitleShade />
        <TitleBlock text={TITLE.text} sub={TITLE.sub} start={0} end={beatF(TITLE.b1) - beatF(TITLE.b0)} />
      </Sequence>
      {CHAPTERS.map((c) => {
        const from = Math.round((0.2464 + c.b0 * 0.46155) * FPS);
        const dur = Math.round((0.2464 + c.b1 * 0.46155) * FPS) - from;
        return (
          <Sequence key={c.text} from={from} durationInFrames={dur} name={`chapter ${c.text}`}>
            <Chapter text={c.text} dur={dur} />
          </Sequence>
        );
      })}

      {/* Music: song edit at an 8-beat phrase boundary */}
      {bgm ? (
        <>
          <Sequence from={0} durationInFrames={spliceF + 3} name="bgm part 1">
            <Audio src={staticFile('audio/bgm.mp3')} volume={(f) => 0.55 * duckAt(f) * interpolate(f, [spliceF - 1, spliceF + 3], [1, 0], clamp)} />
          </Sequence>
          <Sequence from={spliceF} durationInFrames={DURATION - spliceF} name="bgm part 2">
            <Audio src={staticFile('audio/bgm.mp3')} startFrom={part2Start}
              volume={(f) => 0.55 * duckAt(spliceF + f) * Math.min(interpolate(f, [0, 3], [0, 1], clamp), interpolate(f, [DURATION - spliceF - 40, DURATION - spliceF], [1, 0], clamp))} />
          </Sequence>
        </>
      ) : null}

      {/* SFX pin table (relative to beatF) */}
      {SFX.map((s) => (
        <Sequence key={s.note} from={s.from} durationInFrames={s.dur ?? 60} name={`sfx ${s.note}`}>
          <Audio src={staticFile(s.src)} volume={(f) => s.volume * (s.dur ? interpolate(f, [s.dur - 12, s.dur], [1, 0], clamp) : 1)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
