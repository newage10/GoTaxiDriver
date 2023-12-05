import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BackgroundFetch from 'react-native-background-fetch';
import SCREENS from '~/constant/screens';
import LoginScreen from './account/LoginScreen';
import RegisterScreen from './account/RegisterScreen';
import HomeScreen from './home/HomeScreen';
import OrderScreen from './order/OrderScreen';
import ProfileScreen from './profile/ProfileScreen';
import BookingScreen from './booking/BookingScreen';
import ReceiveBookScreen from './order/ReceiveBookScreen';

const Stack = createNativeStackNavigator();
const stackOptions = { headerShown: false, keyboardHandlingEnabled: true, headerVisible: false, gesturesEnabled: true };

const ScreensContainer = () => {
  useEffect(() => {
    // Định nghĩa tác vụ fetch nền
    const onFetch = async (taskId) => {
      console.log('[BackgroundFetch] taskId:', taskId);
      // Gọi hàm lấy vị trí hoặc tác vụ cần thiết
      // Ví dụ: getCurrentLocation();

      // Gọi finish để báo hiệu tác vụ đã hoàn thành
      BackgroundFetch.finish(taskId);
    };

    // Cấu hình và lập lịch cho Background Fetch
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // <-- thời gian lặp lại tối thiểu là 15 phút
        stopOnTerminate: false, // <-- tiếp tục chạy sau khi app tắt
        startOnBoot: true, // <-- bắt đầu lại khi thiết bị khởi động
      },
      onFetch,
      (error) => {
        console.error('[BackgroundFetch] configure error:', error);
      }
    );

    return () => {
      BackgroundFetch.stop();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={stackOptions} initialRouteName={SCREENS.LOGIN}>
        <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
        <Stack.Screen name={SCREENS.REGISTER} component={RegisterScreen} />
        <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
        <Stack.Screen name={SCREENS.PROFILE_SCREEN} component={ProfileScreen} />
        <Stack.Screen name={SCREENS.BOOKING_SCREEN} component={BookingScreen} />
        <Stack.Screen name={SCREENS.ORDER_SCREEN} component={OrderScreen} />
        <Stack.Screen name={SCREENS.RECEIVE_BOOK_SCREEN} component={ReceiveBookScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ScreensContainer;

const styles = StyleSheet.create({});
