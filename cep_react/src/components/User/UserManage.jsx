import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';
import userService from '../../services/userService'; 
import UserDetailModal from './UserDetailModal'; 

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    const { users, total } = await userService.getUsers(page, pageSize);
    setUsers(users);
    setTotal(total);
  }, [page, pageSize]);

  useEffect(() => {
    fetchUsers(); // Initial fetch
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await userService.deleteUser(id);
      fetchUsers();
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

  return (
    <div>
      <Box className="title-container">
        <Typography variant="h4" gutterBottom>사용자 정보 관리</Typography>
      </Box>
      <Button variant="contained" onClick={() => openModal(null)}>Add User</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.contact}</TableCell>
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
