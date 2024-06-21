import React, { useState } from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Box } from '@mui/material';
import RuleModal from './RuleModal';
import { v4 as uuidv4 } from 'uuid';

const initialRules = [
  { id: uuidv4(), name: 'Rule1', equipment: 'Equipment1', item: 'Item1', algorithm: 'Algorithm1', featureValue: 'Function1', alert: true, active: true },
  { id: uuidv4(), name: 'Rule2', equipment: 'Equipment2', item: 'Item2', algorithm: 'Algorithm2', featureValue: 'Function2', alert: false, active: true },
];

const RuleManage = () => {
  const [rules, setRules] = useState(initialRules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const handleAddRule = (newRule) => {
    setRules([...rules, { ...newRule, id: uuidv4() }]);
    setIsModalOpen(false);
  };

  const handleEditRule = (updatedRule) => {
    setRules(rules.map(rule => rule.id === updatedRule.id ? updatedRule : rule));
    setIsModalOpen(false);
  };

  const handleDeleteRule = (ruleId) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  const openModal = (rule = null) => {
    setSelectedRule(rule);
    setIsModalOpen(true);
  };

  return (
    <div>
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
