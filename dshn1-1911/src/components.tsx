import React from 'react';
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { CLAMP, T } from './theme';

// Full-bleed footage. `at` is the source in-point in seconds. Every footage shot
// carries a slow linear push so no shot ever reads as a frozen slide.
export const Footage: React.FC<{
  src: string;
  at: number;
  dur: number;
  volume?: number;
  muted?: boolean;
  push?: [number, number];
  origin?: string;
  translateX?: [number, number];
  playbackRate?: number;
}> = ({ src, at, dur, volume = 0.55, muted = false, push = [1, 1.04], origin = '50% 50%', translateX = [0, 0], playbackRate = 1 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], push, CLAMP);
  const tx = interpolate(f, [0, dur], translateX, CLAMP);
  return (
    <AbsoluteFill style={{ background: T.navy, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translateX(${tx}px) scale(${s})`, transformOrigin: origin }}>
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={Math.round(at * 30)}
          muted={muted}
          volume={volume}
          playbackRate={playbackRate}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Lower-third caption: gold kicker + bold white line on a bottom scrim.
// Enter 14f (y 40→0, blur 8→0, opacity, out-cubic) starting at local frame 6;
// exits over the last 8 frames of the shot.
export const Caption: React.FC<{ kicker: string; line: string; dur: number }> = ({ kicker, line, dur }) => {
  const f = useCurrentFrame();
  if (!line) return null;
  const e = interpolate(f, [6, 20], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const out = interpolate(f, [dur - 8, dur], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 720,
          background: 'linear-gradient(to top, rgba(8,20,40,0.88) 0%, rgba(8,20,40,0.55) 45%, rgba(8,20,40,0) 100%)',
          opacity: Math.min(e * 1.4, 1) * out,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 56,
          right: 56,
          bottom: 250,
          opacity: e * out,
          transform: `translateY(${(1 - e) * 40}px)`,
          filter: `blur(${(1 - e) * 8}px)`,
          fontFamily: T.font,
        }}
      >
        {kicker ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
            <div style={{ width: 56, height: 8, borderRadius: 4, background: T.gold }} />
            <div style={{ color: T.gold, fontWeight: 800, fontSize: 50, letterSpacing: 7 }}>{kicker}</div>
          </div>
        ) : null}
        <div
          style={{
            color: T.white,
            fontWeight: 800,
            fontSize: 84,
            lineHeight: 1.12,
            textWrap: 'balance',
            letterSpacing: '-0.01em',
            textShadow: '0 4px 24px rgba(0,0,0,0.45)',
          }}
        >
          {line}
        </div>
      </div>
    </AbsoluteFill>
  );
};
