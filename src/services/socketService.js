import io from 'socket.io-client';

// const SOCKET_URL = 'http://192.168.1.10:5000';
const SOCKET_URL = 'http://35.220.201.164';
const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Sử dụng WebSockets
});

const socketService = {
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

  // Kết nối với server Socket.IO
  connect() {
    if (!this.isConnected()) {
      socket.connect();
      // this.setupListeners();
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

  // Get socketId
  getSocketId() {
    return socket.id;
  },

  // Gửi cập nhật vị trí tài xế lên server (để lắng nghe nhận chuyến)
  updateLocation(driverId, locationData) {
    console.log('Test socket updateLocation: ', driverId, this.isConnected(), JSON.stringify(locationData));
    const locationPayload = {
      id: driverId,
      status: 'available',
      location: {
        type: 'Point',
        coordinates: [locationData.longitude, locationData.latitude],
      },
    };

    socket.emit('driver_connect', locationPayload);
  },

  //hàm nghe sự kiện rideRequest
  listenForRideRequest(callback) {
    socket.on('rideRequest', callback);
  },

  //hàm hủy nghe sự kiện
  stopListeningForRideRequest() {
    socket.off('rideRequest');
  },

  //Tãi xế chấp nhận cuốc xe
  acceptRide(driverId) {
    const payload = {
      id: driverId,
    };

    // Nối tên sự kiện 'driver_accepted' với socket.id
    const eventName = 'driver_accepted' + ':' + socket.id;

    // Gửi sự kiện
    socket.emit(eventName, payload);
  },

  //Tài xế từ chối cuốc xe
  rejectRide(driverId) {
    const payload = {
      driverId: driverId,
    };

    // Nối tên sự kiện 'driver_rejected' với socket.id
    const eventName = 'driver_rejected' + ':' + socket.id;

    // Gửi sự kiện
    socket.emit(eventName, payload);
  },

  //Tãi xế gửi thông báo đã đến điểm đón
  driverArrivedRide(bookingId) {
    const payload = {
      id: bookingId,
      socketId: socket.id,
    };

    // Nối tên sự kiện 'driver_arrived' với socket.id
    const eventName = 'driver_arrived' + ':' + socket.id;

    // Gửi sự kiện
    socket.emit(eventName, payload);
  },

  //Hàm gửi thông tin location của tài xế trong chuyến đi
  sendDriverLocation(driverId, locationData) {
    console.log('Sending driver location: ', driverId, JSON.stringify(locationData));

    const locationPayload = {
      id: driverId,
      location: {
        type: 'Point',
        coordinates: [locationData?.longitude, locationData?.latitude],
      },
    };

    socket.emit('driver_location', locationPayload);
  },

  //Tãi xế gửi thông báo đã hoàn thành chuyến đi
  driverCompletedRide(bookingId, driverId) {
    const payload = {
      id: bookingId,
      driverId: driverId,
      socketId: socket.id,
    };

    // Nối tên sự kiện 'driver_completed' với socket.id
    const eventName = 'driver_completed' + ':' + socket.id;

    // Gửi sự kiện
    socket.emit(eventName, payload);
  },

  //Tài xế gửi sự kiện, ngắt kết nối thực hiện chuyến đi
  disconnectRide(driverId) {
    const payload = {
      driverId: driverId,
    };

    // Nối tên sự kiện 'disconnect' với socket.id
    const eventName = 'disconnect' + ':' + socket.id;

    // Gửi sự kiện
    socket.emit(eventName, payload);
  },
};

export default socketService;
