
import axios from 'axios';

const BASE_URL = 'http://localhost:9090';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getCodes = async (page, pageSize) => {
  try {
    const response = await instance.get(`/codes?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch codes:', error.message);
    return { codes: [], total: 0 };
  }
};

const getSubCodes = async (parentCodeId, page, pageSize) => {
  try {
    const response = await instance.get(`/subcodes?parentCodeId=${parentCodeId}&page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch subcodes:', error.message);
    return { subCodes: [], total: 0 };
  }
};

const getCode = async (id) => {
  try {
    const response = await instance.get(`/code/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch code:', error.message);
    return null;
  }
};

const createCode = async (code) => {
  try {
    const response = await instance.post('/code', code);
    return response.data;
  } catch (error) {
    console.error('Failed to create code:', error.message);
    return null;
  }
};

const updateCode = async (id, code) => {
  try {
    const response = await instance.put(`/code/${id}`, code);
    return response.data;
  } catch (error) {
    console.error('Failed to update code:', error.message);
    return null;
  }
};

const deleteCode = async (id) => {
  try {
    await instance.delete(`/code/${id}`);
    return true; 
  } catch (error) {
    console.error('Failed to delete code:', error.message);
    return false;
  }
};

const codeService = {
  getCodes,
  getSubCodes,
  getCode,
  createCode,
  updateCode,
  deleteCode,
};

export default codeService;