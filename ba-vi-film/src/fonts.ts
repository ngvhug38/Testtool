import { pfVi, pfLa, bvVi, bvLa } from './fontData';

export const TITLE_FONT = 'BV Playfair';
export const BODY_FONT = 'BV Vietnam';
export const CREAM = '#F4EFE4';

const VI = 'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB';
const LA = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const face = (fam: string, b64: string, style: string, weight: string, range: string) =>
  `@font-face{font-family:'${fam}';src:url(data:font/woff2;base64,${b64}) format('woff2');font-style:${style};font-weight:${weight};unicode-range:${range};font-display:block;}`;

// Inline data-URI faces: no network, no delayRender handle that can hang a tab.
export const FONT_CSS = [
  face(TITLE_FONT, pfVi, 'italic', '500', VI), face(TITLE_FONT, pfLa, 'italic', '500', LA),
  face(BODY_FONT, bvVi, 'normal', '300', VI), face(BODY_FONT, bvLa, 'normal', '300', LA),
].join('\n');
