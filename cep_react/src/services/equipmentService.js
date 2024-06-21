const mockEquipmentList = [
  {
    id: 1,
    name: 'Equipment 1',
    description: 'Description 1',
    vendor: 'Vendor 1',
    topic: 'Topic 1',
    ip: '192.168.0.1',
    port: '8080',
    isActive: true,
  },
  {
    id: 2,
    name: 'Equipment 2',
    description: 'Description 2',
    vendor: 'Vendor 2',
    topic: 'Topic 2',
    ip: '192.168.0.2',
    port: '8081',
    isActive: true,
  },
  // Add more mock data as needed
];

const mockItems = [
  {
    id: 1,
    equipmentId: 1,
    name: 'Item 1',
    dataType: 'Type 1',
    isActive: true,
  },
  {
    id: 2,
    equipmentId: 1,
    name: 'Item 2',
    dataType: 'Type 2',
    isActive: true,
  },
  {
    id: 3,
    equipmentId: 2,
    name: 'Item 3',
    dataType: 'Type 3',
    isActive: true,
  },
  // Add more mock items as needed
];

const getEquipment = async (page, rowsPerPage) => {
  const start = (page - 1) * rowsPerPage;
  const end = page * rowsPerPage;
  return {
      equipment: mockEquipmentList.slice(start, end),
      total: mockEquipmentList.length,
  };
};

const getEquipmentById = async (id) => {
  return mockEquipmentList.find((equipment) => equipment.id === id);
};

const createEquipment = async (equipment) => {
  const newId = mockEquipmentList.length + 1;
  const newEquipment = { ...equipment, id: newId };
  mockEquipmentList.push(newEquipment);
  return newEquipment;
};

const createItems = async (equipmentId, items) => {
  const newItems = items.map(item => ({
      id: mockItems.length + 1,
      equipmentId,
      ...item
  }));
  mockItems.push(...newItems);
  return newItems;
};

const updateEquipment = async (id, updatedEquipment) => {
  const index = mockEquipmentList.findIndex((equipment) => equipment.id === id);
  if (index !== -1) {
      mockEquipmentList[index] = { ...mockEquipmentList[index], ...updatedEquipment };
      return mockEquipmentList[index];
  }
  return null;
};

const deleteEquipment = async (id) => {
  const index = mockEquipmentList.findIndex((equipment) => equipment.id === id);
  if (index !== -1) {
      const deletedEquipment = mockEquipmentList.splice(index, 1);
      return deletedEquipment[0];
  }
  return null;
};

const getItemsByEquipmentId = async (equipmentId) => {
  return mockItems.filter((item) => item.equipmentId === equipmentId);
};

const downloadExcel = async () => {
  console.log('Excel download simulated');
};

const equipmentService = {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getItemsByEquipmentId,
  downloadExcel,
  createItems,
};

export default equipmentService;


// const getEquipment = async (page, rowsPerPage) => {
//     const response = await fetch(`/api/equipment?page=${page}&rowsPerPage=${rowsPerPage}`);
//     return response.json();
//   };
  
//   const getEquipmentById = async (id) => {
//     const response = await fetch(`/api/equipment/${id}`);
//     return response.json();
//   };
  
//   const createEquipment = async (equipment) => {
//     const response = await fetch(`/api/equipment`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(equipment),
//     });
//     return response.json();
//   };
  
//   const updateEquipment = async (id, equipment) => {
//     const response = await fetch(`/api/equipment/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(equipment),
//     });
//     return response.json();
//   };
  
//   const deleteEquipment = async (id) => {
//     const response = await fetch(`/api/equipment/${id}`, {
//       method: 'DELETE',
//     });
//     return response.json();
//   };
  
//   const getItemsByEquipmentId = async (equipmentId) => {
//     const response = await fetch(`/api/equipment/${equipmentId}/items`);
//     return response.json();
//   };
  
//   const downloadExcel = async () => {
//     const response = await fetch(`/api/equipment/excel`);
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'equipment.xlsx';
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };
