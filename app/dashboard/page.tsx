/*
 * Copyright 2025 Green-AQI Navigator Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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