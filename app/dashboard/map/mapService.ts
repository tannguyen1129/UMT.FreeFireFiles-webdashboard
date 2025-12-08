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

export interface Forecast {
  id: string;
  location: { value: { coordinates: [number, number] } }; 
  forecastedPM25: { value: number };
}

export interface GreenSpace {
  id: string;
  name: { value: string };
  location: { value: { type: 'Polygon', coordinates: number[][][] } }; 
}

export interface Perception {
  id: string;
  feeling: number; 
  location: { coordinates: [number, number] }; 
  createdAt: string;
}

export const fetchForecasts = async (): Promise<Forecast[]> => {
  const response = await axiosInstance.get('/aqi/forecasts');
  return response.data as Forecast[];
};

export const fetchGreenSpaces = async (): Promise<GreenSpace[]> => {
  const response = await axiosInstance.get('/aqi/green-spaces', {
    params: { lat: 10.7769, lng: 106.7009, radius: 50000 }
  });
  return response.data as GreenSpace[];
};

export const fetchPerceptions = async (): Promise<Perception[]> => {
  const response = await axiosInstance.get('/aqi/perceptions');
  return response.data as Perception[];
};