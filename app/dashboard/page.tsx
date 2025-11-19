'use client';

export default function DashboardWelcomePage() {
  
  // Đây là trang "chính" của /dashboard
  // (Chúng ta có thể chuyển Bảng Quản lý Sự cố ra đây nếu muốn,
  // nhưng hiện tại để đây để fix lỗi 404)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Chào mừng đến với Dashboard
      </h1>
      <p>
        Chọn một mục từ menu bên trái (Sidebar) để bắt đầu.
      </p>
      <p>
        (Ví dụ: "Quản lý Sự cố" hoặc "Quản lý Loại Sự cố").
      </p>
    </div>
  );
}