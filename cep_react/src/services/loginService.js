// services/loginService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:9090';
const API_URL = `${BASE_URL}/logins`;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username, password) => {
  try {
    const response = await instance.post(API_URL, { username, password });
    if (response.status === 200) {
      // 로그인 성공 시 토큰을 반환하도록 설정 (response.data.token)
      return response.data;
    } else {
      throw new Error('Failed to login'); // 다른 HTTP 상태 코드 처리
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid username or password');
    } else {
      throw new Error('Failed to login'); // 네트워크 오류 등 다른 에러 처리
    }
  }
};

export default instance;