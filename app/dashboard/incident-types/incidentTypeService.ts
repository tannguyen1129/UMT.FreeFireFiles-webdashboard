import axiosInstance from '../../lib/axios';

export interface IncidentType {
  type_id: number;
  type_name: string;
  description: string;
}

export const fetchIncidentTypes = async (): Promise<IncidentType[]> => {
  const response = await axiosInstance.get('/aqi/incident-types');
  return response.data as IncidentType[];
};

export const createIncidentType = async (data: Omit<IncidentType, 'type_id'>): Promise<IncidentType> => {
  const response = await axiosInstance.post('/aqi/incident-types', data);
  return response.data as IncidentType;
};

export const updateIncidentType = async (id: number, data: Omit<IncidentType, 'type_id'>): Promise<IncidentType> => {
  const response = await axiosInstance.put(`/aqi/incident-types/${id}`, data);
  return response.data as IncidentType;
};

export const deleteIncidentType = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/aqi/incident-types/${id}`);
};