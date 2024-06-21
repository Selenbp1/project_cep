import React, { useState } from 'react';
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Collapse, Box, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';

const tempData = [
  { id: 1, ruleName: 'Rule 1', equipment: 'Equipment A', item: 'Item X', algorithm: 'Algorithm 1', function: 'Function A', totalData: 100, normalData: 80, abnormalData: 20 },
  { id: 2, ruleName: 'Rule 2', equipment: 'Equipment B', item: 'Item Y', algorithm: 'Algorithm 2', function: 'Function B', totalData: 120, normalData: 100, abnormalData: 20 },
  // Add more data as needed
];

const tempDetailData = [
  { id: 1, ruleId: 1, createdAt: '2024-06-21', rawValue: 100, featureValue: 'Value A', details: 'Details A' },
  { id: 2, ruleId: 1, createdAt: '2024-06-20', rawValue: 120, featureValue: 'Value B', details: 'Details B' },
  { id: 3, ruleId: 2, createdAt: '2024-06-19', rawValue: 110, featureValue: 'Value C', details: 'Details C' },
  { id: 4, ruleId: 2, createdAt: '2024-06-18', rawValue: 130, featureValue: 'Value D', details: 'Details D' },
  // Add more detail data as needed
];

const RuleResultsList = () => {
  const [selectedRule, setSelectedRule] = useState(null);
  const [page, setPage] = useState(1);
  const [detailPages, setDetailPages] = useState({});

  const itemsPerPage = 5;
  const detailItemsPerPage = 2;

  const handlePageChange = (event, value) => {
    setPage(value);
    setSelectedRule(null);
  };

  const handleDetailPageChange = (ruleId, value) => {
    setDetailPages((prev) => ({
      ...prev,
      [ruleId]: value,
    }));
  };

  const slicedData = tempData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleRuleClick = (rule) => {
    if (selectedRule === rule) {
      setSelectedRule(null);
    } else {
      setSelectedRule(rule);
      if (!detailPages[rule.id]) {
        setDetailPages((prev) => ({ ...prev, [rule.id]: 1 }));
      }
    }
  };

  const getDetailDataByRuleId = (ruleId) => {
    return tempDetailData.filter((data) => data.ruleId === ruleId);
  };

  return (
    <div>
      <Box className="title-container">
        <Typography variant="h4" gutterBottom>룰 결과 리스트</Typography>
      </Box>
      <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>룰명</TableCell>
              <TableCell>장비명</TableCell>
              <TableCell>아이템명</TableCell>
              <TableCell>적용 알고리즘</TableCell>
              <TableCell>함수</TableCell>
              <TableCell>전체 데이터</TableCell>
              <TableCell>정상 데이터</TableCell>
              <TableCell>비정상 데이터</TableCell>
              <TableCell>상세</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedData.map((rule, index) => (
              <React.Fragment key={rule.id}>
                <TableRow onClick={() => handleRuleClick(rule)} style={{ cursor: 'pointer' }}>
                  <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{rule.ruleName}</TableCell>
                  <TableCell>{rule.equipment}</TableCell>
                  <TableCell>{rule.item}</TableCell>
                  <TableCell>{rule.algorithm}</TableCell>
                  <TableCell>{rule.function}</TableCell>
                  <TableCell>{rule.totalData}</TableCell>
                  <TableCell>{rule.normalData}</TableCell>
                  <TableCell>{rule.abnormalData}</TableCell>
                  <TableCell>
                    {selectedRule === rule ? (
                      <IconButton size="small" onClick={() => setSelectedRule(null)}>
                        <ExpandLess />
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={() => handleRuleClick(rule)}>
                        <ExpandMore />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                    <Collapse in={selectedRule === rule} timeout="auto" unmountOnExit>
                      <Box margin={1} bgcolor="#f9f9f9" borderRadius={4} p={2}>
                        <Typography variant="h6" gutterBottom>룰 처리 결과 데이터</Typography>
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>생성일</TableCell>
                                <TableCell>Raw Value</TableCell>
                                <TableCell>Feature Value</TableCell>
                                <TableCell>Details</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {getDetailDataByRuleId(rule.id).slice((detailPages[rule.id] - 1) * detailItemsPerPage, detailPages[rule.id] * detailItemsPerPage).map((detail, detailIndex) => (
                                <TableRow key={detail.id}>
                                  <TableCell>{(detailPages[rule.id] - 1) * detailItemsPerPage + detailIndex + 1}</TableCell>
                                  <TableCell>{detail.createdAt}</TableCell>
                                  <TableCell>{detail.rawValue}</TableCell>
                                  <TableCell>{detail.featureValue}</TableCell>
                                  <TableCell>{detail.details}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Box display="flex" justifyContent="center" mt={2}>
                          <Pagination
                            count={Math.ceil(getDetailDataByRuleId(rule.id).length / detailItemsPerPage)}
                            page={detailPages[rule.id] || 1}
                            onChange={(event, value) => handleDetailPageChange(rule.id, value)}
                            color="primary"
                            size="small"
                          />
                        </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(tempData.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>
    </div>
  );
};

export default RuleResultsList;
