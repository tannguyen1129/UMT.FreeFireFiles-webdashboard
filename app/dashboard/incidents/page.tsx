'use client';
import { useEffect, useState } from 'react';
import { 
  Incident, 
  fetchIncidents, 
  updateIncidentStatus, 
  incidentStatuses 
} from './incidentService';
import { MdMap, MdImageNotSupported } from "react-icons/md"; // Icon hỗ trợ

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchIncidents();
        setIncidents(data);
      } catch (err: any) {
        setError(err.message || 'Không thể tải dữ liệu sự cố');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStatusChange = async (incidentId: string, newStatus: string) => {
    try {
      const updatedIncident = await updateIncidentStatus(incidentId, newStatus);
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.incident_id === incidentId ? { ...inc, status: updatedIncident.status } : inc
        )
      );
    } catch (err: any) {
      alert(`Lỗi cập nhật: ${err.message}`);
    }
  };

  if (isLoading) return <div className="p-8">Đang tải...</div>;
  if (error) return <div className="p-8 text-red-500">Lỗi: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản lý Sự cố</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại / Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày báo cáo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {incidents.map((incident) => {
              // Xử lý tọa độ (GeoJSON: [lng, lat])
              const lng = incident.location?.coordinates[0];
              const lat = incident.location?.coordinates[1];
              const mapLink = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : '#';

              return (
                <tr key={incident.incident_id} className="hover:bg-gray-50 transition-colors">
                  {/* 1. CỘT HÌNH ẢNH */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {incident.image_url ? (
                      <a href={incident.image_url} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={incident.image_url} 
                          alt="Evidence" 
                          className="h-16 w-16 object-cover rounded-md border border-gray-300 hover:scale-110 transition-transform"
                        />
                      </a>
                    ) : (
                      <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                        <MdImageNotSupported size={24} />
                      </div>
                    )}
                  </td>

                  {/* 2. CỘT THÔNG TIN */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{incident.incidentType?.type_name ?? 'Khác'}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs" title={incident.description}>
                      {incident.description || 'Không có mô tả'}
                    </div>
                  </td>

                  {/* 3. CỘT VỊ TRÍ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lat && lng ? (
                      <a 
                        href={mapLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                      >
                        <MdMap /> Xem Map
                        <span className="text-xs text-gray-400 block">({lat.toFixed(3)}, {lng.toFixed(3)})</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">Không xác định</span>
                    )}
                  </td>

                  {/* 4. CỘT TRẠNG THÁI */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      incident.status === 'pending' ? 'bg-red-100 text-red-800' : 
                      incident.status === 'verified' ? 'bg-orange-100 text-orange-800' :
                      incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {incident.status.toUpperCase()}
                    </span>
                  </td>

                  {/* 5. NGÀY GIỜ */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(incident.created_at).toLocaleString('vi-VN')}
                  </td>

                  {/* 6. HÀNH ĐỘNG */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={incident.status}
                      onChange={(e) => handleStatusChange(incident.incident_id, e.target.value)}
                      className="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      {incidentStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}