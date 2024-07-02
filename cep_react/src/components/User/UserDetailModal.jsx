import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import userService from '../../services/userService';

const UserDetailModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    contact: '',
    permission: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        password: '', // Do not pre-fill the password for security reasons
        full_name: user.info?.full_name || '',
        email: user.info?.email || '',
        contact: user.info?.contact || '',
        permission: user.permission || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      const userData = {
        username: formData.username,
        password: formData.password, 
        info: {
          full_name: formData.full_name,
          email: formData.email,
          contact: formData.contact,
        },
        permission: formData.permission,
      };

      if (user) {
        await userService.updateUser(user.id, userData);
      } else {
        await userService.createUser(userData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <TextField name="username" label="Username" value={formData.username} onChange={handleChange} fullWidth />
        <TextField name="password" label="Password" type="password" value={formData.password} onChange={handleChange} fullWidth />
        <TextField name="full_name" label="Full Name" value={formData.full_name} onChange={handleChange} fullWidth />
        <TextField name="email" label="Email" value={formData.email} onChange={handleChange} fullWidth />
        <TextField name="contact" label="Contact" value={formData.contact} onChange={handleChange} fullWidth />
        <TextField name="permission" label="Permission" value={formData.permission} onChange={handleChange} fullWidth />
        <Button onClick={handleSubmit} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          Save
        </Button>
        <Button onClick={onClose} variant="contained" color="secondary" style={{ marginTop: '1rem', marginLeft: '1rem' }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default UserDetailModal;
