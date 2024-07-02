import axios from 'axios';

const BASE_URL = 'http://localhost:9090';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getEquipment = async (page, pageSize) => {
  try {
    const response = await instance.get(`/equipment?page=${page}&pageSize=${pageSize}`);
    return response.data; // Assuming response.data contains equipment and total count
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};


const getEquipmentById = async (id) => {
  try {
    const response = await instance.get(`/equipment/${id}`);
    return response.data; // Assuming response.data contains equipment details
  } catch (error) {
    console.error(`Error fetching equipment with ID ${id}:`, error);
    throw error;
  }
};

const createEquipment = async (equipment) => {
  try {
    const response = await instance.post('/equipment', equipment);
    return response.data; // Assuming response.data contains newly created equipment
  } catch (error) {
    console.error('Error creating equipment:', error);
    throw error;
  }
};

const updateEquipment = async (id, updatedEquipment) => {
  try {
    const response = await instance.put(`/equipment/${id}`, updatedEquipment);
    return response.data; // Assuming response.data contains updated equipment
  } catch (error) {
    console.error(`Error updating equipment with ID ${id}:`, error);
    throw error;
  }
};

const deleteEquipment = async (id) => {
  try {
    const response = await instance.delete(`/equipment/${id}`);
    return response.data; // Assuming response.data contains deleted equipment
  } catch (error) {
    console.error(`Error deleting equipment with ID ${id}:`, error);
    throw error;
  }
};

const getItemsByEquipmentId = async (equipmentId) => {
  try {
    const response = await instance.get(`/equipment/${equipmentId}/items`);
    return response.data; // Assuming response.data contains items associated with equipmentId
  } catch (error) {
    console.error(`Error fetching items for equipment with ID ${equipmentId}:`, error);
    throw error;
  }
};

const createItems = async (equipmentId, items) => {
  try {
    const response = await instance.post(`/equipment/${equipmentId}/items`, items);
    return response.data; // Assuming response.data contains newly created items
  } catch (error) {
    console.error(`Error creating items for equipment with ID ${equipmentId}:`, error);
    throw error;
  }
};

const downloadExcel = async () => {
  // Implement downloadExcel functionality (not included in mock)
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