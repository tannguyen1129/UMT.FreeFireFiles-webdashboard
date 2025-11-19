'use client';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLng } from 'leaflet';
import { Forecast, GreenSpace } from './mapService';
// 🚀 1. SỬA LỖI: Import 'FeatureCollection' thay vì (hoặc cùng với) GeoJsonObject
import type { FeatureCollection } from 'geojson'; 

// Helper: Tính toán màu
const getColorForPm25 = (pm25: number) => {
  if (pm25 <= 12) return 'green';
  if (pm25 <= 35.4) return 'yellow';
  if (pm25 <= 55.4) return 'orange';
  if (pm25 <= 150.4) return 'red';
  return 'purple';
};

// Props (dữ liệu) mà Component này nhận vào
interface MapProps {
  forecasts: Forecast[];
  greenSpaces: GreenSpace[];
}

export default function MonitoringMap({ forecasts, greenSpaces }: MapProps) {
  // Tọa độ trung tâm TP.HCM
  const hcmcCenter = new LatLng(10.7769, 106.7009);

  // 🚀 2. SỬA LỖI: Dùng kiểu 'FeatureCollection'
  // Kiểu này cho phép thuộc tính 'features'
  const greenSpaceGeoJson: FeatureCollection = {
    type: 'FeatureCollection',
    features: greenSpaces.map(space => ({
      type: 'Feature',
      geometry: space.location.value, // 👈 Lấy thẳng Polygon
      properties: {
        name: space.name.value,
      },
    })),
  };

  return (
    <MapContainer 
      center={hcmcCenter} 
      zoom={12} 
      style={{ height: '80vh', width: '100%' }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* 1. Vẽ Lớp Dự báo (Vòng tròn) */}
      {forecasts.map((forecast) => {
        const coords = forecast.location.value.coordinates;
        const position = new LatLng(coords[1], coords[0]); // Đảo [lng, lat]
        const pm25 = forecast.forecastedPM25.value;
        const color = getColorForPm25(pm25);

        return (
          <CircleMarker
            key={forecast.id}
            center={position}
            radius={15} // Kích thước vòng tròn
            pathOptions={{ color: color, fillColor: color, fillOpacity: 0.5 }}
          >
            <Popup>
              <b>Dự báo PM2.5:</b> {pm25} µg/m³<br/>
              (Trạm: {forecast.id.split(':').pop()})
            </Popup>
          </CircleMarker>
        );
      })}
      
      {/* 2. Vẽ Lớp Công viên (Đa giác) */}
      <GeoJSON 
        data={greenSpaceGeoJson} 
        style={{ color: 'green', weight: 2, opacity: 0.7 }} 
        onEachFeature={(feature, layer) => {
           // Thêm Popup khi nhấn vào
           layer.bindPopup(feature.properties.name || 'Không rõ tên');
        }}
      />

    </MapContainer>
  );
}