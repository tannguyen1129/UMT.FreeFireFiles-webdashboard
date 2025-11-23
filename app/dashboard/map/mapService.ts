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