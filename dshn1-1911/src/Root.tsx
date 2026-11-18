import React from 'react';
import { Composition } from 'remotion';
import { MainProps } from './Main';
import { MainWithFonts } from './fonts';
import { FPS, H, W } from './theme';
import { TOTAL } from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Recap"
    component={MainWithFonts}
    durationInFrames={TOTAL}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{ bgm: true } satisfies MainProps}
  />
);
