import React, { useState } from 'react';
import {Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const RuleFormStep3 = ({ onNext, onBack, data }) => {
  const [item, setItem] = useState(data.item || '');
  const [dataType, setDataType] = useState(data.dataType || '');

  const handleNext = () => {
    onNext({ item, dataType });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="item-label">아이템명</InputLabel>
        <Select
          labelId="item-label"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          label="아이템명"
        >
          <MenuItem value="아이템명1">아이템명1</MenuItem>
          <MenuItem value="아이템명2">아이템명2</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="datatype-label">데이터타입</InputLabel>
        <Select
          labelId="datatype-label"
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          label="데이터타입"
        >
          <MenuItem value="데이터타입1">데이터타입1</MenuItem>
          <MenuItem value="데이터타입2">데이터타입2</MenuItem>
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

export default RuleFormStep3;
