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
        const data = await fetchRuleData();
        setRuleData(data);
      } catch (error) {
        console.error('Error loading rule data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRuleData();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
    setSelectedRule(null);
  };

  const handleDetailPageChange = async (item_uuid, value) => {
    setDetailPages((prev) => ({
      ...prev,
      [item_uuid]: value,
    }));
    try {
      console.log(`Fetching detail page ${value} for rule ID ${item_uuid}`);
      const { details, totalCount } = await fetchDetailDataByRuleId(item_uuid, value, detailItemsPerPage);
      console.log('Fetched Detail Data:', details, totalCount);
      setDetailData((prev) => ({
        ...prev,
        [item_uuid]: {
          ...prev[item_uuid],
          [value]: details,
        },
      }));
      setDetailTotalCounts((prev) => ({ ...prev, [item_uuid]: totalCount }));
    } catch (error) {
      console.error(`Error loading detail data for rule UUID ${item_uuid}:`, error.message);
    }
  };

  const handleRuleClick = async (rule) => {
    if (selectedRule === rule) {
      setSelectedRule(null);
    } else {
      setSelectedRule(rule);
      if (!detailPages[rule.item_id]) {
        setDetailPages((prev) => ({ ...prev, [rule.item_id]: 1 }));
        try {
          const { details, totalCount } = await fetchDetailDataByRuleId(rule.item_id, 1, detailItemsPerPage);
          setDetailData((prev) => ({
            ...prev,
            [rule.item_id]: {
              1: details,
            },
          }));
          setDetailTotalCounts((prev) => ({ ...prev, [rule.item_id]: totalCount }));
        } catch (error) {
          console.error(`Error loading detail data for rule ID ${rule.item_id}:`, error.message);
        }
      }
    }
  };

  const slicedData = ruleData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getDetailDataByRuleId = (item_uuid) => {
    const detailPagesData = detailData[item_uuid] || {};
    const currentPage = detailPages[item_uuid] || 1;
    const data = detailPagesData[currentPage] || [];
    console.log('Detail Data for page', currentPage, ':', data);
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
                  <TableCell>[{rule.id}]_{rule.rule_nm}</TableCell>
                  <TableCell>{rule.equipment_nm}</TableCell>
                  <TableCell>{rule.item_nm}</TableCell>
                  <TableCell>{rule.rule_nm}</TableCell>
                  <TableCell>{rule.feature_nm}</TableCell>
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
                            {getDetailDataByRuleId(rule.item_id).map((detail, detailIndex) => (
                                <TableRow key={detail.id}>
                                  <TableCell>{(detailPages[rule.item_id] - 1) * detailItemsPerPage + detailIndex + 1}</TableCell>
                                  <TableCell>{detail.wdate}</TableCell>
                                  <TableCell>{detail.raw_value}</TableCell>
                                  <TableCell>{detail.feature_value}</TableCell>
                                  <TableCell>{detail.error_value}</TableCell>
                                </TableRow>
                               ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Box display="flex" justifyContent="center" mt={2}>
                          <Pagination
                            count={Math.ceil((detailTotalCounts[rule.item_id] || 0) / detailItemsPerPage)}
                            page={detailPages[rule.item_id] || 1}
                            onChange={(event, value) => {
                              console.log(`Changing page to: ${value} for rule ID ${rule.item_id}`);
                              handleDetailPageChange(rule.item_id, value);
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
