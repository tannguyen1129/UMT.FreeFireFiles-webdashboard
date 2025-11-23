import axiosInstance from '../../lib/axios';

export interface Incident {
  incident_id: string;
  description: string;
  status: string;
  created_at: string;
  incidentType: {
    type_name: string;
  };

  image_url?: string; 
  location: {
    type: 'Point';
    coordinates: [number, number]; // [Longitude, Latitude]
  };
}

export const incidentStatuses = ['pending', 'verified', 'in_progress', 'resolved', 'rejected'];

export const fetchIncidents = async (): Promise<Incident[]> => {
  const response = await axiosInstance.get('/aqi/incidents');
  return response.data as Incident[];
};

export const updateIncidentStatus = async (incidentId: string, status: string): Promise<Incident> => {
  const response = await axiosInstance.patch(`/aqi/incidents/${incidentId}/status`, { status });
  return response.data as Incident;
};