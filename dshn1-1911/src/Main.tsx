import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { Caption, Footage } from './components';
import { Freeze, FREEZE } from './Freeze';
import { Hook, HOOK_CARD_STARTS } from './Hook';
import { Intro } from './Intro';
import { Outro, OUTRO } from './Outro';
import { Quad, QUAD_SWAP } from './Quad';
import { FACES, Highlight } from './Highlight';
import { CLAMP } from './theme';
import { MONTAGE, SHOTS, TOTAL, beatF } from './timeline';

export type MainProps = { bgm: boolean };

const len = (s: { from: number; to: number }) => s.to - s.from;
const INTRO_TAKEOVER_END = beatF(10);

// ---- SFX table: every entry is relative to a shot boundary or beat (S2/S3). ----
// Volumes set against measured peaks (all sources peak between -7.7 and 0 dB).
type Sfx = { from: number; src: string; volume: number; dur?: number; note: string };
// impact-cine-big builds slowly: its hit sits ~65f into the file (RMS envelope), so it
// is started 65f before the visual landing. *-g files are copies gained +10/+12 dB
// (sources were recorded ~-20 dB RMS and vanished under the BGM).
const IMPACT_LEAD = 65;
const TITLE_LAND = SHOTS.outro.from + OUTRO.titleMove + 32;
// Reaction highlights: absolute start = montage shot start + (face.t0 - clip in-point).
const HIGHLIGHTS = FACES.map((face) => {
  const k = face.key as keyof typeof MONTAGE;
  return { face, from: SHOTS[k].from + Math.round((face.t0 - MONTAGE[k].clip.at) * 30) };
});

const SFX: Sfx[] = [
  { from: INTRO_TAKEOVER_END - 30, src: 'air-woosh-quick', volume: 0.4, note: 'intro: "19.11" starts swelling' },
  { from: INTRO_TAKEOVER_END - IMPACT_LEAD, src: 'impact-cine-big', volume: 0.42, dur: 125, note: 'intro: takeover lands (slam 1/2)' },
  ...HOOK_CARD_STARTS.map((f, i) => ({ from: f, src: 'swoosh-quick', volume: [0.32, 0.27, 0.22][i], note: `hook: title card ${i + 1} cut` })),
  { from: SHOTS.freeze.from + FREEZE.flowEnd, src: 'camera-shutter-hard', volume: 0.5, note: 'freeze: frame stops' },
  { from: SHOTS.freeze.from + FREEZE.flowEnd + 7, src: 'paper-slide-g', volume: 0.6, note: 'freeze: marker circle drawn' },
  { from: SHOTS.quad.from, src: 'air-woosh-quick', volume: 0.32, note: 'quad: cells fly in' },
  { from: SHOTS.quad.from + QUAD_SWAP, src: 'swoosh-quick', volume: 0.28, note: 'quad: cells swap to round 2' },
  { from: SHOTS.outro.from, src: 'click-camera-g', volume: 0.7, note: 'outro: photo 1 shutter + flash' },
  { from: SHOTS.outro.from + OUTRO.swap, src: 'click-camera-g', volume: 0.7, note: 'outro: photo 2 shutter + flash' },
  { from: SHOTS.outro.from + OUTRO.titleMove - 4, src: 'air-woosh-quick', volume: 0.38, note: 'outro: photo lifts, title rises' },
  { from: TITLE_LAND - IMPACT_LEAD, src: 'impact-cine-big', volume: 0.55, dur: 150, note: 'outro: title lands (slam 2/2, loudest)' },
  { from: TITLE_LAND + 10, src: 'shimmer-sparkle-sweep', volume: 0.3, dur: 80, note: 'outro: marker underline sparkle tail' },
  ...HIGHLIGHTS.map((h) => ({ from: h.from + 2, src: 'paper-slide-g', volume: 0.4, dur: 30, note: `highlight ${h.face.key}: marker circle` })),
];

const MontageShot: React.FC<{ k: keyof typeof MONTAGE }> = ({ k }) => {
  const steady = k === 'm6'; // handheld footage already moves a lot (Q3)
  const s = SHOTS[k];
  const m = MONTAGE[k];
  const d = len(s);
  return (
    <Sequence from={s.from} durationInFrames={d}>
      <Footage src={m.clip.src} at={m.clip.at} dur={d} push={steady ? [1, 1] : [1, 1.04]} />
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
      {HIGHLIGHTS.map((h) => (
        <Sequence key={h.face.key} from={h.from} durationInFrames={h.face.track.length} name={`highlight ${h.face.key}`}>
          <Highlight face={h.face} />
        </Sequence>
      ))}
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
