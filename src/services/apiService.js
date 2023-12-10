import axios from 'axios';
import { getToken } from '~/configs/storageUtils';

const API_BASE_URL = 'http://35.220.201.164/v1';

// Tạo Axios Instance
const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tạo Interceptor để thêm Token vào Headers
apiService.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      //Bearer
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    // Xử lý lỗi
    return Promise.reject(error);
  }
);

//Hàm lấy loại xe
export const getCarTypes = async () => {
  try {
    const response = await apiService.get('/cartypes');
    return response.data;
  } catch (error) {
    console.error('Error fetching car types:', error);
    throw error;
  }
};

// Hàm lấy tất cả các dịch vụ
export const getAllServices = async () => {
  try {
    const response = await apiService.get('/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Hàm đăng ký xe
export const registerCar = async (carData) => {
  try {
    const response = await apiService.post('/car/create', carData);
    return response.data;
  } catch (error) {
    console.error('Error registering car:', error);
    throw error;
  }
};

// Hàm lấy thông tin xe và dịch vụ của tài xế
export const getDriverCars = async (driverId) => {
  try {
    const response = await apiService.get(`/car/driverid/${driverId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching driver cars:', error);
    throw error;
  }
};

export default apiService;
