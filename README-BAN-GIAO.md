# RetailMind v7 — Bản nâng cấp đa doanh nghiệp (kiểm thử trước triển khai)

**RetailMind** là nền tảng quản trị bán lẻ tích hợp DSS và Gemini AI. Phiên bản này xây dựng từ mã nguồn RetailMind v6/v5.1, không tạo lại sáu bảng dữ liệu demo của SmartDecision.

## Những phần đã viết trong mã nguồn

- Trang **Đăng nhập / Đăng ký / Quên mật khẩu**, xác minh email qua Supabase Auth; không có tài khoản mẫu giả.
- Sau khi đăng nhập, người dùng **tạo doanh nghiệp riêng** hoặc **tham gia bằng mã mời**. Mã mời tạo bởi chủ doanh nghiệp/quản trị và hết hạn sau 7 ngày.
- Trạng thái hoạt động mỗi doanh nghiệp lưu trên `public.rm_company_state` (JSONB), có mã doanh nghiệp và bộ đếm phiên bản để hạn chế ghi đè nếu dữ liệu thay đổi trên máy khác. RLS giới hạn thành viên trong cùng doanh nghiệp; sáu bảng demo cũ không bị thay đổi.
- Chứng từ và ảnh sản phẩm tải lên Supabase Storage **bucket riêng tư** `retailmind-files`, khóa đường dẫn theo mã doanh nghiệp; giới hạn ảnh JPG/PNG/WebP/PDF tối đa 6 MB (riêng ảnh sản phẩm chỉ nhận ảnh).
- Trang đăng nhập phong cách xanh lam doanh nghiệp, minh họa trừu tượng chung cho mọi loại bán lẻ; màn hình chọn doanh nghiệp; ứng dụng thích ứng với điện thoại/máy tính bảng/máy tính.
- Cài đặt giao diện: sáu bảng màu, ba mức cỡ chữ, chọn Việt/Anh, đổi tên và logo doanh nghiệp. Lựa chọn màu/chữ/ngôn ngữ được ghi nhớ trên thiết bị; tên/logo nằm trong dữ liệu doanh nghiệp.
- Sản phẩm có ảnh minh họa và tính giá vốn như bản v6; các chức năng kho, bán hàng, công nợ, báo cáo, mô phỏng DSS và Gemini được giữ lại.
- Khắc phục **trang đôi khi không cuộn**: không chặn wheel trên input số nữa, vùng menu/bảng có thể chuyển cuộn ra trang, hủy trạng thái kéo chatbot khi pointer mất capture. Giá trị trong ô số không tự tăng/giảm do lăn chuột.

## BẮT BUỘC — Chuẩn bị Supabase (chỉ làm một lần)

Bạn đã cấu hình Supabase Authentication cho Email signup + Confirm Email và URL Configuration ở địa chỉ `https://smartdecision-xstk.netlify.app/`; giữ nguyên các cài đặt này.

1. Vào Supabase → đúng project `smartdecision-xstk` → **SQL Editor** → **New query**.
2. Mở file `supabase/SETUP-RETAILMIND.sql` trong ZIP, **sao chép toàn bộ nội dung** rồi dán vào cửa sổ SQL Editor. Xem lại để xác nhận đúng dự án.
3. Bấm **Run** và kiểm tra thông báo thực thi thành công. Nếu xuất hiện lỗi, **dừng lại và gửi đúng nội dung lỗi**, không chạy các câu lệnh quyền rộng để sửa tùy tiện.
4. Table Editor sẽ có các bảng mới `rm_organizations`, `rm_memberships`, `rm_company_state`, `rm_invites`. Bảng demo `products`, `orders`, `customers`, `suppliers`, `expenses`, `decisions` được giữ nguyên.
5. SQL cũng tạo private Storage bucket `retailmind-files` và RLS theo thành viên doanh nghiệp.

**Không bao giờ tắt RLS cho bảng nghiệp vụ thật; không tạo policy “authenticated có toàn quyền” hoặc anonymous write.** Không gửi service-role key, API key bí mật, mật khẩu vào chat hay mã nguồn.

## Kiểm tra biến môi trường Netlify

Trong Netlify → Site configuration → Environment variables, cần có hai biến **công khai, không phải service-role**:

- `VITE_SUPABASE_URL`: URL dự án Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Publishable key (hoặc tên cũ `VITE_SUPABASE_ANON_KEY`)

Bạn đã từng khai báo những biến này; chỉ cần kiểm tra còn tồn tại, **không cần tạo lại API key**. `build.mjs` tạo file `dist/config.js` từ hai biến đó trong quá trình Netlify build. Chỉ URL và publishable/anon key được đưa xuống trình duyệt; `GEMINI_API_KEY` phải tiếp tục nằm ở phía server Netlify Function.

## Cập nhật bằng Copy → Replace → Commit → Push

1. Nên xuất sao lưu JSON từ website đang chạy; file sao lưu có thể chứa thông tin khách hàng, hãy lưu ở nơi riêng tư.
2. Giải nén ZIP `RetailMind-v7-...zip`, mở thư mục `RetailMind-v7` và **copy toàn bộ nội dung bên trong**.
3. Trong GitHub Desktop → **Repository → Show in Explorer** → dán → **Replace**. **Không xóa toàn bộ thư mục repository** (để `.git` được giữ nguyên mà không cần bạn mở nó).
4. Commit ví dụ: `RetailMind v7 - Dang nhap doanh nghiep va giao dien xanh`; chọn Push origin.
5. Netlify build bằng `node --test tests/*.test.mjs && node build.mjs`; sau khi site cập nhật, kiểm tra có trang Đăng nhập.

**Nên hoàn thành SQL trước khi Push v7**. Nếu chưa có SQL, người dùng có thể đăng ký nhưng không tạo/mở được doanh nghiệp.

## Kiểm thử cơ bản sau khi triển khai

1. **Tài khoản A:** Đăng ký email → xác minh email → đăng nhập → tạo Doanh nghiệp A → thêm sản phẩm.
2. **Tài khoản B:** Đăng ký email khác → tạo Doanh nghiệp B → chắc chắn **không thấy sản phẩm của A**.
3. Trong A, chủ doanh nghiệp tạo mã mời và mời tài khoản C. C đăng nhập, nhập mã và kiểm tra thấy sản phẩm A; cập nhật nhỏ rồi kiểm tra lại từ A. Khi hai người cùng sửa liên tục, có thể phát sinh cảnh báo xung đột phiên bản — cần tải lại và xử lý, không được tự ghi đè âm thầm.
4. Thử đăng nhập lại từ điện thoại/tablet và kiểm tra sản phẩm, ảnh chứng từ xuất hiện trong đúng doanh nghiệp.
5. Vào Cài đặt đổi màu, cỡ chữ, VI/EN, logo; thêm ảnh sản phẩm; xem thử các kích thước màn hình.
6. Mở sản phẩm hoặc nhập hàng, chọn ô số, lăn chuột; số không đổi và trang phải cuộn được. Cuộn menu tới cuối rồi lăn tiếp bên trong nội dung; không được bị kẹt. Kiểm tra hộp thoại và chatbot.
7. Thử quy trình nhập hàng → công nợ → thanh toán → tài chính → mô phỏng DSS → Gemini.

## Giới hạn và trạng thái kiểm tra trung thực

- **Bộ kiểm thử Node.js:** tại thời điểm đóng gói, 101 bài đã đạt; `node build.mjs` xây dựng website tĩnh thành công. Có kiểm thử mock cho Auth client, RLS cơ bản bằng kiểm tra cấu trúc SQL và kiểm tra Chromium trong chế độ xem thử, nhưng **chưa thử được đăng nhập thật trên Supabase của bạn** (SQL chưa chạy trên dự án của bạn), nên KHÔNG coi đây là chứng nhận bảo mật hoàn chỉnh.
- **Dữ liệu nhiều người:** lưu tập trung theo từng doanh nghiệp và kiểm tra phiên bản, **không phải đồng bộ realtime**. Cùng sửa một lúc có thể gặp xung đột, cần tải lại. Chủ/quản trị hiện khác nhân viên chủ yếu ở quyền mời, đổi tên doanh nghiệp; **chưa có ma trận phân quyền chi tiết đến từng thao tác nghiệp vụ**.
- **Tiếng Anh:** menu và nhiều nhãn cài đặt, biểu mẫu đã có bản dịch; một số đoạn mô tả và báo cáo chưa dịch hết. Nội dung khách hàng/sản phẩm do người dùng nhập không tự dịch.
- **Giá trị chứng từ:** ảnh/PDF là hồ sơ lưu trữ, không phải chứng nhận tiền đã vào ngân hàng. Gemini không tự động phê duyệt giao dịch.
- **Ảnh sản phẩm:** mới tải ảnh từ bộ nhớ thiết bị; chưa phải OCR/AI tự nhận diện sản phẩm.
- **Gemini:** còn phụ thuộc hạn mức và lỗi 429/503 từ Google. Không test được API key Netlify thật trong môi trường xây dựng.
- **Bảo mật:** việc cô lập tenant dựa vào RLS + quyền EXECUTE RPC/Storage; cần kiểm thử với hai tài khoản thật trước khi dùng dữ liệu nhạy cảm ngoài thực tế.
- **Trang demo** chỉ dùng dữ liệu cục bộ; các doanh nghiệp mới không tự động sử dụng dữ liệu 6 bảng SmartDecision cũ.

**Không sửa code hoặc triển khai bản cũ lên trên v7 sau khi đã đưa dữ liệu doanh nghiệp thật vào hoạt động** nếu chưa sao lưu và kiểm tra tương thích.
