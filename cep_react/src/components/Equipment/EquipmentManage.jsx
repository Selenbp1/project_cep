import React, { useState, useEffect, useCallback } from 'react';
import { Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import equipmentService from '../../services/equipmentService';
import EquipmentDetailModal from './EquipmentDetailModal';
import '../../styles/Scroll.css'; 

const EquipmentManage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10); 
  const [total, setTotal] = useState(0);

  const fetchEquipment = useCallback(async () => {
    try {
      const response = await equipmentService.getEquipment(page, rowsPerPage);

      if (response && Array.isArray(response)) {
        setEquipmentList(response);
        setTotal(response.length);
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await equipmentService.deleteEquipment(id);
        fetchEquipment();
      } catch (error) {
        console.error('Error deleting equipment:', error);
      }
    }
  };

  const handleCreate = () => {
    setSelectedEquipmentId(null);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    setSelectedEquipmentId(id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleView = (id) => {
    setSelectedEquipmentId(id);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDownloadExcel = async () => {
    try {
      await equipmentService.downloadExcel();
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  return (
    <div className="scroll-container">
      <Box>
        <Box className="title-container">
          <Typography variant="h4" gutterBottom>설비/아이템 관리</Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={handleCreate} sx={{ mb: 2 }}>
          등록
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDownloadExcel} sx={{ mb: 2, ml: 2 }}>
          엑셀 다운로드
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell align="center">장비명</TableCell>
                <TableCell align="center">토픽명</TableCell>
                <TableCell align="center">IP</TableCell>
                <TableCell align="center">Port</TableCell>
                <TableCell align="center">사용여부</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipmentList.map((equip, index) => (
                <TableRow key={equip.id}>
                  <TableCell align="center">{index + 1 + (page - 1) * rowsPerPage}</TableCell>
                  <TableCell>[{equip.id}]_{equip.title}</TableCell>
                  <TableCell align="center">{equip.topic_nm}</TableCell>
                  <TableCell align="center">{equip.ip}</TableCell>
                  <TableCell align="center">{equip.port}</TableCell>
                  <TableCell align="center">{equip.flag ? 'Y' : 'N'}</TableCell>
                  <TableCell align="center">
                    <Button size="small" onClick={() => handleView(equip.id)}>상세보기</Button>
                    <Button size="small" onClick={() => handleEdit(equip.id)}>수정</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(equip.id)}>삭제</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
        {isModalOpen && (
          <EquipmentDetailModal
            open={isModalOpen}
            handleClose={handleModalClose}
            equipmentId={selectedEquipmentId}
            isEditMode={isEditMode}
            onUpdate={fetchEquipment}
          />
        )}
      </Box>
    </div>
  );
};

export default EquipmentManage;
