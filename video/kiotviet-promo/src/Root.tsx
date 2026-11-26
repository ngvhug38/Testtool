import React from 'react';
import { Composition } from 'remotion';
import { Main } from './Main';
import { TOTAL, FPS } from './timeline';

export const Root: React.FC = () => (
  <>
    <Composition id="KiotVietPromo" component={Main} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} defaultProps={{ bgm: true, vertical: false }} />
    {/* TikTok 9:16 — same timeline, sound and copy; layouts adapted to the TikTok safe zone */}
    <Composition id="KiotVietPromoTikTok" component={Main} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{ bgm: true, vertical: true }} />
  </>
);
