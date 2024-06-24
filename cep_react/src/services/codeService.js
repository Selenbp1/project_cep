const exampleCodes = [
    { id: 1, upperCode: 'U001', codeName: 'Code 1', date: '2023-01-01', parentCode: null },
    { id: 2, upperCode: 'U002', codeName: 'Code 2', date: '2023-02-01', parentCode: null },
    { id: 3, upperCode: 'U003', codeName: 'Code 3', date: '2023-03-01', parentCode: null },
    { id: 4, upperCode: 'S001', codeName: 'Sub Code 1', date: '2023-03-01', parentCode: 1 },
    { id: 5, upperCode: 'S002', codeName: 'Sub Code 2', date: '2023-04-01', parentCode: 1 },
    { id: 6, upperCode: 'S003', codeName: 'Sub Code 3', date: '2023-05-01', parentCode: 1 },
    { id: 7, upperCode: 'S004', codeName: 'Sub Code 4', date: '2023-04-01', parentCode: 2 },
    { id: 8, upperCode: 'S005', codeName: 'Sub Code 5', date: '2023-05-01', parentCode: 2 },
    { id: 9, upperCode: 'S006', codeName: 'Sub Code 6', date: '2023-06-01', parentCode: 3 },
    { id: 10, upperCode: 'S007', codeName: 'Sub Code 7', date: '2023-06-01', parentCode: 3 },
    { id: 11, upperCode: 'S008', codeName: 'Sub Code 8', date: '2023-06-01', parentCode: 3 },
  ];
  
  
  const getCodes = async (page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCodes = exampleCodes.filter(code => code.parentCode === null).slice(startIndex, endIndex);
    return { codes: paginatedCodes, total: exampleCodes.filter(code => code.parentCode === null).length };
  };
  
  const getSubCodes = async (parentCodeId, page, pageSize) => {
    const subCodes = exampleCodes.filter(code => code.parentCode === parentCodeId);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedSubCodes = subCodes.slice(startIndex, endIndex);
    return { subCodes: paginatedSubCodes, total: subCodes.length };
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
  