import axios from 'axios';

// Định nghĩa kiểu dữ liệu
export interface IncidentType {
  type_id: number;
  type_name: string;
  description: string;
}

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/** 1. Lấy TẤT CẢ loại sự cố (GET) */
export const fetchIncidentTypes = async (): Promise<IncidentType[]> => {
  const response = await axios.get(`${API_GATEWAY_URL}/aqi/incident-types`, {
    headers: getAuthHeaders(),
  });
  return response.data as IncidentType[];
};

/** 2. TẠO MỚI loại sự cố (POST) */
export const createIncidentType = async (
  data: Omit<IncidentType, 'type_id'>
): Promise<IncidentType> => {
  const response = await axios.post(`${API_GATEWAY_URL}/aqi/incident-types`, data, {
    headers: getAuthHeaders(),
  });
  return response.data as IncidentType;
};

/** 3. CẬP NHẬT loại sự cố (PUT) */
export const updateIncidentType = async (
  id: number, 
  data: Omit<IncidentType, 'type_id'>
): Promise<IncidentType> => {
  const response = await axios.put(`${API_GATEWAY_URL}/aqi/incident-types/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data as IncidentType;
};

/** 4. XÓA loại sự cố (DELETE) */
export const deleteIncidentType = async (id: number): Promise<void> => {
  await axios.delete(`${API_GATEWAY_URL}/aqi/incident-types/${id}`, {
    headers: getAuthHeaders(),
  });
};