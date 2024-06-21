const exampleCodes = [
    { id: 1, upperCode: 'U001', codeName: 'Code 1', date: '2023-01-01', parentCode: null },
    { id: 2, upperCode: 'U002', codeName: 'Code 2', date: '2023-02-01', parentCode: null },
    { id: 3, upperCode: 'S001', codeName: 'Sub Code 1', date: '2023-03-01', parentCode: 1 },
    { id: 4, upperCode: 'S002', codeName: 'Sub Code 2', date: '2023-04-01', parentCode: 1 },
    { id: 5, upperCode: 'S003', codeName: 'Sub Code 3', date: '2023-05-01', parentCode: 2 },
    // 필요한 만큼 더 추가
  ];
  
  
  const getCodes = async () => {
    return exampleCodes.filter(code => code.parentCode === null);
  };
  
  const getSubCodes = async (parentCodeId) => {
    return exampleCodes.filter(code => code.parentCode === parentCodeId);
  };
  
  const getCode = async (id) => {
    return exampleCodes.find(code => code.id === parseInt(id));
  };
  
  const createCode = async (code) => {
    const newCode = { ...code, id: exampleCodes.length + 1 };
    exampleCodes.push(newCode);
    return newCode;
  };
  
  const updateCode = async (id, code) => {
    const index = exampleCodes.findIndex(c => c.id === parseInt(id));
    exampleCodes[index] = { ...exampleCodes[index], ...code };
    return exampleCodes[index];
  };
  
  const deleteCode = async (id) => {
    const index = exampleCodes.findIndex(c => c.id === parseInt(id));
    const deletedCode = exampleCodes.splice(index, 1);
    return deletedCode;
  };
  
  const codeService = {
    getCodes,
    getSubCodes,
    getCode,
    createCode,
    updateCode,
    deleteCode,
  };
  
  export default codeService;
  