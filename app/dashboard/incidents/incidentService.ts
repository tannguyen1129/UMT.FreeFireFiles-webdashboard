import axios from 'axios';

// Định nghĩa kiểu dữ liệu (type) cho Incident
export interface Incident {
  incident_id: string;
  description: string;
  status: string;
  created_at: string;
  incidentType: {
    type_name: string;
  };
}

// Các trạng thái hợp lệ
export const incidentStatuses = [
  'pending', 
  'verified', 
  'in_progress', 
  'resolved', 
  'rejected'
];

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';

/**
 * Lấy token từ localStorage (chỉ chạy ở client)
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * 1. Lấy TẤT CẢ sự cố (cho Admin)
 */
export const fetchIncidents = async (): Promise<Incident[]> => {
  const response = await axios.get(`${API_GATEWAY_URL}/aqi/incidents`, {
    headers: getAuthHeaders(),
  });
  return response.data as Incident[];
};

/**
 * 2. Cập nhật TRẠNG THÁI của một sự cố
 */
export const updateIncidentStatus = async (
  incidentId: string, 
  status: string
): Promise<Incident> => {
  
  const response = await axios.patch(
    `${API_GATEWAY_URL}/aqi/incidents/${incidentId}/status`, 
    { status: status }, // 👈 Đây là DTO (UpdateIncidentStatusDto)
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data as Incident;
};