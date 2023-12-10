import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavigationContext, useNavigation } from '@react-navigation/native';
import { Footer } from '~/components/Footer';
import Header from '~/components/Header';
import Colors from '~/themes/colors';
import { SCREEN_WIDTH, isEmptyObj, responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';
import LayoutView from '~/components/LayoutView';
import FastImage from 'react-native-fast-image';
import images from '~/themes/images';
import useToggleState from '~/hooks/useToggleState';
import Geolocation from '@react-native-community/geolocation';
import { useAppDispatch, useAppSelector } from '~/configs/hooks';
import { getCurrentLocation } from '~/redux/map/actions';
import { store } from '~/configs/store.config';
import socketService from '~/services/socketService';
import { setDriverAvailability } from '~/redux/driver/actions';

const ReceiveBookScreen = () => {
  const dispatch = useAppDispatch();
  const [isSubmit, setCheckSubmit] = useState(true);
  const isAvailable = useAppSelector((state) => state?.driver?.isAvailable ?? false);
  const driverId = useAppSelector((state) => state?.driver?.profile?.id ?? 10);
  console.log('Test 2 isAvailable: ', isAvailable);

  const navigation = React.useContext(NavigationContext);

  const toggleAvailability = () => {
    const newAvailability = !isAvailable;
    dispatch(setDriverAvailability(newAvailability)); // Cập nhật trạng thái trong Redux store
    if (newAvailability) {
      console.log('Test 2 isAvailable: ', newAvailability);
      // Tài xế bây giờ sẵn sàng nhận chuyến, gửi vị trí hiện tại
      getCurrentLocationMap();
      socketService.connect(); // Mở kết nối Socket.IO
    } else {
      console.log('Tài xế không sẵn sàng nhận chuyến');
      socketService.disconnect(); // Ngắt kết nối Socket.IO
      // Nếu tài xế không còn sẵn sàng, gửi thông báo đến server nếu cần
    }
  };

  const getCurrentLocationMap = useCallback(() => {
    console.log('Test 2 isAvailable getCurrentLocationMap: ', isAvailable);
    // Chỉ lấy vị trí khi tài xế sẵn sàng nhận chuyến
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Test 2 position receive: ', JSON.stringify(position));
        // Dispatch vị trí hiện tại vào Redux store
        dispatch(getCurrentLocation(position));
        // Gửi vị trí hiện tại đến server thông qua Socket.io
        socketService.updateLocation(driverId, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, [dispatch, isAvailable]);

  return (
    <LayoutView>
      <Header barStyle="dark-content" title={'Thông tin chuyến'} onPressLeft={() => navigation.goBack()} />
      <SafeAreaView style={styles.container}>
        <View style={styles.viewContent}>
          <View style={styles.viewReceiveBook}>
            <Text style={styles.txtReceiveBook}>Nhận chuyến</Text>
            <TouchableOpacity style={styles.btnReceiveBook} onPress={toggleAvailability}>
              <FastImage source={isAvailable ? images.icSwitchOn : images.icSwitchOff} style={styles.imgReceiveBook} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
        <Footer disableShadown backgroundColor="white">
          <TouchableOpacity style={[styles.viewInputButton, !isSubmit ? styles.viewInputButton_Disabled : null]} disabled={!isSubmit}>
            <Text style={styles.txtSubmit}>BẮT ĐẦU</Text>
          </TouchableOpacity>
        </Footer>
      </SafeAreaView>
    </LayoutView>
  );
};

export default ReceiveBookScreen;

export const orderType = {
  NEW: 1,
  HISTORY: 2,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    backgroundColor: Colors.bgWhite2,
  },
  contentScrollView: {
    paddingBottom: responsiveSizeOS(50),
    paddingHorizontal: responsiveSizeOS(15),
  },
  viewContent: {
    flex: 1,
    backgroundColor: 'white',
    width: SCREEN_WIDTH,
    borderTopLeftRadius: responsiveSizeOS(20),
    borderTopRightRadius: responsiveSizeOS(20),
    paddingTop: responsiveSizeOS(4),
    paddingHorizontal: responsiveSizeOS(15),
  },
  viewSearch: {
    height: responsiveSizeOS(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
    borderWidth: responsiveSizeOS(0.5),
    borderColor: 'rgb(203, 203, 203)',
    borderRadius: responsiveSizeOS(10),
    paddingHorizontal: responsiveSizeOS(10),
    marginBottom: responsiveSizeOS(16),
    width: '98%',
  },
  viewSelectLocation: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: responsiveSizeOS(10),
    marginBottom: responsiveSizeOS(15),
  },
  btnSelectLocation: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveSizeOS(16),
    height: responsiveSizeOS(32),
    paddingHorizontal: responsiveSizeOS(16),
  },
  btnSelectLocationEnable: {
    backgroundColor: Colors.txtGreen,
  },
  txtSelectService: {
    fontSize: responsiveFontSizeOS(16),
    color: 'rgb(11, 11, 11)',
  },
  txtSelectServiceEnable: {
    color: 'white',
  },
  viewInputButton: {
    bottom: 0,
    backgroundColor: Colors.btnSubmit,
    borderRadius: responsiveSizeOS(15),
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveSizeOS(45),
    width: SCREEN_WIDTH - responsiveSizeOS(30),
    marginBottom: responsiveSizeOS(12),
    alignSelf: 'center',
    marginTop: responsiveSizeOS(10),
  },
  viewInputButton_Disabled: {
    backgroundColor: Colors.bgGray,
  },
  txtSubmit: {
    fontSize: responsiveFontSizeOS(16),
    color: 'white',
  },
  viewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: responsiveSizeOS(8),
    paddingVertical: responsiveSizeOS(8),
    paddingHorizontal: responsiveSizeOS(10),
  },
  viewItemEnable: {
    backgroundColor: Colors.txtGreen,
  },
  viewItemLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '70%',
  },
  icItem: {
    width: responsiveSizeOS(24),
    height: responsiveSizeOS(24),
  },
  txtTitle: {
    fontSize: responsiveFontSizeOS(16),
    color: 'black',
  },
  txtTitleEnable: {
    color: Colors.txtWhite,
  },
  txtTitleRight: {
    fontSize: responsiveFontSizeOS(16),
    color: 'black',
  },
  viewItemContent: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: responsiveSizeOS(15),
  },
  viewItemRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '30%',
  },
  txtDesc: {
    fontSize: responsiveFontSizeOS(14),
    color: '#6E6E6E',
    marginTop: responsiveSizeOS(4),
    lineHeight: responsiveSizeOS(20),
  },
  bookList: {
    flex: 1,
    width: '100%',
  },
  btnReceiveBook: {
    width: responsiveSizeOS(100),
    height: responsiveSizeOS(30),
    alignItems: 'flex-end',
  },
  imgReceiveBook: {
    width: responsiveSizeOS(50),
    height: responsiveSizeOS(30),
  },
  viewReceiveBook: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveSizeOS(16),
    marginHorizontal: responsiveSizeOS(16),
  },
  txtReceiveBook: {
    fontSize: responsiveFontSizeOS(16),
    color: 'rgb(11, 11, 11)',
  },
});
