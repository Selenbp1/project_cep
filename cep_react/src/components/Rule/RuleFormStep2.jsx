import React, { useState, useEffect } from 'react';
import { Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const BASE_URL = 'http://localhost:9090';
const API_URL = `${BASE_URL}/rules/form`;

const RuleFormStep2 = ({ onNext, onBack, data }) => {
  const [equipmentId, setEquipmentId] = useState(data.equipmentId || '');
  const [itemId, setItemId] = useState(data.itemId || '');
  const [dataType, setDataType] = useState(data.dataType || '');
  const [equipmentData, setEquipmentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/step1`, {
          params: {
            page: 1,
            pageSize: 10,
          },
        });
        setEquipmentData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.equipmentId) {
      setEquipmentId(data.equipmentId);
    }
    if (data.itemId) {
      setItemId(data.itemId);
    }
    if (data.dataType) {
      setDataType(data.dataType);
    }
  }, [data]);

  
  const handleNext = () => {
    onNext({ equipmentId, itemId, dataType });
  };

  const selectedEquipment = equipmentData.find(equip => equip.equipmentId === equipmentId);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="equipment-label">장비명</InputLabel>
        <Select
          labelId="equipment-label"
          value={equipmentId}
          onChange={(e) => setEquipmentId(e.target.value)}
          label="장비명"
        >
          {equipmentData.map(equip => (
            <MenuItem key={equip.equipmentId} value={equip.equipmentId}>
              {equip.equipmentNm}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
       <FormControl fullWidth>
        <InputLabel id="item-label">아이템명</InputLabel>
        <Select
          labelId="item-label"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          label="아이템명"
        >
          {selectedEquipment?.item.map(it => (
            <MenuItem key={it.itemId} value={it.itemId}>
              {it.itemNm}
            </MenuItem>
          ))}
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
          {selectedEquipment?.item.map(it => (
            <MenuItem key={it.itemId} value={it.dataType}>
              {it.dataType}
            </MenuItem>
          ))}
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
