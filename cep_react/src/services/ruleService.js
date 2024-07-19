import axios from 'axios';

const BASE_URL = 'http://localhost:9090';
const API_URL = `${BASE_URL}/rules`;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getRules = async (page, pageSize) => {
  try {
    const response = await instance.get(API_URL, {
      params: {
        page,
        pageSize,
      },
    });
    console.log("Raw API Response:", response.data); // Add this line
    return response.data; 
  } catch (error) {
    console.error('Error fetching rules:', error);
    throw error;
  }
};


export const addRule = async (newRule) => {
  try {
    const response = await instance.post(API_URL, newRule);
    return response.data;
  } catch (error) {
    console.error('Error adding rule:', error);
    throw new Error('Failed to add rule');
  }
};

export const editRule = async (updatedRule) => {
  try {
    const response = await instance.put(`${API_URL}/${updatedRule.id}`, updatedRule);
    return response.data;
  } catch (error) {
    console.error('Error editing rule:', error);
    throw new Error('Failed to edit rule');
  }
};

export const deleteRule = async (ruleId) => {
  try {
    await instance.delete(`${API_URL}/${ruleId}`);
    return ruleId;
  } catch (error) {
    console.error('Error deleting rule:', error);
    throw new Error('Failed to delete rule');
  }
};
