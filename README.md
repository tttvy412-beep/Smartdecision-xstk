# SmartDecision

Website demo hệ thống thông tin hỗ trợ ra quyết định cho doanh nghiệp bán lẻ vừa và nhỏ. Giao diện tiếng Việt, responsive, có dashboard, quản lý sản phẩm/đơn hàng/khách hàng/nhà cung cấp, tồn kho, chi phí, phân tích, cảnh báo, mô phỏng, trợ lý quy tắc, theo dõi quyết định và báo cáo.

## Chạy trên máy

Cần cài Node.js 20 trở lên.

```bash
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal (thường là http://localhost:5173).

## Đưa lên GitHub

1. Tạo repository mới trên GitHub.
2. Upload toàn bộ nội dung thư mục này (không upload `node_modules`).
3. Để chạy trực tiếp trên web, vào **Settings → Pages** và cấu hình GitHub Actions phù hợp với Vite, hoặc deploy repository lên Vercel/Netlify. GitHub không tự chạy ứng dụng React chỉ bằng việc upload mã nguồn.

## Lưu ý về dữ liệu

- Đây là bản demo frontend. Dữ liệu được lưu trong `localStorage` trên trình duyệt hiện tại, không đồng bộ giữa thiết bị/người dùng.
- Trợ lý hiện dùng quy tắc demo, không phải mô hình AI tạo sinh và không gọi API bên ngoài.
- Muốn có đăng nhập, phân quyền, cơ sở dữ liệu đám mây và AI thật, cần bổ sung backend/Supabase và cấu hình khóa API ở phía máy chủ.
- Các số liệu khởi tạo là dữ liệu minh họa, không phải dữ liệu doanh nghiệp thực tế.
