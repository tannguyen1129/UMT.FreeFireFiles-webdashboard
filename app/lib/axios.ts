import axios from 'axios';

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. INTERCEPTOR REQUEST: Tự động đính kèm Token trước khi gửi
axiosInstance.interceptors.request.use(
  (config) => {
    // Kiểm tra xem code có chạy ở Client không (để tránh lỗi build server)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. INTERCEPTOR RESPONSE: Tự động xử lý lỗi 401 (Hết hạn)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        console.warn('Token hết hạn hoặc không hợp lệ. Đang đăng xuất...');
        localStorage.removeItem('admin_token');
        // Dùng window.location để force reload về trang login
        window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;