import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';
import userService from '../../services/userService';
import UserDetailModal from './UserDetailModal';
import '../../styles/Scroll.css';

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // Adjusted page size for demonstration
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const { users: fetchedUsers, total: fetchedTotal } = await userService.getUsers(page, pageSize);
      setUsers(fetchedUsers);
      setTotal(fetchedTotal);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this user?')) {
        await userService.deleteUser(id);
        fetchUsers();
      }
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handling cases where users is not an array (edge case)
  if (!Array.isArray(users)) {
    console.error('Users data is not an array:', users);
    return null; // or handle differently as per your app's logic
  }

  return (
    <div className="scroll-container">
      <Box className="title-container">
        <Typography variant="h4" gutterBottom>사용자 정보 관리</Typography>
      </Box>
      <Button variant="contained" onClick={() => openModal(null)}>Add User</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Permission</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.contact}</TableCell>
                <TableCell>{user.permission}</TableCell>
                <TableCell>
                  <Button onClick={() => openModal(user)} startIcon={<Edit />}>Edit</Button>
                  <Button onClick={() => handleDelete(user.id)} startIcon={<Delete />} color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
      {isModalOpen && (
        <UserDetailModal
          user={selectedUser}
          onClose={closeModal}
          onSave={() => {
            closeModal();
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

export default UserManage;
