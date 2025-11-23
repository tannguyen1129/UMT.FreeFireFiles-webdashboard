'use client';
import { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet';
import { Forecast, GreenSpace, Perception } from './mapService';
import { Incident } from '../incidents/incidentService';
import type { FeatureCollection } from 'geojson';
// Icons
import { MdCloud, MdWarning } from "react-icons/md";
import { renderToStaticMarkup } from 'react-dom/server';

// --- HELPER MÀU SẮC & ICON ---
const getColorForPm25 = (pm25: number) => {
  if (pm25 <= 12) return 'green';
  if (pm25 <= 35.4) return '#FFD700'; 
  if (pm25 <= 55.4) return 'orange';
  if (pm25 <= 150.4) return 'red';
  return 'purple';
};

const getFeelingColor = (feeling: number) => {
  switch (feeling) {
    case 1: return '#4CAF50';
    case 2: return '#FFEB3B';
    case 3: return '#FF9800';
    case 4: return '#F44336';
    default: return '#9E9E9E';
  }
};

const getFeelingText = (feeling: number) => {
  switch (feeling) {
    case 1: return 'Trong lành';
    case 2: return 'Bình thường';
    case 3: return 'Kém/Bụi';
    case 4: return 'Ô nhiễm/Khó thở';
    default: return 'Không rõ';
  }
};

// Tạo Icon Đám mây (Cảm nhận)
const createPerceptionIcon = (feeling: number) => {
  const color = getFeelingColor(feeling);
  const iconHtml = renderToStaticMarkup(
    <MdCloud style={{ color: color, fontSize: '30px', filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))' }} />
  );
  return L.divIcon({
    html: iconHtml,
    className: 'custom-icon', // Class chung để xóa style mặc định
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

// 🚀 TẠO ICON SỰ CỐ (Cảnh báo Tam giác)
const createIncidentIcon = (status: string) => {
  let color = '#F44336'; // Đỏ (Pending - Nguy hiểm nhất)
  if (status === 'verified') color = '#FF9800'; // Cam (Đã xác minh)
  if (status === 'in_progress') color = '#2196F3'; // Xanh dương (Đang xử lý)

  const iconHtml = renderToStaticMarkup(
    <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Hiệu ứng nhấp nháy cho Pending */}
      {status === 'pending' && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-30 animate-ping"></span>
      )}
      <MdWarning style={{ color: color, fontSize: '36px', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))', zIndex: 10 }} />
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

interface MapProps {
  forecasts: Forecast[];
  greenSpaces: GreenSpace[];
  perceptions: Perception[];
  incidents: Incident[];
}

export default function MonitoringMap({ forecasts, greenSpaces, perceptions, incidents }: MapProps) {
  const hcmcCenter = new LatLng(10.7769, 106.7009);

  const greenSpaceGeoJson: FeatureCollection = {
    type: 'FeatureCollection',
    features: greenSpaces.map(space => ({
      type: 'Feature',
      geometry: space.location.value,
      properties: { name: space.name.value },
    })),
  };

  // 🚀 LỌC SỰ CỐ: Chỉ hiện những cái CHƯA xong
  const activeIncidents = useMemo(() => {
    return incidents.filter(i => i.status !== 'resolved' && i.status !== 'rejected');
  }, [incidents]);

  // IDW Heatmap Logic
  const heatmapPoints = useMemo(() => {
    if (!forecasts || forecasts.length === 0) return [];
    const points: React.ReactNode[] = [];
    const minLat = 10.35; const maxLat = 11.10;
    const minLng = 106.30; const maxLng = 107.00;
    const step = 0.015; 

    const getDistSq = (lat1: number, lng1: number, lat2: number, lng2: number) => Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2);

    for (let lat = minLat; lat <= maxLat; lat += step) {
      for (let lng = minLng; lng <= maxLng; lng += step) {
        let numerator = 0; let denominator = 0;
        forecasts.forEach(sensor => {
          const sLat = sensor.location.value.coordinates[1];
          const sLng = sensor.location.value.coordinates[0];
          const val = sensor.forecastedPM25.value;
          const distSq = getDistSq(lat, lng, sLat, sLng);
          if (distSq === 0) { numerator = val; denominator = 1; } 
          else { const weight = 1 / distSq; numerator += val * weight; denominator += weight; }
        });
        const interpolatedPm25 = denominator !== 0 ? numerator / denominator : 0;
        if (interpolatedPm25 > 0) {
          points.push(
            <CircleMarker
              key={`heat-${lat}-${lng}`}
              center={[lat, lng]}
              radius={20}
              pathOptions={{ color: 'transparent', fillColor: getColorForPm25(interpolatedPm25), fillOpacity: 0.15 }}
              interactive={false}
            />
          );
        }
      }
    }
    return points;
  }, [forecasts]);

  return (
    <MapContainer center={hcmcCenter} zoom={11} style={{ height: '80vh', width: '100%' }}>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* 1. Heatmap */}
      {heatmapPoints}

      {/* 2. Công viên */}
      <GeoJSON 
        data={greenSpaceGeoJson} 
        style={{ color: 'green', weight: 1, fillOpacity: 0.6 }} 
        onEachFeature={(feature, layer) => { if (feature.properties?.name) layer.bindPopup(`<b>Công viên:</b> ${feature.properties.name}`); }}
      />

      {/* 3. Trạm Quan trắc */}
      {forecasts.map((f) => (
        <CircleMarker
          key={`forecast-${f.id}`}
          center={[f.location.value.coordinates[1], f.location.value.coordinates[0]]}
          radius={25}
          pathOptions={{ color: 'white', weight: 1, fillColor: getColorForPm25(f.forecastedPM25.value), fillOpacity: 0.7 }}
        >
          <Popup><div className="text-center"><strong>Trạm Quan Trắc</strong><br/>{f.id.split(':').pop()}<br/>PM2.5: <b>{f.forecastedPM25.value.toFixed(1)}</b></div></Popup>
        </CircleMarker>
      ))}

      {/* 4. Cảm nhận */}
      {perceptions.map((p) => (
        <Marker key={`p-${p.id}`} position={[p.location.coordinates[1], p.location.coordinates[0]]} icon={createPerceptionIcon(p.feeling)}>
          <Popup><div className="text-center"><b>Phản ánh</b><br/>{getFeelingText(p.feeling)}<br/><span className="text-xs">{new Date(p.createdAt).toLocaleString('vi-VN')}</span></div></Popup>
        </Marker>
      ))}

      {/* 5. 🚀 SỰ CỐ (HIỂN THỊ TRÊN BẢN ĐỒ) */}
      {activeIncidents.map((incident) => {
        const loc = incident.location;
        if (!loc || !loc.coordinates) return null;
        const coords = loc.coordinates; // [lng, lat]

        return (
          <Marker
            key={`inc-${incident.incident_id}`}
            position={[coords[1], coords[0]]} // Đảo lat/lng
            icon={createIncidentIcon(incident.status)}
            zIndexOffset={1000} // Luôn nổi lên trên cùng
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-red-600 flex items-center gap-2" style={{marginBottom: 5}}>
                   <MdWarning size={20}/> Sự cố: {incident.incidentType?.type_name}
                </h3>
                {incident.image_url && (
                  <img src={incident.image_url} alt="Evidence" style={{width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '5px'}} />
                )}
                <p className="text-sm my-1 border-b pb-2">{incident.description || 'Không có mô tả'}</p>
                <div className="text-xs text-gray-600">
                  Status: <b>{incident.status.toUpperCase()}</b><br/>
                  Time: {new Date(incident.created_at).toLocaleString('vi-VN')}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

    </MapContainer>
  );
}