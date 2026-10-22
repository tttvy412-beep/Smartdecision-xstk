# RetailMind v8.1 — Sửa lỗi Netlify build thất bại

**Đây là bản v8 với bản vá build Netlify; không thay đổi dữ liệu Supabase hay luồng nghiệp vụ.**

## Đã xác định nguyên nhân

Phiên bản v8 cũ chạy `node --test tests/*.test.mjs` **ngay trong bước Netlify Production build**. Khi Netlify có `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY`, Netlify Function Gemini bật xác thực Supabase; các bài kiểm thử giả lập vốn không có token nhận HTTP `401` và báo fail, chặn deploy. Trên môi trường không có biến Supabase, toàn bộ test vẫn pass nên lỗi chỉ xuất hiện khi deploy thật.

Sửa ở v8.1:
- Netlify chạy `npm run build`, việc build chỉ thực hiện `node build.mjs`, không chạy bài kiểm thử giả lập bằng biến môi trường production.
- `npm test` được giữ riêng; các bài kiểm thử Gemini giả lập được cô lập khỏi cấu hình production nên có thể chạy ổn khi Netlify có Supabase Auth.
- Thêm `.nvmrc` để yêu cầu Node 22 và loại bỏ khoảng trắng thừa ở biến URL/key khi build.
- Không thay đổi 6 bảng demo, 4 bảng `rm_*`, chính sách RLS, tài khoản, Gemini key.

## Cách cập nhật

1. Giải nén ZIP **RetailMind-v8.1-Fix-Netlify.zip**.
2. Mở thư mục **RetailMind-v8.1-Fix-Netlify** bên trong, copy toàn bộ nội dung.
3. GitHub Desktop → Repository → Show in Explorer → dán **Replace**, KHÔNG xóa hết thư mục repo.
4. Commit: `RetailMind v8.1 - Sua loi build Netlify` → **Push origin** để Netlify tự deploy. Không cần bấm Retry ở bản đã Failed.
5. Khi hiện `Published`, đăng nhập và kiểm thử website. Nếu phát sinh lỗi mới, báo lại cùng ảnh.

Đã kiểm thử bằng Node 22: test chạy trong môi trường giả lập Netlify Production có đủ biến Supabase và `GEMINI_API_KEY`, sau đó build tạo `dist/`. **Chưa xác nhận bản v8.1 Published trên Netlify của người dùng**.

---

# RetailMind v8 — Giao diện trung tâm điều hành & sửa lỗi tổng hợp

> Phiên bản mã nguồn có thể build và kiểm thử trong môi trường phát triển, **chưa phải chứng nhận đã chạy ổn trên Supabase/Netlify thật của người dùng**.

## 1. Những thay đổi đã lập trình

**Giao diện mới có bản sắc**
- Thiết kế lại **Đăng nhập / Đăng ký / Quên mật khẩu** thành hai khu vực: nội dung minh họa doanh nghiệp đa ngành màu xanh và biểu mẫu xác thực rõ ràng; không dùng hình quần áo, không có nút Google/Microsoft giả khi chưa cấu hình OAuth.
- Trang **Tổng quan** được thay thành trung tâm điều hành kiểu bento: biểu ngữ điều hành, 4 KPI mang màu sắc riêng, bản đồ việc cần xử lý, trợ lý AI, quyết định chờ xử lý, biểu đồ doanh thu thực, sản phẩm bán chạy, thao tác nhanh.
- **Logo doanh nghiệp nằm trong ô doanh nghiệp ở menu**, thay biểu tượng ngôi nhà, giới hạn kích thước để ảnh không tràn. Vẫn giữ logo RetailMind cho nền tảng.
- Giao diện tương thích máy tính, máy tính bảng, điện thoại theo quy tắc responsive; nút trợ lý AI thu gọn hình vuông để không che nút thao tác. Có thể kéo thanh tiêu đề trợ lý, đổi vị trí.
- Màu sắc của menu và màn hình điều hành sử dụng biến theme cài đặt; người dùng vẫn chọn 6 màu, 3 kích thước chữ, tiếng Việt hoặc tiếng Anh; có thêm bản dịch cho các nhãn chính mới (chưa dịch toàn bộ nội dung nghiệp vụ dài).

**Độ tin cậy nghiệp vụ**
- Sửa thao tác nhập tiền bằng **xử lý thay đổi tại `beforeinput` theo chữ số**, tránh hiện tượng lặp chữ số khi vừa gõ vừa tự chèn dấu chấm; giữ vị trí con trỏ, xóa qua dấu ngăn cách và xử lý dán số. Số `50000000` phải hiện **50.000.000**; dữ liệu tính theo VND nguyên.
- Nâng cấp **Dự báo nhu cầu**: đọc lượng bán của sản phẩm theo ba kỳ 30 ngày, so sánh xu hướng và đánh giá đủ dữ liệu; chỉ tính lượng cần cân nhắc nhập khi có đủ lịch sử theo nhiều kỳ. Giữ mô hình thống kê có thể kiểm tra, không tự nói Gemini tạo dự báo đáng tin khi mẫu quá ít.
- Bổ sung thao tác yêu cầu Gemini giải thích xu hướng và so sánh các tình huống; gửi thêm tóm tắt mô hình có nguồn từ doanh nghiệp hiện tại. Lưu phương án dự báo vào Theo dõi quyết định khi đủ dữ liệu.
- **Ngăn hiển thị hội thoại Gemini từ doanh nghiệp A trong doanh nghiệp B** khi chuyển không gian hoặc đăng xuất; bỏ phản hồi bất đồng bộ từ không gian cũ.
- Netlify Function Gemini **yêu cầu xác thực Supabase** khi dự án có cấu hình Supabase; xác minh Bearer token qua `/auth/v1/user`, giới hạn số lần gọi theo tài khoản. Nếu môi trường Production thiếu cấu hình xác thực, từ chối gọi Gemini để bảo vệ hạn mức API. Khóa Gemini luôn ở server.
- Giữ các nghiệp vụ cũ: hình ảnh sản phẩm, kho, mua hàng nhiều đợt, kiểm nhận, công nợ và chứng từ, khách hàng, tài chính, mô phỏng, so sánh nhà cung cấp, quyết định và quản lý doanh nghiệp.

**Sửa lỗi cuộn được kế thừa từ v7.2**: không ngăn sự kiện wheel trên ô nhập tiền; với input số kiểu quantity sẽ blur thay vì chặn cuộn; menu và bảng có vùng cuộn riêng; chấm dứt trạng thái kéo chatbot khi mất pointer.

## 2. Kết quả kiểm tra tại thời điểm đóng gói

- `npm test` (Node test runner): **110/110 bài đạt**. Bộ kiểm tra bao gồm nghiệp vụ cũ, auth client giả lập, xử lý tiền `50000000`, dự báo dữ liệu ít/nhiều kỳ, và xác thực proxy Gemini giả lập.
- `node build.mjs`: build `dist/` thành công, **không cần npm install**. Không ghi service_role hay Gemini key vào file được trình duyệt tải.
- Kiểm tra giao diện **tĩnh** bằng Chromium với ảnh chụp màn hình ở 390 / 820 / 1440px, không có tràn ngang. Hạn chế môi trường: trình duyệt chặn điều hướng tới máy chủ test nên **không chạy được luồng đăng nhập/nhập tiền end-to-end bằng trang thực**; các thao tác trên đã kiểm thử bằng Node, ảnh chụp phản ánh giao diện dựng từ mã nguồn.

## 3. Cập nhật qua GitHub Desktop

1. Nếu đang có dữ liệu thật, vào Cài đặt → Xuất bản sao lưu JSON trước. Dữ liệu nằm trong Supabase theo doanh nghiệp nhưng bản sao lưu riêng vẫn có ích.
2. Giải nén ZIP; mở **thư mục RetailMind-v8**, sao chép **toàn bộ file/thư mục bên trong** (không sao chép thư mục cha).
3. GitHub Desktop → **Repository → Show in Explorer**, dán → **Replace files**. Không xóa thư mục dự án trước khi dán (giữ `.git`).
4. Commit: `RetailMind v8 - Giao dien dieu hanh va sua loi tong hop` → **Push origin**. Netlify tự deploy từ GitHub.
5. Bảo đảm Netlify **đúng project `retailmind-xstk`** có `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` và server-only `GEMINI_API_KEY` nếu dùng Gemini. Không gửi key cho người khác. Build bắt buộc có hai biến Supabase để login hoạt động.
6. **Supabase Auth → URL Configuration**: vì website bạn hiện dùng `https://retailmind-xstk.netlify.app/`, hãy thêm URL này làm **Site URL** và `https://retailmind-xstk.netlify.app/**` trong Redirect URLs (nếu chưa có), để xác minh email/quên mật khẩu không điều hướng về website SmartDecision cũ. Không cần chạy lại SQL `SETUP-RETAILMIND.sql` nếu bốn bảng `rm_*` và RLS đã tạo trước đây.

## 4. Thử ngay sau deploy

1. Đăng ký bằng email hợp lệ và xác minh; đăng nhập rồi chọn/tạo doanh nghiệp. Dùng 2 tài khoản thuộc 2 doanh nghiệp để xác nhận riêng dữ liệu; không dùng dữ liệu bí mật trước khi xác nhận.
2. Ở Tổng quan, các thẻ phải đúng số liệu; bấm vấn đề thiếu kho thì chuyển sang Kho. Menu giữ cuộn, mobile không tràn ngang.
3. Vào Sản phẩm → Thêm sản phẩm, nhập giá `50000000`; phải hiện `50.000.000`. Thử xóa, đặt con trỏ giữa số, bấm Backspace, dán `5.000.000` và cuộn chuột.
4. Dự báo sản phẩm ít dữ liệu phải ghi **chưa đủ để dự báo**; với nhiều đơn ở nhiều tháng mới có kết quả tham khảo và hướng dẫn độ tin cậy. Bấm AI phân tích, kiểm tra không cắt nội dung và giữ dữ liệu đúng doanh nghiệp.
5. Chuyển doanh nghiệp, mở AI; hội thoại từ doanh nghiệp trước không được xuất hiện.
6. Thử nhập kho → thanh toán từng lần/đính kèm hóa đơn → xem công nợ → tài chính → quyết định. Thử màu giao diện, cỡ chữ và Việt/Anh.

## 5. Những giới hạn chưa thể tuyên bố là hoàn thành

- Chưa được kiểm thử trực tiếp trên Netlify thật, Gemini key thật, Supabase Auth/Storage và kết nối từ hai thiết bị thật. Hãy dùng dữ liệu demo khi xác minh.
- Chế độ VI/EN dịch menu và nhiều giao diện nhưng **chưa bao phủ 100% thông báo và mọi nội dung dài**; nội dung sản phẩm/khách hàng nhập vào không tự dịch.
- Phiên bản này tiếp tục dùng **một tài liệu JSON theo doanh nghiệp với kiểm tra version**, chưa phải hệ thống giao dịch đa bảng có đồng bộ realtime/khóa giao dịch; hai thành viên sửa cùng lúc có thể cần tải lại và xử lý xung đột.
- Vai trò `member` hiện có thể sửa đa số dữ liệu nghiệp vụ trong doanh nghiệp; chưa có ma trận phân quyền sâu như chỉ kế toán mới ghi được thu/chi. Cần thiết kế thêm nếu đưa vào vận hành thật.
- Ảnh chuyển khoản/chứng từ không xác thực được ngân hàng đã nhận tiền; người quản lý phải đối chiếu.
- Gemini chỉ hỗ trợ phân tích; kết quả không thay thế chuyên môn quản trị và có thể gặp 429/503.

**Quan trọng:** Sáu bảng SmartDecision demo cũ không bị thay đổi bởi v8. Không bật anonymous writes hoặc tắt RLS để sửa lỗi đăng nhập.
