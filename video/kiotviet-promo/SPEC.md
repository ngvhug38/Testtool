# KiotViet promo – design spec (Cùng sáng tạo)

Trạng thái: chờ người dùng duyệt kịch bản phân cảnh (bước cuối trước khi dựng).

## 1. Tóm tắt sản phẩm (đã duyệt)
- Định vị: phần mềm quản lý bán hàng phổ biến nhất Việt Nam (300.000+ nhà bán hàng, 25 văn phòng; Bán lẻ 75% / F&B 20% / Đặt chỗ 5%).
- Người xem: chủ cửa hàng bán lẻ, F&B, dịch vụ đặt chỗ; cả Việt kiều kinh doanh ở nước ngoài.
- Nội dung bắt buộc: thanh toán đa quốc gia (VietQRPay & VietQRGlobal – NAPAS, 1 mã QR), nhóm tính năng nổi bật, chi phí (270K/330K/490K), thiết bị (chỉ liệt kê, KHÔNG ghi giá), khách hàng tiêu biểu.
- Khung hình 16:9 1920×1080 @30fps, ~55s, tiếng Việt, chữ trên màn hình (không lồng tiếng).
- Âm thanh: BGM + SFX; giao 2 bản (có BGM / chỉ SFX).
- Dữ liệu: chỉ thông tin công khai + logo người dùng xác nhận. Được phép dùng cảnh quay từ reel KiotViet (FB reel 1364674518328699).
- CTA cuối: "Dùng thử miễn phí – liên hệ Hưng (KiotViet): 0327 012 877" + kiotviet.vn.

## 2. Hướng hình ảnh (đã duyệt): A "Sáng & tin cậy" + B "Nhịp phố" cho đoạn mở phần thanh toán
- Font: Be Vietnam Pro 500–900 (site dùng Google Sans Flex).
- Màu: xanh #006FFF, sky #00B2FF, navy #0C2D5E, nền #F0F2F6, thẻ #FFFFFF, cam #FF8A00, xanh lá #12A02A, xanh ngọc HUD #7CF5C4 (chỉ cho khung quét QR).
- Thẻ bo 28–48px, bóng mềm navy 8%; quầng sáng mờ xanh dương/xanh lá ở nền.
- Logo thật: assets/logo-mark.png, logo-word.png, logo-full.png (nền trong suốt).
- Styleframe: scratchpad video/styleframes/sheet.png (4 khung). Cảnh reel có phụ đề in sẵn → cắt khung/chọn đoạn tránh phụ đề; không chồng logo lên watermark reel.

## 3. Ghép nội dung – hiệu ứng (đã duyệt)
| Nội dung | Card · style |
|---|---|
| Logo mở đầu | logo-shrink-wordmark-lockup |
| Quy mô | odometer-digit-roll |
| "1 mã QR" | text-as-mask |
| Khóa mã QR | fui-hud-moves · reticle-lock-on |
| Lợi ích thanh toán | doc-park-left-pill-deal |
| Hệ sinh thái | pill-slot-cycle |
| Tính năng | wall-reveal-moves · bento-light-up |
| Thiết bị (không giá) | runway-ground-skim |
| Chi phí | spotlight-hero-card |
| Khách hàng | page-waterfall-wall |
| Kết | outro-group-photo-launch |
| Chuyển cảnh | shot-transitions · flash-cut / whip-pan |

## 4. Nhạc nền
`bgm-tech-house.mp3` (Mixkit), ~123 BPM → 1 ô nhịp (4 phách) ≈ 1,95s ≈ 58,5 frame. Lấy đoạn năng lượng ổn định (~10–65s của bản gốc), lưới nhịp sẽ được khớp chính xác (librosa) trước khi dựng; chuyển cảnh rơi đúng phách 1 của ô nhịp.

## 5. Kịch bản phân cảnh
Xem bảng trong chat ngày 2026-11-25 (bản chép ở dưới).

| # | Ô nhịp | Thời gian | Nội dung | Hiệu ứng | Chữ trên màn hình | Âm thanh |
|---|---|---|---|---|---|---|
| 1 | 0–2 | 0,0–3,9s | Biểu tượng KiotViet thu về giữa → dạt trái, chữ KiotViet trượt vào; hold ≥1s | logo-shrink-wordmark-lockup | KiotViet | whoosh nhẹ → sparkle khi khóa logo |
| 2 | 2–4 | 3,9–7,8s | 300.000+ lăn số, dừng; chip phụ hiện | odometer-digit-roll | 300.000+ nhà bán hàng tin dùng · 25 văn phòng · Bán lẻ 75% · F&B 20% · Đặt chỗ 5% | tick lăn số; flash-cut sang #3 |
| 3 | 4–7 | 7,8–13,7s | Chữ "1 MÃ QR" chứa cảnh quét QR, phóng to tới khi cảnh quay phủ kín | text-as-mask | THANH TOÁN ĐA QUỐC GIA / 1 MÃ QR | riser → impact ở ô nhịp 6 |
| 4 | 7–9 | 13,7–17,6s | Toàn màn hình; khung ngắm xanh ngọc khóa vào mã QR + tia quét | fui-hud-moves · reticle-lock-on | Khách trong nước & quốc tế đều quét được · VietQRPay · VietQRGlobal · NAPAS | lock click |
| 5 | 9–12 | 17,6–23,4s | Cảnh quay dạt trái thành thẻ; 3 thẻ lợi ích lần lượt hiện bên phải | doc-park-left-pill-deal | Quét là trả, nhận tiền tức thì / Một mã cho nội địa & quốc tế / Tiền về ngay, an toàn / Doanh thu tự vào báo cáo | pop nhẹ mỗi thẻ |
| 6 | 12–14 | 23,4–27,3s | Câu cố định, ô chữ đổi 5 lần (nhịp nghỉ) | pill-slot-cycle | KiotViet lo trọn [Bán hàng / Kế toán & Thuế / Thanh toán / Bán online / Nhân viên] | tick theo phách |
| 7 | 14–17 | 27,3–33,2s | Lưới ô tính năng sáng theo 3 nhóm; ô MIỄN PHÍ sáng cuối | wall-reveal-moves · bento-light-up | Tối ưu vận hành · Tối ưu quản lý · Thúc đẩy doanh thu · Hóa đơn điện tử, chữ ký số, kế toán HKD: MIỄN PHÍ | whoosh-up; whip-pan sang #8 |
| 8 | 17–19 | 33,2–37,1s | Thẻ thiết bị rơi nhanh xuống mặt quầy, góc máy thấp (không giá) | runway-ground-skim | Thiết bị bán hàng đồng bộ: Máy POS KV88 · D68 Single · D68 Dual · Máy in hóa đơn · Máy quét mã vạch · Màn hình QR KV99 · Loa báo thanh toán KV66 · Máy chấm công | tiếng đặt vật xuống |
| 9 | 19–22 | 37,1–42,9s | 3 thẻ giá; đèn quét, khóa gói Chuyên nghiệp, thẻ nổi lên rồi về chỗ | spotlight-hero-card | Chi phí rõ ràng, chọn gói vừa sức · 270K · 330K (Phổ biến) · 490K /tháng · Miễn phí khởi tạo | shimmer khi đèn khóa |
| 10 | 22–24,5 | 42,9–47,8s | Tường 18 logo trôi ngược chiều trên mặt nghiêng 3D | page-waterfall-wall | Gian hàng tiêu biểu đang dùng KiotViet | nền nhạc, ít SFX |
| 11 | 24,5–28 | 47,8–54,6s | Các yếu tố đã xuất hiện bay về vây quanh logo; CTA hiện; hold ≥1,5s | outro-group-photo-launch | Dùng thử miễn phí · Liên hệ Hưng (KiotViet) 0327 012 877 · kiotviet.vn | riser → impact → sparkle; nhạc fade-out |
