import React, { useState, useEffect, useCallback } from 'react';
import { Button, Grid, Card, CardContent, Typography, CardActions, Box, Pagination } from '@mui/material';
import codeService from '../../services/codeService';
import CodeDetailModal from './CodeDetailModal';
import '../../styles/Scroll.css';

const CodeManage = () => {
  const [codes, setCodes] = useState([]);
  const [subCodes, setSubCodes] = useState([]);
  const [selectedCodeId, setSelectedCodeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpperCode, setIsUpperCode] = useState(true);
  const [viewedParentCodeId, setViewedParentCodeId] = useState(null);
  const [page, setPage] = useState(1);
  const [subPage, setSubPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  const fetchCodes = useCallback(async () => {
    try {
      const { codes, total } = await codeService.getCodes(page, pageSize);
      setCodes(codes);
      setTotal(total);
    } catch (error) {
      console.error('Failed to fetch codes:', error.message);
    }
  }, [page, pageSize]);

  const fetchSubCodes = useCallback(async (parentCodeId) => {
    try {
      const { subCodes, total } = await codeService.getSubCodes(parentCodeId, subPage, pageSize);
      setSubCodes(subCodes);
      setSubTotal(total);
    } catch (error) {
      console.error('Failed to fetch subcodes:', error.message);
    }
  }, [subPage, pageSize]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  useEffect(() => {
    if (viewedParentCodeId !== null) {
      fetchSubCodes(viewedParentCodeId);
    }
  }, [viewedParentCodeId, fetchSubCodes]);

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 코드를 삭제하시겠습니까?')) {
      try {
        await codeService.deleteCode(id);
        const updatedCodes = codes.filter(code => code.id !== id);
        setCodes(updatedCodes);
        if (viewedParentCodeId === id) {
          setSubCodes([]);
          setViewedParentCodeId(null);
        }
      } catch (error) {
        console.error('Failed to delete code:', error.message);
      }
    }
  };

  const handleCreate = () => {
    setSelectedCodeId(null);
    setIsUpperCode(true);
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
      try {
        const { subCodes } = await codeService.getSubCodes(id);
        setSubCodes(subCodes);
        setViewedParentCodeId(id);
      } catch (error) {
        console.error('Failed to fetch subcodes:', error.message);
      }
    }
  };

  const totalPages = Math.ceil(total / pageSize);
  const subTotalPages = Math.ceil(subTotal / pageSize);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSubPageChange = (event, value) => {
    setSubPage(value);
  };

  return (
    <div className="scroll-container">
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
              <Card style={{ opacity: viewedParentCodeId && code.id !== viewedParentCodeId ? 0.5 : 1 }}>
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
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
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
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={subTotalPages}
                page={subPage}
                onChange={handleSubPageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
           </Box>
          </>
        )}
        <CodeDetailModal
          open={isModalOpen}
          handleClose={handleModalClose}
          codeId={selectedCodeId}
          isUpperCode={isUpperCode}
        />
      </Box>
    </div>
  );
};

export default CodeManage;
