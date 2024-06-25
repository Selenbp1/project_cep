import React, { useState, useEffect, useCallback } from 'react';
import { Button, Grid, Card, CardContent, Typography, CardActions, Box, Pagination } from '@mui/material';
import codeService from '../../services/codeService';
import CodeDetailModal from './CodeDetailModal';
import '../../styles/Scroll.css';

const CodeManage = () => {
  const [codes, setCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [total, setTotal] = useState(0);
  const [subCodes, setSubCodes] = useState([]);
  const [subPage, setSubPage] = useState(1); 
  const [subPageSize] = useState(6);
  const [subTotal, setSubTotal] = useState(0);
  const [viewingSubCodes, setViewingSubCodes] = useState(null); 
  

  const fetchCodes = useCallback(async () => {
    try {
      const { codes: fetchedCodes, total: totalCount } = await codeService.getCodes(page, pageSize);
      const filteredCodes = fetchedCodes.filter(code => !code.group_code); 
      setCodes(filteredCodes);
      setTotal(totalCount);
    } catch (error) {
      console.error('Failed to fetch codes:', error.message);
    }
  }, [page, pageSize]);

  const fetchSubCodes = useCallback(async (parentCodeId) => {
    try {
      const { subCodes, total } = await codeService.getSubCodes(parentCodeId, subPage, subPageSize); 
      setSubCodes(subCodes);
      setSubTotal(total);
    } catch (error) {
      console.error('Failed to fetch sub-codes:', error.message);
    }
  }, [subPage, subPageSize]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  useEffect(() => {
    if (viewingSubCodes) {
      fetchSubCodes(viewingSubCodes.code);
    }
  }, [viewingSubCodes, fetchSubCodes]);


  const handleDelete = async (code) => {
    if (window.confirm('정말로 이 코드를 삭제하시겠습니까?')) {
      try {
        await codeService.deleteCode(code.code);
        const updatedCodes = codes.filter(c => c.code !== code.code);
        setCodes(updatedCodes);
      } catch (error) {
        console.error('Failed to delete code:', error.message);
      }
    }
  };

  const handleCreateParentCode = () => {
    setSelectedCode(null);
    setIsModalOpen(true);
  };

  const handleCreateSubCode = (parentCodeId) => {
    setSelectedCode({ group_code: parentCodeId, code: '', code_name: '', description: '', flag: false, sub_codes: ['', '', '', ''], ref_codes: ['', '', '', ''] });
    setIsModalOpen(true);
  };

  const handleEdit = (code) => {
    setSelectedCode(code);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCode(null); 
  };

  const handleViewSubCodes = async (code) => {
    if (viewingSubCodes && viewingSubCodes.code === code.code) {
      setViewingSubCodes(null); 
    } else {
      setViewingSubCodes(code);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    setViewingSubCodes(null); 
  };

  const handleSubPageChange = (event, value) => {
    setSubPage(value);
    fetchSubCodes(viewingSubCodes.code);
  };

  const totalPages = Math.ceil(total / pageSize);
  const subTotalPages = Math.ceil(subTotal / subPageSize);

  return (
    <div className="scroll-container">
      <Box>
        <Box className="title-container">
          <Typography variant="h4" gutterBottom>공통 코드 관리</Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={handleCreateParentCode} sx={{ mb: 2 }}>
          상위 코드 추가
        </Button>
        <Grid container spacing={3}  >
          {codes.map((code) => (
            <Grid item xs={4} key={code.code}>
              <Card sx={{ height: '100%', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {code.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {code.code_name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleViewSubCodes(code)}>
                    {viewingSubCodes  && viewingSubCodes.code === code.code ? '하위코드숨기기' : '하위코드보기'}
                  </Button>
                  <Button size="small" onClick={() => handleCreateSubCode(code.code)}>
                    하위코드추가
                  </Button>
                  <Button size="small" onClick={() => handleEdit(code)}>
                    수정
                  </Button>
                  <Button size="small" onClick={() => handleDelete(code)} color="error">
                    삭제
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          size="large"
          color="primary"
          sx={{ mt: 4, justifyContent: 'center' }}
        />
      </Box>
      {viewingSubCodes  && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            하위 코드 목록
          </Typography>
          <Grid container spacing={3}>
            {subCodes.map((subCode) => (
              <Grid item xs={4} key={subCode.code}>
                <Card sx={{ height: '100%', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {subCode.code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {subCode.code_name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleEdit(subCode)}>
                      수정
                    </Button>
                    <Button size="small" onClick={() => handleDelete(subCode)} color="error">
                      삭제
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={subTotalPages}
            page={subPage}
            onChange={handleSubPageChange}
            size="large"
            color="primary"
            sx={{ mt: 4, justifyContent: 'center' }}
          />
        </Box>
      )}
      {isModalOpen && (
        <CodeDetailModal
          open={isModalOpen}
          handleClose={handleModalClose}
          code={selectedCode}
        />
      )}
    </div>
  );
};

export default CodeManage;