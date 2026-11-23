import React from 'react';
import { Composition } from 'remotion';
import { Film } from './Film';
import { DURATION, FPS, H, W } from './timeline';

export const Root: React.FC = () => (
  <Composition id="BaVi" component={Film} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{ bgm: true }} />
);
