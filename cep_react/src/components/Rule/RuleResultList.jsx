import React, { useState, useEffect } from 'react';
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Collapse, Box, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';
import { fetchRuleData, fetchDetailDataByRuleId } from '../../services/ruleResultListService';
import '../../styles/Scroll.css'; 

const RuleResultsList = () => {
  const [ruleData, setRuleData] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [page, setPage] = useState(1);
  const [detailPages, setDetailPages] = useState({});
  const [detailData, setDetailData] = useState({});
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;
  const detailItemsPerPage = 5;

  useEffect(() => {
    const loadRuleData = async () => {
      setLoading(true);
      const data = await fetchRuleData();
      setRuleData(data);
      setLoading(false);
    };

    loadRuleData();
  }, []);

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

  const handleRuleClick = async (rule) => {
    if (selectedRule === rule) {
      setSelectedRule(null);
    } else {
      setSelectedRule(rule);
      if (!detailPages[rule.id]) {
        setDetailPages((prev) => ({ ...prev, [rule.id]: 1 }));
      }
      if (!detailData[rule.id]) {
        const data = await fetchDetailDataByRuleId(rule.id);
        setDetailData((prev) => ({ ...prev, [rule.id]: data }));
      }
    }
  };

  const slicedData = ruleData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getDetailDataByRuleId = (ruleId) => {
    return detailData[ruleId] || [];
  };

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <div className="scroll-container">
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
                      <Box margin={1} bgcolor="#f9f9d8" borderRadius={4} p={2}>
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
          count={Math.ceil(ruleData.length / itemsPerPage)}
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
