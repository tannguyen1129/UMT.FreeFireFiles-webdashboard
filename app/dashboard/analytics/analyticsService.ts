import axiosInstance from '../../lib/axios';

export interface AnalyticsData {
  trend: { hour: string; avg_pm25: string }[];
  incidents: { status: string; count: string }[];
  correlation: { district: string; pm25: number; roadCount: number }[];
}

export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  const response = await axiosInstance.get('/aqi/analytics');
  return response.data as AnalyticsData;
};