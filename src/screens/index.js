import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SCREENS from '~/constant/screens';
import LoginScreen from './account/LoginScreen';
import RegisterScreen from './account/RegisterScreen';
import HomeScreen from './home/HomeScreen';
import OrderScreen from './order/OrderScreen';
import ProfileScreen from './profile/ProfileScreen';
import BookingScreen from './booking/BookingScreen';

const Stack = createNativeStackNavigator();
const stackOptions = { headerShown: false, keyboardHandlingEnabled: true, headerVisible: false, gesturesEnabled: true };

const ScreensContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={stackOptions} initialRouteName={SCREENS.LOGIN}>
        <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
        <Stack.Screen name={SCREENS.REGISTER} component={RegisterScreen} />
        <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
        <Stack.Screen name={SCREENS.PROFILE_SCREEN} component={ProfileScreen} />
        <Stack.Screen name={SCREENS.BOOKING_SCREEN} component={BookingScreen} />
        <Stack.Screen name={SCREENS.ORDER_SCREEN} component={OrderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ScreensContainer;

const styles = StyleSheet.create({});
