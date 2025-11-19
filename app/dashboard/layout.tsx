'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

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

// --- 🚀 COMPONENT MỚI: Sidebar ---
function Sidebar() {
  const pathname = usePathname(); 
  
  const navItems = [
    { name: 'Quản lý Sự cố', href: '/dashboard/incidents' },
    { name: 'Quản lý Loại Sự cố', href: '/dashboard/incident-types' },
    { name: 'Bản đồ Giám sát', href: '/dashboard/map' },
  ];

  return (
    <nav className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-bold text-green-600">Admin Menu</h2>
      </div>
      <ul className="space-y-2 p-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 ${
                pathname === item.href ? 'bg-green-100 text-green-700 font-bold' : ''
              }`}
            >
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
// --- (Hết component Sidebar) ---


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