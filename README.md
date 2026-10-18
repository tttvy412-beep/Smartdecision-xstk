# SmartDecision — bản demo hoàn chỉnh

Ứng dụng React/Vite cho đồ án hệ thống thông tin quản lý bán lẻ.

## Triển khai

1. Sao lưu mã nguồn GitHub cũ, sau đó tải **nội dung bên trong thư mục ZIP** lên repository hiện tại, ghi đè các file trùng tên.
2. Netlify build command: `npm run build`; publish directory: `dist`.
3. Giữ nguyên `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY` đã thiết lập trên Netlify.
4. Chờ Netlify Published và tải lại website.

## Dữ liệu & bảo mật

- Bảng `products` trên Supabase chỉ được đọc công khai (SELECT anon + RLS); không cấp INSERT/UPDATE/DELETE công khai.
- Thêm/sửa/xóa sản phẩm, nhà cung cấp, đơn hàng, khách hàng, chi phí, quyết định được lưu trong localStorage trên thiết bị đang sử dụng.
- Khôi phục dữ liệu demo tại Cài đặt; sản phẩm trở về snapshot Supabase vừa tải.
- Không dùng dữ liệu cá nhân hoặc kinh doanh thật. Không có xác thực, phân quyền hay đồng bộ ghi giữa các máy.
- Trợ lý hỏi đáp là logic quy tắc demo, không phải mô hình AI gọi API; nút mic chưa triển khai. Biểu đồ và mô phỏng có phần số liệu giả định.

## Chạy cục bộ

`npm install` rồi `npm run dev`. Tạo `.env.local` với hai biến VITE nếu muốn đọc Supabase ở máy riêng.
