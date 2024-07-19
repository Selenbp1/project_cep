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
      const response = await getRules(page, pageSize);
      console.log("API Response:", response);
      
      // Assuming response is an array
      const rulesData = response; // Adjust this line
      const fetchedTotal = response.length; // Assuming total is the length of the array
  
      console.log("Fetched rules:", rulesData);
      setRules(rulesData || []);
      setTotal(fetchedTotal || 0); 
    } catch (error) {
      console.error('Error fetching rules:', error.message);
    }
  }, [page, pageSize]);

  useEffect(() => {
    console.log("Fetching rules for page:", page);  // Add this line
    fetchRules();
  }, [fetchRules, page]);

  const handleAddRule = async (newRule) => {
    try {
      const addedRule = await addRule(newRule);
      console.log("Added rule:", addedRule);  // Add this line
      setRules((prevRules) => [...prevRules, addedRule]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding rule:', error.message);
    }
  };
  
  const handleEditRule = async (updatedRule) => {
    try {
      const editedRule = await editRule(updatedRule);
      console.log("Edited rule:", editedRule);  // Add this line
      setRules((prevRules) =>
        prevRules.map((rule) => (rule.id === editedRule.id ? editedRule : rule))
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error editing rule:', error.message);
    }
  };
  
  const handleDeleteRule = async (ruleId) => {
    try {
      await deleteRule(ruleId);
      console.log("Deleted rule ID:", ruleId);  // Add this line
      setRules((prevRules) => prevRules.filter((rule) => rule.id !== ruleId));
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
        <Typography variant="h4" gutterBottom>
          룰 관리
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => openModal()}
      >
        등록
      </Button>
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
              <TableCell>수정</TableCell>
              <TableCell>삭제</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.length > 0 ? (
              rules.map((rule, index) => (
                <TableRow key={rule.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>[{rule.id}]_{rule.rule_nm}</TableCell>
                  <TableCell>{rule.equipment_nm}</TableCell>
                  <TableCell>{rule.item_nm}</TableCell>
                  <TableCell>{rule.code_nm}</TableCell>
                  <TableCell>
                    {rule.feature_nm} (
                    {rule.feature_low_value} ~ {rule.feature_high_value})
                  </TableCell>
                  <TableCell>{rule.alaram_flag ? 'Y' : 'N'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => openModal(rule)}
                    >
                      수정
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteRule(rule.item_id)}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">No data available</TableCell>
              </TableRow>
            )}
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
        <Box
          sx={{
            width: 400,
            margin: 'auto',
            marginTop: '10%',
            padding: 2,
            backgroundColor: 'white',
          }}
        >
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
