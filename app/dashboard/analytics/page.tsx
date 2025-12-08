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
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, ComposedChart, Area
} from 'recharts';
import { AnalyticsData, fetchAnalytics } from './analyticsService';
import { Licorice } from 'next/font/google';

// Màu sắc cho biểu đồ tròn
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchAnalytics();
        
        // Format lại dữ liệu Trend cho đẹp (chỉ lấy giờ)
        result.trend = result.trend.map(item => ({
          ...item,
          hour: new Date(item.hour).getHours() + ':00', // Chuyển "2023-..." thành "14:00"
          avg_pm25: parseFloat(item.avg_pm25 as any).toFixed(1)
        })) as any;

        setData(result);
      } catch (err: any) {
        setError(err.message || 'Lỗi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) return <div className="p-8">Đang tổng hợp dữ liệu...</div>;
  if (error) return <div className="p-8 text-red-500">Lỗi: {error}</div>;
  if (!data) return null;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Trung tâm Phân tích Dữ liệu</h1>

      {/* HÀNG 1: XU HƯỚNG & SỰ CỐ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. Biểu đồ Xu hướng AQI (24h) */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Xu hướng PM2.5 (24h qua)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avg_pm25" name="PM2.5 TB" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Biểu đồ Tròn: Trạng thái Sự cố (ĐÃ CẢI TIẾN) */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Tình trạng Xử lý Sự cố</h2>
          <div className="h-64">
            {data.incidents.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.incidents}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                    // 🚀 THÊM LABEL HIỂN THỊ SỐ LIỆU
                    label={({ name, value }) => `${name}: ${value}`} 
                  >
                    {data.incidents.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} sự cố`, `Trạng thái: ${name}`]} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Chưa có dữ liệu sự cố nào
              </div>
            )}
          </div>
        </div>

      </div>
      {/* HÀNG 2: TƯƠNG QUAN (QUAN TRỌNG NHẤT) */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Phân tích Tương quan: Mật độ Giao thông vs. Ô nhiễm Không khí
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Biểu đồ này giúp chứng minh giả thuyết: Khu vực nhiều đường lớn (trục tung phải) thường có chỉ số PM2.5 cao hơn (trục tung trái).
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.correlation}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="district" scale="band" />
              <YAxis yAxisId="left" label={{ value: 'PM2.5 (µg/m³)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Số lượng đường lớn', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              
              {/* Cột: PM2.5 */}
              <Bar yAxisId="left" dataKey="pm25" name="PM2.5 Trung bình" barSize={20} fill="#ff7300" />
              
              {/* Đường: Số lượng đường */}
              <Line yAxisId="right" type="monotone" dataKey="roadCount" name="Mật độ đường" stroke="#413ea0" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}