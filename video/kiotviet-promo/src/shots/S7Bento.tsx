// S7 · wall-reveal-moves · bento-light-up (adapted from demos/ui-entrance/wall-reveal-moves/BentoLightUp.tsx)
// Kept: dark field, 3×2 bento held dim (opacity 0.18, y+20), per cell: SVG rect pathLength=100
// dashoffset stroke 8f out-cubic with drop-shadow glow → content lights/rises at +6f for 8f with
// bezier(0.3,1.4,0.5,1) (relay, not simultaneous) → stroke anneals to 0.4 from +12 to +26f;
// mid-light glow pulse lit·(1−lit)·4 with sin-hash seed; even cell cadence; after all lit a
// 25f push 1→1.04 bezier(0.33,0,0.2,1) then true stillness ≥15f.
// Adapted: cadence = 1 musical beat (≈14.5f, inside the card's 8–12f-ish "even cadence" spirit,
// locked to the grid), dark field = brand deep navy, accent stroke = sky blue (free cell: green),
// real KiotViet feature content instead of fixture cards, title fully lit for readability.
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { C, FONT } from '../theme';
import { useLayout, Layout } from '../layout';

const geom = (L: Layout) => {
  const cols = L.vertical ? 2 : 3;
  const CELL_W = L.vertical ? 394 : 520;
  const CELL_H = L.vertical ? 330 : 300;
  const GUT = L.vertical ? 28 : 36;
  const rows = Math.ceil(6 / cols);
  const LEFT = L.vertical ? (1080 - (CELL_W * 2 + GUT)) / 2 : (1920 - (CELL_W * 3 + GUT * 2)) / 2;
  const TOP = L.vertical ? 360 : (1080 - (CELL_H * 2 + GUT)) / 2 + 60;
  return { cols, CELL_W, CELL_H, GUT, rows, LEFT, TOP };
};
type Geom = ReturnType<typeof geom>;

type Cell = { title: string; items: string[]; free?: boolean };
export const S7_DEFAULTS = {
  title: 'Nhóm tính năng nổi bật',
  beat: 14.5,
  cells: [
    { title: 'Tối ưu vận hành', items: ['Bán hàng · Trả hàng · Đặt hàng', 'Thanh toán · Kết ca', 'Giao vận · Thiết bị'] },
    { title: 'Tối ưu quản lý', items: ['Hàng hóa · Giao dịch', 'Khách hàng · Nhân viên', 'Sổ quỹ · Báo cáo · API'] },
    { title: 'Thúc đẩy doanh thu', items: ['Cửa hàng Zalo · KiotViet Web', 'Sàn TMĐT, mạng xã hội', 'Khuyến mại · Tích điểm'] },
    { title: 'Thuế – Kế toán', items: ['Tờ khai thuế hộ kinh doanh', 'Sổ kế toán · Hạch toán', 'Thiết lập ban đầu'] },
    { title: 'Hóa đơn điện tử', items: ['Đăng ký chữ ký số', 'Phát hành, xử lý sai sót', 'Chứng từ & phiếu xuất kho'] },
    { title: 'MIỄN PHÍ', items: ['Hóa đơn điện tử', 'Chữ ký số', 'Kế toán hộ kinh doanh'], free: true },
  ] as Cell[],
};

const CellView: React.FC<{ i: number; frame: number; cell: Cell; first: number; gap: number; g: Geom; V: boolean }> = ({ i, frame, cell, first, gap, g, V }) => {
  const { cols, CELL_W, CELL_H, GUT, LEFT, TOP } = g;
  const start = first + i * gap;
  const col = i % cols;
  const row = Math.floor(i / cols);
  const x = LEFT + col * (CELL_W + GUT);
  const y = TOP + row * (CELL_H + GUT);
  const accent = cell.free ? C.greenBright : '#39B8FF';
  const draw = interpolate(frame, [start, start + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const strokeFade = interpolate(frame, [start + 12, start + 26], [1, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const lit = interpolate(frame, [start + 6, start + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const rise = interpolate(frame, [start + 6, start + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 1.4, 0.5, 1) });
  const opacity = 0.18 + 0.82 * lit;
  const ty = 20 * (1 - rise);
  const jitter = Math.abs((Math.sin(i * 127.3) * 43758.5453) % 1);
  const glow = lit * (1 - lit) * 4 * (14 + jitter * 6);
  const glowRGB = cell.free ? '59,209,90' : '57,184,255';
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: CELL_W, height: CELL_H }}>
      <div
        style={{
          opacity,
          transform: `translateY(${ty}px)`,
          boxShadow: lit > 0.5 ? `0 0 ${glow}px rgba(${glowRGB},${0.45 * lit * (1 - lit) * 4})` : 'none',
          borderRadius: 18,
          width: CELL_W,
          height: CELL_H,
          boxSizing: 'border-box',
          background: cell.free ? '#E8F9EC' : '#FFFFFF',
          padding: V ? '26px 30px' : '34px 38px',
          fontFamily: FONT,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 16, height: 16, borderRadius: 5, background: cell.free ? C.green : C.blue }} />
          <div style={{ fontSize: cell.free ? (V ? 44 : 50) : V ? 34 : 40, fontWeight: 900, whiteSpace: 'nowrap', color: cell.free ? C.green : C.navy, letterSpacing: cell.free ? 2 : 0 }}>{cell.title}</div>
        </div>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cell.items.map((it) => (
            <div key={it} style={{ fontSize: V ? 28 : 30, fontWeight: 600, color: C.text, whiteSpace: V ? 'normal' : 'nowrap', lineHeight: 1.25 }}>
              {it}
            </div>
          ))}
        </div>
      </div>
      {draw > 0 && (
        <svg width={CELL_W} height={CELL_H} viewBox={`0 0 ${CELL_W} ${CELL_H}`} style={{ position: 'absolute', left: 0, top: ty, overflow: 'visible' }}>
          <rect
            x={2}
            y={2}
            width={CELL_W - 4}
            height={CELL_H - 4}
            rx={18}
            fill="none"
            stroke={accent}
            strokeWidth={4}
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100 * (1 - draw)}
            opacity={strokeFade}
            style={{ filter: `drop-shadow(0 0 ${6 + jitter * 4}px ${accent})` }}
          />
        </svg>
      )}
    </div>
  );
};

const CELLS_V: Cell[] = [
  { title: 'Tối ưu vận hành', items: ['Bán · Trả · Đặt hàng', 'Thanh toán · Kết ca', 'Giao vận · Thiết bị'] },
  { title: 'Tối ưu quản lý', items: ['Hàng hóa · Giao dịch', 'Khách hàng · Nhân viên', 'Sổ quỹ · Báo cáo'] },
  { title: 'Thúc đẩy doanh thu', items: ['Cửa hàng Zalo', 'Sàn TMĐT, MXH', 'Khuyến mại · Tích điểm'] },
  { title: 'Thuế – Kế toán', items: ['Tờ khai thuế HKD', 'Sổ kế toán', 'Hạch toán'] },
  { title: 'Hóa đơn điện tử', items: ['Chữ ký số', 'Phát hành HĐĐT', 'Phiếu xuất kho'] },
  { title: 'MIỄN PHÍ', items: ['Hóa đơn điện tử', 'Chữ ký số', 'Kế toán HKD'], free: true },
];

export const S7Bento: React.FC<Partial<typeof S7_DEFAULTS>> = (p) => {
  const { title, beat, cells: cellsL } = { ...S7_DEFAULTS, ...p };
  const frame = useCurrentFrame();
  const L = useLayout();
  const g = geom(L);
  const cells = L.vertical && !p.cells ? CELLS_V : cellsL;
  const FIRST = beat;
  const allLit = FIRST + (cells.length - 1) * beat + 14;
  const push = interpolate(frame, [allLit, allLit + 25], [1, L.vertical ? 1.02 : 1.04], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.33, 0, 0.2, 1) });
  const titleLit = interpolate(frame, [2, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1400px 900px at 50% 40%, #12305C, ${C.navyDeep})`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: `${L.W / 2}px ${L.vertical ? 820 : 560}px` }}>
        <div style={{ position: 'absolute', left: g.LEFT, top: g.TOP - (L.vertical ? 104 : 118), opacity: titleLit, fontFamily: FONT, fontSize: L.vertical ? 60 : 64, fontWeight: 800, color: '#fff' }}>{title}</div>
        {cells.map((c, i) => (
          <CellView key={i} i={i} frame={frame} cell={c} first={FIRST} gap={beat} g={g} V={L.vertical} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
