import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const RuleFormStep4 = ({ onSave, onBack, data }) => {
  const [algorithm, setAlgorithm] = useState(data.algorithm || '');
  const [sizeCount, setSizeCount] = useState(data.sizeCount || '');
  const [featureValue, setFeatureValue] = useState(data.featureValue || '');
  const [lowerValue, setLowerValue] = useState(data.lowerValue || '');
  const [upperValue, setUpperValue] = useState(data.upperValue || '');
  const [statisticValue, setStatisticValue] = useState(data.statisticValue || '');
  const [orderType, setOrderType] = useState(data.orderType || '');
  const [lowerLimit, setLowerLimit] = useState(data.lowerLimit || '');
  const [upperLimit, setUpperLimit] = useState(data.upperLimit || '');

  useEffect(() => {
    if (featureValue !== 'STDEV') {
      setStatisticValue('');
    }
  }, [featureValue]);

  const handleSave = () => {
    onSave({
      algorithm, sizeCount, featureValue, lowerValue, upperValue, 
      statisticValue, orderType, lowerLimit, upperLimit
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="algorithm-select">적용 알고리즘</InputLabel>
        <Select
          labelId="algorithm-select"
          label="적용 알고리즘"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          fullWidth
        >
          <MenuItem value="Algorithm1">Algorithm1</MenuItem>
          <MenuItem value="Algorithm2">Algorithm2</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Size Count"
        value={sizeCount}
        onChange={(e) => setSizeCount(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel id="feature-select">Feature Value</InputLabel>
        <Select
          labelId="Feature Value"
          label="알림 여부"
          value={featureValue}
          onChange={(e) => setFeatureValue(e.target.value)}
          fullWidth
        >
          <MenuItem value="SUM">SUM</MenuItem>
          <MenuItem value="MAX">MAX</MenuItem>
          <MenuItem value="MIN">MIN</MenuItem>
          <MenuItem value="MEAN">MEAN</MenuItem>
          <MenuItem value="COUNT">COUNT</MenuItem>
          <MenuItem value="STDEV">STDEV</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Lower Value"
        value={lowerValue}
        onChange={(e) => setLowerValue(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Upper Value"
        value={upperValue}
        onChange={(e) => setUpperValue(e.target.value)}
        variant="outlined"
        fullWidth
      />
      {featureValue === 'STDEV' && (
        <TextField
          label="Statistic Value"
          value={statisticValue}
          onChange={(e) => setStatisticValue(e.target.value)}
          variant="outlined"
          fullWidth
        />
      )}
      <FormControl fullWidth>
        <InputLabel id="order-select">Order Type</InputLabel>
        <Select
          labelId="order-select"
          label="Order Type"
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          fullWidth
        >
          <MenuItem value="NONE">NONE</MenuItem>
          <MenuItem value="ASC">ASC</MenuItem>
          <MenuItem value="DESC">DESC</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Lower Limit"
        value={lowerLimit}
        onChange={(e) => setLowerLimit(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Upper Limit"
        value={upperLimit}
        onChange={(e) => setUpperLimit(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="contained" onClick={onBack}>
          이전
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          저장
        </Button>
      </Box>
    </Box>
  );
};

export default RuleFormStep4;
