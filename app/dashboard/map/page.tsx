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
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Forecast, GreenSpace, Perception, fetchForecasts, fetchGreenSpaces, fetchPerceptions } from './mapService';
import { fetchIncidents, Incident } from '../incidents/incidentService'; 

export default function MapPage() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [greenSpaces, setGreenSpaces] = useState<GreenSpace[]>([]);
  const [perceptions, setPerceptions] = useState<Perception[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]); // 👈 State lưu sự cố
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MonitoringMap = useMemo(() => dynamic(
    () => import('./MonitoringMap'),
    { ssr: false, loading: () => <p>Đang tải bản đồ...</p> }
  ), []);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // 🚀 Gọi song song 4 API
        const [forecastData, greenSpaceData, perceptionData, incidentData] = await Promise.all([
          fetchForecasts(),
          fetchGreenSpaces(),
          fetchPerceptions(),
          fetchIncidents(), // 👈 Lấy sự cố
        ]);
        
        setForecasts(forecastData);
        setGreenSpaces(greenSpaceData);
        setPerceptions(perceptionData);
        setIncidents(incidentData); // 👈 Lưu vào state

      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, []);

  if (error) return <div className="p-8 text-red-500">Lỗi: {error}</div>;

  return (
    <div>
       <h1 className="text-3xl font-bold mb-6">Bản đồ Giám sát & Điều hành</h1>
       <div className="bg-white rounded-lg shadow p-4">
        {isLoading ? (
          <p>Đang tải dữ liệu tổng hợp...</p>
        ) : (
           <MonitoringMap 
              forecasts={forecasts} 
              greenSpaces={greenSpaces} 
              perceptions={perceptions}
              incidents={incidents} // 👈 Truyền dữ liệu xuống Map
           />
        )}
      </div>
    </div>
  );
}