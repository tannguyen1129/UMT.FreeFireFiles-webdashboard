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
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { MdLogout } from "react-icons/md";

// --- (Hook useAuth giữ nguyên) ---
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token'); 
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  return { isAuthenticated, isLoading };
};
// --- (Hết hook useAuth) ---

function Sidebar() {
  const pathname = usePathname(); 
  const router = useRouter();
  
  const navItems = [
    { name: 'Tổng quan Analytics', href: '/dashboard/analytics' },
    { name: 'Quản lý Sự cố', href: '/dashboard/incidents' },
    { name: 'Quản lý Loại Sự cố', href: '/dashboard/incident-types' },
    { name: 'Bản đồ Giám sát', href: '/dashboard/map' },
  ];

  // 🚀 HÀM ĐĂNG XUẤT
  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.removeItem('admin_token'); // Xóa token
      router.push('/'); // Về trang Login
    }
  };

  return (
    <nav className="w-64 bg-white shadow-md flex flex-col h-screen">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-green-600">Green-AQI Admin</h2>
      </div>
      
      {/* Danh sách Menu (Dãn nở để đẩy nút logout xuống đáy) */}
      <ul className="space-y-2 p-2 flex-1">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-green-50 transition-colors ${
                pathname === item.href ? 'bg-green-100 text-green-700 font-bold' : ''
              }`}
            >
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* 🚀 NÚT ĐĂNG XUẤT Ở ĐÁY */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
          <MdLogout className="mr-2 text-xl" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </nav>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Đang kiểm tra xác thực...
      </div>
    );
  }

  // Giao diện Dashboard (Layout + Nội dung)
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
}