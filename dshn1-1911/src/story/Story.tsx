import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { Freeze, FREEZE } from '../Freeze';
import { FACES, Highlight } from '../Highlight';
import { Intro } from '../Intro';
import { Outro, OUTRO } from '../Outro';
import { Quad, QUAD_SWAP } from '../Quad';
import { CLAMP, T } from '../theme';
import { ColdOpen, Organisers, PairAct, Problem, Result, Rules } from './Parts';
import { ACT, BGM_START, DROP_F, PAIRS, SONG_OFFSET, TOTAL, resolveSubs } from './timeline';

export type StoryProps = { bgm: boolean };
const len = (a: { from: number; to: number }) => a.to - a.from;

// Face-tracked highlights: placed wherever a normal-speed sub-shot contains the track window.
const SUBS = PAIRS.flatMap((p) => resolveSubs(p));
// Faces in the top band (y < 520) would collide with the pair HUD — skipped in this version.
const HIGHLIGHTS = FACES.filter((face) => face.track[0][1] >= 520).flatMap((face) => {
  const s = SUBS.find((x) => (x.rate ?? 1) === 1 && x.src === `clips/${face.clip}.mp4` && face.t0 >= x.at && face.t1 <= x.at + x.dur / 30 + 0.01);
  return s ? [{ face, from: s.from + Math.round((face.t0 - s.at) * 30) }] : [];
});

const P6 = PAIRS[5];
const P6_SLOW = resolveSubs(P6)[1];
const P2 = PAIRS[1];
const P2_FIXED = resolveSubs(P2).reduce((a, s) => a + s.dur, 0);
const P3_FREEZE_AT = ACT.p2.from + P2_FIXED; // freeze shot (pair B) starts here
const IMPACT_LEAD = 65; // impact-cine-big hits ~65f into the file
const TITLE_LAND = ACT.outro.from + OUTRO.titleMove + 32;

type Sfx = { from: number; src: string; volume: number; dur?: number; note: string };
const SFX: Sfx[] = [
  ...[0, 9, 18].map((f, i) => ({ from: f, src: 'swoosh-quick', volume: [0.3, 0.26, 0.22][i], note: `cold open cut ${i + 1}` })),
  ...[28, 50, 70, 88].map((f, i) => ({ from: f, src: 'heartbeat-single', volume: [0.7, 0.75, 0.8, 0.85][i], dur: 30, note: 'cold open heartbeat (speeds up)' })),
  { from: DROP_F - 30, src: 'air-woosh-quick', volume: 0.4, note: 'title: 19.11 swells' },
  { from: DROP_F - IMPACT_LEAD, src: 'impact-cine-big', volume: 0.45, dur: 125, note: 'title: takeover on the drop (slam 1/2)' },
  { from: ACT.org.from, src: 'swoosh-quick', volume: 0.25, note: 'organisers' },
  { from: ACT.rules.from, src: 'swoosh-quick', volume: 0.25, note: 'rules' },
  ...[10, 40, 96].map((f, i) => ({ from: ACT.rules.from + f, src: 'pop', volume: [0.45, 0.4, 0.35][i], dur: 15, note: `rule ${i + 1} pops` })),
  { from: ACT.problem.from + 18, src: 'pop', volume: 0.55, dur: 15, note: 'GẦN slams in' },
  ...PAIRS.map((p) => ({ from: ACT[p.key].from, src: 'swoosh-quick', volume: 0.22, note: `pair ${p.n} badge` })),
  { from: P3_FREEZE_AT + FREEZE.flowEnd, src: 'camera-shutter-hard', volume: 0.5, note: 'pair 2 (B): freeze' },
  { from: P3_FREEZE_AT + FREEZE.flowEnd + 7, src: 'paper-slide-g', volume: 0.6, note: 'pair 2 (B): marker circle' },
  { from: P6_SLOW.from, src: 'applause-rhythmic-loop', volume: 0.45, dur: 120, note: 'pair 6: slow-mo, room erupts' },
  { from: P6_SLOW.from + 20, src: 'pop', volume: 0.6, dur: 15, note: 'pair 6: meter VỠ!' },
  { from: ACT.quad.from, src: 'air-woosh-quick', volume: 0.32, note: 'quad: cells fly in' },
  { from: ACT.quad.from + QUAD_SWAP, src: 'swoosh-quick', volume: 0.26, note: 'quad: swap' },
  { from: ACT.result.from, src: 'applause-rhythmic-loop', volume: 0.5, dur: len(ACT.result) + 20, note: 'result' },
  { from: ACT.outro.from, src: 'click-camera-g', volume: 0.7, note: 'medal photo shutter' },
  { from: ACT.outro.from + OUTRO.swap, src: 'click-camera-g', volume: 0.7, note: 'fun photo shutter' },
  { from: ACT.outro.from + OUTRO.titleMove - 4, src: 'air-woosh-quick', volume: 0.38, note: 'title rises' },
  { from: TITLE_LAND - IMPACT_LEAD, src: 'impact-cine-big', volume: 0.55, dur: 150, note: 'title lands (slam 2/2)' },
  { from: TITLE_LAND + 10, src: 'shimmer-sparkle-sweep', volume: 0.3, dur: 80, note: 'underline sparkle' },
  ...HIGHLIGHTS.map((h) => ({ from: h.from + 2, src: 'paper-slide-g', volume: 0.4, dur: 30, note: `highlight ${h.face.key}` })),
];

export const Story: React.FC<StoryProps> = ({ bgm }) => {
  let prev = 30;
  const acts = PAIRS.map((p) => {
    const from = prev;
    prev = p.ngai;
    const tail = p.key === 'p2' ? <Freeze dur={len(ACT.p2) - P2_FIXED} /> : undefined;
    const burstAt = p.key === 'p6' ? P6_SLOW.from - ACT.p6.from + 20 : undefined;
    return (
      <Sequence key={p.key} from={ACT[p.key].from} durationInFrames={len(ACT[p.key])}>
        <PairAct pair={p} prevNgai={from} tail={tail} burstAt={burstAt} />
      </Sequence>
    );
  });
  return (
    <AbsoluteFill style={{ background: T.navy }}>
      <Sequence durationInFrames={len(ACT.cold)}>
        <ColdOpen dur={len(ACT.cold)} />
      </Sequence>
      <Sequence from={ACT.title.from} durationInFrames={len(ACT.title)}>
        <Intro dur={len(ACT.title)} takeoverEnd={DROP_F - ACT.title.from} top="DSHN1 · 19.11" bottom={['THỬ THÁCH', 'CẮN NGẮN NHẤT']} bottomSize={66} />
      </Sequence>
      <Sequence from={ACT.org.from} durationInFrames={len(ACT.org)}>
        <Organisers dur={len(ACT.org)} />
      </Sequence>
      <Sequence from={ACT.rules.from} durationInFrames={len(ACT.rules)}>
        <Rules dur={len(ACT.rules)} />
      </Sequence>
      <Sequence from={ACT.problem.from} durationInFrames={len(ACT.problem)}>
        <Problem dur={len(ACT.problem)} />
      </Sequence>
      {acts}
      {HIGHLIGHTS.map((h) => (
        <Sequence key={h.face.key} from={h.from} durationInFrames={h.face.track.length}>
          <Highlight face={h.face} />
        </Sequence>
      ))}
      <Sequence from={ACT.quad.from} durationInFrames={len(ACT.quad)}>
        <Quad dur={len(ACT.quad)} />
      </Sequence>
      <Sequence from={ACT.result.from} durationInFrames={len(ACT.result)}>
        <Result dur={len(ACT.result)} />
      </Sequence>
      <Sequence from={ACT.outro.from} durationInFrames={TOTAL - ACT.outro.from}>
        <Outro
          dur={TOTAL - ACT.outro.from}
          medalZoom
          text={{
            kicker: '19.11 · NGÀY QUỐC TẾ ĐÀN ÔNG',
            line1: 'Chúc mừng',
            line2: 'anh em',
            mark: 'DSHN1',
            sub: 'Cảm ơn chị em đã tổ chức',
            chipKicker: 'LỄ TRAO HUY CHƯƠNG',
            chip: 'Huy chương Dũng cảm cho mọi anh em',
          }}
        />
      </Sequence>

      {bgm && (
        <Sequence from={BGM_START}>
          <Audio
            src={staticFile('audio/g-eazy-nba-type.mp3')}
            startFrom={Math.round(30 * SONG_OFFSET) + BGM_START}
            volume={(f) => interpolate(f, [0, 8, TOTAL - BGM_START - 50, TOTAL - BGM_START], [0, 0.32, 0.32, 0], CLAMP)}
          />
        </Sequence>
      )}
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.from)} durationInFrames={s.dur ?? 60} name={s.note}>
          <Audio src={staticFile(`audio/sfx/${s.src}.mp3`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
