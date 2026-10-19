# SmartDecision v3.0 — Phiên bản triển khai độc lập (bán lẻ MIS + DSS)

## Tình trạng bàn giao — ngày 20/10/2026

**Đây là mã nguồn mới được xây dựng lại để khắc phục giới hạn của phiên bản React cũ.** Không cần cài thư viện bên ngoài khi build hoặc chạy. Cần Node.js >= 18 để chạy bài kiểm thử/build cục bộ và Netlify Functions.

- `npm run build` đã chạy thành công trên môi trường tạo gói: **39 bài kiểm thử đạt** và thư mục `dist/` có website tĩnh.
- Có kiểm thử lõi nghiệp vụ, kiểm thử giả lập Netlify Function và kiểm thử tương tác qua các sự kiện giao diện (không dùng API key thật).
- Đã truy cập bản preview qua HTTP và nhận phản hồi 200 cho `index.html`, `src/app.mjs` và `src/core.mjs`.
- Chưa kiểm thử được một phiên sử dụng trên trình duyệt đồ họa hoặc lời gọi Gemini thật với khóa Netlify của bạn. **Không bảo đảm Gemini trả lời được khi Google trả 503/429 hoặc hạn mức miễn phí đã hết.**
- Chưa có đồng bộ dữ liệu xuyên thiết bị. Dữ liệu nghiệp vụ được lưu ở `localStorage` của từng trình duyệt để tránh nguy cơ cấp quyền ghi công khai trái phép cho Supabase.

## 15 chức năng (khác nhau về nhiệm vụ)

1. Tổng quan quản trị — KPI, biểu đồ doanh thu theo 6 tháng, cảnh báo ưu tiên.
2. Bán hàng & đơn hàng — đơn nhiều SKU, khách hàng, trạng thái, xuất kho một lần và hoàn kho khi đổi khỏi trạng thái hoàn thành.
3. Sản phẩm — SKU, phân loại, giá bán, giá vốn tham khảo, nhà cung cấp, trạng thái bán; không sửa số lượng tồn ở đây.
4. Kho hàng — mua/nhận hàng, kiểm kê, giá vốn bình quân và nhật ký nhập/xuất.
5. Nhà cung cấp & mua hàng — hồ sơ NCC, phiếu nhập, thanh toán nhiều lần, công nợ tự tính và lịch sử thanh toán.
6. Khách hàng — quản lý hồ sơ và giá trị mua từ đơn hoàn thành.
7. Chi phí & lợi nhuận — ghi/sửa/xóa chi phí, phân kỳ, báo thiếu giá vốn, tránh cộng trùng tiền mua hàng.
8. Phân tích kinh doanh — sản phẩm bán chạy, cơ cấu doanh thu, xu hướng doanh thu và chi phí.
9. Dự báo nhu cầu — run-rate theo SKU dựa trên ít nhất 3 đơn hợp lệ; không đủ dữ liệu thì từ chối suy đoán.
10. Mô phỏng phương án — What-if và Goal-seeking có công thức/giả định rõ.
11. Đánh giá nhà cung cấp — ma trận chấm điểm 1–5 và trọng số đa tiêu chí, xếp hạng và lưu thành quyết định.
12. Cảnh báo rủi ro — tồn kho ngưỡng thấp, công nợ, thiếu dữ liệu giá vốn.
13. Quản lý quyết định — căn cứ, người phụ trách, hạn, trạng thái, mục tiêu và kết quả thực tế.
14. Báo cáo quản trị — nguồn KPI và xuất CSV theo kỳ.
15. Cài đặt doanh nghiệp — đổi tên, điện thoại, email, địa chỉ, ngành, sao lưu/khôi phục và chuyển dữ liệu cũ.

Trợ lý AI Gemini là chức năng hỗ trợ ở tất cả các trang. Có proxy Netlify giữ khóa API phía server, giới hạn số lần gọi tương đối theo instance, retry một lần 503 và thử model dự phòng khi được cấp quyền. Nếu lỗi, chatbot ghi **“PHÂN TÍCH DSS CỤC BỘ (KHÔNG PHẢI GEMINI AI)”**. Micro Web Speech API chỉ hoạt động trên trình duyệt hỗ trợ và HTTPS. Cửa sổ có thể kéo thả bằng thanh tiêu đề và nhớ vị trí.

## Cách cập nhật GitHub một lần (dành cho người mới)

**Trước khi làm:** Hãy mở website cũ trên trình duyệt bạn vẫn sử dụng; trong trang Cài đặt cũ, xuất JSON sao lưu nếu có nút đó. Sau khi thay website, tên miền giữ nguyên, dữ liệu lưu trên cùng trình duyệt vẫn còn nếu không xóa dữ liệu trang web.

1. Giải nén file ZIP, mở thư mục `SmartDecision-Final`.
2. Mở GitHub Desktop → chọn repository SmartDecision → menu **Repository → Show in Explorer**.
3. Sao chép bản gốc vào một thư mục dự phòng trên máy (hoặc ghi nhớ commit hiện tại để có thể khôi phục).
4. Trong thư mục repository, **giữ nguyên thư mục `.git`** (thư mục ẩn chứa lịch sử Git). Xóa **các file/thư mục mã nguồn cũ khác**, rồi chép **toàn bộ nội dung bên trong** `SmartDecision-Final` vào **ngay thư mục gốc repository**. Không chép lồng nguyên thư mục `SmartDecision-Final` thêm một cấp.
5. Kiểm tra thư mục gốc GitHub có `index.html`, `netlify.toml`, `package.json`, `src/`, `netlify/`, `tests/`, `build.mjs`. Không đưa file `.env`, mật khẩu hoặc API key vào GitHub.
6. GitHub Desktop → Commit changes → Push origin. Netlify tự deploy một lần. `netlify.toml` quy định lệnh kiểm thử/build và thư mục publish `dist/`.
7. Trên Netlify, nếu chưa có, đặt `GEMINI_API_KEY` là biến bí mật (không nhập vào giao diện hay mã nguồn). Nếu có `GEMINI_MODEL`, ưu tiên model bạn đã được cấp quyền; Gemini vẫn có thể từ chối vì hạn mức/quá tải.
8. Mở lại website bằng **trình duyệt đang chứa dữ liệu cũ**, vào **Cài đặt doanh nghiệp → Chuyển dữ liệu từ phiên bản cũ**; chọn xác nhận. Nếu đã có tệp sao lưu kiểu `smartdecision-local-v1`, dùng **Nhập sao lưu v3 / bản cũ** để khôi phục. **Sao lưu v3 trước khi thay thế** dữ liệu nếu đã nhập mới.

Nếu Netlify không tự deploy thì vào Netlify → Deploys xem trạng thái; đừng đổi biến môi trường lung tung hoặc tạo API key mới chỉ vì lỗi 503.

## Kiểm thử thủ công sau deploy (không cần nhiều lượt deploy)

- **Kho ↔ công nợ:** Chọn nhà cung cấp, chọn đúng sản phẩm, nhập 5 sản phẩm giá nhập 100.000, trả trước 200.000. Tồn phải tăng 5 và công nợ tăng 300.000. Thanh toán thêm 100.000 → công nợ giảm 100.000, lợi nhuận không đổi.
- **Đơn hàng ↔ kho:** Tạo đơn gồm 2 SKU, trạng thái Hoàn thành → kho mỗi SKU giảm theo số lượng; chuyển sang Đã hủy → hoàn kho; đổi trạng thái không lặp phép tính.
- **Tài chính:** Thêm chi phí 100.000 → lợi nhuận sau chi phí giảm 100.000 khi có đủ giá vốn; sửa / xóa khoản chi → cập nhật lại.
- **DSS:** Vào Mô phỏng → sửa các giả định giá/nhu cầu → kết quả thay đổi; Goal-seeking → tính doanh thu cần đạt. Đổi trọng số trong Đánh giá NCC → điểm/xếp hạng cập nhật.
- **Cài đặt:** Đổi tên doanh nghiệp → tên hiển thị trên thanh bên thay đổi; tải lại trang để xác nhận vẫn lưu.
- **Chatbot:** Hỏi “Phân tích doanh thu”. Nếu Gemini trả lỗi 503, vẫn thấy phân tích DSS nội bộ được ghi rõ không phải AI.
- **Sao lưu:** Xuất JSON v3 để tránh mất dữ liệu khi xóa trình duyệt hoặc đổi máy.

## Vấn đề giới hạn chưa giải quyết hoàn toàn

1. **Đồng bộ nhiều thiết bị / nhiều tài khoản:** Phiên bản này cố ý **không tự ghi Supabase bằng anon key**. Muốn đồng bộ an toàn cần thiết kế bảng giao dịch mới, xác thực và RLS, không thể giải quyết bằng việc bật anonymous public writes. Người xem trên máy khác sẽ thấy dữ liệu mẫu ban đầu hoặc bản JSON họ nhập, không tự thấy dữ liệu người quản lý.
2. **Dữ liệu cũ thiếu dòng SKU hoặc giá vốn:** Không tự đoán giá vốn/hàng tồn. Lợi nhuận tổng hiện “chưa đủ dữ liệu” khi có đơn cũ thiếu chứng từ. Mô hình What-if/Goal-seeking không tự tạo số khi không đủ dữ liệu.
3. **Gemini API:** Có hỗ trợ xử lý 503/429 nhưng không thể bảo đảm Google cấp model/hạn mức miễn phí hoặc dịch vụ không quá tải. Retry có giới hạn; fallback DSS nội bộ không phải câu trả lời của Gemini.
4. **Nghiệp vụ kế toán nâng cao:** Chưa bao gồm thuế, chiết khấu nhiều mức, hoàn tiền, chuyển kho đa chi nhánh, tính FIFO, đối soát ngân hàng hoặc quản lý vai trò nhân sự; không tự gọi là ERP hoặc phần mềm kế toán đạt chuẩn.
5. **Kiểm thử trình duyệt thật:** Đã kiểm tra logic, UI mô phỏng qua DOM sự kiện, HTTP và build; chưa xác nhận trực quan trên tất cả các trình duyệt hoặc Netlify production.

## File cần thiết

- `index.html`, `styles.css`, `src/app.mjs`, `src/core.mjs`: mã chạy website.
- `netlify/functions/decision-ai.mjs`: Gemini API proxy ở server.
- `netlify.toml`: build / deploy Netlify.
- `build.mjs`, `package.json`: đóng gói đầu ra `dist/` không cần tải thư viện npm.
- `tests/*.test.mjs`: bộ 39 phép kiểm thử.
- `dist/`: file tĩnh đã build, Netlify sẽ tạo lại khi deploy.

Có thể kiểm thử trên máy có Node.js bằng `npm run build`, sau đó `npm run dev` và mở `http://localhost:4173`. Không cần `npm install` vì không có dependencies.
