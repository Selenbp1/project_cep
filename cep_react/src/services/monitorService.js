const getMonthlyData = async () => {
  return [
    { name: '정상 데이터', value: 1000 },
    { name: '비정상 데이터', value: 300 }
  ];
};

const getDailyData = async () => {
  return [
    { type: '전체 데이터', count: 100 },
    { type: '정상 데이터', count: 50 },
    { type: '비정상 데이터', count: 50 }
  ];
};

const getRealTimeData = async () => {
  return [
    { time: '2024-06-21 12:00:00', total: 50, normal: 30, abnormal: 20 },
    { time: '2024-06-21 12:01:00', total: 60, normal: 40, abnormal: 20 },
    { time: '2024-06-21 12:02:00', total: 70, normal: 50, abnormal: 20 },
    // 더 많은 데이터 포인트 추가 가능
  ];
};

const monitorService = {
  getMonthlyData,
  getDailyData,
  getRealTimeData
};

export default monitorService;
