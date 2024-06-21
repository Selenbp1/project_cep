import React, { useState, useEffect } from 'react';
import { Button, Grid, Card, CardContent, Typography, CardActions, Box } from '@mui/material';
import codeService from '../../services/codeService';
import CodeDetailModal from './CodeDetailModal';

const CodeManage = () => {
  const [codes, setCodes] = useState([]);
  const [subCodes, setSubCodes] = useState([]);
  const [selectedCodeId, setSelectedCodeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpperCode, setIsUpperCode] = useState(true);
  const [viewedParentCodeId, setViewedParentCodeId] = useState(null);

  useEffect(() => {
    const fetchCodes = async () => {
      const codes = await codeService.getCodes();
      setCodes(codes);
    };
    fetchCodes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this code?')) {
      await codeService.deleteCode(id);
      const updatedCodes = codes.filter(code => code.id !== id);
      setCodes(updatedCodes);
      setSubCodes([]);
      setViewedParentCodeId(null);
    }
  };

  const handleCreate = () => {
    setSelectedCodeId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id, isUpper) => {
    setSelectedCodeId(id);
    setIsUpperCode(isUpper);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleViewSubCodes = async (id) => {
    if (id === viewedParentCodeId) {
      setSubCodes([]);
      setViewedParentCodeId(null);
    } else {
      const subCodes = await codeService.getSubCodes(id);
      setSubCodes(subCodes);
      setViewedParentCodeId(id);
    }
  };

  return (
    <Box>
      <Box className="title-container">
        <Typography variant="h4" gutterBottom>공통 코드 관리</Typography>
      </Box>
      <Button variant="contained" color="primary" onClick={handleCreate} sx={{ mb: 2 }}>
        등록
      </Button>
      <Grid container spacing={3}>
        {codes.map(code => (
          <Grid item xs={12} sm={6} md={4} key={code.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">No. {code.id}</Typography>
                <Typography variant="body2" color="textSecondary">상위코드: {code.upperCode}</Typography>
                <Typography variant="body2" color="textSecondary">코드명: {code.codeName}</Typography>
                <Typography variant="body2" color="textSecondary">날짜: {code.date}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEdit(code.id, true)}>상세보기</Button>
                <Button size="small" color="error" onClick={() => handleDelete(code.id)}>삭제</Button>
                <Button size="small" onClick={() => handleViewSubCodes(code.id)}>
                  {viewedParentCodeId === code.id ? '하위코드 숨기기' : '하위코드 보기'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {subCodes.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>하위코드 리스트</Typography>
          <Grid container spacing={3}>
            {subCodes.map(subCode => (
              <Grid item xs={12} sm={6} md={4} key={subCode.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">No. {subCode.id}</Typography>
                    <Typography variant="body2" color="textSecondary">하위코드: {subCode.upperCode}</Typography>
                    <Typography variant="body2" color="textSecondary">코드명: {subCode.codeName}</Typography>
                    <Typography variant="body2" color="textSecondary">날짜: {subCode.date}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleEdit(subCode.id, false)}>상세보기</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(subCode.id)}>삭제</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      <CodeDetailModal
        open={isModalOpen}
        handleClose={handleModalClose}
        codeId={selectedCodeId}
        isUpperCode={isUpperCode}
      />
    </Box>
  );
};

export default CodeManage;
