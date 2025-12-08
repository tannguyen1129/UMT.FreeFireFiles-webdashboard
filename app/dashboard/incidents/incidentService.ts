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