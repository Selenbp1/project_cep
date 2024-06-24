import axios from 'axios';

const BASE_URL = 'http://localhost:9090';
const API_URL = `${BASE_URL}/users`; // Assuming '/users' is your users endpoint

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getUsers = async (page, pageSize) => {
  try {
    const response = await instance.get(API_URL, {
      params: {
        page,
        pageSize
      }
    });
    return {
      users: response.data,
      total: Number(response.headers['x-total-count']),
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

const getUserById = async (id) => {
  try {
    const response = await instance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw new Error(`Failed to fetch user with ID ${id}`);
  }
};

const createUser = async (user) => {
  try {
    const response = await instance.post(API_URL, user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

const updateUser = async (id, updatedUser) => {
  try {
    const response = await instance.put(`${API_URL}/${id}`, updatedUser);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw new Error(`Failed to update user with ID ${id}`);
  }
};

const deleteUser = async (id) => {
  try {
    const response = await instance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw new Error(`Failed to delete user with ID ${id}`);
  }
};

const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

export default userService;
