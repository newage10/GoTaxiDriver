import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { tripLocations } from '~/data';

const DriverTripScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mapView = useRef(null);

  useEffect(() => {
    if (currentIndex === tripLocations.length - 1) {
      Alert.alert('Thông báo', 'Đã hoàn thành chuyến đi', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
    } else {
      const interval = setInterval(() => {
        let nextIndex = (currentIndex + 1) % tripLocations.length;
        setCurrentIndex(nextIndex);
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

      return () => clearInterval(interval);
    }
  }, [currentIndex]);

  return (
    <MapView
      style={styles.mapStyle}
      showsUserLocation={false}
      zoomEnabled={true}
      zoomControlEnabled={true}
      initialRegion={{
        latitude: tripLocations[0].coordinates.lat,
        longitude: tripLocations[0].coordinates.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      ref={mapView}
    >
      {/* Marker cho điểm hiện tại */}
      <Marker
        key={`coordinate_current`}
        coordinate={{
          latitude: tripLocations[currentIndex].coordinates.lat,
          longitude: tripLocations[currentIndex].coordinates.lng,
        }}
        title={`Điểm hiện tại: ${currentIndex}`}
      />

      {/* Marker cho điểm đến */}
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
