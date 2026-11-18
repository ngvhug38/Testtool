import React, { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import { Main, MainProps } from './Main';

// Be Vietnam Pro (OFL; files from @fontsource copied to public/fonts), latin + vietnamese
// subsets per weight, loaded with the FontFace API. delayRender lives inside the
// component (documented pattern) — a module-scope handle was never cleared by the
// renderer and timed out ~N seconds into every full render.
const RANGES = {
  latin:
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
  vietnamese:
    'U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB',
} as const;

let loaded: Promise<unknown> | null = null;
const loadFonts = () => {
  if (!loaded) {
    const faces = (['500', '800', '900'] as const).flatMap((w) =>
      (Object.keys(RANGES) as (keyof typeof RANGES)[]).map(
        (s) =>
          new FontFace('Be Vietnam Pro', `url(${staticFile(`fonts/be-vietnam-pro-${s}-${w}-normal.woff2`)}) format('woff2')`, {
            weight: w,
            unicodeRange: RANGES[s],
          }),
      ),
    );
    loaded = Promise.all(faces.map((f) => f.load().then((ff) => document.fonts.add(ff))));
  }
  return loaded;
};

export const MainWithFonts: React.FC<MainProps> = (props) => {
  const [handle] = useState(() => delayRender('Be Vietnam Pro'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    loadFonts()
      .catch(() => undefined)
      .then(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);
  return ready ? <Main {...props} /> : null;
};
