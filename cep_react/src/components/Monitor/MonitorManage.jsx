import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import monitorService from '../../services/monitorService';
import '../../styles/Title.css';

const MonitorManage = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [realTimeData, setRealTimeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setMonthlyData(await monitorService.getMonthlyData());
      setDailyData(await monitorService.getDailyData());
      setRealTimeData(await monitorService.getRealTimeData());
    };
    fetchData();
  }, []);

  const calculateTotal = (data) => {
    return data.reduce((acc, item) => acc + item.value, 0);
  };

  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(1);
  };

  const totalMonthlyData = calculateTotal(monthlyData);

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
      <Box className="title-container">
        <Typography variant="h4" gutterBottom>모니터링</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper className="monitor-paper" sx={{ height: '100%' }}>
            <Typography variant="h6">금월 데이터 처리 현황</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={monthlyData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}  (${value}건)`}
                  labelLine={false}
                >
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4caf50' : '#f44336'} />
                  ))}
                </Pie>
                <Tooltip 
                formatter={(value, name, props) => [`${calculatePercentage(value, totalMonthlyData)}%`, name]} 
                />
              </PieChart>
            </ResponsiveContainer>
            <Box mt={2} textAlign="center">
              <Typography variant="body1">전체 총 데이터 건 수: {totalMonthlyData}건</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className="monitor-paper" sx={{ height: '100%' }}>
            <Typography variant="h6" mb={6}>금일 데이터 처리 현황</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>종류</TableCell>
                    <TableCell>건수</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dailyData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.type}</TableCell>
                      <TableCell>{data.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Paper className="monitor-paper">
          <Typography variant="h6">실시간 데이터 처리 현황</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={realTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
              <Line type="monotone" dataKey="normal" stroke="#82ca9d" />
              <Line type="monotone" dataKey="abnormal" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default MonitorManage;
