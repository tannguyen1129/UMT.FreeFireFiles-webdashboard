'use client';
import { useEffect, useState, useCallback } from 'react';
import { 
  Incident, 
  fetchIncidents, 
  updateIncidentStatus, 
  incidentStatuses 
} from './incidentService';

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchIncidents();
        setIncidents(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Không thể tải dữ liệu sự cố');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStatusChange = useCallback(async (incidentId: string, newStatus: string) => {
    setUpdatingId(incidentId);
    
    try {
      const updatedIncident = await updateIncidentStatus(incidentId, newStatus);
      
      setIncidents((prevIncidents) =>
        prevIncidents.map((inc) =>
          inc.incident_id === incidentId 
            ? { ...inc, status: updatedIncident.status }
            : inc
        )
      );
      setError(null);
    } catch (err: any) {
      setError(`Lỗi cập nhật: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const getStatusStyle = useCallback((status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-900 border border-yellow-300',
      resolved: 'bg-green-100 text-green-900 border border-green-300',
      in_progress: 'bg-blue-100 text-blue-900 border border-blue-300'
    };
    return styles[status] || 'bg-gray-100 text-gray-900 border border-gray-300';
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Quản lý Sự cố</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && incidents.length === 0) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-red-900 mb-2">Lỗi</h2>
          <p className="text-red-800 mb-4 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Sự cố</h1>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm text-gray-600">Tổng số: </span>
          <span className="text-sm font-bold text-gray-900">{incidents.length}</span>
          <span className="text-sm text-gray-600"> sự cố</span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg">
          <p className="text-red-900 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Loại Sự cố
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Mô tả
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Ngày báo cáo
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="text-gray-500">
                      <svg className="mx-auto h-16 w-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-base font-semibold text-gray-700">Chưa có sự cố nào</p>
                      <p className="text-sm text-gray-500 mt-1">Danh sách sự cố sẽ hiển thị tại đây</p>
                    </div>
                  </td>
                </tr>
              ) : (
                incidents.map((incident) => (
                  <tr 
                    key={incident.incident_id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Loại sự cố - TEXT ĐẬM HƠN */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">
                        {incident.incidentType?.type_name ?? 'N/A'}
                      </span>
                    </td>

                    {/* Mô tả - TEXT RÕ HƠN */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800 font-medium max-w-xs truncate" title={incident.description}>
                        {incident.description}
                      </p>
                    </td>

                    {/* Trạng thái - BADGE ĐẬM HƠN VỚI BORDER */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-md ${getStatusStyle(incident.status)}`}>
                        {incident.status}
                      </span>
                    </td>

                    {/* Ngày - TEXT ĐẬM HƠN */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-800 font-medium">
                        {new Date(incident.created_at).toLocaleString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>

                    {/* Hành động - SELECT ĐẬM HƠN */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <select
                          value={incident.status}
                          onChange={(e) => handleStatusChange(incident.incident_id, e.target.value)}
                          disabled={updatingId === incident.incident_id}
                          className="block w-full px-3 py-2 text-sm font-semibold text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:border-gray-400"
                          aria-label={`Thay đổi trạng thái sự cố ${incident.incident_id}`}
                        >
                          {incidentStatuses.map((status) => (
                            <option key={status} value={status} className="font-medium">
                              {status}
                            </option>
                          ))}
                        </select>
                        {updatingId === incident.incident_id && (
                          <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
