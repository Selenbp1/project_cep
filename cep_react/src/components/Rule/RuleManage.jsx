// RuleManage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Box, Pagination } from '@mui/material';
import RuleModal from './RuleModal';
import { getRules, addRule, editRule, deleteRule } from '../../services/ruleService';
import '../../styles/Scroll.css'; 

const RuleManage = () => {
  const [rules, setRules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / pageSize);

  const fetchRules = useCallback(async () => {
    try {
      const { rules: fetchedRules, total: fetchedTotal } = await getRules(page, pageSize);
      setRules(fetchedRules);
      setTotal(fetchedTotal);
    } catch (error) {
      console.error('Error fetching rules:', error.message);
    }
  }, [page, pageSize]);
  
  useEffect(() => {
    fetchRules();
  }, [fetchRules, page]);

  const handleAddRule = async (newRule) => {
    try {
      const addedRule = await addRule(newRule);
      setRules((prevRules) => [...prevRules, addedRule]); // 새로운 룰 추가
      setIsModalOpen(false); // 모달 닫기
    } catch (error) {
      console.error('Error adding rule:', error.message);
    }
  };
  
  const handleEditRule = async (updatedRule) => {
    try {
      const editedRule = await editRule(updatedRule);
      setRules((prevRules) => prevRules.map(rule => rule.id === editedRule.id ? editedRule : rule)); // 수정된 룰 업데이트
      setIsModalOpen(false); // 모달 닫기
    } catch (error) {
      console.error('Error editing rule:', error.message);
    }
  };
  
  const handleDeleteRule = async (ruleId) => {
    try {
      await deleteRule(ruleId);
      setRules((prevRules) => prevRules.filter(rule => rule.id !== ruleId)); // 삭제된 룰 제거
    } catch (error) {
      console.error('Error deleting rule:', error.message);
    }
  };

  const openModal = (rule = null) => {
    setSelectedRule(rule);
    setIsModalOpen(true);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    setSelectedRule(null);
  };

  return (
    <div className="scroll-container">
      <Box className="title-container">
        <Typography variant="h4" gutterBottom>룰 관리</Typography>
      </Box>
      <Button variant="contained" color="primary" onClick={() => openModal()}>등록</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>룰명</TableCell>
              <TableCell>장비명</TableCell>
              <TableCell>아이템명</TableCell>
              <TableCell>적용 알고리즘</TableCell>
              <TableCell>함수</TableCell>
              <TableCell>알림 여부</TableCell>
              <TableCell>사용 여부</TableCell>
              <TableCell>수정</TableCell>
              <TableCell>삭제</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule, index) => (
              <TableRow key={rule.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{rule.name}</TableCell>
                <TableCell>{rule.equipment}</TableCell>
                <TableCell>{rule.item}</TableCell>
                <TableCell>{rule.algorithm}</TableCell>
                <TableCell>{rule.featureValue}</TableCell>
                <TableCell>{rule.alert ? 'Yes' : 'No'}</TableCell>
                <TableCell>{rule.active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => openModal(rule)}>수정</Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="error" onClick={() => handleDeleteRule(rule.id)}>삭제</Button>
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
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ width: 400, margin: 'auto', marginTop: '10%', padding: 2, backgroundColor: 'white' }}>
          <RuleModal 
            rule={selectedRule} 
            onSave={selectedRule ? handleEditRule : handleAddRule} 
            onClose={() => setIsModalOpen(false)} 
          />
        </Box>
      </Modal>
    </div>
  );
};

export default RuleManage;
