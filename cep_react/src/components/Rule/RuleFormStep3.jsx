import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const BASE_URL = 'http://localhost:9090';
const API_URL = `${BASE_URL}/rules/form`;

// 숫자와 문자열 매핑 정의
const ORDER_TYPE_MAP = {
  'NONE': 0,
  'ASC': 1,
  'DESC': 2
};

const REVERSE_ORDER_TYPE_MAP = {
  0: 'NONE',
  1: 'ASC',
  2: 'DESC'
};

const RuleFormStep3 = ({ onSave, onBack, data }) => {
  const initialOrderType = ORDER_TYPE_MAP[data.orderType] !== undefined ? ORDER_TYPE_MAP[data.orderType] : 0;
  const [algorithm, setAlgorithm] = useState(data.algorithm || '');
  const [sizeCount, setSizeCount] = useState(data.sizeCount || '');
  const [featureValue, setFeatureValue] = useState(data.featureValue || '');
  const [lowerValue, setLowerValue] = useState(data.lowerValue || '');
  const [upperValue, setUpperValue] = useState(data.upperValue || '');
  const [orderType, setOrderType] = useState(initialOrderType); 
  const [lowerLimit, setLowerLimit] = useState(data.lowerLimit || '');
  const [upperLimit, setUpperLimit] = useState(data.upperLimit || '');
  const [algorithmData, setAlgorithmData] = useState([]);
  const [featureData, setFeatureData] = useState([]);

  useEffect(() => {
    console.log('Initial data:', data); 
    console.log('Initial orderType:', REVERSE_ORDER_TYPE_MAP[data.orderType]); 
    const fetchAlgorithmData = async () => {
      try {
        const response = await axios.get(`${API_URL}/step2`, {
          params: {
            page: 1,
            pageSize: 10,
          },
        });
        setAlgorithmData(response.data);
      } catch (error) {
        console.error('Error fetching algorithm data:', error);
      }
    };

    fetchAlgorithmData();
  }, [data]);

  useEffect(() => {
    const fetchFeatureData = async () => {
      try {
        const response = await axios.get(`${API_URL}/step3`, {
          params: {
            page: 1,
            pageSize: 10,
          },
        });
        setFeatureData(response.data);
      } catch (error) {
        console.error('Error fetching feature data:', error);
      }
    };

    fetchFeatureData();
  }, []);

  const handleSave = () => {
    onSave({
      algorithm,
      sizeCount,
      featureValue,
      lowerValue,
      upperValue,
      orderType, 
      lowerLimit,
      upperLimit,
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
          {algorithmData.map((algorithm) => (
            <MenuItem key={algorithm.code} value={algorithm.code}>
              {algorithm.codeName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Size Count"
        value={sizeCount}
        onChange={(e) => setSizeCount(Number(e.target.value))}
        variant="outlined"
        fullWidth
        type="number"
      />
      <FormControl fullWidth>
        <InputLabel id="feature-select">Feature Value</InputLabel>
        <Select
          labelId="feature-select"
          label="Feature Value"
          value={featureValue}
          onChange={(e) => setFeatureValue(e.target.value)}
          fullWidth
        >
          {featureData.map((feature) => (
            <MenuItem key={feature.code} value={feature.code}>
              {feature.codeName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Lower Value"
        value={lowerValue}
        onChange={(e) => setLowerValue(Number(e.target.value))}
        variant="outlined"
        fullWidth
        type="number"
      />
      <TextField
        label="Upper Value"
        value={upperValue}
        onChange={(e) => setUpperValue(Number(e.target.value))}
        variant="outlined"
        fullWidth
        type="number"
      />
      <FormControl fullWidth>
        <InputLabel id="order-select">Order Type</InputLabel>
        <Select
          labelId="order-select"
          label="Order Type"
          value={orderType} 
          onChange={(e) => {setOrderType(Number(e.target.value))}}
          fullWidth
        >
          <MenuItem value={ORDER_TYPE_MAP['NONE']}>NONE</MenuItem>
          <MenuItem value={ORDER_TYPE_MAP['ASC']}>ASC</MenuItem>
          <MenuItem value={ORDER_TYPE_MAP['DESC']}>DESC</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Lower Limit"
        value={lowerLimit}
        onChange={(e) => setLowerLimit(Number(e.target.value))}
        variant="outlined"
        fullWidth
        type="number"
      />
      <TextField
        label="Upper Limit"
        value={upperLimit}
        onChange={(e) => setUpperLimit(Number(e.target.value))}
        variant="outlined"
        fullWidth
        type="number"
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

export default RuleFormStep3;
