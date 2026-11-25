import { continueRender, delayRender, staticFile } from 'remotion';

// Brand tokens — from kiotviet.vn computed styles + KiotViet reel + approved styleframes (SPEC.md §2)
export const C = {
  blue: '#006FFF',
  sky: '#00B2FF',
  navy: '#0C2D5E',
  navyDeep: '#0A1A33',
  ink: '#0A0A0A',
  text: '#33415C',
  muted: '#5B6B85',
  bg: '#F0F2F6',
  card: '#FFFFFF',
  line: '#E2E8F2',
  orange: '#FF8A00',
  green: '#12A02A',
  greenBright: '#3BD15A',
  hud: '#7CF5C4',
};
export const FONT = "'Be Vietnam Pro', 'Helvetica Neue', Arial, sans-serif";

// Local woff2 (vietnamese + latin + latin-ext subsets, weights 500–900) — no network at render time
const SUBSETS: { sub: string; range: string }[] = [
  { sub: 'vietnamese', range: 'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB' },
  { sub: 'latin-ext', range: 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF' },
  { sub: 'latin', range: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' },
];
const WEIGHTS = [500, 600, 700, 800, 900];

let loaded = false;
export const ensureFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Be Vietnam Pro');
  const faces = WEIGHTS.flatMap((w) =>
    SUBSETS.map(
      ({ sub, range }) =>
        new FontFace('Be Vietnam Pro', `url(${staticFile(`fonts/bvp-${w}-${sub}.woff2`)}) format('woff2')`, {
          weight: String(w),
          unicodeRange: range,
        }),
    ),
  );
  Promise.all(faces.map((f) => f.load().then((ff) => document.fonts.add(ff))))
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
