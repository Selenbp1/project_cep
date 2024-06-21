// src/services/UserService.js

const users = [
    { id: 1, userId: 'user1', name: 'John Doe', email: 'john.doe@example.com', contact: '123-456-7890' },
    { id: 2, userId: 'user2', name: 'Jane Smith', email: 'jane.smith@example.com', contact: '987-654-3210' },
    { id: 3, userId: 'user3', name: 'Mike Johnson', email: 'mike.johnson@example.com', contact: '555-123-4567' },
    // Add more users as needed
  ];
  
  const getUsers = async (page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = users.slice(startIndex, endIndex);
    return { users: paginatedUsers, total: users.length };
  };
  
  const getUserById = async (id) => {
    return users.find(user => user.id === id);
  };
  
  const createUser = async (user) => {
    const newUser = { id: users.length + 1, ...user };
    users.push(newUser);
    return newUser;
  };
  
  const updateUser = async (id, updatedUser) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      return users[index];
    }
    return null;
  };
  
  const deleteUser = async (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      const deletedUser = users.splice(index, 1);
      return deletedUser;
    }
    return null;
  };
  
  const userService = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
  
  export default userService;
  