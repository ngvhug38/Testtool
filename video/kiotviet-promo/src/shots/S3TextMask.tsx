// S3 · text-as-mask (adapted from demos/opening/text-as-mask/TextAsMask.tsx)
// Kept: 0–20f hold, 20–100f in-glyph drift (content scale 1.15, translateX +110→-110, uniform),
// 100–130f single bezier(0.4,0,0.2,1) takeover: glyph layer scale 1→26 with origin pinned inside a
// solid stroke, content 1.15→1 back to standard framing, unmasked full-screen layer fades in over
// endT 0.25–0.9 as takeover insurance, then ≥20f true rest.
// Adapted: light brand scene, so the "mask" is a knockout layer (paper-colour plate + ink glyphs,
// mix-blend-mode: screen → footage shows only inside the glyphs). This keeps the Be Vietnam Pro
// web font (a data-URI SVG mask cannot load web fonts → Vietnamese diacritics would fall back) and
// keeps the card's命门: glyph layer and footage layer are driven separately, footage never scales ×26.
import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, FONT } from '../theme';

const PLATE = '#F2F4F8';
export const S3_DEFAULTS = { word: '1 MÃ QR', eyebrow: 'THANH TOÁN ĐA QUỐC GIA', origin: '31.5% 56%' };

export const S3TextMask: React.FC<Partial<typeof S3_DEFAULTS>> = (p) => {
  const { word, eyebrow, origin } = { ...S3_DEFAULTS, ...p };
  const f = useCurrentFrame();
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  const endT = interpolate(f, [100, 130], [0, 1], { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) });
  const driftX = interpolate(f, [20, 100], [110, -110], clamp);
  const dx = f < 100 ? driftX : interpolate(endT, [0, 1], [-110, 0]);
  const dashS = interpolate(endT, [0, 1], [1.15, 1]);
  const maskS = interpolate(endT, [0, 1], [1, 26]);
  const cover = interpolate(endT, [0.15, 0.6], [0, 1], clamp); // review: faster insurance fade removes plate residue
  const eyebrowOp = interpolate(f, [0, 10, 100, 112], [0, 1, 1, 0], clamp);

  const footage = (
    <AbsoluteFill style={{ transform: `translateX(${dx}px) scale(${dashS})`, transformOrigin: '50% 50%' }}>
      <OffthreadVideo src={staticFile('footage/qr-slow.mp4')} muted style={{ width: 1920, height: 1080, objectFit: 'cover' }} />
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ background: PLATE, overflow: 'hidden', fontFamily: FONT }}>
      {/* knockout group: footage below, paper plate with ink glyphs blended with `screen` above */}
      <AbsoluteFill style={{ isolation: 'isolate' }}>
        {footage}
        <AbsoluteFill style={{ mixBlendMode: 'screen' }}>
          <AbsoluteFill
            style={{
              background: PLATE,
              transform: `scale(${maskS})`,
              transformOrigin: origin,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* plate must stay larger than the frame while scaling, so pad it with an outer plate */}
            <div style={{ position: 'absolute', inset: -2000, background: PLATE }} />
            <div style={{ position: 'relative', fontSize: 420, fontWeight: 900, letterSpacing: -10, color: '#000', lineHeight: 1, marginTop: 60, whiteSpace: 'nowrap' }}>{word}</div>
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* takeover insurance layer: same motion, unmasked */}
      <AbsoluteFill style={{ opacity: cover }}>{footage}</AbsoluteFill>
      <div style={{ position: 'absolute', top: 236, width: '100%', textAlign: 'center', fontSize: 40, fontWeight: 800, letterSpacing: 10, color: C.blue, opacity: eyebrowOp }}>
        {eyebrow}
      </div>
    </AbsoluteFill>
  );
};
