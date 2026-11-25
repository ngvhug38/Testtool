import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { SHOTS, TOTAL, AUDIO_START_FRAME, beatF } from './timeline';
import { ensureFonts } from './theme';
import { FlashCut } from './lib/FlashCut';
import { SFX } from './sfx';
import { S1LogoLockup } from './shots/S1LogoLockup';
import { S2Odometer } from './shots/S2Odometer';
import { S3TextMask } from './shots/S3TextMask';
import { S4ReticleLock } from './shots/S4ReticleLock';
import { S5DocPark } from './shots/S5DocPark';
import { S6PillSlot } from './shots/S6PillSlot';
import { S7Bento } from './shots/S7Bento';
import { S8Runway } from './shots/S8Runway';
import { S9Spotlight } from './shots/S9Spotlight';
import { S10LogoWall } from './shots/S10LogoWall';
import { S11Outro } from './shots/S11Outro';

ensureFonts();

export const SHOT_COMPONENTS: { key: keyof typeof SHOTS; C: React.FC }[] = [
  { key: 'logo', C: S1LogoLockup },
  { key: 'scale', C: S2Odometer },
  { key: 'qrMask', C: S3TextMask },
  { key: 'qrLock', C: S4ReticleLock },
  { key: 'benefits', C: S5DocPark },
  { key: 'ecosystem', C: S6PillSlot },
  { key: 'features', C: S7Bento },
  { key: 'devices', C: S8Runway },
  { key: 'pricing', C: S9Spotlight },
  { key: 'customers', C: S10LogoWall },
  { key: 'outro', C: S11Outro },
];

// flash-cut (shot-transitions A): from = cut − 5, 10f, only over hard cuts with a big tonal jump
export const FLASH_CUTS = [SHOTS.benefits.from, SHOTS.customers.from];

export const Main: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  return (
    <AbsoluteFill style={{ background: '#F0F2F6' }}>
      {SHOT_COMPONENTS.map(({ key, C }) => (
        <Sequence key={key} from={SHOTS[key].from} durationInFrames={SHOTS[key].dur} name={key}>
          <C />
        </Sequence>
      ))}
      {FLASH_CUTS.map((f) => (
        <Sequence key={f} from={f - 5} durationInFrames={10} name="flash">
          <FlashCut />
        </Sequence>
      ))}
      {bgm ? (
        <Audio
          src={staticFile('audio/bgm.mp3')}
          startFrom={AUDIO_START_FRAME}
          volume={(f) => interpolate(f, [0, 20, TOTAL - beatF(4), TOTAL], [0, 0.34, 0.34, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      ) : null}
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur ?? 90} name={`sfx:${s.note}`}>
          <Audio src={staticFile(`audio/sfx/${s.src}`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
