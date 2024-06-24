import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import codeService from '../../services/codeService';

const CodeDetailModal = ({ open, handleClose, codeId, isUpperCode }) => {
  const [code, setCode] = useState(null);

  useEffect(() => {
    if (codeId) {
      // 코드 ID가 주어졌을 때 기존 코드를 불러옴
      fetchCode(codeId);
    } else {
      // 코드 ID가 없으면 새로운 코드 객체를 초기화
      setCode({
        upperCode: '', // 상위 코드 초기값
        codeName: '', // 코드명 초기값
        description: '', // 설명 초기값
        isActive: false, // 사용 여부 초기값
        subCode1: '', // 서브 코드 초기값
        subCode2: '', // 서브 코드 초기값
        subCode3: '', // 서브 코드 초기값
        subCode4: '', // 서브 코드 초기값
        refCode1: '', // 참조 코드 초기값
        refCode2: '', // 참조 코드 초기값
        refCode3: '', // 참조 코드 초기값
        refCode4: '', // 참조 코드 초기값
      });
    }
  }, [codeId]);

  const fetchCode = async (id) => {
    try {
      const codeData = await codeService.getCode(id);
      setCode(codeData);
    } catch (error) {
      console.error('Error fetching code:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCode(prevCode => ({
      ...prevCode,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      if (codeId) {
        // 코드 ID가 있으면 수정
        await codeService.updateCode(codeId, code);
      } else {
        // 코드 ID가 없으면 등록
        await codeService.createCode(code);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving code:', error.message);
    }
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