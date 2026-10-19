# SmartDecision DSS + AI (demo)

## Tính năng
- Quản trị sản phẩm/tồn kho, đơn hàng, khách hàng, nhà cung cấp, chi phí, báo cáo, quyết định.
- Tạo đơn hàng có chọn khách hàng cũ hoặc tạo hồ sơ khách hàng mới; chọn nhiều sản phẩm, tính tổng tự động, chụp giá bán và giá vốn từng dòng.
- Khi đơn chuyển sang Hoàn thành, trừ tồn kho; chuyển khỏi Hoàn thành, hoàn tồn kho. Đơn mẫu cũ không có chi tiết dòng hàng nên không thể tự điều chỉnh kho.
- Thống kê khách hàng cập nhật từ các đơn liên kết; dữ liệu cũ thiếu customerId không thể ghép chính xác.
- Lãi gộp chỉ được tính khi mọi đơn Hoàn thành có giá vốn từng dòng; nếu thiếu sẽ ghi rõ Chưa đủ dữ liệu.
- Supabase chỉ đọc danh mục sản phẩm ban đầu; sửa/thêm/xóa demo lưu localStorage.
- Chatbot AI thực gọi Google Gemini từ **Netlify Function**; không có API key trong mã frontend.
- AI phân tích dữ liệu tổng hợp, so sánh phương án, nêu giới hạn dữ liệu. Không gửi thông tin liên hệ khách hàng.

## Cấu hình Gemini AI miễn phí (một lần)
1. Truy cập Google AI Studio (https://aistudio.google.com/apikey), đăng nhập và tạo API key trong dự án hỗ trợ Free Tier. Kiểm tra hạn mức và điều kiện hiện hành của Google. Không bật thanh toán nếu bạn chỉ muốn dùng miễn phí.
2. Trong Netlify → Project configuration → Environment variables, thêm `GEMINI_API_KEY` (secret, KHÔNG có tiền tố VITE_). Có thể thêm `GEMINI_MODEL` nếu cần chọn mô hình hỗ trợ Free Tier; mặc định `gemini-2.5-flash`, tùy tình trạng cung cấp của Google.
3. Trigger deploy lại. Mở chatbot và hỏi ngay, không cần mã truy cập.
4. Giữ nguyên VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY.

**Lưu ý chi phí và bảo mật:** Không thể bảo đảm Free Tier luôn có sẵn hoặc không đổi hạn mức. Đảm bảo dự án Google AI Studio của bạn đang ở Free Tier và không bật billing. Netlify cũng có giới hạn miễn phí riêng. Chatbot không có mã truy cập, endpoint công khai nên người khác có thể dùng hạn mức của bạn. Có giới hạn tạm thời 5 yêu cầu/phút/IP trong một instance, KHÔNG phải bảo vệ chống lạm dụng đáng tin cậy; nếu đưa vào sử dụng thực tế cần rate limit bền vững, xác thực và giám sát quota.

## Kiểm thử
1. Kiểm tra sản phẩm, đơn hàng liên kết khách hàng và tồn kho.
2. Sau khi cấu hình GEMINI_API_KEY và deploy, mở chatbot và hỏi: “Balo còn 6 chiếc, nên nhập 4 hay 10 chiếc? Tính vốn và rủi ro.”
3. Nếu 503: thiếu khóa. Nếu 429: giới hạn sử dụng. Nếu 502: kiểm tra key, mô hình và quota.

## Giới hạn
Dữ liệu đơn hàng là demo, không có lịch sử số lượng bán theo SKU; do đó không tuyên bố có dự báo nhu cầu thống kê đáng tin cậy. Các quyết định AI chỉ hỗ trợ tham khảo.

## Kiểm chứng và hạn chế
- Chưa chạy được `npm run build` trong môi trường đóng gói này do không tải được dependencies. Sau khi đẩy GitHub, kiểm tra build Netlify trước khi dùng.
- Đây là bản demo kết nối dữ liệu sản phẩm chỉ đọc; các chức năng CRUD và quan hệ đơn hàng/khách hàng vẫn nằm trong localStorage của một trình duyệt, không phải hệ thống nhiều người dùng.
- Cần cấu hình GEMINI_API_KEY để chatbot AI hoạt động; không thể nhúng API key vào ZIP.
- Dữ liệu demo hiện có chưa đủ cho dự báo thống kê đáng tin cậy; mô phỏng là các giả định, không phải dự báo.

## Bản nâng cấp giao diện và logic (19/10/2026)
- Cải thiện kích thước chữ, tương phản, nút, bảng, modal và khung chatbot trên màn hình nhỏ.
- Đơn hàng mới yêu cầu thông tin liên hệ khách mới; chặn tạo trùng khách theo số điện thoại/email.
- Khách hàng hiển thị số đơn và chi tiêu tính từ đơn thực tế (đơn mẫu cũ được ghép theo tên khi thiếu ID, có thể trùng tên).
- Nhà cung cấp tính số sản phẩm liên kết thay vì dùng số cố định; ngăn xóa nhà cung cấp còn liên kết sản phẩm.
- Ngăn xóa sản phẩm có lịch sử dòng đơn hàng; kiểm tra giá vốn, giá bán, tồn và ngưỡng nhập là số hợp lệ.
- Phân tích tồn kho hiển thị số vốn cần để bù tới ngưỡng tối thiểu; không coi đó là số lượng đặt tối ưu.
- Mô phỏng lấy doanh thu đơn hoàn thành và giá vốn có dữ liệu, chi phí marketing từ sổ chi phí; nếu đơn mẫu thiếu giá vốn, mô phỏng chưa phải lợi nhuận đầy đủ.
- **Chưa triển khai đồng bộ ghi Supabase** vì Supabase hiện chỉ cấp quyền đọc công khai. Cần xác thực, RLS và thiết kế cơ sở dữ liệu trước khi bật ghi an toàn.
- **Chưa xác nhận build và kiểm thử giao diện trên Netlify** trong môi trường này do không cài được dependencies. Hãy kiểm tra Deploy log và chạy các tình huống nghiệp vụ trước khi nộp.

## Bản vá kiểm tra nghiệp vụ 19/10/2026
- Đơn hàng mẫu cũ: có thể đổi trạng thái, nhưng **không tự trừ/hoàn tồn kho** vì thiếu SKU và số lượng được xác thực. Đây là chủ đích bảo vệ dữ liệu, không phải liên kết kho hoàn chỉnh.
- Đơn hàng mới: tiếp tục tự kiểm tra tồn kho khi hoàn thành.
- Trạng thái đơn có màu xanh/vàng/đỏ; chọn nhà cung cấp từ danh sách đã có khi thêm/sửa sản phẩm; ngăn trùng tên nhà cung cấp.
- Micro sử dụng Web Speech API của trình duyệt (thường Chrome/Edge), cần HTTPS và quyền micro; không đảm bảo mọi trình duyệt hỗ trợ.
- Gemini: `GEMINI_API_KEY` ở Netlify, `GEMINI_MODEL` tùy chọn (mặc định `gemini-2.5-flash`). Nếu API trả lỗi 400/404, kiểm tra mô hình hiện được tài khoản hỗ trợ và deploy lại. Không có bảo đảm hạn mức miễn phí cho mọi tài khoản.
- Dữ liệu chỉnh sửa lưu localStorage theo trình duyệt; không đồng bộ giữa thiết bị. Không công khai quyền ghi Supabase nếu chưa có xác thực và chính sách RLS phù hợp.
- Cần kiểm tra thực tế sau deploy: tạo đơn, chuyển trạng thái, F5, micro, AI và trên điện thoại. Không gửi khóa API trong ảnh chụp hoặc ZIP.
