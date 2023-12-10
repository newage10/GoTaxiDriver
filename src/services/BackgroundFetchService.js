import React, { useEffect } from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import { store } from '~/configs/store.config';
import socketService from './socketService';
// Đường dẫn tới Redux store

const BackgroundFetchService = () => {
  useEffect(() => {
    const configureBackgroundFetch = async () => {
      console.log('Đang cấu hình BackgroundFetch...');
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 1, // Khoảng thời gian fetch tối thiểu là 15 phút
          stopOnTerminate: false,
          startOnBoot: true,
        },
        async (taskId) => {
          console.log('[BackgroundFetch] taskId:', taskId);

          // Lấy trạng thái hiện tại từ Redux store
          const currentState = store.getState();
          const currentPosition = currentState?.map?.currentLocation;
          const isDriverAvailable = currentState?.driver?.isAvailable ?? false;
          const driverId = currentState?.driver?.profile?.id ?? 10;

          if (isDriverAvailable) {
            // Kết nối với Socket.IO nếu chưa kết nối
            if (!socketService.isConnected()) {
              socketService.connect();
            }

            // Gửi vị trí hiện tại đến server nếu có vị trí
            if (currentPosition) {
              console.log('Test 2 background position:', JSON.stringify(currentPosition));
              // socketService.updateLocation(currentPosition.coords);
              socketService.updateLocation(driverId, {
                latitude: currentPosition.coords.latitude,
                longitude: currentPosition.coords.longitude,
              });
            }
          } else {
            // Ngắt kết nối với Socket.IO
            socketService.disconnect();
          }

          // Kết thúc background task
          BackgroundFetch.finish(taskId);
        },
        (error) => {
          console.error('[BackgroundFetch] configure error:', error);
        }
      );
    };

    configureBackgroundFetch();

    return () => {
      // Hủy BackgroundFetch khi không cần thiết
      BackgroundFetch.stop();
      console.log('BackgroundFetch đã dừng.');
    };
  }, []);

  return null;
};

export default BackgroundFetchService;
