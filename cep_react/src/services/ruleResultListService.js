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

const fetchDetailDataByRuleId = async (ruleId) => {
  try {
    const response = await instance.get(`${API_URL}/${ruleId}/details`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching detail data for rule ID ${ruleId}:`, error.message);
    throw new Error('Failed to fetch detail data');
  }
};

export { fetchRuleData, fetchDetailDataByRuleId };