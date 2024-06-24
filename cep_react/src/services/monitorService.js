import axios from 'axios';

const BASE_URL = 'http://localhost:9090';
const API_URL = `${BASE_URL}/monitors`;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getMonthlyData = async () => {
  try {
    const response = await instance.get(`${API_URL}/monthly-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly data:', error.message);
    throw new Error('Failed to fetch monthly data. Please try again later.'); // 에러 메시지 개선
  }
};

const getDailyData = async () => {
  try {
    const response = await instance.get(`${API_URL}/daily-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching daily data:', error.message);
    throw new Error('Failed to fetch daily data. Please try again later.'); // 에러 메시지 개선
  }
};

const getRealTimeData = async () => {
  try {
    const response = await instance.get(`${API_URL}/real-time-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching real-time data:', error.message);
    throw new Error('Failed to fetch real-time data. Please try again later.'); // 에러 메시지 개선
  }
};

const monitorService = {
  getMonthlyData,
  getDailyData,
  getRealTimeData,
};

export default monitorService;