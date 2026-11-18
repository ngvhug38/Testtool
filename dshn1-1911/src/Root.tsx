import React from 'react';
import { Composition } from 'remotion';
import { MainProps } from './Main';
import { MainWithFonts, withFonts } from './fonts';
import { Story, StoryProps } from './story/Story';
import { TOTAL as STORY_TOTAL } from './story/timeline';

const StoryWithFonts = withFonts<StoryProps>(Story);
import { FPS, H, W } from './theme';
import { TOTAL } from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="Story"
    component={StoryWithFonts}
    durationInFrames={STORY_TOTAL}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{ bgm: true } satisfies StoryProps}
  />
  <Composition
    id="Recap"
    component={MainWithFonts}
    durationInFrames={TOTAL}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{ bgm: true } satisfies MainProps}
  />
  </>
);
