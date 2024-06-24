const tempData = [
    { id: 1, ruleName: 'Rule 1', equipment: 'Equipment A', item: 'Item X', algorithm: 'Algorithm 1', function: 'Function A', totalData: 100, normalData: 80, abnormalData: 20 },
    { id: 2, ruleName: 'Rule 2', equipment: 'Equipment B', item: 'Item Y', algorithm: 'Algorithm 2', function: 'Function B', totalData: 120, normalData: 100, abnormalData: 20 },
    { id: 3, ruleName: 'Rule 2', equipment: 'Equipment B', item: 'Item Y', algorithm: 'Algorithm 2', function: 'Function B', totalData: 120, normalData: 100, abnormalData: 20 },
    { id: 4, ruleName: 'Rule 2', equipment: 'Equipment B', item: 'Item Y', algorithm: 'Algorithm 2', function: 'Function B', totalData: 120, normalData: 100, abnormalData: 20 },
    { id: 5, ruleName: 'Rule 2', equipment: 'Equipment B', item: 'Item Y', algorithm: 'Algorithm 2', function: 'Function B', totalData: 120, normalData: 100, abnormalData: 20 },
    { id: 6, ruleName: 'Rule 2', equipment: 'Equipment B', item: 'Item Y', algorithm: 'Algorithm 2', function: 'Function B', totalData: 120, normalData: 100, abnormalData: 20 },
    // Add more data as needed
  ];
  
  const tempDetailData = [
    { id: 1, ruleId: 1, createdAt: '2024-06-21', rawValue: 100, featureValue: 'Value A', details: 'Details A' },
    { id: 2, ruleId: 1, createdAt: '2024-06-20', rawValue: 120, featureValue: 'Value B', details: 'Details B' },
    { id: 3, ruleId: 2, createdAt: '2024-06-19', rawValue: 110, featureValue: 'Value C', details: 'Details C' },
    { id: 4, ruleId: 2, createdAt: '2024-06-18', rawValue: 130, featureValue: 'Value D', details: 'Details D' },
    { id: 5, ruleId: 1, createdAt: '2024-06-21', rawValue: 100, featureValue: 'Value A', details: 'Details A' },
    { id: 6, ruleId: 1, createdAt: '2024-06-20', rawValue: 120, featureValue: 'Value B', details: 'Details B' },
    { id: 7, ruleId: 2, createdAt: '2024-06-19', rawValue: 110, featureValue: 'Value C', details: 'Details C' },
    { id: 8, ruleId: 2, createdAt: '2024-06-18', rawValue: 130, featureValue: 'Value D', details: 'Details D' },
    { id: 9, ruleId: 1, createdAt: '2024-06-21', rawValue: 100, featureValue: 'Value A', details: 'Details A' },
    { id: 10, ruleId: 1, createdAt: '2024-06-20', rawValue: 120, featureValue: 'Value B', details: 'Details B' },
    { id: 11, ruleId: 2, createdAt: '2024-06-19', rawValue: 110, featureValue: 'Value C', details: 'Details C' },
    { id: 12, ruleId: 2, createdAt: '2024-06-18', rawValue: 130, featureValue: 'Value D', details: 'Details D' },
    // Add more detail data as needed
  ];

const fetchRuleData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tempData);
      }, 1000); // Simulating network delay
    });
  };
  
  const fetchDetailDataByRuleId = (ruleId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tempDetailData.filter((data) => data.ruleId === ruleId));
      }, 1000); // Simulating network delay
    });
  };

  export { fetchRuleData, fetchDetailDataByRuleId };