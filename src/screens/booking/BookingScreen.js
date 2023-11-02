import { BackHandler, Dimensions, SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Header from '~/components/Header';
import { WebView } from 'react-native-webview';
import { NavigationContext, useNavigation } from '@react-navigation/native';
import { Footer } from '~/components/Footer';
import DriverReceiverModal from './DriverReceiverModal';
import useToggleState from '~/hooks/useToggleState';
import getDirections from 'react-native-google-maps-directions';
import { orderType } from '../order/OrderScreen';
import { searchType } from '~/constant/content';
import { SCREEN_WIDTH, isEmptyObj, responsiveSizeOS } from '~/helper/GeneralMain';
import SCREENS from '~/constant/screens';
import { Layout } from '~/components/Layout';
import LayoutView from '~/components/LayoutView';

const BookingScreen = (props) => {
  const { searchLocation } = props?.route?.params ?? {};
  const navigation = React.useContext(NavigationContext);
  const webviewRef = useRef(null);
  const [bookingVisible, toggleBookingVisible] = useToggleState(false);
  const [linkWebMap, setLinkWebMap] = useState(null);

  useEffect(() => {
    const { bookType } = searchLocation ?? {};
    if (bookType === orderType.NEW) {
      handleDirections();
    }
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', preventGoBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', preventGoBack);
    };
  }, []);

  useEffect(() => {
    if (!isEmptyObj(searchLocation)) {
      const { locationType, currentSource, currentDestination, inputSource, inputDestination } = searchLocation ?? {};
      let linkDireaction;
      switch (locationType) {
        case searchType.CURRENT:
          linkDireaction = `https://www.google.com/maps/dir/${currentSource?.location?.latitude},${currentSource?.location?.longitude}/${currentDestination?.desc}`;
          break;
        case searchType.INPUT:
          linkDireaction = `https://www.google.com/maps/dir/${inputSource?.desc}/${inputDestination?.desc}`;
          break;
        default:
          break;
      }
      setLinkWebMap(linkDireaction);
    }
  }, [searchLocation]);

  const handleDirections = () => {
    const { locationType, currentSource, currentDestination, inputSource, inputDestination } = searchLocation ?? {};
    const data = {
      source: {
        latitude: locationType === searchType.CURRENT ? currentSource?.location?.latitude : inputSource?.location?.latitude,
        longitude: locationType === searchType.CURRENT ? currentSource?.location?.longitude : inputSource?.location?.longitude,
      },
      destination: {
        latitude: locationType === searchType.CURRENT ? currentDestination?.location?.latitude : inputDestination?.location?.latitude,
        longitude: locationType === searchType.CURRENT ? currentDestination?.location?.longitude : inputDestination?.location?.longitude,
      },
      params: [
        {
          key: 'travelmode',
          value: 'driving', // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: 'dir_action',
          value: 'navigate', // this instantly initializes navigation using the given travel mode
        },
      ],
    };

    getDirections(data);
  };

  const handleBooking = () => {
    setTimeout(() => {
      Alert.alert(
        'Thông báo',
        'Hoàn thành chuyến đi',
        [
          { text: 'Không', style: 'cancel' },
          {
            text: 'Trang chủ',
            onPress: () => navigation.navigate(SCREENS.HOME_SCREEN),
          },
        ],
        { cancelable: true }
      );
    }, 5000);
    handleDirections();
  };

  const preventGoBack = () => {
    navigation.goBack();
    return true;
  };

  return (
    <>
      <LayoutView>
        <Header barStyle="dark-content" title={'Chuyến đi'} onPressLeft={preventGoBack} />
        <SafeAreaView style={styles.container}>
          <View style={styles.viewContent}>
            <WebView source={{ uri: linkWebMap }} javaScriptEnabled={true} ref={webviewRef} startInLoadingState={true} setSupportMultipleWindows={false} />
          </View>
        </SafeAreaView>
        <DriverReceiverModal modalVisible={bookingVisible} toggleModalVisible={toggleBookingVisible} modalTitle={'Chọn tài xế'} handleBooking={handleBooking} />
      </LayoutView>
    </>
  );
};

export default BookingScreen;

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const defaultLocation = {
  id: 1,
  text: 'Chợ Bến Thành',
  desc: 'Chợ Bến Thành, Lê Lợi, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
  location: {
    latitude: 10.771423,
    longitude: 106.698471,
  },
  country: 'VietNam',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentScrollView: {
    paddingBottom: responsiveSizeOS(50),
    paddingHorizontal: responsiveSizeOS(15),
  },
  viewContent: {
    // overflow: 'hidden',
    flex: 1,
    backgroundColor: 'rgb(244,244,244)',
    width: SCREEN_WIDTH,
    borderTopLeftRadius: responsiveSizeOS(20),
    borderTopRightRadius: responsiveSizeOS(20),
  },
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
  containerSheet: {
    height: responsiveSizeOS(300),
    position: 'absolute',
    bottom: 0,
  },
  imgRight: {
    width: responsiveSizeOS(25),
    height: responsiveSizeOS(25),
    resizeMode: 'contain',
  },
});
