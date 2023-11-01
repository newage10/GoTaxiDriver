import { StyleSheet, Text, View, Platform, Alert, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import FastImage from 'react-native-fast-image';
import { NavigationContext, useNavigation } from '@react-navigation/native';
import { PermissionsLocation, searchType } from '~/constant/content';
import images from '~/themes/images';
import { responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';
import { historyBookData } from '~/data';
import SCREENS from '~/constant/screens';
import SplashScreen from 'react-native-splash-screen';
import HomeModal from './HomeModal';
import useToggleState from '~/hooks/useToggleState';
import Colors from '~/themes/colors';

//Giao diện trang home: phía trên: thanh tìm kiếm, kết hợp nút đi vào quản lý user
//Modal phía dưới, chứa thông tin lịch sử chuyến đi
//Khi click vào sẽ tìm kiếm chuyến đi

const HomeScreen = () => {
  const navigation = React.useContext(NavigationContext);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [currentLatitude, setCurrentLatitude] = useState(defaultLocation?.latitude);
  const [currentLongitude, setCurrentLongitude] = useState(defaultLocation?.longitude);
  const [historyVisible, toggleHistoryVisible] = useToggleState(false);
  const [historyTrip, setHistoryTrip] = useState(historyBookData);

  useEffect(() => {
    SplashScreen.hide();
    toggleHistoryVisible();
    handlePermissionsContact();
  }, []);

  useEffect(() => {
    if (currentPosition) {
      const { latitude, longitude } = currentPosition?.coords;
      setCurrentLatitude(latitude);
      setCurrentLongitude(longitude);
    }
  }, [currentPosition]);

  const handlePermissionsContact = () => {
    check(Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then((result) => {
        switch (result) {
          case RESULTS.DENIED:
            request(Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PermissionsLocation.alertRequest).then((result) => {
              switch (result) {
                case RESULTS.DENIED:
                  Alert.alert('Thông báo', PermissionsLocation.alertDenied);
                  break;
                case RESULTS.GRANTED:
                  getCurrentLocation();
                  break;
                case RESULTS.BLOCKED:
                  Alert.alert(
                    'Cấp quyền truy cập',
                    PermissionsLocation.alertGranted,
                    [
                      { text: 'Không', style: 'cancel' },
                      { text: 'Đồng ý', onPress: () => openSettings() },
                    ],
                    { cancelable: true }
                  );
                  break;
              }
            });
            break;
          case RESULTS.GRANTED:
            getCurrentLocation();
            break;
          case RESULTS.BLOCKED:
            Alert.alert(
              'Cấp quyền truy cập',
              PermissionsLocation.alertGranted,
              [
                { text: 'Không', style: 'cancel' },
                { text: 'Đồng ý', onPress: () => openSettings() },
              ],
              { cancelable: true }
            );
            break;
        }
      })
      .catch((error) => {
        if (__DEV__) {
          console.log('Test error permission: ', error);
        }
      });
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition((info) => {
      console.log('Test vi tri: ', info);
      setCurrentPosition(info);
    });
    // Geolocation.getCurrentPosition(
    //   (position) => {
    //     console.log('Vi tri: ', position);
    //     setCurrentPosition(position);
    //   },
    //   (error) => {
    //     // See error code charts below.
    //     console.log(error.code, error.message);
    //   },
    //   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    // );
  };

  const viewSearchHeader = () => {
    return (
      <>
        <View style={styles.viewSearhHeader}>
          <View style={styles.viewLeftHeader}>
            <TouchableOpacity style={styles.btnMap} onPress={toggleHistoryVisible}>
              <FastImage source={images.icMap} style={styles.imgMap} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          <View style={styles.viewCenterHeader}>
            <TouchableOpacity style={styles.btnSearch} onPress={() => navigation.navigate(SCREENS.ORDER_SCREEN)}>
              <FastImage source={images.icSearch} style={styles.imgSearh} resizeMode="contain" />
              <Text style={styles.txtSearch}>Thông tin các yêu cầu đặt xe</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewRightHeader}>
            <TouchableOpacity style={styles.btnAcc} onPress={() => console.log('Test 200')}>
              <FastImage source={images.icAcc} style={styles.imgAcc} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  const viewBottomSheet = () => {
    return <HomeModal modalVisible={historyVisible} toggleModalVisible={toggleHistoryVisible} modalTitle={'Lịch sử chuyến đi'} listDataModal={historyTrip} />;
  };

  const handleSelect = (item) => () => {
    navigation.navigate(SCREENS.BOOKING, {
      searchLocation: {
        locationType: searchType.INPUT,
        inputSource: { desc: item?.fromDesc, location: item?.fromLocation },
        inputDestination: { desc: item?.toDesc, location: item?.toLocation },
      },
    });
  };

  const viewItemHistory = (item) => {
    return (
      <>
        <TouchableOpacity style={[styles.viewItem]} onPress={handleSelect(item)}>
          <View style={styles.viewItemLeft}>
            <FastImage source={item?.goType === 1 ? images.icMotorcycle : item?.goType === 2 ? images.icCar : images.icCarXL} style={styles.icItem} resizeMode="contain" />
            <View style={styles.viewItemContent}>
              <Text style={styles.txtTitle} numberOfLines={2} ellipsizeMode="tail">{`Từ: ${item?.from}`}</Text>
              <Text style={styles.txtDesc} numberOfLines={2} ellipsizeMode="tail">{`Đến: ${item?.to}`}</Text>
            </View>
          </View>
          <View style={styles.viewItemRight}>
            <Text style={styles.txtTitleRight}>{'Thời gian'}</Text>
            <Text style={styles.txtDesc}>{item?.time}</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapStyle}
        showsUserLocation={false}
        zoomEnabled={true}
        zoomControlEnabled={true}
        initialRegion={{
          latitude: currentLatitude,
          longitude: currentLongitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude: currentLatitude, longitude: currentLongitude }} title={'Chợ Bến Thành'} description={'Chợ Bến Thành, Lê Lợi, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam'} />
      </MapView>
      {viewSearchHeader()}
      {viewBottomSheet()}
    </View>
  );
};

export default HomeScreen;

const defaultLocation = {
  latitude: 10.771423,
  longitude: 106.698471,
};

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  MainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: 16,
    backgroundColor: '#F3F4F9',
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHandle: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
  },
  item: {
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    marginVertical: 10,
  },
  viewSearhHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: responsiveSizeOS(20),
    marginHorizontal: responsiveSizeOS(10),
  },
  viewLeftHeader: {
    width: '10%',
    // marginRight: responsiveSizeOS(15),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  btnMap: {
    backgroundColor: Colors.bgGrayT,
    borderRadius: responsiveSizeOS(4),
    height: responsiveSizeOS(30),
    width: responsiveSizeOS(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewCenterHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '75%',
    borderRadius: responsiveSizeOS(15),
    paddingHorizontal: responsiveSizeOS(15),
    height: responsiveSizeOS(35),
  },
  btnSearch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  txtSearch: {
    fontSize: responsiveFontSizeOS(14),
    marginLeft: responsiveSizeOS(15),
  },
  imgSearh: {
    height: responsiveSizeOS(15),
    width: responsiveSizeOS(15),
  },
  imgMap: {
    height: responsiveSizeOS(20),
    width: responsiveSizeOS(20),
  },
  viewRightHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
    height: responsiveSizeOS(35),
  },
  btnAcc: {
    borderRadius: responsiveSizeOS(30),
  },
  imgAcc: {
    height: responsiveSizeOS(35),
    width: responsiveSizeOS(35),
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
    backgroundColor: '#d0aaf3',
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
  txtTitle: {
    fontSize: responsiveFontSizeOS(16),
    color: 'black',
  },
  txtTitleRight: {
    fontSize: responsiveFontSizeOS(16),
    color: 'black',
  },
  txtDesc: {
    fontSize: responsiveFontSizeOS(14),
    color: '#6E6E6E',
    marginTop: responsiveSizeOS(4),
    lineHeight: responsiveSizeOS(20),
  },
});
