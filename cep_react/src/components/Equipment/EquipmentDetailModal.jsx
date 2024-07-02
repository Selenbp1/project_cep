import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import equipmentService from '../../services/equipmentService';

const EquipmentDetailModal = ({ open, handleClose, equipmentId, isEditMode, onUpdate }) => {
  const [equipment, setEquipment] = useState({ name: '', description: '', vendor: '', topic: '', ip: '', port: '', isActive: true });
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      if (equipmentId) {
        try {
          const equipmentData = await equipmentService.getEquipmentById(equipmentId);
          setEquipment(equipmentData);

          const itemsData = await equipmentService.getItemsByEquipmentId(equipmentId);
          setItems(itemsData);
        } catch (error) {
          console.error('Error fetching equipment data:', error);
        }
      } else {
        setEquipment({ name: '', description: '', vendor: '', topic: '', ip: '', port: '', isActive: true });
        setItems([]);
      }
    };

    fetchData();
  }, [equipmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipment((prevEquipment) => ({
      ...prevEquipment,
      [name]: value,
    }));
  };

  const handleItemChange = (index, fieldName, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [fieldName]: value };
    setItems(newItems);
  };

  const handleSave = async () => {
    if (isEditMode) {
      try {
        if (equipmentId) {
          await equipmentService.updateEquipment(equipmentId, equipment);
          await equipmentService.updateItems(equipmentId, items); // 예시 API 호출. 실제로는 적절한 API를 호출해야 함.
        } else {
          const newEquipment = await equipmentService.createEquipment(equipment);
          await equipmentService.createItems(newEquipment.id, items);
        }
        onUpdate();
      } catch (error) {
        console.error('Error saving equipment:', error);
      }
    }
    handleClose();
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const handleAddItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      { equipmentId: '', name: '', dataType: '', isActive: true }
    ]);
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        p: 4,
        bgcolor: 'background.paper',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          장비 정보
        </Typography>
        <TextField
          label="장비명"
          name="name"
          value={equipment.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditMode}
        />
        <TextField
          label="토픽명"
          name="topic"
          value={equipment.topic}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditMode}
        />
        <TextField
          label="IP"
          name="ip"
          value={equipment.ip}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditMode}
        />
        <TextField
          label="Port"
          name="port"
          value={equipment.port}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditMode}
        />
        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 6, mb: 2 }}>
          아이템 정보
          {isEditMode && (
            <Button variant="outlined" color="inherit" onClick={handleAddItem}>
              아이템 추가
            </Button>
          )}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>아이템명</TableCell>
                <TableCell>데이터타입</TableCell>
                <TableCell>사용여부</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? items.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                : items
              ).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      fullWidth
                      disabled={!isEditMode}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item.dataType}
                      onChange={(e) => handleItemChange(index, 'dataType', e.target.value)}
                      fullWidth
                      disabled={!isEditMode}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item.isActive ? 'Yes' : 'No'}
                      onChange={(e) => handleItemChange(index, 'isActive', e.target.value === 'Yes')}
                      fullWidth
                      disabled={!isEditMode}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={items.length}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', mt: 2 }}>
          {isEditMode && (
            <Button variant="contained" color="primary" onClick={handleSave}>
              저장
            </Button>
          )}
          <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

EquipmentDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  equipmentId: PropTypes.number,
  isEditMode: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EquipmentDetailModal;
