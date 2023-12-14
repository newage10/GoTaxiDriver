// socketService.js
import io from 'socket.io-client';

// Thay thế bằng địa chỉ URL thực tế của server Socket.IO
// const SOCKET_URL = 'http://192.168.1.10:5000';
const SOCKET_URL = 'http://35.220.201.164';
const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Sử dụng WebSockets
});

const socketService = {
  // Kết nối với server Socket.IO
  connect() {
    if (!this.isConnected()) {
      socket.connect();
      this.setupListeners();
    }
  },

  // Ngắt kết nối từ server Socket.IO
  disconnect() {
    if (this.isConnected()) {
      socket.disconnect();
    }
  },

  // Kiểm tra xem đã kết nối với server hay chưa
  isConnected() {
    return socket.connected;
  },

  // Thiết lập lắng nghe các sự kiện từ server
  setupListeners() {
    socket.on('rideRequest', (data) => {
      console.log('Ride request received:', data);
    });
    // Thêm các sự kiện khác ở đây nếu cần
  },

  // Lắng nghe một sự kiện từ server
  on(eventName, callback) {
    socket.on(eventName, callback);
  },

  // Gửi một sự kiện tới server
  emit(eventName, data) {
    if (!this.isConnected()) {
      this.connect();
    }
    socket.emit(eventName, data);
  },

  // Gửi cập nhật vị trí tài xế lên server
  updateLocation(driverId, locationData) {
    if (this.isConnected()) {
      const locationPayload = {
        id: driverId,
        status: 'available',
        location: {
          type: 'Point',
          coordinates: [locationData.longitude, locationData.latitude],
        },
      };

      socket.emit('driver_connect', locationPayload);
    }
  },
  // Tài xế chấp nhận cuốc xe
  acceptRide(driverId) {
    this.emit('driver_accepted', { driverId });
  },

  // Tài xế từ chối cuốc xe
  rejectRide(driverId) {
    this.emit('driver_rejected', { driverId });
  },

  //hàm nghe sự kiện rideRequest
  listenForRideRequest(callback) {
    socket.on('rideRequest', callback);
  },

  //hàm hủy nghe sự kiện
  stopListeningForRideRequest() {
    socket.off('rideRequest');
  },
};

export default socketService;
