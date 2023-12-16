import { Alert, ScrollView, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavigationContext, useNavigation } from '@react-navigation/native';
import { Footer } from '~/components/Footer';
import Header from '~/components/Header';
import Colors from '~/themes/colors';
import { SCREEN_WIDTH, formatMoneyNumber, isEmptyObj, responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';
import LayoutView from '~/components/LayoutView';
import FastImage from 'react-native-fast-image';
import images from '~/themes/images';
import { useAppDispatch, useAppSelector } from '~/configs/hooks';
import socketService from '~/services/socketService';
import { setDriverAvailability } from '~/redux/driver/actions';
import { fakeLocation, rideRequestData } from '~/data';
import SCREENS from '~/constant/screens';

const ReceiveBookScreen = () => {
  const dispatch = useAppDispatch();
  const [bookReceiveData, setBookReceiveData] = useState(null);
  const isAvailable = useAppSelector((state) => state?.driver?.isAvailable ?? false);
  const driverId = useAppSelector((state) => state?.driver?.driverId ?? 10);
  const currentPosition = useAppSelector((state) => state?.map?.currentLocation ?? fakeLocation);

  const navigation = React.useContext(NavigationContext);

  // Hàm từ chối cuốc xe
  const handleRejectRide = (driverId) => () => {
    socketService.rejectRide(driverId);
    console.log('Tài xế từ chối cuốc xe:', driverId);
  };

  //Hàm tài xế chấp nhận cuốc xe
  const handleAcceptRide = (driverId) => () => {
    socketService.acceptRide(driverId);
    console.log('Cuốc xe đã được chấp nhận:', driverId);
    navigation.navigate(SCREENS.DRIVER_TRIP_SCREEN, { bookingId: bookReceiveData?.bookingInfo?.id });
  };

  const toggleAvailability = () => {
    const newAvailability = !isAvailable;
    dispatch(setDriverAvailability(newAvailability)); // Cập nhật trạng thái trong Redux store
    if (newAvailability) {
      console.log('Test 2 isAvailable: ', newAvailability);
      // Tài xế bây giờ sẵn sàng nhận chuyến, gửi vị trí hiện tại
      socketService.connect(); // Mở kết nối Socket.IO
      socketService.updateLocation(driverId, currentPosition);
      socketService.listenForRideRequest((data) => {
        // Xử lý dữ liệu yêu cầu đi chuyến
        console.log('Ride request received:', data);
        setBookReceiveData(data ?? rideRequestData);
      });
    } else {
      console.log('Tài xế không sẵn sàng nhận chuyến');
      socketService.stopListeningForRideRequest();
      socketService.disconnect(); // Ngắt kết nối Socket.IO
    }
  };

  const onRefreshLoading = () => {};

  useEffect(() => {
    // Cleanup function
    // return () => {
    //   socketService.stopListeningForRideRequest();
    //   socketService.disconnect();
    // };
  }, []);

  const viewItem = (name, value, line = true, fWidthLeft = null, fWidthRight = null) => {
    return (
      <View>
        <View style={styles.viewItem}>
          <Text style={[styles.txtItemLeft, fWidthLeft]}>{name}</Text>
          <Text style={[styles.txtItemRight, fWidthRight]}>{value}</Text>
        </View>
        {line ? <View style={styles.viewLine} /> : null}
      </View>
    );
  };

  const viewReceiveBook = () => {
    const { Customer, pickupLocation, destination, Bill, paymentName, paymentStatus, noteBook } = bookReceiveData?.bookingInfo ?? {};
    console.log('Test bookReceiveData: ', JSON.stringify(bookReceiveData));
    return isAvailable && !isEmptyObj(bookReceiveData) ? (
      <>
        <Text style={styles.txtReceiveInfo}>Thông tin chuyến </Text>
        <View style={styles.viewLine} />
        {viewItem('Tên khách hàng', Customer?.fullname, true)}
        {viewItem('Điện thoại', Customer?.phoneNo, true)}
        {viewItem('Điểm đón', pickupLocation?.locationName, true)}
        {viewItem('Điểm đến', destination?.locationName, true)}
        {viewItem('Mức phí', `${formatMoneyNumber(Bill?.sum)} VNĐ`, true)}
        {viewItem('Phương thức thanh toán', 'Tiền mặt', true)}
        {viewItem('Trạng thái thanh toán', BillTypes[Bill?.status], true)}
        {viewItem('Tin nhắn KH', noteBook ?? 'Gọi điện khi tới', true)}
      </>
    ) : (
      <View style={styles.viewNotFound}>
        <FastImage source={images.imgNotFound} style={styles.imgNotFound} />
      </View>
    );
  };

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
          <View style={styles.viewLine} />
          <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={false} onRefresh={onRefreshLoading} />}>
            {viewReceiveBook()}
          </ScrollView>
        </View>

        <Footer disableShadown backgroundColor="white" containerStyle={styles.viewButtonList}>
          <TouchableOpacity style={[styles.viewInputButton, isEmptyObj(bookReceiveData) ? styles.viewInputButton_Disabled : null]} disabled={isEmptyObj(bookReceiveData)} onPress={handleRejectRide(driverId)}>
            <Text style={styles.txtSubmit}>TỪ CHỐI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.viewInputButton, isEmptyObj(bookReceiveData) ? styles.viewInputButton_Disabled : null]} disabled={isEmptyObj(bookReceiveData)} onPress={handleAcceptRide(driverId)}>
            <Text style={styles.txtSubmit}>XÁC NHẬN</Text>
          </TouchableOpacity>
        </Footer>
      </SafeAreaView>
    </LayoutView>
  );
};

export default ReceiveBookScreen;

const BillTypes = {
  1: 'Chưa thanh toán',
  2: 'Đã thanh toán',
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
    height: responsiveSizeOS(40),
    width: responsiveSizeOS(150),
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
    alignItems: 'flex-start',
    marginVertical: responsiveSizeOS(2),
    paddingVertical: responsiveSizeOS(2),
    paddingHorizontal: responsiveSizeOS(16),
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
  txtItemLeft: {
    fontSize: responsiveFontSizeOS(15),
    color: 'rgb(4, 4, 4)',
    // fontFamily: Fonts.Regular,
    width: '40%',
    textAlign: 'left',
  },
  txtItemRight: {
    fontSize: responsiveFontSizeOS(15),
    color: 'rgb(4, 4, 4)',
    // fontFamily: Fonts.Regular,
    width: '60%',
    textAlign: 'right',
  },
  viewReceiveRide: {
    flex: 1,
    // justifyContent: 'center', // Center the content vertically
    // alignItems: 'center', // Center the content horizontally
    // backgroundColor: 'white',
  },
  viewLine: {
    borderColor: 'rgb(203, 203, 203)',
    marginVertical: responsiveSizeOS(6),
    // width: '100%',
    borderWidth: responsiveSizeOS(0.7),
    borderStyle: 'dotted',
    borderRadius: responsiveSizeOS(1),
    marginHorizontal: responsiveSizeOS(16),
  },
  txtReceiveInfo: {
    fontSize: responsiveFontSizeOS(16),
    color: 'rgb(11, 11, 11)',
    marginTop: responsiveSizeOS(10),
    marginHorizontal: responsiveSizeOS(16),
    textAlign: 'center',
    marginBottom: responsiveSizeOS(16),
  },
  viewButtonList: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  viewNotFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgNotFound: {
    width: '80%',
    height: '50%',
  },
});
