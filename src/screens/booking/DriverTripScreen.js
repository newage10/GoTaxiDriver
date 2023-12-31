import { NavigationContext } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAppSelector } from '~/configs/hooks';
import SCREENS from '~/constant/screens';
import { tripDriverLocations, tripLocations } from '~/data';
import socketService from '~/services/socketService';

const DriverTripScreen = (props) => {
  const { bookingId, socketId } = props?.route?.params ?? {};
  const navigation = React.useContext(NavigationContext);
  const [currentDriverIndex, setCurrentDriverIndex] = useState(0);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [onPickupRoute, setOnPickupRoute] = useState(true); // Ban đầu, tài xế đang trên đường đón khách
  const mapView = useRef(null);
  const driverId = useAppSelector((state) => state?.driver?.driverId ?? 10);

  const currentLocation = onPickupRoute ? tripDriverLocations[currentDriverIndex] : tripLocations[currentTripIndex];

  const currentTitle = onPickupRoute ? `Điểm hiện tại: ${currentDriverIndex}` : `Điểm hiện tại: ${currentTripIndex}`;

  //Hàm tài xế gửi thông báo đã đến điểm đón
  const handleDriverArrivedRide = (bookingId, socketId) => () => {
    socketService.driverArrivedRide(bookingId, socketId);
    setOnPickupRoute(false);
  };

  //Hàm cập nhật vị trí chuyến đi
  const handleSendDriverLocation = (driverId, locationData) => () => {
    console.log('Socket cập nhật vị trí chuyến đi: ', driverId, JSON.stringify(locationData));
    socketService.sendDriverLocation(driverId, locationData);
  };

  //Hàm xử lý hoàn thành chuyến đi
  const handleCompleteRide = () => {
    socketService.driverCompletedRide(bookingId, driverId, socketId);
    // socketService.disconnectRide(driverId);
    navigation.navigate(SCREENS.HOME);
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      // socketService.stopListeningForRideRequest();
      // socketService.disconnectRide(driverId);
    };
  }, []);

  useEffect(() => {
    let interval;

    const sendDriverLocation = (locationData) => {
      handleSendDriverLocation(driverId, locationData)();
    };

    if (onPickupRoute) {
      // Nếu đang trên đường đón khách
      if (currentDriverIndex === tripDriverLocations.length - 1) {
        // Đã đến điểm đón khách
        Alert.alert('Thông báo', 'Đã đến điểm đón khách hàng', [{ text: 'Xác nhận', onPress: handleDriverArrivedRide(bookingId, socketId) }]);
        console.log('Thông tin vị trí điểm cuối chặn 1: ', JSON.stringify(tripDriverLocations[currentDriverIndex]));
        // Gửi vị trí cuối cùng khi đến nơi
        sendDriverLocation({
          latitude: tripDriverLocations[currentDriverIndex].coordinates.lat,
          longitude: tripDriverLocations[currentDriverIndex].coordinates.lng,
        });
      } else {
        // Tiếp tục di chuyển đến điểm đón khách
        interval = setInterval(() => {
          let nextIndex = currentDriverIndex + 1;
          setCurrentDriverIndex(nextIndex);
          console.log('Thông tin vị trí của tài xe trong chặn 1: ', JSON.stringify(tripDriverLocations[nextIndex]));
          // Gửi vị trí tài xế sau mỗi lần cập nhật
          sendDriverLocation({
            latitude: tripDriverLocations[nextIndex].coordinates.lat,
            longitude: tripDriverLocations[nextIndex].coordinates.lng,
          });
          if (mapView.current) {
            mapView.current.animateToRegion(
              {
                latitude: tripDriverLocations[nextIndex].coordinates.lat,
                longitude: tripDriverLocations[nextIndex].coordinates.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              1000
            );
          }
        }, 5000);
      }
    } else {
      // Nếu đang trên chặn 2 (đưa khách đến điểm đến)
      if (currentTripIndex === tripLocations.length - 1) {
        // Đã hoàn thành chuyến đi
        Alert.alert('Thông báo', 'Đã hoàn thành chuyến đi', [{ text: 'Xác nhận', onPress: handleCompleteRide }]);
        console.log('Thông tin vị trí ở điểm cuối chặn 2: ', JSON.stringify(tripLocations[currentTripIndex]));
        // Gửi vị trí cuối cùng khi hoàn thành chuyến đi
        sendDriverLocation({
          latitude: tripLocations[currentDriverIndex].coordinates.lat,
          longitude: tripLocations[currentDriverIndex].coordinates.lng,
        });
      } else {
        // Tiếp tục chặn 2
        interval = setInterval(() => {
          let nextIndex = currentTripIndex + 1;
          setCurrentTripIndex(nextIndex);
          console.log('Thông tin vị trí trên hành trình chặn 2: ', JSON.stringify(tripLocations[nextIndex]));
          // Gửi vị trí tài xế sau mỗi lần cập nhật
          sendDriverLocation({
            latitude: tripLocations[nextIndex].coordinates.lat,
            longitude: tripLocations[nextIndex].coordinates.lng,
          });
          if (mapView.current) {
            mapView.current.animateToRegion(
              {
                latitude: tripLocations[nextIndex].coordinates.lat,
                longitude: tripLocations[nextIndex].coordinates.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              1000
            );
          }
        }, 5000);
      }
    }

    return () => clearInterval(interval);
  }, [currentDriverIndex, currentTripIndex, onPickupRoute, currentLocation]);

  return (
    <MapView
      style={styles.mapStyle}
      showsUserLocation={false}
      zoomEnabled={true}
      zoomControlEnabled={true}
      initialRegion={{
        latitude: currentLocation.coordinates.lat,
        longitude: currentLocation.coordinates.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      ref={mapView}
    >
      {/* Marker for the current location */}
      <Marker
        key={`coordinate_current`}
        coordinate={{
          latitude: currentLocation.coordinates.lat,
          longitude: currentLocation.coordinates.lng,
        }}
        title={currentTitle}
      />

      {/* Marker for the destination */}
      <Marker
        key={`coordinate_destination`}
        coordinate={{
          latitude: tripLocations[tripLocations.length - 1].coordinates.lat,
          longitude: tripLocations[tripLocations.length - 1].coordinates.lng,
        }}
        title={'Điểm đến'}
      />
    </MapView>
  );
};

export default DriverTripScreen;

const styles = StyleSheet.create({
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
