import React, { useState, useEffect } from 'react';
import { Button, Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

const RuleFormStep1 = ({ onNext, data }) => {
  const [ruleNm, setRuleNm] = useState(data.ruleNm || '');
  const [alaramFlag, setAlaramFlag] = useState(data.alaramFlag || '');

  useEffect(() => {
    if (data) {
      setRuleNm(data.ruleNm || '');
      setAlaramFlag(data.alarm_flag || 'N');
    }
  }, [data]);

  const handleNext = () => {
    onNext({ ruleNm, alaramFlag });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="룰 명"
        value={ruleNm}
        onChange={(e) => setRuleNm(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel id="alert-label">알림 여부</InputLabel>
        <Select
          labelId="alert-label"
          value={alaramFlag}
          onChange={(e) => setAlaramFlag(e.target.value)}
          label="알림 여부"
        >
          <MenuItem value="Y">Y</MenuItem>
          <MenuItem value="N">N</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleNext}>
          다음
        </Button>
      </Box>
    </Box>
  );
};

export default RuleFormStep1;
