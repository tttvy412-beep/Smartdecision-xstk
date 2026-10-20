# SmartDecision v4.2 — cập nhật giao diện, chứng từ và AI (20/10/2026)

**Mã nguồn dựa trên phiên bản v4.1 đang chạy.** Không xóa localStorage; giữ `smartdecision_v3_main` để bảo toàn dữ liệu cũ trên cùng địa chỉ website và trình duyệt.

## Các vấn đề người dùng đã báo và cách xử lý

- Trả lời Gemini lộ `**`, `###`, `\frac`, `\text`, công thức Markdown/LaTeX: server được yêu cầu trả lời tiếng Việt với công thức dạng văn bản; client có trình bày tiêu đề, danh sách, chữ đậm và làm sạch cú pháp toán cơ bản khi Gemini vẫn gửi định dạng. **Chưa thử bằng API key thật.**
- Nốt nhạc tại chatbot: đổi sang icon micro SVG; giữ nhận dạng giọng nói Web Speech API khi trình duyệt hỗ trợ.
- Mục **Khác** trong nhóm chi phí: thêm tùy chọn **＋ Thêm nhóm chi phí mới**; tên nhóm mới sẽ xuất hiện trong các lần nhập sau. Danh mục cũ tên Khác (nếu có) vẫn được giữ để không tự sửa dữ liệu lịch sử.
- Ký tự **C** ở góc trên: vốn là chữ đầu tên doanh nghiệp, không có chức năng; đã bỏ. Tên doanh nghiệp vẫn ở menu và Cài đặt.
- Danh mục sản phẩm: bỏ nút **Nhập thêm** khỏi mỗi dòng; chỉ còn **Sửa**. Nhập hàng luôn đi qua Nhà cung cấp & nhập hàng.
- Nhà cung cấp và Tạo phiếu nhập: hai nút tạo chính cùng màu tím.
- Mua hàng và thanh toán công nợ: có ô chọn ảnh JPG, PNG, WebP hoặc PDF tối đa 6 MB; xem chứng từ theo từng phiếu nhập hoặc thanh toán. Chứng từ lưu trong **IndexedDB của trình duyệt**, không chuyển cho Gemini hay Netlify. Tệp sao lưu JSON đầy đủ chứa cả ảnh/PDF đã lưu. Tải ảnh lên **không chứng minh hóa đơn hợp lệ**, cần người quản lý xác minh.
- Tài chính: bổ sung **TỔNG TIỀN CHI ĐÃ GHI NHẬN**, bằng số đã trả nhà cung cấp + phí nhập kho trả bên ngoài + chi phí vận hành (giả định đã chi). Khi nhập hàng và thanh toán tiền, dòng tiền đã chi cập nhật tự động. **Không tự ghi toàn bộ tiền nhập kho là chi phí lợi nhuận:** hàng mua còn trong kho là hàng tồn; vốn của hàng bán chỉ ghi nhận khi bán.
- AI: thêm **AI phân tích tài chính** để phân tích trực tiếp từ số liệu hiện có và **Lưu phân tích thành đề xuất** sau khi người dùng xác nhận. AI không được tự ý ghi nhận thanh toán, nhập kho hoặc duyệt quyết định.

## Hướng dẫn cập nhật (chỉ copy–replace)

1. Trên website v4.1, chọn Cài đặt doanh nghiệp → **Xuất bản sao lưu JSON** để dự phòng.
2. Giải nén ZIP, mở thư mục `SmartDecision-v4` bên trong, chọn toàn bộ nội dung → Ctrl+C.
3. GitHub Desktop → Repository → Show in Explorer → Ctrl+V → Replace.
4. GitHub Desktop → Commit với tên `SmartDecision v4.2 - Cap nhat Gemini chung tu va tai chinh` → Push origin. Netlify tự triển khai; không cần đụng đến `.git` hay API key.
5. Kiểm tra: chatbot có mic, hỏi phân tích doanh thu; tạo nhóm chi phí; tạo phiếu nhập kèm chứng từ; thanh toán có chứng từ; xem tổng chi tiền ở Tài chính; bấm xem lại chứng từ.

## Kiểm tra và giới hạn

- **56/56 bài kiểm thử tự động đạt và tạo được `dist` bằng lệnh `npm run build`**. Bao gồm kiểm thử mới cho menu, nhóm chi phí, bằng chứng giao dịch, biểu tượng micro và bảng tài chính.
- **Chưa kiểm thử trình duyệt thật trong môi trường này** vì hệ thống chặn điều hướng headless Chromium; các luồng IndexedDB, đọc tệp bằng trình duyệt và micro cần bạn kiểm tra sau khi cập nhật.
- Chưa kiểm thử Gemini thật từ Netlify, do API key nằm trong môi trường bí mật của bạn; lỗi 429/503 từ phía Gemini vẫn có thể xảy ra.
- Dữ liệu và chứng từ chỉ lưu theo trình duyệt, không tự đồng bộ đa thiết bị. File JSON sao lưu có thể chứa thông tin khách hàng/chứng từ; giữ riêng tư.
- Không cung cấp tự động xác minh hóa đơn, không tự ghi bút toán thuế, và không tự thực thi đề xuất AI.

---

# Bản vá điều hướng v4.1 (20/10/2026)

**Sửa lỗi menu nhảy về đầu khi chọn mục ở phía dưới (ví dụ Theo dõi quyết định).** Giao diện bây giờ ghi nhớ vị trí cuộn thực tế của thanh menu trước khi cập nhật nội dung và phục hồi ngay sau khi cập nhật. Bỏ cơ chế khôi phục vị trí cuộn cũ theo trang vốn có thể làm nội dung chính nhảy bất thường. Bấm lại mục hiện tại không vẽ lại toàn bộ trang.

**Phạm vi:** Chỉ thay đổi cách chuyển mục và giữ vị trí cuộn, không thay đổi mô hình dữ liệu hay cách tính công nợ, kho và tài chính. Có thêm 3 bài kiểm thử điều hướng. `npm run build` đã đạt 50/50 bài kiểm thử và tạo `dist` thành công. Chưa xác minh được bằng trình duyệt tương tác trong môi trường đóng gói vì trình duyệt bị hạn chế truy cập trang local.

**Cập nhật:** Giải nén → copy **nội dung bên trong thư mục `SmartDecision-v4`** vào thư mục repository đang dùng → Replace → Commit → Push. Không xóa thư mục `.git`. Dữ liệu localStorage không bị xóa bởi bản vá này.

---

# SmartDecision v4.0 — bản tối giản, dữ liệu liên thông, DSS có quy trình

Ngày bàn giao mã nguồn: 20/10/2026.

## Trạng thái đã kiểm chứng

- `npm run build`: **thành công**. Có **47/47 bài kiểm thử tự động đạt**, gồm tính toán tài chính, nhập hàng, giá vốn, thanh toán công nợ, tạo/hủy đơn, mô phỏng, lưu quyết định và kiểm thử các sự kiện giao diện giả lập.
- Website tĩnh được tạo trong `dist/`. Không cần tải thư viện npm bên ngoài để build.
- Chưa kiểm thử thao tác bằng trình duyệt đồ họa tại môi trường này vì trình duyệt thử nghiệm chặn điều hướng; chưa xác minh lời gọi Gemini thật trên Netlify bằng API key của người dùng.
- **Giữ nguyên khóa localStorage `smartdecision_v3_main`** để đọc dữ liệu đang có của SmartDecision v3 trên cùng tên miền và trình duyệt. Nên sao lưu JSON trước khi cập nhật.
- Dữ liệu **chưa đồng bộ nhiều thiết bị**. Không bật quyền ghi Supabase công khai chỉ để đồng bộ.

## 13 mục chức năng và luồng nghiệp vụ

**Vận hành (7):** Tổng quan; Bán hàng & đơn hàng; Danh mục sản phẩm; Kho & kiểm kê; Nhà cung cấp & nhập hàng; Khách hàng; Tài chính & báo cáo.

**DSS (5):** Phân tích kinh doanh; Dự báo nhu cầu; Mô phỏng quyết định (What-if/Goal-seeking); So sánh nhà cung cấp đa tiêu chí; Theo dõi quyết định. **Hệ thống (1):** Cài đặt doanh nghiệp.

Báo cáo quản trị trùng lặp được gộp vào **Tài chính & báo cáo** và có nút Xuất CSV. Cảnh báo được dẫn từ Tổng quan vào danh sách xử lý theo nghiệp vụ, không còn mục menu riêng. Trang Kho không có chức năng tạo phiếu nhập thứ hai: nút nhập hàng dẫn đến **Nhà cung cấp & nhập hàng**, nơi quản lý chứng từ và công nợ.

### Chu trình thao tác nên kiểm tra

1. **Sản phẩm:** Thêm sản phẩm với SKU, danh mục chọn từ dữ liệu có sẵn hoặc chọn **Thêm danh mục mới**. Không nhập giá vốn thủ công ở đây; sản phẩm mới có tồn kho 0 và giá vốn 0 cho tới lần nhập đầu tiên.
2. **Nhà cung cấp & nhập hàng:** Chọn nhà cung cấp, sản phẩm, số lượng, **đơn giá mua**, phí đưa hàng về kho, phí bốc xếp và tiền đã trả. Có bảng tự tính trước giá vốn/đơn vị, giá trị nhập kho và phải trả NCC. Phiếu nhập cập nhật kho, giá vốn bình quân, giá mua gần nhất và công nợ.
3. **Thanh toán:** Thanh toán phần nợ chưa trả của phiếu. Giá vốn, tồn kho và lợi nhuận **không thay đổi lần nữa** chỉ vì thanh toán.
4. **Khách hàng & đơn hàng:** Tạo đơn bán, chọn khách và các SKU. Khi hoàn thành, ghi doanh thu, giá vốn đã chụp lúc bán và trừ tồn một lần; hủy hoàn hàng và loại đơn khỏi doanh thu.
5. **Tài chính & báo cáo:** Hiển thị **hai nhóm khác nhau**: (a) doanh thu - giá vốn đã bán - chi phí vận hành - lợi nhuận; (b) tiền nhập hàng, phí nhập kho, tiền đã trả và công nợ còn lại. **Tiền nhập hàng chưa bán không bị trừ trực tiếp vào lợi nhuận.** Xuất CSV ngay tại đây.
6. **Phân tích & dự báo:** Thống kê bán hàng, xu hướng, ngoại suy tốc độ bán nếu đủ dữ liệu. Đề xuất dự báo có nút lưu thành hồ sơ quyết định với công thức và số liệu đã dùng.
7. **Mô phỏng & xếp hạng:** Điều chỉnh giả định, lưu kết quả What-if thành hồ sơ quyết định; so sánh nhà cung cấp theo trọng số, chỉ xếp hạng đơn vị đã được người quản lý chấm điểm. Từ kết quả so sánh có đường tắt về việc nhập hàng thật.
8. **Theo dõi quyết định:** Ghi lý do, mục tiêu, người phụ trách, kết quả thực tế và tình trạng để đánh giá sau khi thực hiện; bản thân thao tác lưu quyết định không tự tạo đơn hay thay đổi kho.
9. **Cài đặt & chatbot:** Đổi tên doanh nghiệp, sao lưu/khôi phục JSON. Cửa sổ chatbot kéo bằng thanh tiêu đề (có dòng chỉ dẫn); nút mở chatbot cũng có thể kéo, và có nút đặt lại vị trí. Bỏ phần thông báo kỹ thuật Gemini dài trong Cài đặt.

### Phân biệt giá nhập và giá vốn

Ví dụ: nhập 10 chiếc, giá mua 100.000đ/chiếc, phí vận chuyển về kho 100.000đ, bốc xếp 50.000đ. Giá trị nhập kho = **1.150.000đ**, giá vốn lô mới = **115.000đ/chiếc**. Nếu còn hàng cũ, dùng bình quân gia quyền theo số lượng còn tồn và giá vốn cũ.

- **Bên vận chuyển ngoài thu phí:** Hệ thống **giả định đã trả khoản phí này ngay khi nhập**, cộng phí vào giá trị tồn kho nhưng **không tăng nợ đối với nhà cung cấp hàng hóa**.
- **Nhà cung cấp thu cả phí:** Chọn tùy chọn tương ứng, chi phí này **cộng vào số tiền phải trả nhà cung cấp**.
- Khoản phí nhập kho đã phân bổ vào giá vốn **không ghi thêm lần thứ hai vào “Chi phí vận hành”**.
- Phí giao hàng tới khách là **chi phí bán hàng**, không cộng ngược vào giá vốn nhập kho.
- Hệ thống hiện chưa có sổ công nợ **riêng cho hãng vận chuyển** hoặc sổ quỹ tiền/bank đầy đủ; nếu chi phí ngoài chưa thanh toán, đừng xác nhận là “đã trả” trong nghiệp vụ này.

## Cách cập nhật — Copy → Replace → Commit → Push

1. Vào SmartDecision v3 đang chạy bằng đúng trình duyệt đã nhập dữ liệu → **Cài đặt → Xuất bản sao lưu JSON**. Giữ file JSON để dự phòng.
2. Giải nén ZIP bản v4. Mở thư mục **`SmartDecision-v4`** bên trong.
3. GitHub Desktop → chọn repository hiện tại → **Repository → Show in Explorer**.
4. Chọn **toàn bộ nội dung bên trong** `SmartDecision-v4`, `Ctrl+C`; quay lại cửa sổ Explorer của repository, `Ctrl+V`, chọn **Replace the files in the destination**. Không xóa sạch thư mục dự án; không cần quan tâm `.git`.
5. Quay lại GitHub Desktop → ghi commit `SmartDecision v4 - sửa liên kết nghiệp vụ và DSS` → **Commit to main → Push origin**. Netlify sẽ tự build từ `netlify.toml`.
6. Mở lại website trên trình duyệt cũ, thử tạo **một sản phẩm và một phiếu nhập** rồi kiểm tra thay đổi ở Tài chính; thử Gemini bằng câu hỏi doanh thu. Không cần gửi/chia sẻ API key.

**Không thay đổi hoặc đăng công khai** `GEMINI_API_KEY`. Nếu Gemini gặp lỗi 429/503 do Google, chatbot có phân tích DSS cục bộ ghi rõ nguồn; không thể đảm bảo bên thứ ba hoạt động liên tục.

## Kiểm thử chi tiết bằng ví dụ

- Tạo 1 SKU mới và 1 danh mục mới; lần sau thêm sản phẩm, danh mục vừa tạo phải xuất hiện trong danh sách.
- Nhập 10 chiếc giá mua 100.000đ, phí nhập 150.000đ, trả NCC 400.000đ, phí do bên ngoài thu: kho +10; giá vốn 115.000đ/chiếc (nếu tồn trước đó 0); công nợ NCC +600.000đ; phần chi phí nhập được thể hiện riêng ở Tài chính.
- Trả tiếp NCC 200.000đ: công nợ phiếu còn 400.000đ; tồn kho và lợi nhuận không đổi.
- Tạo đơn bán 2 chiếc và hoàn thành: kho -2, doanh thu tăng theo giá bán, giá vốn hàng bán 230.000đ (nếu đúng giá vốn 115.000đ/chiếc). Hủy đơn: hoàn 2 và loại doanh thu/giá vốn của đơn khỏi kỳ.
- Thêm chi phí quảng cáo 50.000đ: giảm lợi nhuận sau chi phí 50.000đ khi đủ dữ liệu; không làm tăng công nợ NCC.
- Đổi trọng số xếp hạng NCC: thứ hạng đổi theo điểm do bạn nhập. Lưu kết quả và mở Theo dõi quyết định. Mô phỏng What-if cũng có nút lưu quyết định.
- Thử kéo cửa sổ trợ lý bằng thanh đầu và kéo nút nổi khi cửa sổ đóng; nút ⤢ đặt lại vị trí. Cuộn trên ô số không tự làm tăng/giảm giá trị.

## Giới hạn phải nói rõ

1. Vẫn là ứng dụng đơn người dùng, lưu dữ liệu vào `localStorage`. Muốn đồng bộ giữa các máy cần Supabase Auth, bảng giao dịch và chính sách RLS phù hợp, không thể mở quyền ghi công khai.
2. Không thể tự phục dựng chính xác giá vốn/dòng SKU của đơn lịch sử thiếu chi tiết; giao diện giữ cảnh báo thay vì bịa lợi nhuận.
3. Không phải phần mềm kế toán chuẩn đầy đủ: chưa bao gồm VAT, FIFO, kiểm soát nhập hàng nhiều dòng trên một chứng từ, công nợ đơn vị vận chuyển chưa thanh toán hoặc dòng tiền ngân hàng.
4. 47 bài kiểm thử và build thành công **không thay thế kiểm thử thực tế trên Netlify và bằng trình duyệt người dùng**. Gemini API thật và thao tác kéo thả trên thiết bị của bạn cần xác nhận sau deploy.
