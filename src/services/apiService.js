import axios from 'axios';
import { Alert } from 'react-native';
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

//Hàm đăng nhập app
export const loginApp = async (loginData) => {
  try {
    const response = await apiService.post('/driver/login', loginData);
    return response.data;
  } catch (error) {
    let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại';

    // Kiểm tra xem có phản hồi từ server không và có thông báo lỗi không
    if (error?.response?.data) {
      errorMessage = error.response.data;
    }

    return Alert.alert('Thông báo', errorMessage);
  }
};

//Hàm đăng ký app
export const registerApp = async (registerData) => {
  try {
    const response = await apiService.post('/driver/register', registerData);
    return response.data;
  } catch (error) {
    let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại';

    // Kiểm tra xem có phản hồi từ server không và có thông báo lỗi không
    if (error?.response?.data) {
      errorMessage = error.response.data;
    }

    return Alert.alert('Thông báo', errorMessage);
  }
};

//Hàm lấy loại xe
export const getCarTypes = async () => {
  try {
    const response = await apiService.get('/cartypes');
    return response.data;
  } catch (error) {
    let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại';

    // Kiểm tra xem có phản hồi từ server không và có thông báo lỗi không
    if (error?.response?.data) {
      errorMessage = error.response.data;
    }

    return Alert.alert('Thông báo', errorMessage);
  }
};

// Hàm lấy tất cả các dịch vụ
export const getAllServices = async () => {
  try {
    const response = await apiService.get('/services');
    return response.data;
  } catch (error) {
    let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại';

    // Kiểm tra xem có phản hồi từ server không và có thông báo lỗi không
    if (error?.response?.data) {
      errorMessage = error.response.data;
    }

    return Alert.alert('Thông báo', errorMessage);
  }
};

// Hàm đăng ký xe
export const registerCar = async (carData) => {
  try {
    const response = await apiService.post('/car/create', carData);
    return response.data;
  } catch (error) {
    let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại';

    // Kiểm tra xem có phản hồi từ server không và có thông báo lỗi không
    if (error?.response?.data) {
      errorMessage = error.response.data;
    }

    return Alert.alert('Thông báo', errorMessage);
  }
};

// Hàm lấy thông tin xe và dịch vụ của tài xế
export const getDriverCars = async (driverId) => {
  try {
    const response = await apiService.get(`/car/driverid/${driverId}`);
    return response.data;
  } catch (error) {
    let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại';

    // Kiểm tra xem có phản hồi từ server không và có thông báo lỗi không
    if (error?.response?.data) {
      errorMessage = error.response.data;
    }

    return Alert.alert('Thông báo', errorMessage);
  }
};

// Hàm lấy thông tin tài xế
export const getDriverInfo = async (driverId) => {
  try {
    const response = await apiService.get(`/driver/${driverId}`);
    return response.data;
  } catch (error) {
    let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại';

    // Kiểm tra xem có phản hồi từ server không và có thông báo lỗi không
    if (error?.response?.data) {
      errorMessage = error.response.data;
    }

    return Alert.alert('Thông báo', errorMessage);
  }
};

export const updateDriverInfo = async (driverId, driverData) => {
  try {
    const response = await apiService.put(`/driver/updatedriverinfo/${driverId}`, driverData);
    return response.data;
  } catch (error) {
    let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại';

    // Kiểm tra xem có phản hồi từ server không và có thông báo lỗi không
    if (error?.response?.data) {
      errorMessage = error.response.data.message || error.response.data;
    }

    return Alert.alert('Thông báo', errorMessage);
  }
};

//Hàm đăng xuất app
export const logoutApp = async () => {
  try {
    const response = await apiService.post('/driver/logout');
    return response.data;
  } catch (error) {
    let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại';

    // Kiểm tra xem có phản hồi từ server không và có thông báo lỗi không
    if (error?.response?.data) {
      errorMessage = error.response.data.message || error.response.data;
    }

    return Alert.alert('Thông báo', errorMessage);
  }
};

export const updateCarInfo = async (carId, carData) => {
  try {
    const response = await apiService.put(`/car/driverid/${carId}`, carData);
    return response.data;
  } catch (error) {
    let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại';

    // Kiểm tra xem có phản hồi từ server không và có thông báo lỗi không
    if (error?.response?.data) {
      errorMessage = error.response.data.message || error.response.data;
    }

    return Alert.alert('Thông báo', errorMessage);
  }
};

export default apiService;

export const GOOGLE_MAPS_APIKEY = 'AIzaSyD6yL5xr1ainr_kWZvnyRkL-x_c0uDUorw';
// export const GOOGLE_MAPS_APIKEY = 'AIzaSyBv_3P3yNTVYWvi3fdSENaTV-jJ1XzWWAw';
