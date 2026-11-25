// Workbench manifest — decomposes the film into editable clips (see video-shotcraft references/workbench.md).
// All timing comes from timeline.ts / Main.tsx (single source of truth). Only context-level props
// (copy, colours) are exposed; motion timing, eases and camera keys stay fixed.
import { createElement, type FC } from 'react';
import { SHOTS, TOTAL } from './timeline';
import { Main, SHOT_COMPONENTS, FLASH_CUTS } from './Main';
import { SFX } from './sfx';
import { FlashCut } from './lib/FlashCut';
import { S1_DEFAULTS } from './shots/S1LogoLockup';
import { S2Odometer, S2_DEFAULTS } from './shots/S2Odometer';
import { S3_DEFAULTS } from './shots/S3TextMask';
import { S4ReticleLock, S4_DEFAULTS } from './shots/S4ReticleLock';
import { S6_DEFAULTS } from './shots/S6PillSlot';
import { S7_DEFAULTS } from './shots/S7Bento';
import { S8_DEFAULTS } from './shots/S8Runway';
import { S9Spotlight, S9_DEFAULTS } from './shots/S9Spotlight';
import { S10_DEFAULTS } from './shots/S10LogoWall';
import { S11_DEFAULTS } from './shots/S11Outro';

type Field = Record<string, unknown> & { type: string; key: string; label: string; default: unknown };
const text = (key: string, label: string, def: string): Field => ({ type: 'text', key, label, default: def });
const textarea = (key: string, label: string, def: string): Field => ({ type: 'textarea', key, label, default: def });
const color = (key: string, label: string, def: string): Field => ({ type: 'color', key, label, default: def });
const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);

// adapters: line-DSL textareas → array props
export const S2Unit: FC<{ label?: string; chipsText?: string }> = ({ label = S2_DEFAULTS.label, chipsText = S2_DEFAULTS.chips.join('\n') }) =>
  createElement(S2Odometer, { label, chips: lines(chipsText) });
S2Unit.displayName = 'S2Odometer';
export const S4Unit: FC<{ titleText?: string; chipsText?: string; label?: string }> = ({
  titleText = S4_DEFAULTS.title.join('\n'),
  chipsText = S4_DEFAULTS.chips.join('\n'),
  label = S4_DEFAULTS.label,
}) => createElement(S4ReticleLock, { title: lines(titleText), chips: lines(chipsText), label });
S4Unit.displayName = 'S4ReticleLock';
export const S9Unit: FC<{ title?: string; chipsText?: string; noteText?: string }> = ({
  title = S9_DEFAULTS.title,
  chipsText = S9_DEFAULTS.chips.join('\n'),
  noteText = S9_DEFAULTS.note.join('\n'),
}) => createElement(S9Spotlight, { title, chips: lines(chipsText), note: lines(noteText) });
S9Unit.displayName = 'S9Spotlight';
export const FlashUnit: FC<{ duration?: number }> = ({ duration = 10 }) => createElement(FlashCut, { duration });
FlashUnit.displayName = 'FlashCut';

const LABELS: Record<keyof typeof SHOTS, string> = {
  logo: 'S1 Logo KiotViet',
  scale: 'S2 300.000+',
  qrMask: 'S3 1 MÃ QR',
  qrLock: 'S4 Khóa mã QR',
  benefits: 'S5 Lợi ích thanh toán',
  ecosystem: 'S6 Một phần mềm lo trọn',
  features: 'S7 Nhóm tính năng',
  devices: 'S8 Thiết bị',
  pricing: 'S9 Bảng giá',
  customers: 'S10 Khách hàng',
  outro: 'S11 Kết · CTA',
};

const OVERRIDES: Partial<Record<keyof typeof SHOTS, { component: FC<any>; props: Record<string, unknown>; schema: Field[] }>> = {
  logo: { component: SHOT_COMPONENTS[0].C, props: { ...S1_DEFAULTS }, schema: [text('tagline', 'Tagline', S1_DEFAULTS.tagline), color('accent', 'Màu tagline', S1_DEFAULTS.accent)] },
  scale: { component: S2Unit, props: { label: S2_DEFAULTS.label, chipsText: S2_DEFAULTS.chips.join('\n') }, schema: [text('label', 'Nhãn dưới số', S2_DEFAULTS.label), textarea('chipsText', 'Chip (mỗi dòng 1 chip)', S2_DEFAULTS.chips.join('\n'))] },
  qrMask: { component: SHOT_COMPONENTS[2].C, props: { word: S3_DEFAULTS.word, eyebrow: S3_DEFAULTS.eyebrow }, schema: [text('word', 'Chữ lớn', S3_DEFAULTS.word), text('eyebrow', 'Dòng trên', S3_DEFAULTS.eyebrow)] },
  qrLock: { component: S4Unit, props: { titleText: S4_DEFAULTS.title.join('\n'), chipsText: S4_DEFAULTS.chips.join('\n'), label: S4_DEFAULTS.label }, schema: [textarea('titleText', 'Tiêu đề (2 dòng)', S4_DEFAULTS.title.join('\n')), textarea('chipsText', 'Chip', S4_DEFAULTS.chips.join('\n')), text('label', 'Nhãn khung ngắm', S4_DEFAULTS.label)] },
  ecosystem: { component: SHOT_COMPONENTS[5].C, props: { stem: S6_DEFAULTS.stem, finale: S6_DEFAULTS.finale }, schema: [text('stem', 'Vế đầu', S6_DEFAULTS.stem), text('finale', 'Vế kết', S6_DEFAULTS.finale)] },
  features: { component: SHOT_COMPONENTS[6].C, props: { title: S7_DEFAULTS.title }, schema: [text('title', 'Tiêu đề', S7_DEFAULTS.title)] },
  devices: { component: SHOT_COMPONENTS[7].C, props: { title: S8_DEFAULTS.title, subtitle: S8_DEFAULTS.subtitle }, schema: [text('title', 'Tiêu đề', S8_DEFAULTS.title), text('subtitle', 'Phụ đề', S8_DEFAULTS.subtitle)] },
  pricing: { component: S9Unit, props: { title: S9_DEFAULTS.title, chipsText: S9_DEFAULTS.chips.join('\n'), noteText: S9_DEFAULTS.note.join('\n') }, schema: [text('title', 'Tiêu đề', S9_DEFAULTS.title), textarea('chipsText', 'Chip', S9_DEFAULTS.chips.join('\n')), textarea('noteText', 'Ghi chú nổi (2 dòng)', S9_DEFAULTS.note.join('\n'))] },
  customers: { component: SHOT_COMPONENTS[9].C, props: { title: S10_DEFAULTS.title }, schema: [text('title', 'Tiêu đề', S10_DEFAULTS.title)] },
  outro: { component: SHOT_COMPONENTS[10].C, props: { ...S11_DEFAULTS }, schema: [text('cta', 'Lời kêu gọi', S11_DEFAULTS.cta), text('contact', 'Liên hệ', S11_DEFAULTS.contact), text('site', 'Website', S11_DEFAULTS.site)] },
};

export const WORKBENCH = {
  name: 'KiotViet promo',
  fps: 30,
  width: 1920,
  height: 1080,
  total: TOTAL,
  background: '#F0F2F6',
  shots: SHOT_COMPONENTS.map(({ key, C }) => {
    const o = OVERRIDES[key];
    return { id: key, label: LABELS[key], from: SHOTS[key].from, duration: SHOTS[key].dur, component: o?.component ?? C, ...(o ? { props: o.props, schema: o.schema } : {}) };
  }),
  transitions: FLASH_CUTS.map((f, i) => ({ id: `flash${i}`, label: 'Flash cut', from: f - 5, duration: 10, component: FlashUnit, props: { duration: 10 }, cardId: 'flash' })),
  captions: [],
  overlays: [],
  sfx: SFX.map((s) => ({ from: s.from, duration: s.dur ?? 90, src: `audio/sfx/${s.src}`, volume: s.volume })),
  bgm: [{ from: 0, duration: TOTAL, src: 'audio/bgm.mp3', volume: 0.34 }],
  order: ['transitions', 'captions', 'overlays'],
  original: Main,
};
