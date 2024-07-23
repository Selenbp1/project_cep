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

const fetchRuleData = async (page, pageSize) => {
  try {
    const response = await instance.get(`${API_URL}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rule data:', error.message);
    throw new Error('Failed to fetch rule data');
  }
};

const fetchDetailDataByRuleId = async (id, page, pageSize) => {
  try {
    const response = await instance.get(`${API_URL}/detail/${id}?page=${page}&pageSize=${pageSize}`);
    return {
      details: response.data.details,
      totalCount: response.data.totalCount
    };
  } catch (error) {
    console.error(`Error fetching detail data for rule ID ${id}:`, error.message);
    throw new Error('Failed to fetch detail data');
  }
};

export { fetchRuleData, fetchDetailDataByRuleId };
