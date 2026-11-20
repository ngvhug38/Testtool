# Kênh YouTube về tính năng KiotViet — Chiến lược + Lộ trình 30 ngày

> Soạn bằng bộ skill `yt-viral` (nghiên cứu) và `yt-script` (kịch bản). Ngày soạn: 20/11/2026.

---

## PHẦN 1 — NGHIÊN CỨU (yt-viral)

### Giới hạn của lần nghiên cứu này (đọc trước)

`yt-viral` không xếp hạng video theo tổng lượt xem. Nó xếp theo **video đó vượt bao nhiêu lần mức
trung vị của chính kênh đăng nó**. Để làm vậy cần ít nhất 4 video/kênh, lấy từ danh sách công khai.
Môi trường tôi đang chạy **bị chặn truy cập YouTube**, nên tôi **chưa có số view thật** và
**chưa chạy được bảng xếp hạng outlier**. Phần chiến lược bên dưới dựa trên dữ liệu thị trường
công khai và các công thức hook, không phải dữ liệu view. Cách tự chạy phần này nằm ở cuối file.

### Dữ liệu thị trường có nguồn

- KiotViet phục vụ **hơn 300.000 cửa hàng** → tệp người xem là chủ shop và nhân viên, có nhu cầu tìm
  kiếm cao kiểu "làm sao để…" ([ITviec](https://itviec.com/blog/kiotviet-16-nam-khang-dinh-vi-the-bang-su-tan-tam-va-dong-long/)).
- KiotViet cho dùng **phần mềm kế toán miễn phí**: dữ liệu bán hàng tự đổ vào **7 loại sổ theo
  TT88/2021** và tờ khai theo **TT40/2021** ([VCCI](https://vcci.com.vn/tin-tuc/kiotviet-mien-phi-phan-mem-ke-toan-cho-ho-kinh-doanh),
  [Thời báo Tài chính](https://thoibaotaichinhvietnam.vn/kiotviet-mien-phi-phan-mem-ke-toan-cho-ho-kinh-doanh-183836.html)).
- Phân hệ Thuế & Kế toán ra mắt để chuẩn bị cho việc **bỏ thuế khoán từ 2026**. Đây là chủ đề có
  hạn chót thật, nhiều người tìm kiếm, nên được làm đầu tiên.
- KiotViet cùng Napas triển khai **VietQRPay** (mã QR tích hợp trong phần mềm bán hàng) và có
  **gói vay đăng ký trên app** ([CafeF](https://cafef.vn/chuyen-doi-so-ban-le-phan-mem-ban-hang-ha-tang-song-con-nam-2026-188261016213856936.chn)).
- Đã có kênh/video "HDSD – Phần mềm KiotViet" làm chủ đề thuế ([recapio](https://recapio.com/digest/tu-dong-hoa-so-ke-toan-to-khai-thue-cho-hkd-theo-tt88-tt40-phan-mem-ke-toan-mien-phi-kiotviet-by-hds)).
  Nghĩa là chủ đề này có người làm, nhưng thường theo kiểu hướng dẫn khô khan. Chỗ trống của bạn là
  **cách trình bày**, không phải chủ đề.

### Định vị kênh (khuyến nghị)

**"Người dùng KiotViet giỏi nhất khu phố"**, không phải một kênh hướng dẫn chính thức.
Mỗi video giải quyết **một nỗi đau của chủ shop** (lệch kho, mất tiền, sợ thuế, nhân viên gian lận),
còn tính năng KiotViet là cách giải quyết. Đặt tên video theo **vấn đề**, không theo tên menu.

| Tránh | Nên |
|---|---|
| "Hướng dẫn chức năng Kiểm kho KiotViet" | "Kho KiotViet lệch mãi? Không phải do nhân viên" |
| "Hướng dẫn thiết lập khuyến mại" | "Giảm giá kiểu này, shop càng bán càng lỗ" |

**Lưu ý pháp lý/thương hiệu:** không dùng logo KiotViet làm ảnh đại diện, không đặt tên kênh khiến
người xem tưởng là kênh chính thức. Ghi rõ trong phần giới thiệu kênh: *"Kênh cá nhân, không phải
kênh chính thức của KiotViet."* Ví dụ tên kênh: **"Bán Hàng Gọn"**, **"Shop Chạy Số cùng [Tên bạn]"**.

### 6 trụ cột nội dung

1. **Thuế & kế toán hộ kinh doanh** (đang nóng, có hạn chót). Kéo view từ tìm kiếm.
2. **Kho & nhập hàng**: lệch kho, kiểm kho, công nợ nhà cung cấp.
3. **Bán hàng & thanh toán**: bán nhanh, QR, in hóa đơn, mã vạch.
4. **Bán đa kênh**: Shopee, TikTok Shop, Facebook đồng bộ tồn kho.
5. **Quản lý nhân viên & báo cáo**: phân quyền, chống gian lận, đọc lãi lỗ.
6. **Theo ngành**: tạp hóa, thời trang, mỹ phẩm, quán cà phê/F&B.

### Công thức hook nên dùng (trong 21 công thức của yt-script)

Đây là nhận định về **cách đặt tiêu đề/câu mở đầu**, không phải lời giải thích vì sao video thắng
(vì chưa có dữ liệu outlier để kiểm chứng).

- **The Deadline / The Warning**: "Thuế khoán đã bỏ…, trước kỳ khai thuế…". Hợp với trụ cột 1.
- **The Mistake**: "Anh chị đang để sai thiết lập này…". Hợp với trụ cột 2 và 5.
- **The Clock**: "…trong 15 phút". Hợp với video cài đặt cho người mới.
- **The Before-After**: màn hình kho lệch → màn hình kho khớp. Hợp với Shorts.

**Điểm chung về cấu trúc:** mọi hook đều gọi tên **một nỗi lo về tiền hoặc thời gian của chủ shop**
ngay câu đầu, rồi mới nhắc tới KiotViet.

### Có thể làm ngay tuần này, với những gì bạn đang có

Bạn chỉ cần **một tài khoản KiotViet (dùng thử cũng được) + phần mềm quay màn hình + micro**.
Video 1 (thuế), video 2 (cài từ con số 0) và video 3 (lệch kho) đều quay màn hình được 100%,
không cần lộ mặt và không cần shop thật.

---

## PHẦN 2 — LỘ TRÌNH 30 NGÀY (yt-script)

### Nhịp đăng

- **3 video dài/tuần** (Thứ 2 – Thứ 4 – Thứ 6), 6–10 phút, quay màn hình kèm giọng đọc.
- **1 Short/ngày**, 30–50 giây, **cắt từ video dài gần nhất** để không phải quay thêm.
- Ngày 1 tính là **Thứ 2**. Tổng cộng: 13 video dài + 30 Shorts.

> **Về giọng văn:** skill yêu cầu file giọng văn (`voice.md`) dựng từ 3 video có sẵn của bạn.
> Kênh của bạn chưa có video, nên tôi tạm dùng giọng **thân thiện, thực tế, xưng "mình", gọi người
> xem là "anh chị"**, câu ngắn, không hứa hẹn quá đà. Sau khi đăng 3 video đầu, gửi tôi link hoặc
> bản ghi lời, tôi sẽ dựng `voice.md` thật và chỉnh lại kịch bản.

### Lịch 30 ngày

| Ngày | Video dài (tiêu đề + câu mở đầu) | Công thức | Short trong ngày |
|---|---|---|---|
| 1 | **Thuế khoán đã bỏ: 3 thiết lập KiotViet phải làm trước kỳ khai thuế** — *(kịch bản đầy đủ bên dưới)* | Warning | "Bán hàng trên KiotViet có tự ra sổ thuế không?" (trả lời trong 30 giây) |
| 2 | — | | 7 loại sổ kế toán KiotViet tự làm: lướt qua từng sổ |
| 3 | **Cài KiotViet từ con số 0 trong 15 phút (tự làm, không tốn tiền thuê)** — *(kịch bản bên dưới)* | Clock | Tạo 1 mặt hàng có mã vạch trong 40 giây |
| 4 | — | | Lỗi số 1 khi nhập danh sách hàng bằng file Excel |
| 5 | **Kho KiotViet lệch mãi? Không phải do nhân viên — 5 thiết lập gây lệch kho** — *(kịch bản bên dưới)* | Mistake | Trước/sau: số tồn kho lệch → khớp |
| 6 | — | | Thiết lập số 3 trong video kho (cắt riêng) |
| 7 | — | | Hỏi đáp: trả lời 1 bình luận hay nhất trong tuần |
| 8 | **Còn nợ nhà cung cấp bao nhiêu? Xem trong 10 giây trên KiotViet** — "Anh chị có biết chính xác tối nay mình đang nợ nhà cung cấp bao nhiêu không?" | Question | Màn hình công nợ nhà cung cấp |
| 9 | — | | Nhập hàng bằng quét mã vạch trên điện thoại |
| 10 | **Kiểm kho bằng điện thoại: 1 người, 1 buổi tối** — mở bằng cảnh trước/sau: sổ tay đếm kho → màn hình phiếu kiểm kho | Before-After | Cách xử lý chênh lệch sau kiểm kho |
| 11 | — | | Kiểm kho sai lúc nào sẽ làm lệch giá vốn? |
| 12 | **4 con số chủ shop phải xem mỗi tối trong báo cáo cuối ngày** — "Có 4 con số trên KiotViet, nếu anh chị không xem mỗi tối thì sẽ không biết tiền đi đâu." | List | Con số thứ 1: tiền mặt thực thu |
| 13 | — | | Con số dễ đọc nhầm nhất: doanh thu khác lợi nhuận |
| 14 | — | | Tổng kết 2 tuần: 3 câu hỏi được hỏi nhiều nhất |
| 15 | **Khách quét QR, tiền vào, đơn tự xác nhận — cài thanh toán QR trên KiotViet** — "Mình sẽ cho anh chị xem ngay trên màn hình: khách quét mã, đơn tự báo đã thanh toán." | Reveal | Demo quét QR 20 giây |
| 16 | — | | Lỗi hay gặp: khách chuyển khoản nhưng đơn chưa xác nhận |
| 17 | **3 cách giữ khách quay lại bằng tính năng Khách hàng & Tích điểm** — "3 thiết lập này biến khách vãng lai thành khách quen, mà anh chị chưa bật cái nào." | List | Bật tích điểm trong 30 giây |
| 18 | — | | Xem khách nào lâu rồi không quay lại |
| 19 | **Giảm giá kiểu này, shop càng bán càng lỗ — thiết lập khuyến mại đúng trên KiotViet** — "Anh chị đang chạy khuyến mại nhưng có thể mỗi đơn đang lỗ mà không biết." | Mistake | Combo "mua 2 tặng 1" cài đúng cách |
| 20 | — | | Khuyến mại theo khung giờ |
| 21 | — | | Hỏi đáp tuần 3 |
| 22 | **Bán Shopee + TikTok Shop + cửa hàng mà không bao giờ bán lố hàng** — "Bán 3 nơi cùng lúc, hết hàng ở tiệm nhưng sàn vẫn nhận đơn. Đây là cách KiotViet chặn chuyện đó." | Stack | Đồng bộ tồn kho: trước/sau |
| 23 | — | | Liên kết sản phẩm sàn với hàng trong KiotViet |
| 24 | **Nhân viên sửa giá, xóa hóa đơn? Chặn ngay bằng phân quyền KiotViet** — "Trước khi giao máy bán hàng cho nhân viên mới, khóa 3 quyền này lại." | Warning | Tắt quyền xóa hóa đơn |
| 25 | — | | Xem lịch sử thao tác của nhân viên |
| 26 | **Quán cà phê hay tiệm bán lẻ: dùng KiotViet bản nào?** — "Chọn sai bản là anh chị phải nhập lại toàn bộ menu. Đây là khác biệt giữa 2 bản." | Comparison | Khác biệt lớn nhất giữa 2 bản trong 30 giây |
| 27 | — | | Gọi món tại bàn bằng app (bản F&B) |
| 28 | — | | Hỏi đáp tuần 4 + khảo sát chủ đề tháng sau |
| 29 | **Mổ xẻ 1 shop thật đang dùng KiotViet: họ thiết lập gì, bỏ sót gì** — *(cần xin phép 1 shop thật, che thông tin nhạy cảm)* | Teardown | 1 điều shop đó làm tốt nhất |
| 30 | — | | Tổng kết 30 ngày + giới thiệu chuỗi tháng sau |

> Trước khi quay: kiểm tra lại **tên menu và đường dẫn** trên phiên bản KiotViet bạn đang dùng.
> Giao diện thay đổi theo bản cập nhật, và **giá/gói dịch vụ không được ghi trong kế hoạch này**.
> Đừng nói giá nếu chưa kiểm tra trên trang chính thức.

---

## PHẦN 3 — KỊCH BẢN ĐẦY ĐỦ TUẦN 1

> **Cách chấm hook:** `hookscore.py` chấm bằng mẫu từ tiếng Anh, nên tôi chấm **bản dịch tiếng Anh
> sát nghĩa** của từng hook để đo cấu trúc (độ cụ thể, nói thẳng với người xem, rủi ro, gợi tò mò,
> độ ngắn). Mỗi video viết 5 hook, sửa 1 vòng, giữ 2 hook tốt nhất. Điểm thấp nghĩa là cần xem lại;
> điểm cao **không** đảm bảo video sẽ nhiều view.

---

### VIDEO 1 (Ngày 1) — Thuế khoán đã bỏ: 3 thiết lập KiotViet phải làm trước kỳ khai thuế

**Hook A: 68/100 WORKABLE** · The Warning
> "Thuế khoán đã bỏ từ 2026. Trước kỳ khai thuế tới, anh chị kiểm tra xem mình còn thiếu cái nào
> trong 3 thiết lập này trên KiotViet."

```
SPECIFICITY 90 | ADDRESS 66 | STAKES 62 | CURIOSITY 58 | BREVITY 100
Điểm yếu nhất: CURIOSITY
```

**Hook B: 56/100 WORKABLE** · The Direct Address
> "Nếu anh chị bán hàng trên KiotViet: thuế khoán đã bỏ, nhưng gần như chưa ai bật màn hình miễn phí này."

```
SPECIFICITY 62 | ADDRESS 76 | STAKES 36 | CURIOSITY 75 | BREVITY 100
Điểm yếu nhất: STAKES
```

**Chọn Hook A**: dùng công thức The Warning vì chủ đề có hạn chót thật (kỳ khai thuế), và con số
"3 thiết lập" tạo ra câu hỏi người xem chỉ trả lời được khi xem hết.

**Kịch bản**

**[0:00–0:15] HOOK**
[TRÊN MÀN HÌNH: chữ lớn "THUẾ KHOÁN ĐÃ BỎ — 2026", cắt nhanh sang màn hình KiotViet mục Thuế & Kế toán, khoanh đỏ 3 ô]
"Thuế khoán đã bỏ từ 2026. Trước kỳ khai thuế tới, anh chị kiểm tra xem mình còn thiếu cái nào trong 3 thiết lập này trên KiotViet. Thiết lập thứ ba là cái mình thấy nhiều shop bỏ sót nhất."

**[0:15–0:45] VÀO VIỆC**
[TRÊN MÀN HÌNH: danh sách 3 mục hiện lần lượt: 1. Bật phân hệ · 2. Khai thông tin hộ kinh doanh · 3. Rà dữ liệu bán hàng]
"Video này làm đúng một việc: đi qua 3 thiết lập để dữ liệu bán hàng trên KiotViet tự thành sổ sách và tờ khai thuế. KiotViet cho dùng phần kế toán này miễn phí, tự ra 7 loại sổ theo Thông tư 88 và tờ khai theo Thông tư 40. Mình mở tài khoản ra làm luôn."

**[0:45–2:30] THIẾT LẬP 1: Bật phân hệ Thuế & Kế toán**
[TRÊN MÀN HÌNH: quay màn hình thật, chuột di chuyển chậm, phóng to vào nút bật. Ghi chú góc màn hình: "Đường dẫn: (điền theo bản bạn đang dùng)"]
"Đầu tiên, phần này mặc định có thể chưa bật. Anh chị vào đây… bấm vào đây. Khi bật xong, anh chị sẽ thấy mục sổ sách xuất hiện ở đây. Nếu không thấy, nghĩa là tài khoản của anh chị chưa có quyền chủ cửa hàng. Nhờ người tạo tài khoản bật giúp."

**[2:30–4:30] THIẾT LẬP 2: Khai báo thông tin hộ kinh doanh**
[TRÊN MÀN HÌNH: form thông tin, che mã số thuế bằng ô mờ. Mũi tên chỉ vào ô ngành nghề]
"Thứ hai, thông tin hộ kinh doanh. Ô quan trọng nhất là ngành nghề, vì nó quyết định cách tính thuế trên tờ khai. Chọn sai ngành là tờ khai sai ngay từ đầu. Anh chị đối chiếu với giấy đăng ký kinh doanh của mình rồi chọn đúng. Nếu kinh doanh nhiều ngành, xem kỹ phần này."
[TRÊN MÀN HÌNH: chú thích "Không chắc ngành nào? Hỏi cán bộ thuế hoặc kế toán. Video này không thay tư vấn thuế."]

**[4:30–6:30] THIẾT LẬP 3: Rà dữ liệu bán hàng (cái hay bị bỏ sót)**
[TRÊN MÀN HÌNH: danh sách hóa đơn, lọc hóa đơn hủy và đơn trả hàng, khoanh đỏ]
"Đây là cái mình nói lúc đầu. Sổ sách tự động chỉ đúng khi dữ liệu bán hàng đúng. Ba chỗ hay sai: hóa đơn bán xong không hủy mà tạo đơn mới, khách trả hàng nhưng không làm phiếu trả, và bán ngoài phần mềm. Anh chị lọc ở đây… cái nào sai thì sửa trước ngày khai."

**[6:30–7:15] PAYOFF**
[TRÊN MÀN HÌNH: mở 1 sổ kế toán đã tự sinh ra, sau đó mở bản xem trước tờ khai]
"Đó là 3 thiết lập. Làm xong, đây là kết quả: sổ tự có số, tờ khai tự điền. Mình để danh sách kiểm tra 3 bước ở phần mô tả, anh chị in ra dán cạnh quầy."

**[7:15–7:30] KÊU GỌI**
[TRÊN MÀN HÌNH: thẻ video "Cài KiotViet từ con số 0 trong 15 phút"]
"Nếu shop anh chị chưa dùng KiotViet, video tiếp theo mình cài từ đầu trong 15 phút. Bấm vào đây."

**Ước tính thời lượng:** khoảng 500 từ lời đọc, tương đương 3,3 phút ở tốc độ 150 từ/phút, cộng thêm
thời gian thao tác trên màn hình, **thành phẩm khoảng 7–8 phút**.

---

### VIDEO 2 (Ngày 3) — Cài KiotViet từ con số 0 trong 15 phút

**Hook A: 58/100 WORKABLE** · The Clock
> "Sắp mở shop tháng này? Trước khi trả tiền nhờ ai cài KiotViet, đây là cách tự làm trong 15 phút."

```
SPECIFICITY 68 | ADDRESS 46 | STAKES 62 | CURIOSITY 58 | BREVITY 100
Điểm yếu nhất: ADDRESS
```

**Hook B: 56/100 WORKABLE** · The Clock
> "Mới dùng KiotViet? Anh chị bán được đơn đầu tiên trong 15 phút, nhưng chỉ khi bỏ qua bước mà ai cũng làm đầu tiên."

```
SPECIFICITY 68 | ADDRESS 100 | STAKES 36 | CURIOSITY 41 | BREVITY 100
Điểm yếu nhất: STAKES
```

**Chọn Hook A**: dùng công thức The Clock. Mốc "15 phút" là lời hứa đo được, và "trước khi trả tiền
nhờ ai" gọi đúng chi phí người xem sắp bỏ ra.

**Kịch bản**

**[0:00–0:15] HOOK**
[TRÊN MÀN HÌNH: đồng hồ đếm ngược 15:00 ở góc phải, chạy suốt video. Cảnh đầu: tài khoản trống trơn]
"Sắp mở shop tháng này? Trước khi trả tiền nhờ ai cài KiotViet, đây là cách tự làm trong 15 phút. Đồng hồ góc phải bắt đầu chạy."

**[0:15–0:40] VÀO VIỆC**
[TRÊN MÀN HÌNH: 4 chặng: Cửa hàng → Hàng hóa → Máy in → Đơn đầu tiên]
"Mình đi đúng 4 chặng: thông tin cửa hàng, hàng hóa, máy in, rồi bán đơn đầu tiên. Không cài thứ gì chưa cần ở tuần đầu."

**[0:40–3:00] CHẶNG 1: Thông tin cửa hàng**
[TRÊN MÀN HÌNH: form tên cửa hàng, địa chỉ, số điện thoại, logo in trên hóa đơn]
"Tên, địa chỉ, số điện thoại. Mấy thông tin này sẽ in lên hóa đơn của khách, nên gõ đúng chính tả. Logo để sau cũng được."

**[3:00–7:30] CHẶNG 2: Hàng hóa — nhập 1 món tay, phần còn lại bằng Excel**
[TRÊN MÀN HÌNH: tạo 1 mặt hàng thủ công (tên, giá bán, giá vốn, tồn đầu, mã vạch), sau đó tải file mẫu Excel và nhập 20 dòng]
"Mình tạo tay một món trước để anh chị hiểu từng ô. Ô giá vốn đừng bỏ trống, vì thiếu nó thì báo cáo lãi lỗ sau này sai hết. Xong rồi, phần còn lại nhập bằng file mẫu Excel. Lỗi hay gặp nhất là trùng mã hàng, mình chỉ cách kiểm tra ở đây."

**[7:30–10:00] CHẶNG 3: Máy in & mẫu hóa đơn**
[TRÊN MÀN HÌNH: chọn khổ giấy, xem trước mẫu in, sửa dòng cảm ơn cuối hóa đơn]
"Chọn đúng khổ giấy máy in của anh chị, thường là khổ nhỏ cho máy in nhiệt. Bấm xem trước. Dòng cuối mình sửa thành số Zalo của shop để khách liên hệ lại."

**[10:00–13:30] CHẶNG 4: Bán đơn đầu tiên**
[TRÊN MÀN HÌNH: màn hình bán hàng, quét/tìm hàng, chọn khách lẻ, thanh toán tiền mặt, in. Rồi mở danh sách hóa đơn và thấy tồn kho tự trừ]
"Giờ bán thật. Tìm hàng, thêm vào, thanh toán, in. Anh chị để ý: tồn kho món này vừa tự trừ đi 1. Đây là lý do mình bắt nhập tồn đầu ở chặng 2."

**[13:30–14:30] PAYOFF**
[TRÊN MÀN HÌNH: đồng hồ dừng, hiện số thời gian thực tế. Quay lại 4 chặng, tất cả có dấu tích]
"Dừng đồng hồ. Cửa hàng xong, hàng hóa xong, máy in xong, đơn đầu tiên xong. File Excel mẫu mình dùng để ở phần mô tả."

**[14:30–14:45] KÊU GỌI**
[TRÊN MÀN HÌNH: thẻ video "Kho KiotViet lệch mãi?"]
"Bán được một tuần là anh chị sẽ gặp chuyện lệch kho. Video sau mình chỉ 5 thiết lập gây ra chuyện đó."

**Ước tính thời lượng:** khoảng 480 từ lời đọc, tương đương 3,2 phút, cộng thao tác, **thành phẩm
khoảng 14–15 phút**. Bám đúng lời hứa 15 phút; nếu vượt, cắt bớt cảnh chờ tải.

---

### VIDEO 3 (Ngày 5) — Kho KiotViet lệch mãi? Không phải do nhân viên

**Hook A: 61/100 WORKABLE** · The Impossible Claim
> "Kho trên KiotViet của anh chị lệch mãi? Không phải do nhân viên. Đây là lý do, nằm trong 5 thiết lập."

```
SPECIFICITY 74 | ADDRESS 96 | STAKES 62 | CURIOSITY 41 | BREVITY 100
Điểm yếu nhất: CURIOSITY
```

**Hook B: 57/100 WORKABLE** · The Warning
> "Đừng đếm kho bằng tay nữa, cho tới khi anh chị kiểm tra 5 thiết lập này trên KiotViet."

```
Điểm yếu nhất: CURIOSITY
```

**Chọn Hook A**: phủ nhận điều người xem đang nghĩ ("do nhân viên") rồi hứa một lời giải thích cụ thể.
Để bù điểm Curiosity thấp, **đừng nói thiết lập nào gây lệch nhiều nhất cho tới phút cuối**.

**Kịch bản**

**[0:00–0:15] HOOK**
[TRÊN MÀN HÌNH: bảng tồn kho, cột "trên máy" khác cột "thực tế", số chênh nhấp nháy đỏ]
"Kho trên KiotViet của anh chị lệch mãi? Không phải do nhân viên. Đây là lý do, nằm trong 5 thiết lập. Cái thứ năm là cái mình gặp nhiều nhất."

**[0:15–0:35] VÀO VIỆC**
[TRÊN MÀN HÌNH: 5 ô úp, mở dần trong video]
"Mỗi thiết lập mình chỉ: nó gây lệch kho kiểu gì, và sửa ở đâu."

**[0:35–2:00] 1. Bán hàng khi đã hết tồn**
[TRÊN MÀN HÌNH: cài đặt cho phép bán âm kho, bật/tắt và so sánh]
"Nếu cho phép bán khi tồn bằng 0, số tồn sẽ âm và mọi lần kiểm kho sau đều lệch. Tắt ở đây, hoặc bật có kiểm soát nếu anh chị hay nhập hàng sau."

**[2:00–3:30] 2. Hàng nhiều đơn vị tính (thùng/lốc/chai)**
[TRÊN MÀN HÌNH: 1 mặt hàng có đơn vị thùng = 24 chai, demo bán lẻ 1 chai]
"Nhập theo thùng, bán theo chai, nhưng không khai quy đổi thì máy trừ cả thùng. Khai quy đổi ở đây."

**[3:30–5:00] 3. Trả hàng không làm phiếu trả**
[TRÊN MÀN HÌNH: so sánh 2 cách: hủy hóa đơn và làm phiếu trả hàng]
"Khách trả hàng, nhân viên đưa tiền lại nhưng không làm phiếu trả. Món đó nằm trên kệ, còn máy thì bảo đã bán."

**[5:00–6:30] 4. Hàng hỏng, hàng dùng nội bộ không xuất hủy**
[TRÊN MÀN HÌNH: tạo phiếu xuất hủy]
"Vỡ, hết hạn, lấy dùng trong tiệm. Không làm phiếu xuất hủy thì máy vẫn tính là còn."

**[6:30–8:00] 5. Nhập hàng không qua phiếu nhập (cái gặp nhiều nhất)**
[TRÊN MÀN HÌNH: sửa tồn kho trực tiếp và làm phiếu nhập hàng, so sánh lịch sử thẻ kho của 2 cách]
"Và đây là cái số năm. Hàng về, ai đó sửa thẳng số tồn cho nhanh, thay vì làm phiếu nhập. Số tồn thì đúng, nhưng giá vốn sai và không còn dấu vết để truy lại. Lần sau lệch, anh chị không biết lệch từ đâu."

**[8:00–8:45] PAYOFF**
[TRÊN MÀN HÌNH: 5 ô đã mở hết thành checklist, thẻ kho của 1 mặt hàng sạch sẽ từ đầu đến cuối]
"5 thiết lập: bán âm kho, đơn vị tính, phiếu trả, xuất hủy, phiếu nhập. Sửa xong, làm một lần kiểm kho để đưa số về đúng. Checklist này ở phần mô tả."

**[8:45–9:00] KÊU GỌI**
[TRÊN MÀN HÌNH: thẻ video "Kiểm kho bằng điện thoại"]
"Kiểm kho thế nào cho nhanh, 1 người làm trong 1 buổi tối, là video tuần sau."

**Ước tính thời lượng:** khoảng 470 từ lời đọc, tương đương 3,1 phút, cộng thao tác, **thành phẩm
khoảng 8–9 phút**.

---

## PHẦN 4 — VIỆC CẦN LÀM SAU 30 NGÀY

1. **Chạy nghiên cứu outlier thật (yt-viral)** trên máy của bạn, nơi YouTube không bị chặn:

```bash
pip install yt-dlp
```

```bash
yt-dlp --flat-playlist -J --playlist-end 30 "URL_KÊNH_ĐỐI_THỦ/videos" > kenh1.json
```

   Làm với 5–8 kênh cùng chủ đề (KiotViet, phần mềm bán hàng, kinh doanh nhỏ), gộp thành danh sách
   `[{"channel","title","views","url","duration"}]`, rồi chạy `python3 swipe.py collected.json --min 2.0`.
   Gửi kết quả cho tôi, tôi sẽ đối chiếu với lịch tháng 2.
2. **Dựng `voice.md`** từ 3 video đầu bạn đã đăng.
3. Trong YouTube Studio, xem **tỷ lệ người xem còn ở lại tại giây 30** của từng video. Video nào rơi
   mạnh ở đó thì viết lại hook theo đúng hướng dẫn ở dòng "Điểm yếu nhất".

---

**Ship it, or change it?** *(Duyệt để quay, hay muốn đổi gì?)*
