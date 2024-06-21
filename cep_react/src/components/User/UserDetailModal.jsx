// src/components/User/UserDetailModal.jsx

import React, { useState } from 'react';
import { Modal, Box, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import userService from '../../services/userService'; // 경로 확인 필요

const UserDetailModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    userId: user ? user.userId : '',
    name: user ? user.name : '',
    email: user ? user.email : '',
    contact: user ? user.contact : '',
    isActive: user ? user.isActive : false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (user) {
      await userService.updateUser(user.id, formData);
    } else {
      await userService.createUser(formData);
    }
    onSave();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <TextField name="userId" label="ID" value={formData.userId} onChange={handleChange} fullWidth />
        <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth />
        <TextField name="email" label="Email" value={formData.email} onChange={handleChange} fullWidth />
        <TextField name="contact" label="Contact" value={formData.contact} onChange={handleChange} fullWidth />
        <FormControlLabel
          control={<Checkbox name="isActive" checked={formData.isActive} onChange={handleChange} />}
          label="Active"
        />
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
