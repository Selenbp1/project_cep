import React, { useState } from 'react';
import { Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const RuleFormStep2 = ({ onNext, onBack, data }) => {
  const [equipment, setEquipment] = useState(data.equipment || '');
  const [description, setDescription] = useState(data.description || '');

  const handleNext = () => {
    onNext({ equipment, description });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="equipment-label">장비명</InputLabel>
        <Select
          labelId="equipment-label"
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          label="장비명"
        >
          <MenuItem value="장비1">장비1</MenuItem>
          <MenuItem value="장비2">장비2</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="detail-label">설명</InputLabel>
        <Select
          labelId="detail-label"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="설명"
        >
          <MenuItem value="설명1">설명1</MenuItem>
          <MenuItem value="설명2">설명2</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="contained" onClick={onBack}>
            이전
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
            다음
        </Button>
      </Box>
    </Box>
  );
};

export default RuleFormStep2;
