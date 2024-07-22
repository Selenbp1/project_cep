import axios from 'axios';

const BASE_URL = 'http://localhost:9090';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username, password) => {
  try {
    const response = await instance.post('/login', { username, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    throw new Error('Invalid username or password');
  }
};
