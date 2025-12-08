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

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // 👈 Import hook điều hướng

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // 👈 Khởi tạo router

  // 🚀 SỬA LẠI API URL:
  // Dashboard (chạy trên trình duyệt) phải gọi IP Tĩnh của WSL
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(null); 
    
    // (Kiểm tra xem đây có phải là email admin không)
    if (!email.endsWith('@green.aqi')) {
      setError('Quyền truy cập bị từ chối. Đây là cổng đăng nhập nội bộ.');
      return;
    }

    try {
      // 4. Gọi API /auth/login
      const response = await axios.post(
        `${API_GATEWAY_URL}/auth/login`,
        {
          email: email,
          password: password,
        }
      );

      // 5. 🚀 SỬA LỖI: LƯU TOKEN VÀ CHUYỂN TRANG
      const token = response.data.access_token;
      localStorage.setItem('admin_token', token); // Lưu token
      
      // Chuyển đến trang Dashboard
      router.push('/dashboard'); 

    } catch (err: any) {
      console.error('Lỗi đăng nhập:', err);
      if (err.response) {
        setError(err.response.data.message || 'Email hoặc mật khẩu không đúng.');
      } else {
        setError('Không thể kết nối đến máy chủ. Backend (WSL) đã chạy chưa?');
      }
    }
  };

  // 7. Giao diện (JSX và Tailwind CSS)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Green-AQI Dashboard
        </h1>
        <p className="text-center text-gray-600">
          Đăng nhập (Admin / Cơ quan chức năng)
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Hiển thị lỗi (nếu có) */}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="admin@green.aqi"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••"
            />
          </div>

          {/* Nút Đăng nhập */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}