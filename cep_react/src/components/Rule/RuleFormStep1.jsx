import React, { useState } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const RuleFormStep1 = ({ onNext, data }) => {
  const [name, setName] = useState(data.name || '');
  const [alert, setAlert] = useState(data.alert || false);
  const [owner, setOwner] = useState(data.owner || '');

  const handleNext = () => {
    onNext({ name, alert, owner });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="룰명"
        value={name}
        onChange={(e) => setName(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel id="alertd-label">알림 여부</InputLabel>
        <Select
          labelId="alert-label"
          value={alert}
          onChange={(e) => setAlert(e.target.value)}
          label="알림 여부"
        >
          <MenuItem value={true}>Yes</MenuItem>
          <MenuItem value={false}>No</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="담당자"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleNext}>
          다음
        </Button>
      </Box>
    </Box>
  );
};

export default RuleFormStep1;
