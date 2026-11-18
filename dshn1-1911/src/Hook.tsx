// card-footage-cadence (trailer-grammar-moves B) — adapted from
// demos/rhythm/trailer-grammar-moves/CardFootageCadence.tsx.
// Kept: hard cuts with zero crossfade (each segment mounted only inside its own
// window), footage segments always moving (push / crop-pan), title cards static except
// a 1.05→1 out-cubic settle in 5f, the last card carries an underline.
// Changed: boundaries are beat-locked (footage 2/2/1 beats ↔ cards 1 beat) instead of
// fixed 14/22/34… frames; cards sit on the event navy instead of #0d0d0d.
import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { Footage } from './components';
import { CLAMP, T } from './theme';
import { beatF } from './timeline';

const TitleCard: React.FC<{ text: string; underline?: boolean }> = ({ text, underline }) => {
  const local = useCurrentFrame();
  const scale = interpolate(local, [0, 5], [1.05, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: T.navy, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ transform: `scale(${scale})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div style={{ fontFamily: T.font, fontWeight: 900, fontSize: 124, color: T.white, lineHeight: 1, letterSpacing: 0 }}>
          {text}
        </div>
        {underline && <div style={{ width: 460, height: 16, background: T.gold, borderRadius: 8 }} />}
      </div>
    </AbsoluteFill>
  );
};

const B0 = 12; // hook starts on absolute beat 12
const rel = (n: number) => beatF(B0 + n) - beatF(B0);

type Seg =
  | { kind: 'clip'; a: number; b: number; src: string; at: number; push: [number, number]; origin?: string; tx?: [number, number] }
  | { kind: 'card'; a: number; b: number; text: string; underline?: boolean };

const SEGS: Seg[] = [
  { kind: 'clip', a: 0, b: 2, src: 'clips/c6.mp4', at: 8.7, push: [1, 1.08] }, // hands over eyes
  { kind: 'card', a: 2, b: 3, text: 'BỊT MẮT' },
  { kind: 'clip', a: 3, b: 5, src: 'clips/c7.mp4', at: 50.5, push: [1.4, 1.4], origin: '50% 40%', tx: [40, -40] },
  { kind: 'card', a: 5, b: 6, text: 'ĐOÁN NGƯỜI' },
  { kind: 'clip', a: 6, b: 7, src: 'clips/c1.mp4', at: 0.2, push: [1.15, 1.22], origin: '50% 20%' }, // crowd laughing
  { kind: 'card', a: 7, b: 8, text: 'CƯỜI XỈU', underline: true },
];

// Absolute frames of each title-card cut (for the SFX table).
export const HOOK_CARD_STARTS = SEGS.filter((s) => s.kind === 'card').map((s) => beatF(B0 + s.a));

export const Hook: React.FC = () => (
  <AbsoluteFill style={{ background: T.navy }}>
    {SEGS.map((s) => {
      const from = rel(s.a);
      const dur = rel(s.b) - from;
      return (
        <Sequence key={s.a} from={from} durationInFrames={dur}>
          {s.kind === 'card' ? (
            <TitleCard text={s.text} underline={s.underline} />
          ) : (
            <Footage src={s.src} at={s.at} dur={dur} muted push={s.push} origin={s.origin} translateX={s.tx} />
          )}
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
