import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import userService from '../../services/userService';

const UserDetailModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user ? user.username : '', 
    name: user ? user.info[0].full_name : '',
    email: user ? user.info[0].email : '', 
    contact: user ? user.info[0].contact : '', 
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
    try {
      if (user) {
        await userService.updateUser(user.id, formData); 
      } else {
        await userService.createUser(formData); 
      }
      onSave();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
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
