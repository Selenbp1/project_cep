import { v4 as uuidv4 } from 'uuid';

const initialRules = [
    { id: uuidv4(), name: 'Rule1', equipment: 'Equipment1', item: 'Item1', algorithm: 'Algorithm1', featureValue: 'Function1', alert: true, active: true },
    { id: uuidv4(), name: 'Rule2', equipment: 'Equipment2', item: 'Item2', algorithm: 'Algorithm2', featureValue: 'Function2', alert: false, active: true },
    { id: uuidv4(), name: 'Rule2', equipment: 'Equipment2', item: 'Item2', algorithm: 'Algorithm2', featureValue: 'Function2', alert: false, active: true },
    { id: uuidv4(), name: 'Rule2', equipment: 'Equipment2', item: 'Item2', algorithm: 'Algorithm2', featureValue: 'Function2', alert: false, active: true },
    { id: uuidv4(), name: 'Rule2', equipment: 'Equipment2', item: 'Item2', algorithm: 'Algorithm2', featureValue: 'Function2', alert: false, active: true },
    { id: uuidv4(), name: 'Rule2', equipment: 'Equipment2', item: 'Item2', algorithm: 'Algorithm2', featureValue: 'Function2', alert: false, active: true },
    { id: uuidv4(), name: 'Rule2', equipment: 'Equipment2', item: 'Item2', algorithm: 'Algorithm2', featureValue: 'Function2', alert: false, active: true },
    { id: uuidv4(), name: 'Rule2', equipment: 'Equipment2', item: 'Item2', algorithm: 'Algorithm2', featureValue: 'Function2', alert: false, active: true },
    { id: uuidv4(), name: 'Rule2', equipment: 'Equipment2', item: 'Item2', algorithm: 'Algorithm2', featureValue: 'Function2', alert: false, active: true },
    { id: uuidv4(), name: 'Rule2', equipment: 'Equipment2', item: 'Item2', algorithm: 'Algorithm2', featureValue: 'Function2', alert: false, active: true },
    { id: uuidv4(), name: 'Rule2', equipment: 'Equipment2', item: 'Item2', algorithm: 'Algorithm2', featureValue: 'Function2', alert: false, active: true },
  ];

const getRules = async (page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRules = initialRules.slice(startIndex, endIndex);
    return { rules: paginatedRules, total: initialRules.length };
  };
  
  const addRule = (newRule) => {
    const rule = { ...newRule, id: uuidv4() };
    initialRules.push(rule);
    return rule;
  };
  
  const editRule = (updatedRule) => {
    const index = initialRules.findIndex(rule => rule.id === updatedRule.id);
    if (index !== -1) {
      initialRules[index] = updatedRule;
    }
    return updatedRule;
  };
  
  const deleteRule = (ruleId) => {
    const index = initialRules.findIndex(rule => rule.id === ruleId);
    if (index !== -1) {
      initialRules.splice(index, 1);
    }
    return ruleId;
  };
  
  export { getRules, addRule, editRule, deleteRule };