import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import codeService from '../../services/codeService';

const CodeDetailModal = ({ open, handleClose, codeId, isUpperCode }) => {
  const [code, setCode] = useState(null);

  useEffect(() => {
    const fetchCode = async () => {
      if (codeId) {
        const codeData = await codeService.getCode(codeId);
        setCode(codeData);
      }
    };
    fetchCode();
  }, [codeId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCode(prevCode => ({
      ...prevCode,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    await codeService.updateCode(codeId, code);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle }}>
        {code && (
          <>
            <TextField
              label={isUpperCode ? "상위코드" : "하위코드"}
              name="upperCode"
              value={code.upperCode}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="코드명"
              name="codeName"
              value={code.codeName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="설명"
              name="description"
              value={code.description || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={code.isActive}
                  onChange={handleChange}
                  name="isActive"
                />
              }
              label="사용 여부"
            />
            {[...Array(4)].map((_, index) => (
              <TextField
                key={`subCode${index + 1}`}
                label={`서브코드${index + 1}`}
                name={`subCode${index + 1}`}
                value={code[`subCode${index + 1}`] || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            ))}
            {[...Array(4)].map((_, index) => (
              <TextField
                key={`refCode${index + 1}`}
                label={`참조코드${index + 1}`}
                name={`refCode${index + 1}`}
                value={code[`refCode${index + 1}`] || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            ))}
            <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>
              수정
            </Button>
            <Button onClick={handleClose} variant="outlined" sx={{ mt: 2, ml: 2 }}>
              닫기
            </Button>
          </>
        )}
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
