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
