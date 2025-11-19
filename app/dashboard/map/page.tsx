'use client';
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic'; // 👈 Dùng để tải động
import { Forecast, GreenSpace, fetchForecasts, fetchGreenSpaces } from './mapService';

export default function MapPage() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [greenSpaces, setGreenSpaces] = useState<GreenSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🚀 BẮT BUỘC: Tải Map component ở Client-side (ssr: false)
  // để tránh lỗi 'window is not defined'
  const MonitoringMap = useMemo(() => dynamic(
    () => import('./MonitoringMap'),
    { 
      ssr: false, // 👈 Tắt Server-Side Rendering
      loading: () => <p>Đang tải bản đồ...</p> // Hiển thị khi đang tải
    }
  ), []);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Tải song song 2 API
        const [forecastData, greenSpaceData] = await Promise.all([
          fetchForecasts(),
          fetchGreenSpaces()
        ]);
        setForecasts(forecastData);
        setGreenSpaces(greenSpaceData);
      } catch (err: any) {
        setError(err.message || 'Không thể tải dữ liệu bản đồ');
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, []);

  if (error) {
    return <div className="p-8 text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bản đồ Giám sát</h1>
      <div className="bg-white rounded-lg shadow p-4">
        {isLoading ? (
          <p>Đang tải dữ liệu AQI và Công viên...</p>
        ) : (
          // 🚀 Render bản đồ đã được tải động
          <MonitoringMap forecasts={forecasts} greenSpaces={greenSpaces} />
        )}
      </div>
    </div>
  );
}