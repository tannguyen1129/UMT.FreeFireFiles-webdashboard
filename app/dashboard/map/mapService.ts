import axios from 'axios';

// Định nghĩa kiểu dữ liệu (chỉ lấy phần cần thiết)
export interface Forecast {
  id: string;
  location: { value: { coordinates: [number, number] } }; // [lng, lat]
  forecastedPM25: { value: number };
}

export interface GreenSpace {
  id: string;
  name: { value: string };
  location: { value: { type: 'Polygon', coordinates: number[][][] } }; // GeoJSON Polygon
}

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

/** 1. Lấy TẤT CẢ Dữ liệu Dự báo (Forecasts) */
export const fetchForecasts = async (): Promise<Forecast[]> => {
  const response = await axios.get(`${API_GATEWAY_URL}/aqi/forecasts`, {
    headers: getAuthHeaders(),
  });
  return response.data as Forecast[];
};

/** 2. Lấy TẤT CẢ Không gian xanh (Green Spaces) */
export const fetchGreenSpaces = async (): Promise<GreenSpace[]> => {
  
  // 🚀 SỬA LỖI: Thêm các tham số (params) bắt buộc
  const response = await axios.get(`${API_GATEWAY_URL}/aqi/green-spaces`, {
    headers: getAuthHeaders(),
    params: {
      lat: 10.7769, // 👈 Tọa độ trung tâm TPHCM (mặc định)
      lng: 106.7009,
      radius: 50000 // 👈 Bán kính 50km (để lấy tất cả)
    }
  });
  return response.data as GreenSpace[];
};