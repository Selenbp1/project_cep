import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import codeService from '../../services/codeService';

const CodeDetailModal = ({ open, handleClose, code }) => {
  const [codeDetails, setCodeDetails] = useState({
    group_code: '',
    code: '',
    code_name: '',
    description: '',
    flag: false,
    sub_codes: ['', '', '', ''], 
    ref_codes: ['', '', '', ''], 
  });

  useEffect(() => {
    if (code) {
      setCodeDetails({
        ...code,
        flag: code.flag === 'Y',
        sub_codes: code.sub_codes ? [...code.sub_codes, '', '', ''].slice(0, 4) : ['', '', '', ''],
        ref_codes: code.ref_codes ? [...code.ref_codes, '', '', ''].slice(0, 4) : ['', '', '', ''],
      });
    } else {
      setCodeDetails({
        group_code: '',
        code: '',
        code_name: '',
        description: '',
        flag: false,
        sub_codes: ['', '', '', ''],
        ref_codes: ['', '', '', ''],
      });
    }
  }, [code]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setCodeDetails((prevDetails) => ({
        ...prevDetails,
        [name]: checked,
      }));
    } else if (name.startsWith('sub_code') || name.startsWith('ref_code')) {
      const index = parseInt(name[name.length - 1], 10) - 1;
      const newArray = name.startsWith('sub_code')
        ? [...codeDetails.sub_codes]
        : [...codeDetails.ref_codes];
      newArray[index] = value;
      setCodeDetails((prevDetails) => ({
        ...prevDetails,
        [name.startsWith('sub_code') ? 'sub_codes' : 'ref_codes']: newArray,
      }));
    } else {
      setCodeDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const saveDetails = {
        ...codeDetails,
        flag: codeDetails.flag ? 'Y' : 'N',
      };

      if (code && code.code) {
        await codeService.updateCode(code.code, saveDetails );
      } else {
        if (saveDetails.group_code === '') {
          delete saveDetails.group_code;
        }
        await codeService.createCode(saveDetails );
      }
      handleClose();
    } catch (error) {
      console.error('Error saving code:', error.message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle }}>
        <TextField
          label="상위코드"
          name="group_code"
          value={codeDetails.group_code}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!!codeDetails.group_code} 
        />
        <TextField
          label="하위코드"
          name="code"
          value={codeDetails.code}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="코드명"
          name="code_name"
          value={codeDetails.code_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="설명"
          name="description"
          value={codeDetails.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={codeDetails.flag}
              onChange={handleChange}
              name="flag"
            />
          }
          label="사용 여부"
        />
        {[...Array(4)].map((_, index) => (
          <TextField
            key={`sub_code${index + 1}`}
            label={`서브코드${index + 1}`}
            name={`sub_code${index + 1}`}
            value={codeDetails.sub_codes[index]}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        ))}
        {[...Array(4)].map((_, index) => (
          <TextField
            key={`ref_code${index + 1}`}
            label={`참조코드${index + 1}`}
            name={`ref_code${index + 1}`}
            value={codeDetails.ref_codes[index]}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        ))}
        <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>
          저장
        </Button>
        <Button onClick={handleClose} variant="outlined" sx={{ mt: 2, ml: 2 }}>
          닫기
        </Button>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default CodeDetailModal;
