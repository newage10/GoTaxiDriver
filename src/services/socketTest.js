import io from 'socket.io-client';

// Địa chỉ của server Socket.IO
const SOCKET_URL = 'http://192.168.1.10:5000';

// Kết nối đến server
const socket = io(SOCKET_URL, {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Connected to server');

  // Gửi cập nhật vị trí
  socket.emit('driver_location_update', {
    latitude: 31.24916,
    longitude: 121.48789833333333,
  });

  // Ngắt kết nối sau một thời gian
  setTimeout(() => {
    socket.disconnect();
    console.log('Disconnected from server');
  }, 5000); // Ngắt kết nối sau 5 giây
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
