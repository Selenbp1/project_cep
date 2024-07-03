import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import equipmentService from '../../services/equipmentService';
import { v4 as uuidv4 } from 'uuid';

const EquipmentDetailModal = ({ open, handleClose, equipmentId, isEditMode, onUpdate }) => {
  const [equipment, setEquipment] = useState({ equipment_nm: '', topic_nm: '', ip: '', port: '', flag: '', item: [] });
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editItemIndex, setEditItemIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      if (equipmentId) {
        try {
          const equipmentData = await equipmentService.getEquipmentById(equipmentId);
          setEquipment(equipmentData[0]);
          setItems(equipmentData[0].item || []);
        } catch (error) {
          console.error('Error fetching equipment data:', error);
        }
      } else {
        setEquipment({ equipment_nm: '', topic_nm: '', ip: '', port: '', flag: '', item: [] });
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
    setEquipment((prevEquipment) => ({
      ...prevEquipment,
      item: newItems,
    }));
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        const updatedEquipment = { ...equipment, item: items };
        if (equipmentId) {
          await equipmentService.updateEquipment(equipmentId, updatedEquipment);
        } else {
          await equipmentService.createEquipment(updatedEquipment);
        }
        console.log("Equipment data:", updatedEquipment);
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving equipment:', error);
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

  const handleEditItem = (index) => {
    setEditItemIndex(index);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    setEquipment((prevEquipment) => ({
      ...prevEquipment,
      item: updatedItems,
    }));
    console.log("Updated items after deletion:", updatedItems);
  };

  const handleSaveItem = (index) => {
    setEditItemIndex(-1);
    console.log("Updated items after edit:", items);
  };

  const handleCancelEditItem = () => {
    setEditItemIndex(-1);
  };

  const handleAddNewItem = () => {
    const newItemObject = { id: null, item_uuid: uuidv4(), item_nm: '', data_type: '' }; 
    setItems((prevItems) => [...prevItems, newItemObject]);
    setEditItemIndex(items.length); // Focuses on the newly added item for editing
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
          name="equipment_nm"
          value={equipment.equipment_nm}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditMode}
        />
        <TextField
          label="토픽명"
          name="topic_nm"
          value={equipment.topic_nm}
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
        <Typography variant="h6" sx={{ mt: 2 }}>
          아이템 정보
        </Typography>
        {isEditMode && (
          <Button variant="outlined" onClick={handleAddNewItem} sx={{ mb: 2 }}>
            아이템 추가
          </Button>
        )}
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell align="center">아이템명</TableCell>
                <TableCell align="center">데이터타입</TableCell>
                {isEditMode && <TableCell align="center">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    {editItemIndex === index ? (
                      <TextField
                        size="small"
                        value={item.item_nm}
                        onChange={(e) => handleItemChange(index, 'item_nm', e.target.value)}
                        style={{ width: '100px', marginLeft: '8px' }}
                      />
                    ) : (
                      item.item_nm
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {editItemIndex === index ? (
                      <TextField
                        size="small"
                        value={item.data_type}
                        onChange={(e) => handleItemChange(index, 'data_type', e.target.value)}
                        style={{ width: '100px', marginLeft: '8px' }}
                      />
                    ) : (
                      item.data_type
                    )}
                  </TableCell>
                  {isEditMode && (
                    <TableCell align="center">
                      {editItemIndex === index ? (
                        <>
                          <Button size="small" onClick={() => handleSaveItem(index)}>저장</Button>
                          <Button size="small" onClick={handleCancelEditItem}>취소</Button>
                        </>
                      ) : (
                        <>
                          <Button size="small" onClick={() => handleEditItem(index)}>수정</Button>
                          <Button size="small" onClick={() => handleDeleteItem(index)}>삭제</Button>
                        </>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {isEditMode && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              저장
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              취소
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

EquipmentDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  equipmentId: PropTypes.number,
  isEditMode: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
};

export default EquipmentDetailModal;
