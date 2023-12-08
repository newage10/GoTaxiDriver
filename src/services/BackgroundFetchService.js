import React, { useEffect } from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import { store } from '~/configs/store.config';
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
          const currentPosition = currentState.map.currentLocation; // Đảm bảo đường dẫn này phản ánh cấu trúc của store của bạn

          console.log('Test 2 currentState: ', JSON.stringify(currentState));
          if (currentPosition) {
            console.log('Test 2 background position:', JSON.stringify(currentPosition));

            // Gửi vị trí hiện tại đến server hoặc thực hiện các tác vụ khác
            // TODO: Gọi API hoặc gửi thông tin qua Socket.IO
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
