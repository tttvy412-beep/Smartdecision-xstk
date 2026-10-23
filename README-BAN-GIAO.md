# RetailMind v9.3 — Sửa lỗi, tiếng Anh, truy cập, di động

**Việc BẮT BUỘC làm một lần trên Supabase / Netlify**
1. Supabase → SQL Editor → chạy `supabase/PATCH-MA-MOI.sql` (sửa lỗi *Tạo mã mời*: hàm `rm_create_invite` dùng `gen_random_bytes` nhưng `search_path` rỗng nên không tìm thấy hàm). Dự án mới chỉ cần chạy `SETUP-RETAILMIND.sql` bản mới.
2. Supabase → Authentication → URL Configuration: đặt **Site URL** = địa chỉ Netlify mới của bạn và thêm nó vào **Redirect URLs**. Nếu không, e-mail xác nhận vẫn trỏ về trang cũ. App đã gửi `redirect_to` đúng địa chỉ hiện tại, nhưng Supabase chỉ chấp nhận địa chỉ nằm trong danh sách này.
3. Netlify: biến `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `GEMINI_API_KEY`; deploy lại.

**Đã sửa**
- Tạo mã mời: sửa SQL + hiển thị mã, liên kết mời, nút sao chép, thông báo thân thiện nếu chưa vá SQL; người được mời mở liên kết → mã tự điền.
- Kho & kiểm kê: tiêu đề mục lớn nằm trên 3 thẻ số liệu.
- Xác nhận e-mail: về đúng site, báo thành công / liên kết hết hạn.
- Hộp thoại: bottom-sheet trên di động, khóa cuộn nền, Esc, bẫy Tab, trả focus, nhãn nút đúng ngữ cảnh.
- Tiếng Anh: từ điển đầy đủ + quy tắc cho chuỗi có số; dịch cả hộp thoại, palette Ctrl+K, placeholder, aria-label, title, ngày.
- Truy cập: skip-link, landmark `main`, focus rõ, vùng chạm lớn; di động không tràn ngang (đã kiểm 14 trang ở 390px).
- Sửa nhãn "undefined" ở đối tác thiếu loại; phiên bản 9.3.

- v9.4 (CSS): rà soát tương phản chữ WCAG AA trên cả 6 bảng màu (đã làm đậm gradient dưới chữ trắng, màu chữ phụ, trạng thái); nút/ô nhập ≥44px trên màn hình cảm ứng; đã kiểm bằng script đo tự động, không còn lỗi chữ (chỉ còn vài biểu tượng trang trí).
- Giọng nói: đã kiểm luồng micro → câu hỏi → trả lời → đọc to bằng micro/loa giả lập.

**Chưa kiểm chứng được:** Supabase và Gemini thật trên Netlify (đã kiểm bằng Supabase giả lập); tên sản phẩm/khách do người dùng nhập không được dịch (đúng thiết kế).

# RetailMind v9.2 — Bố cục mới "Phố bán lẻ sắc màu"

- **Bố cục:** bỏ menu trái; dùng thanh trên + dock điều hướng nổi, mỗi trang có masthead riêng; Tổng quan dạng bento; Sản phẩm dạng thẻ/bảng; Khách hàng dạng thẻ; Quyết định dạng kanban (chuyển trạng thái 1 chạm); tìm nhanh/ra lệnh bằng **Ctrl K**.
- **Đổi màu hoạt động:** 6 bảng màu (Cầu vồng, Tím mộng, Rừng xanh, Đại dương, Hoàng hôn, Đêm xanh) — đổi được ở Cài đặt và ngay trên trang đăng nhập; mỗi khu chức năng lấy một màu của bảng đang chọn. Cỡ chữ và ngôn ngữ vẫn đổi được.
- **Trang đăng nhập mới** (2 cột, có nút "Dùng thử với dữ liệu minh họa"), trang chọn doanh nghiệp mới.
- **Đã kiểm tra bằng trình duyệt thật:** thêm khách/NCC/sản phẩm, tạo & nhận phiếu mua, tạo đơn, thu tiền, hoàn tiền & hủy, chi tiết đơn, kiểm kê, chi phí, quyết định (kanban), mô phỏng → quyết định, dự báo, chấm điểm NCC, tìm kiếm, đổi màu/cỡ chữ/ngôn ngữ, sao lưu JSON, xuất CSV, trợ lý chat, Ctrl K. Không lỗi JavaScript. 114/114 test tự động đạt (đã cập nhật test cho bố cục mới).
- Gemini chỉ chạy được trên Netlify (hàm `decision-ai`); chạy cục bộ trợ lý tự dùng quy tắc DSS trong máy.

---
# RetailMind v9.0 — Nâng cấp hỗ trợ ra quyết định (DSS)

**Thay đổi so với v8.2 (giữ nguyên Supabase, Gemini, dữ liệu, các chức năng cũ):**
1. **Điểm sức khỏe kinh doanh (Tổng quan):** 0–100 từ các chỉ số đo được (tồn kho an toàn, chất lượng giá vốn, biên gộp, lợi nhuận sau chi phí, thu hồi công nợ, giao hàng đúng hẹn). Thiếu dữ liệu thì hiển thị “chưa đủ”, không bịa số. Mã: `src/insights.mjs`.
2. **Phân tích kinh doanh:** thêm phân loại **ABC (Pareto)** và **số ngày tồn kho còn đáp ứng** (tồn ÷ tốc độ bán 30 ngày).
3. **Sửa lỗi dự báo:** không còn hiển thị “xu hướng giảm/tăng” khi dữ liệu chưa đủ; sửa dấu chấm kép trong phần giải thích.
4. **Sửa lỗi hiển thị:** ảnh sản phẩm lỗi có ảnh minh họa dự phòng (không còn chữ alt tràn khung); bảng trong khung 2 cột không còn bị cắt cột; thêm favicon; `serve.mjs` phục vụ đúng SVG khi chạy thử cục bộ.
5. **Giao diện mới “Sắc màu chợ phố” (`styles-v9.css`):** sidebar tím đêm với từng mục một màu, banner hero gradient nhiều màu, thẻ số liệu khối màu đặc, mỗi trang nghiệp vụ có một gam màu riêng (đơn hàng hồng, sản phẩm vàng, kho xanh lơ, tài chính xanh lá, phân tích tím…), nút/pill dạng gradient, font Be Vietnam Pro. Logic màu: màu trang = khu chức năng; xanh lá = tốt, cam = cần theo dõi, đỏ = rủi ro. Có thể đổi màu chủ đạo trong Cài đặt như cũ.
6. Thêm 4 bài kiểm thử (`tests/v9-insights.test.mjs`): tổng 114/114 đạt; `npm run build` thành công.

Triển khai: copy → replace như hướng dẫn bên dưới; không cần chạy lại SQL, không đổi biến môi trường Netlify.

---
# RetailMind v8.2 — Bản tổng hợp sửa giao diện và giao dịch

**Bản mã nguồn có thể build, có kiểm thử tự động và kiểm thử thao tác Chromium ở môi trường giả lập.** Việc Published thành công tại Netlify của bạn, Gemini thật, xác thực Supabase và truy cập ảnh chứng từ Cloud cần người dùng xác nhận sau khi triển khai. Không nên dùng dữ liệu thật cho tới khi kiểm thử phân quyền và sao lưu.

## 1. Các yêu cầu đã triển khai trong v8.2

1. **Không còn chỉ tô màu Tổng quan:** mỗi trang nghiệp vụ có gam màu, header dạng bento riêng, các nút chuyển tiếp giữa những màn hình liên quan và màu nhóm chức năng. Loại bỏ banner ngang giống nhau trên các trang bên trong. Tài chính dùng bố cục ghép mảng thay vì 4 ô đều nhau. Bố cục thử tại 1420px và 390px, không tràn ngang.
2. **Logo:** biểu tượng nền tảng RetailMind cố định cạnh chữ RetailMind; ảnh logo của doanh nghiệp chỉ hiển thị trong ô **DOANH NGHIỆP** ở menu. Cài đặt vẫn có tải/xóa logo.
3. **Tiền Việt Nam:** các trường nhập có bản chất là tiền dùng dữ liệu số nguyên VND và định dạng dấu chấm ngay khi gõ. Đã thử `50000000` → `50.000.000` *trước khi Enter*, và số thu tiền `150000` → `150.000`. Không nhầm với số lượng hoặc phần trăm.
4. **Cảnh báo mua hàng:** khi mở **Nhà cung cấp & nhập hàng → Tạo phiếu mua**, các SKU có tồn bằng hoặc thấp hơn ngưỡng được nhắc ngay trong biểu mẫu. Bấm một sản phẩm để điền tên và lượng bổ sung tối thiểu; người dùng vẫn cần xác nhận lượng nhập và kiểm tra đơn đang giao.
5. **Đơn hàng & chứng từ:** nút **Chi tiết & ảnh** tại từng đơn mở một hồ sơ riêng gồm số tiền đã thu, hoàn tiền, còn phải thu, từng lần thanh toán, từng lần hoàn tiền và vị trí ảnh/PDF tương ứng. Có nút xem và bổ sung chứng từ **không ghi thêm tiền**, kể cả cho giao dịch cũ.
6. **Đã hủy:** đơn hủy không hiển thị thao tác thu tiền; chi tiết đơn cũ vẫn truy cập được để kiểm tra chứng từ đã thu/đã hoàn. Thao tác hoàn tiền hợp lệ vẫn theo nguyên tắc của lõi dữ liệu: số tiền đã thu phải được hoàn đủ trước khi hủy đơn, không để tồn kho/doanh thu mâu thuẫn.
7. **Trợ lý giọng nói:** bật chế độ nghe từ nút **Gọi RetailMind** (cần bấm để cấp quyền micro); khi trang đang mở, nói "RetailMind" / "Hey RetailMind" / "Xin chào RetailMind" để mở và hỏi. Có đọc phản hồi bằng `speechSynthesis` khi đã bật. **Không phải Siri cấp hệ điều hành:** trình duyệt cần hỗ trợ `SpeechRecognition`, HTTPS, và trang phải đang hoạt động; không nghe khi đóng web / chạy nền. Micro mặc định tắt.
8. **Hình minh họa:** thêm 8 ảnh vector SVG cho các nhóm sản phẩm (thời trang, điện tử, gia dụng, thực phẩm, đồ uống, văn phòng, mỹ phẩm và khác). Ảnh sản phẩm do người dùng tải luôn ưu tiên hơn hình minh họa.
9. **Bảo vệ doanh nghiệp:** khi đăng nhập, chứng từ không được đọc nhầm từ IndexedDB của chế độ demo cục bộ; chỉ sử dụng đúng Storage của doanh nghiệp. Giữ nguyên cơ chế Supabase Auth/RLS và 6 bảng demo cũ.

## 2. Những việc vẫn có giới hạn

- **Không đảm bảo trợ lý đánh thức bằng tên** hoạt động trên mọi trình duyệt/điện thoại. Web Speech API phụ thuộc trình duyệt, quyền micro, hỗ trợ tiếng Việt và trạng thái tab. Không ghi âm liên tục mặc định, không điều khiển thiết bị như Siri thật.
- **Ảnh chuyển khoản không xác minh đã thanh toán thành công**; phần mềm chỉ lưu chứng từ và giao dịch do người dùng xác nhận.
- Giao diện VI/EN ở các màn hình nghiệp vụ sâu **chưa dịch hoàn toàn**; cần hoàn thiện nếu sử dụng tiếng Anh toàn phần.
- Đăng nhập Supabase thật, chứng từ tải lên Supabase Storage, AI Gemini bằng API key thật, và hai người ghi dữ liệu **đồng thời** chưa được kiểm thử trực tiếp ở website của bạn. Hiện mô hình dữ liệu doanh nghiệp dùng JSON theo phiên bản, không phải database giao dịch chi tiết mọi nghiệp vụ.
- Chưa bổ sung chức năng **hoàn tiền từng phần**; lõi đang hỗ trợ hoàn đủ để hủy đơn. Đổi màu/cỡ chữ/ngôn ngữ là tùy chọn theo thiết bị; logo và dữ liệu kinh doanh lưu theo doanh nghiệp.
- Bản sao lưu JSON của doanh nghiệp bao gồm **metadata tham chiếu chứng từ cloud**, không tự tải toàn bộ tệp từ Storage về trong JSON. Chứng từ được giữ trên Supabase Storage với quyền truy cập riêng.

## 3. Kiểm thử hoàn thành trong môi trường làm việc

- `npm test`: **110/110 bài tự động đạt**.
- `npm run build`: thành công, tạo thư mục `dist/`, không cần tải npm phụ thuộc ngoài.
- Chromium tương tác thực tế ở 1420px: nhập số tiền ngay khi gõ, hiển thị nhắc mua hàng thiếu, vào chi tiết đơn, ghi nhận 150.000đ, hoàn 150.000đ, đơn chuyển đã hủy, không còn nút thu; duyệt 11 trang chức năng không lỗi JavaScript và không tràn ngang.
- Chromium 390px: kiểm tra tổng quan mobile, không lỗi JavaScript hoặc tràn ngang.
- Kiểm thử trên web thật và bản ghi chứng từ Supabase Storage chưa được thực hiện.

## 4. Cập nhật đúng một lần, theo cách Copy → Replace

1. Sao lưu dữ liệu hiện tại của doanh nghiệp nếu có dữ liệu cần giữ: **Cài đặt → Xuất sao lưu JSON**. Bản xuất này không tự tải ảnh cloud về — các ảnh vẫn ở Supabase Storage.
2. Giải nén file `RetailMind-v8.2-GiaoDien-NghiepVu-GiongNoi.zip`.
3. Mở thư mục **RetailMind-v8.2** và copy **mọi file bên trong**.
4. GitHub Desktop → **Repository → Show in Explorer** → dán **Replace** vào thư mục repository hiện có (không xóa sạch repository trước khi dán).
5. GitHub Desktop → nhập Commit `RetailMind v8.2 - Giao dien da sac va chung tu giao dich` → **Commit to main → Push origin**.
6. Netlify dự án `retailmind-xstk` tự build/publish. Xem trạng thái **Published**; nếu Failed, xem log. Không bấm Retry liên tục.

**Không cần chạy lại SQL** `SETUP-RETAILMIND.sql` nếu bốn bảng `rm_*` đã có RLS như trước. Giữ các biến `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `GEMINI_API_KEY` (server-only). **Không gửi API key bí mật cho bất kỳ ai**, không bật public write cho bảng dữ liệu.

## 5. Kiểm tra 5 việc sau khi Published

1. Trên **Sản phẩm → Sửa** và **Mua hàng → Tạo phiếu**, gõ `50000000`, phải thấy `50.000.000` ngay khi gõ, chưa Enter.
2. Vào **Mua hàng → Tạo phiếu**, kiểm tra phần "Cần ưu tiên nhập bổ sung" và bấm nhanh sản phẩm thiếu.
3. Vào **Bán hàng → Đơn hàng → Chi tiết & ảnh**, thử thanh toán kèm ảnh, mở lại hồ sơ, xem ảnh; thử hoàn tiền với ảnh riêng và kiểm tra không còn nút thu ở đơn hủy.
4. Đổi logo doanh nghiệp, kiểm tra ảnh **chỉ đổi ở thẻ DOANH NGHIỆP**, không đổi biểu tượng RetailMind phía trên; xem giao diện Finance, Kho và DSS có màu bố cục riêng; thử trên điện thoại.
5. Bấm **Gọi RetailMind**, cấp quyền micro nếu trình duyệt hỗ trợ, nói "RetailMind, phân tích hàng tồn" rồi kiểm tra hiển thị và đọc câu trả lời. Nếu trình duyệt không hỗ trợ nhận dạng tiếng Việt, dùng nút micro trong khung chat hoặc nhập chữ như bình thường.

---
Đây là bản nâng cấp nhằm giải quyết các lỗi mới nhất bạn đã báo; không tuyên bố đã kiểm thử xong mọi cấu hình Supabase/Netlify hay mọi đường đi nghiệp vụ trên thiết bị thật.
