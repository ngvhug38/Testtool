import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { Caption, Footage } from './components';
import { Freeze, FREEZE } from './Freeze';
import { Hook, HOOK_CARD_STARTS } from './Hook';
import { Intro } from './Intro';
import { Outro, OUTRO } from './Outro';
import { Quad } from './Quad';
import { CLAMP } from './theme';
import { MONTAGE, SHOTS, TOTAL, beatF } from './timeline';

export type MainProps = { bgm: boolean };

const len = (s: { from: number; to: number }) => s.to - s.from;
const INTRO_TAKEOVER_END = beatF(10);

// ---- SFX table: every entry is relative to a shot boundary or beat (S2/S3). ----
// Volumes set against measured peaks (all sources peak between -7.7 and 0 dB).
type Sfx = { from: number; src: string; volume: number; dur?: number; note: string };
const SFX: Sfx[] = [
  { from: INTRO_TAKEOVER_END - 30, src: 'air-woosh-quick', volume: 0.4, note: 'intro: "19.11" starts swelling' },
  { from: INTRO_TAKEOVER_END - 6, src: 'impact-cine-big', volume: 0.42, dur: 75, note: 'intro: takeover lands (slam 1/2)' },
  ...HOOK_CARD_STARTS.map((f, i) => ({ from: f, src: 'swoosh-quick', volume: [0.32, 0.27, 0.22][i], note: `hook: title card ${i + 1} cut` })),
  { from: SHOTS.freeze.from + FREEZE.flowEnd, src: 'camera-shutter-hard', volume: 0.5, note: 'freeze: frame stops' },
  { from: SHOTS.freeze.from + FREEZE.flowEnd + 7, src: 'paper-slide', volume: 0.32, note: 'freeze: marker circle drawn' },
  { from: SHOTS.quad.from, src: 'air-woosh-quick', volume: 0.32, note: 'quad: cut into 2×2' },
  { from: SHOTS.outro.from, src: 'click-camera', volume: 0.6, note: 'outro: photo 1 shutter + flash' },
  { from: SHOTS.outro.from + OUTRO.swap, src: 'click-camera', volume: 0.6, note: 'outro: photo 2 shutter + flash' },
  { from: SHOTS.outro.from + OUTRO.titleMove + 32 - 146, src: 'riser-cine', volume: 0.3, dur: 146, note: 'outro: riser into title' },
  { from: SHOTS.outro.from + OUTRO.titleMove + 30, src: 'impact-cine-big', volume: 0.55, dur: 110, note: 'outro: title lands (slam 2/2, loudest)' },
  { from: SHOTS.outro.from + OUTRO.titleMove + 42, src: 'shimmer-sparkle-sweep', volume: 0.3, dur: 80, note: 'outro: marker underline sparkle tail' },
];

const MontageShot: React.FC<{ k: keyof typeof MONTAGE }> = ({ k }) => {
  const s = SHOTS[k];
  const m = MONTAGE[k];
  const d = len(s);
  return (
    <Sequence from={s.from} durationInFrames={d}>
      <Footage src={m.clip.src} at={m.clip.at} dur={d} />
      <Caption kicker={m.kicker} line={m.line} dur={k === 'm7a' ? d + len(SHOTS.m7b) : d} />
    </Sequence>
  );
};

export const Main: React.FC<MainProps> = ({ bgm }) => {
  return (
    <AbsoluteFill style={{ background: '#081428' }}>
      <Sequence from={SHOTS.intro.from} durationInFrames={len(SHOTS.intro)}>
        <Intro dur={len(SHOTS.intro)} takeoverEnd={INTRO_TAKEOVER_END} />
      </Sequence>
      <Sequence from={SHOTS.hook.from} durationInFrames={len(SHOTS.hook)}>
        <Hook />
      </Sequence>
      <MontageShot k="m1" />
      <MontageShot k="m2" />
      <MontageShot k="m3" />
      <Sequence from={SHOTS.freeze.from} durationInFrames={len(SHOTS.freeze)}>
        <Freeze dur={len(SHOTS.freeze)} />
      </Sequence>
      <MontageShot k="m5" />
      <Sequence from={SHOTS.quad.from} durationInFrames={len(SHOTS.quad)}>
        <Quad dur={len(SHOTS.quad)} />
      </Sequence>
      <MontageShot k="m6" />
      {/* m7a + m7b: one caption spanning both cuts */}
      <Sequence from={SHOTS.m7a.from} durationInFrames={len(SHOTS.m7a)}>
        <Footage src={MONTAGE.m7a.clip.src} at={MONTAGE.m7a.clip.at} dur={len(SHOTS.m7a)} />
      </Sequence>
      <Sequence from={SHOTS.m7b.from} durationInFrames={len(SHOTS.m7b)}>
        <Footage src={MONTAGE.m7b.clip.src} at={MONTAGE.m7b.clip.at} dur={len(SHOTS.m7b)} />
      </Sequence>
      <Sequence from={SHOTS.m7a.from} durationInFrames={SHOTS.m7b.to - SHOTS.m7a.from}>
        <Caption kicker={MONTAGE.m7a.kicker} line={MONTAGE.m7a.line} dur={SHOTS.m7b.to - SHOTS.m7a.from} />
      </Sequence>
      <Sequence from={SHOTS.outro.from} durationInFrames={TOTAL - SHOTS.outro.from}>
        <Outro dur={TOTAL - SHOTS.outro.from} />
      </Sequence>

      {bgm && (
        <Audio
          src={staticFile('audio/house-vibez.mp3')}
          volume={(f) => interpolate(f, [0, 12, TOTAL - 50, TOTAL], [0, 0.3, 0.3, 0], CLAMP)}
        />
      )}
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.from)} durationInFrames={s.dur ?? 60} name={s.note}>
          <Audio src={staticFile(`audio/sfx/${s.src}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
