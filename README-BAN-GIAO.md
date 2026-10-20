# RetailMind v6 — Hệ thống quản lý bán lẻ tích hợp DSS và AI

**Ngày cập nhật:** 20/10/2026.  **Công nghệ:** HTML/CSS/JavaScript tĩnh, Netlify Functions.  **Không cần cài thêm thư viện npm** để build.

## Điểm thay đổi trong v6

- **Đổi nhận diện thành RetailMind** (tiêu đề trình duyệt, tên ứng dụng, giao diện trợ lý, hướng dẫn và báo cáo mới). Giữ nguyên những khóa dữ liệu cũ có chủ ý để bảo toàn dữ liệu đã nhập trên **cùng tên miền/cùng trình duyệt**.
- **Định dạng số tiền ngay khi gõ**: `1` → `10` → `100` → `1.000` → `10.000` → `100.000` → `1.000.000`. Áp dụng cho giá bán, giá mua, phí giao hàng, vận chuyển, bốc xếp, tiền thanh toán, khoản chi và mục tiêu lợi nhuận. Dấu chấm chỉ dùng để dễ đọc, không phải phần thập phân; phép tính và dữ liệu lưu là số nguyên VNĐ. Có xử lý vị trí con trỏ khi sửa giữa chuỗi và khi dán số.
- **Danh mục sản phẩm** hiển thị giá vốn bình quân (từ nhập kho), gợi ý biên lợi nhuận gộp khi thử giá bán; phiếu nhập vẫn là nơi ghi giá mua và chi phí đưa hàng về kho.
- **Tài chính & báo cáo** bổ sung phần dòng tiền khách hàng (thực thu và phải thu) tách biệt khỏi doanh thu, cùng chi tiền nhập hàng tách khỏi chi phí tính lợi nhuận.
- **DSS** thêm bảng phân tích độ nhạy với các kịch bản giá bán, số lượng, giá vốn và chi phí bất lợi; kết quả chỉ được tính khi giá vốn có đủ dữ liệu xác minh. Giữ các mô hình dự báo nhu cầu, What-if, Goal-seeking, so sánh nhà cung cấp và theo dõi quyết định.
- Giữ các cải tiến v5.1: đối tác vận chuyển tạo nhanh, chứng từ đơn hàng cũ, thu tiền nhiều lần, trả công nợ từng đợt, kiểm nhận hàng giao thiếu/hỏng, nhật ký kho, kéo trợ lý, hạn chế cuộn trang ngoài trong hộp thoại.

## Cách cập nhật với GitHub Desktop

1. Nên xuất sao lưu JSON từ trang Cài đặt trên website hiện tại nếu đã nhập dữ liệu thực. File sao lưu có thể chứa thông tin khách hàng và chứng từ, hãy giữ riêng tư.
2. Giải nén ZIP **RetailMind-v6**. Vào thư mục `RetailMind-v6`, **chọn toàn bộ nội dung bên trong**, sao chép.
3. Trong GitHub Desktop chọn **Repository → Show in Explorer** rồi dán vào thư mục repository, chọn **Replace the files in the destination**. **Không xóa cả thư mục repository trước khi dán**; `.git` cần được giữ nhưng bạn không cần thao tác gì với nó.
4. GitHub Desktop → Commit `RetailMind v6 - Dinh dang tien va hoan thien DSS` → Push origin.
5. Chờ Netlify tự deploy. Trong website kiểm tra 5 thao tác ở mục tiếp theo.

Nếu repository còn các tệp không trùng tên từ bản cũ, copy–replace sẽ không tự xóa chúng. Với `netlify.toml` hiện tại, Netlify build bằng `node --test tests/*.test.mjs && node build.mjs` và xuất từ `dist/`.

## Kiểm tra sau triển khai

1. **Sản phẩm → Thêm sản phẩm:** tại ô giá bán, gõ liên tục `100000` → nhìn thấy `100.000`. Thử đặt con trỏ vào giữa và xóa một chữ số, rồi lưu sản phẩm.
2. **Nhà cung cấp & nhập hàng:** tạo phiếu mua; thử điền giá nhập `85000` → `85.000`, vận chuyển `120000` → `120.000`. Hệ thống phải xử lý giá vốn/giá trị phiếu theo số nguyên tương ứng.
3. **Thanh toán công nợ:** gõ số tiền `200000` → `200.000`, kiểm tra công nợ giảm 200.000 khi ghi nhận một giao dịch thanh toán hợp lệ. Có thể đính kèm ảnh/PDF.
4. **Bán hàng → Thu tiền:** ghi thu một phần, xem còn phải thu và biên lai, có thể bổ sung chứng từ cho khoản cũ mà không thu tiền thêm.
5. **Mô phỏng quyết định:** phần Phân tích độ nhạy không đưa ra kết quả tài chính giả khi thiếu giá vốn; mở báo cáo xác nhận tách dòng tiền và lợi nhuận.

## Quy tắc tài chính quan trọng

- **Giá mua hàng** khác **giá vốn nhập kho**: phí thực tế cần thiết để đưa hàng về kho được phân bổ cho hàng nhận hợp lệ. Giao hàng cho khách thường là chi phí bán hàng, không cộng vào vốn nhập kho.
- **Tiền thực chi khi nhập hàng** được ghi ở dòng tiền mua hàng/chi trả, nhưng không tự trừ toàn bộ vào lợi nhuận trước khi hàng bán (tránh ghi trùng giá vốn).
- **Đơn hoàn thành** khác **đơn đã thanh toán**. Đơn cũ không có SKU hay giá vốn hợp lệ được đánh dấu thiếu dữ liệu; không tự tạo bút toán kho giả.
- Ảnh/PDF chứng từ được đính kèm để tra cứu, **không có nghĩa AI hay hệ thống ngân hàng đã xác minh giao dịch**.

## Kết quả và giới hạn kiểm thử

- **96/96** bài kiểm thử Node.js đạt (logic nghiệp vụ, trường hợp v5/v5.1, định dạng số tiền và vị trí con trỏ).
- Đã tạo lại build website tĩnh; thử trực tiếp với Chromium bằng cách nạp mã JS và CSS tại một trang kiểm thử: nhập/xóa giá bán và điền giá, phí ở phiếu mua đều ra dấu chấm đúng; không có lỗi JavaScript trong các thao tác đã thử.
- Do môi trường chặn điều hướng Chromium tới máy chủ thử nghiệm, **chưa kiểm thử đầy đủ một phiên giao dịch trên Netlify thật**. Cần kiểm tra lại nhập chứng từ và Gemini trên miền website của bạn. Gemini đôi lúc vẫn bị dịch vụ bên ngoài trả 429/503.
- **Dữ liệu + ảnh chứng từ vẫn lưu trên trình duyệt** (localStorage/IndexedDB). Chưa có đăng nhập/Supabase RLS cho nhiều thiết bị. Không bật ghi ẩn danh công khai vào cơ sở dữ liệu. Chuyển domain sang tên mới sẽ không tự di chuyển dữ liệu cục bộ.
- Website **chưa phải phần mềm kế toán đầy đủ**: chưa có đối soát ngân hàng tự động, thuế kế toán chuyên sâu, trả hàng nhiều lô hoặc nhận bổ sung nhiều đợt cho cùng phiếu mua. Các mô hình DSS có giả định, không bảo đảm dự báo đúng tương lai.

**Không gửi khóa Gemini/Supabase vào chat hoặc ghi vào mã nguồn.** Giữ cấu hình Netlify ở phía server như trước.
