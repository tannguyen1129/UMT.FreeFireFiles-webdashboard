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