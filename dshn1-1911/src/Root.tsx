import React from 'react';
import { Composition, continueRender, delayRender } from 'remotion';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/800.css';
import '@fontsource/be-vietnam-pro/900.css';
import { Main, MainProps } from './Main';
import { FPS, H, W } from './theme';
import { TOTAL } from './timeline';

// Block rendering until the Vietnamese glyphs of every weight are loaded.
const fontHandle = delayRender('Be Vietnam Pro');
// Race against a timeout: under concurrent tabs document.fonts.load() occasionally never
// settles once the faces are already cached; fonts.ready is the fallback signal.
Promise.race([
  Promise.all(['500', '800', '900'].map((w) => document.fonts.load(`${w} 100px "Be Vietnam Pro"`, 'ĐÀNÔNGẾỜỈ19.11'))),
  new Promise((r) => setTimeout(r, 8000)).then(() => document.fonts.ready),
])
  .then(() => continueRender(fontHandle))
  .catch(() => continueRender(fontHandle));

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Recap"
    component={Main}
    durationInFrames={TOTAL}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{ bgm: true } satisfies MainProps}
  />
);
