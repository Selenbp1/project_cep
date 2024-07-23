import React, { useState, useEffect } from 'react';
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Collapse,
  Box,
  IconButton,
  Pagination
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { fetchRuleData, fetchDetailDataByRuleId } from '../../services/ruleResultListService';
import '../../styles/Scroll.css';

const RuleResultsList = () => {
  const [ruleData, setRuleData] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [page, setPage] = useState(1);
  const [detailPages, setDetailPages] = useState({});
  const [detailData, setDetailData] = useState({});
  const [loading, setLoading] = useState(true);
  const [detailTotalCounts, setDetailTotalCounts] = useState({});

  const itemsPerPage = 5;
  const detailItemsPerPage = 5;

  useEffect(() => {
    const loadRuleData = async () => {
      setLoading(true);
      try {
        const data = await fetchRuleData(page, itemsPerPage);
        const sortedRules = data.rules.sort((a, b) => a.id - b.id);
        setRuleData(sortedRules); 
      } catch (error) {
        console.error('Error loading rule data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRuleData();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    setSelectedRule(null);
  };

  const handleDetailPageChange = async (id, value) => {
    setDetailPages((prev) => ({
      ...prev,
      [id]: value,
    }));
    try {
      const { details, totalCount } = await fetchDetailDataByRuleId(id, value, detailItemsPerPage);
      const sortedDetails = details.sort((a, b) => a.id - b.id);
      setDetailData((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [value]: sortedDetails,
        },
      }));
      setDetailTotalCounts((prev) => ({ ...prev, [id]: totalCount }));
    } catch (error) {
      console.error(`Error loading detail data for rule UUID ${id}:`, error.message);
    }
  };

  const handleRuleClick = async (rule) => {
    if (selectedRule === rule) {
      setSelectedRule(null);
    } else {
      setSelectedRule(rule);
      if (!detailPages[rule.id]) {
        setDetailPages((prev) => ({ ...prev, [rule.id]: 1 }));
        try {
          const { details, totalCount } = await fetchDetailDataByRuleId(rule.id, 1, detailItemsPerPage);
          setDetailData((prev) => ({
            ...prev,
            [rule.id]: {
              1: details,
            },
          }));
          setDetailTotalCounts((prev) => ({ ...prev, [rule.id]: totalCount }));
        } catch (error) {
          console.error(`Error loading detail data for rule ID ${rule.id}:`, error.message);
        }
      }
    }
  };

  const slicedData = ruleData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getDetailDataByRuleId = (id) => {
    const detailPagesData = detailData[id] || {};
    const currentPage = detailPages[id] || 1;
    const data = detailPagesData[currentPage] || [];
    return data;
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
              <TableCell>상세</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedData.map((rule, index) => (
              <React.Fragment key={rule.id}>
                <TableRow onClick={() => handleRuleClick(rule)} style={{ cursor: 'pointer' }}>
                  <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>[{rule.id}]_{rule.ruleNm}</TableCell>
                  <TableCell>{rule.equipmentNm}</TableCell>
                  <TableCell>{rule.itemNm}</TableCell>
                  <TableCell>{rule.ruleNm}</TableCell>
                  <TableCell>{rule.featureNm}</TableCell>
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
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
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
                                <TableCell>Error Value</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                            {getDetailDataByRuleId(rule.id).map((detail, detailIndex) => (
                                <TableRow key={detail.id}>
                                  <TableCell>{(detailPages[rule.id] - 1) * detailItemsPerPage + detailIndex + 1}</TableCell>
                                  <TableCell>{detail.wdate}</TableCell>
                                  <TableCell>{detail.rawValue}</TableCell>
                                  <TableCell>{detail.featureValue}</TableCell>
                                  <TableCell>{detail.errorValue}</TableCell>
                                </TableRow>
                               ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Box display="flex" justifyContent="center" mt={2}>
                          <Pagination
                            count={Math.ceil((detailTotalCounts[rule.id] || 0) / detailItemsPerPage)}
                            page={detailPages[rule.id] || 1}
                            onChange={(event, value) => {
                              console.log(`Changing page to: ${value} for rule ID ${rule.id}`);
                              handleDetailPageChange(rule.id, value);
                            }}
                            color="primary"
                            size="small"
                            showFirstButton
                            showLastButton
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
