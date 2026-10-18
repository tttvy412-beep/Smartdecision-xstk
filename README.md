# SmartDecision DSS + AI (demo)

## Tính năng
- Quản trị sản phẩm/tồn kho, đơn hàng, khách hàng, nhà cung cấp, chi phí, báo cáo, quyết định.
- Tạo đơn hàng có chọn khách hàng cũ hoặc tạo hồ sơ khách hàng mới; chọn nhiều sản phẩm, tính tổng tự động, chụp giá bán và giá vốn từng dòng.
- Khi đơn chuyển sang Hoàn thành, trừ tồn kho; chuyển khỏi Hoàn thành, hoàn tồn kho. Đơn mẫu cũ không có chi tiết dòng hàng nên không thể tự điều chỉnh kho.
- Thống kê khách hàng cập nhật từ các đơn liên kết; dữ liệu cũ thiếu customerId không thể ghép chính xác.
- Lãi gộp chỉ được tính khi mọi đơn Hoàn thành có giá vốn từng dòng; nếu thiếu sẽ ghi rõ Chưa đủ dữ liệu.
- Supabase chỉ đọc danh mục sản phẩm ban đầu; sửa/thêm/xóa demo lưu localStorage.
- Chatbot AI thực gọi OpenAI từ **Netlify Function**; không có API key trong mã frontend.
- AI phân tích dữ liệu tổng hợp, so sánh phương án, nêu giới hạn dữ liệu. Không gửi thông tin liên hệ khách hàng.

## Cài đặt Netlify (dùng site hiện tại)
Giữ nguyên VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY đang hoạt động.
Thêm các **Environment variables** tại Netlify > Project configuration > Environment variables:

- `OPENAI_API_KEY`: khóa API OpenAI của bạn, loại secret; KHÔNG dùng `VITE_` và không đưa lên GitHub.
- `AI_DEMO_ACCESS_CODE`: một mã riêng dài ít nhất 8 ký tự do bạn đặt; nhập mã này vào ô trong chatbot khi sử dụng. KHÔNG dùng API key làm mã.
- `OPENAI_MODEL` (không bắt buộc): mặc định `gpt-4o-mini`.

Sau khi thêm biến, **Trigger deploy** lại. API OpenAI có thể yêu cầu thiết lập billing/hạn mức và có chi phí theo lượt gọi; gói ChatGPT không tự bao gồm API.

**Quan trọng:** Website không đăng nhập và Netlify Function công khai về mặt URL. Mã truy cập là biện pháp giới hạn cơ bản, không thay thế xác thực người dùng và rate limiting. Không công khai mã, giới hạn ngân sách API, chỉ dùng dữ liệu demo. Nếu triển khai thật, cần Netlify Identity/Auth, hạn mức, phân quyền và nhật ký truy cập.

## Kiểm thử
1. Truy cập trang Sản phẩm: kiểm tra 5 sản phẩm từ Supabase (hoặc dữ liệu demo localStorage).
2. Mở chatbot, nhập AI_DEMO_ACCESS_CODE, hỏi: “Balo còn 6 chiếc, có nên nhập 4 hay 10 chiếc? Tính vốn và rủi ro.”
3. Nếu hiện 503: chưa có biến môi trường. 403: mã truy cập sai. 429: hạn mức AI. 502: kiểm tra API key/model/billing.
4. Kiểm tra dashboard: lợi nhuận thực tế hiện 'Chưa đủ dữ liệu' vì đơn hàng chưa có giá vốn từng dòng.

## Giới hạn
Dữ liệu đơn hàng là demo, không có lịch sử số lượng bán theo SKU; do đó không tuyên bố có dự báo nhu cầu thống kê đáng tin cậy. Các quyết định AI chỉ hỗ trợ tham khảo.

## Kiểm chứng và hạn chế
- Chưa chạy được `npm run build` trong môi trường đóng gói này do không tải được dependencies. Sau khi đẩy GitHub, kiểm tra build Netlify trước khi dùng.
- Đây là bản demo kết nối dữ liệu sản phẩm chỉ đọc; các chức năng CRUD và quan hệ đơn hàng/khách hàng vẫn nằm trong localStorage của một trình duyệt, không phải hệ thống nhiều người dùng.
- Cần cấu hình OPENAI_API_KEY và AI_DEMO_ACCESS_CODE để chatbot AI hoạt động; không thể nhúng API key vào ZIP.
- Dữ liệu demo hiện có chưa đủ cho dự báo thống kê đáng tin cậy; mô phỏng là các giả định, không phải dự báo.
