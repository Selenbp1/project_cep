import axios from 'axios';

const BASE_URL = 'http://localhost:9090';
const API_URL = `${BASE_URL}/rules/result`;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const fetchRuleData = async () => {
  try {
    const response = await instance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching rule data:', error.message);
    throw new Error('Failed to fetch rule data');
  }
};

const fetchDetailDataByRuleId = async (item_id, page, pageSize) => {
  try {
    const response = await instance.get(`${API_URL}/detail/${item_id}?page=${page}&pageSize=${pageSize}`);
    console.log('API full response:', response);  // Full response to debug structure
    return {
      details: response.data, // Assuming response.data contains details
      totalCount: response.data.totalCont || response.data.totalCount || response.totalCount || 0 // Adjust based on actual structure
    };
  } catch (error) {
    console.error(`Error fetching detail data for rule ID ${item_id}:`, error.message);
    throw new Error('Failed to fetch detail data');
  }
};

export { fetchRuleData, fetchDetailDataByRuleId };
