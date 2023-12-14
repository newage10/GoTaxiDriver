import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, RefreshControl, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { HeaderPopup } from '~/components/HeaderPopup';
import { isEmptyObj, responsiveFontSizeOS, responsiveSizeOS, screenWidth } from '~/helper/GeneralMain';
import Colors from '~/themes/colors';
import { getAllServices, getCarTypes, getDriverCars, registerCar } from '~/services/apiService';
import { TextInputComponent } from '~/components/TextInputComponent';
import ListDataModal from './ListDataModal';
import useToggleState from '~/hooks/useToggleState';
import { useAppSelector } from '~/configs/hooks';

const RegisterCarModal = (props) => {
  const { modalVisible, toggleModalVisible, modalTitle } = props ?? {};
  const [carTypes, setCarTypes] = useState([]);
  const [servicesTypes, setServicesTypes] = useState([]);
  const [licensePlate, setLicensePlate] = useState(null);
  const [carName, setCarName] = useState(null);
  const [carTypeVisible, toggleCarTypeVisible] = useToggleState(false);
  const [selectedCarType, setSelectedCarType] = useState(null);
  const [serviceTypeVisible, toggleServiceTypeVisible] = useToggleState(false);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [isSubmit, setCheckSubmit] = useState(true);
  const [driverData, setDriverData] = useState(null);
  const driverId = useAppSelector((state) => state?.driver?.driverId ?? 10);

  const handleClose = () => {
    toggleModalVisible();
  };

  useEffect(() => {
    if (!isEmptyObj(driverData)) {
      const { carName, licensePlate } = driverData ?? {};
      setCarName(carName);
      setLicensePlate(licensePlate);
    }
  }, [driverData]);

  const handleSetData = (data, key) => {
    switch (key) {
      case registerDriver.licensePlate:
        setLicensePlate(data);
        break;
      case registerDriver.carName:
        setCarName(data);
        break;
    }
  };

  const fetchDriverData = async (driverId) => {
    try {
      const response = await getDriverCars(driverId);
      console.log('Test 2 response: ', JSON.stringify(response));
      setDriverData(response); // Lưu dữ liệu vào state
    } catch (error) {
      console.error('Error fetching car types:', error);
    }
  };

  // Gọi API lấy các loại xe
  const fetchCarTypes = async () => {
    try {
      const response = await getCarTypes();
      console.log('Test 2 response: ', JSON.stringify(response));
      setCarTypes(response); // Lưu dữ liệu vào state
    } catch (error) {
      console.error('Error fetching car types:', error);
    }
  };

  // Gọi API lấy tất cả các dịch vụ
  const fetchServices = async () => {
    try {
      const response = await getAllServices();
      setServicesTypes(response); // Lưu dữ liệu vào state
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSelectCarType = (item) => () => {
    setSelectedCarType(item);
    toggleCarTypeVisible();
  };

  const handleSelectServiceType = (item) => () => {
    setSelectedServiceType(item);
    toggleServiceTypeVisible();
  };

  const findCarType = (carArray, typeId) => {
    const car = carArray.find((car) => car.id === typeId);
    return car ? car.car_type : 'Chọn loại xe';
  };

  const findServiceName = (serviceArray, idToFind) => {
    const service = serviceArray.find((service) => service.id === idToFind);
    return service ? service.serviceName : 'Chọn dịch vụ';
  };

  const handleSubmit = async () => {
    const carData = {
      driverId: driverId,
      carType: selectedCarType.id,
      serviceId: selectedServiceType.id,
      carName: carName,
      licensePlate: licensePlate,
    };

    try {
      console.log('Test 2 submit driverData: ', isEmptyObj(driverData), driverData);
      if (isEmptyObj(driverData)) {
        const response = await registerCar(carData);
        console.log('Car registered successfully:', response);
        Alert.alert(
          'Thông báo',
          'Đăng ký thông tin xe thành công',
          [
            {
              text: 'Xác nhận',
              onPress: () => handleClose,
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          'Thông báo',
          'Cập nhật đăng ký xe thành công',
          [
            {
              text: 'Xác nhận',
              onPress: () => handleClose,
            },
          ],
          { cancelable: false }
        );
      }
      // Xử lý thêm sau khi đăng ký thành công
    } catch (error) {
      console.error('Error registering car:', error);
      // Xử lý lỗi
    }
  };

  useEffect(() => {
    if (modalVisible) {
      fetchCarTypes();
      fetchServices();
      fetchDriverData(driverId);
    }
  }, [modalVisible]);

  useEffect(() => {
    if (driverId && selectedCarType?.id && selectedServiceType?.id && carName && carName) {
      setCheckSubmit(true);
    } else {
      setCheckSubmit(false);
    }
  }, [selectedCarType, selectedServiceType, carName, carName, driverId]);

  const onRefreshLoading = () => {};

  console.log('Test modal: ', selectedCarType?.id ?? driverData?.carType);

  return (
    <Modal propagateSwipe animationIn="slideInUp" animationOut="slideOutDown" isVisible={modalVisible} onBackdropPress={handleClose} style={styles.containerModal}>
      <View style={[styles.modalView, { marginTop: responsiveSizeOS(200) }]}>
        <HeaderPopup onClose={handleClose} title={modalTitle} styleTitle={styles.fontTitle} />
        <View style={styles.viewContainer}>
          <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={false} onRefresh={onRefreshLoading} />}>
            {/* Input cho biển số xe */}
            <TextInputComponent
              textLabel="Biển số xe"
              textLabelStyle={styles.title}
              labelContainerStyle={styles.viewTextOption}
              value={licensePlate}
              onChangeText={(e) => handleSetData(e, registerDriver.licensePlate)}
              returnKeyType={'done'}
              autoCorrect={false}
              allowFontScaling={false}
              keyboardType="default"
              placeholder={'Nhập biển số xe'}
              viewStyle={styles.viewInputText}
              setValue={setLicensePlate}
            />
            {/* Input cho tên xe */}
            <TextInputComponent
              textLabel="Tên xe"
              textLabelStyle={styles.title}
              labelContainerStyle={styles.viewTextOption}
              value={carName}
              onChangeText={(e) => handleSetData(e, registerDriver.carName)}
              returnKeyType={'done'}
              autoCorrect={false}
              allowFontScaling={false}
              keyboardType="default"
              placeholder={'Nhập tên xe'}
              viewStyle={styles.viewInputText}
              setValue={setLicensePlate}
            />
            <Text style={[styles.viewContentText, styles.viewTextOption]}>Loại xe</Text>
            <View style={styles.viewInput}>
              <View style={styles.viewInputOneLeft}>
                <View style={styles.viewInputItem}>
                  <Text style={styles.viewInputOneLeft_Text} numberOfLines={1} ellipsizeMode="tail">
                    {findCarType(carTypes, selectedCarType?.id ?? driverData?.carType) || 'Chọn loại xe'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewInputOneRight_Button} onPress={toggleCarTypeVisible}>
                <Text style={styles.viewInputOneRight_Text}>Thay đổi</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.viewContentText, styles.viewTextOption]}>Dịch vụ</Text>
            <View style={styles.viewInput}>
              <View style={styles.viewInputOneLeft}>
                <View style={styles.viewInputItem}>
                  <Text style={styles.viewInputOneLeft_Text} numberOfLines={1} ellipsizeMode="tail">
                    {findServiceName(servicesTypes, selectedServiceType?.id ?? driverData?.serviceId) || 'Chọn dịch vụ'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewInputOneRight_Button} onPress={toggleServiceTypeVisible}>
                <Text style={styles.viewInputOneRight_Text}>Thay đổi</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.viewInputButton, !isSubmit ? styles.viewInputButton_Disabled : null]} disabled={!isSubmit} onPress={handleSubmit}>
              <Text style={styles.txtSubmit}>XÁC NHẬN</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {/* Modal cho Loại xe */}
        <ListDataModal modalVisible={carTypeVisible} toggleModalVisible={toggleCarTypeVisible} modalTitle="Chọn loại xe" infoData={carTypes} valueId={selectedCarType?.id ?? driverData?.carType} handleSelect={handleSelectCarType} />

        {/* Modal cho ID Dịch vụ */}
        <ListDataModal modalVisible={serviceTypeVisible} toggleModalVisible={toggleServiceTypeVisible} modalTitle="Chọn dịch vụ" infoData={servicesTypes} valueId={selectedServiceType?.id ?? driverData?.serviceId} handleSelect={handleSelectServiceType} />
      </View>
    </Modal>
  );
};

export default RegisterCarModal;

const registerDriver = {
  licensePlate: 'licensePlate',
  carName: 'carName',
  carType: 'carType',
  driverId: 'driverId',
  serviceId: 'serviceId',
};

const styles = StyleSheet.create({
  viewContainer: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: Colors.txtWhite,
    borderTopLeftRadius: responsiveSizeOS(20),
    borderTopRightRadius: responsiveSizeOS(20),
    paddingHorizontal: responsiveSizeOS(16),
  },
  scrollView: {
    flex: 1,
  },
  containerModal: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: responsiveSizeOS(0),
    paddingBottom: responsiveSizeOS(0),
    backgroundColor: 'rgba(24, 26, 65, 0.1)',
  },
  modalView: {
    paddingTop: responsiveSizeOS(8),
    paddingHorizontal: responsiveSizeOS(6),
    paddingBottom: responsiveSizeOS(16),
    backgroundColor: 'white',
    borderTopLeftRadius: responsiveSizeOS(20),
    borderTopRightRadius: responsiveSizeOS(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: responsiveSizeOS(4),
    elevation: responsiveSizeOS(5),
    marginTop: responsiveSizeOS(200),
  },
  fontTitle: {
    fontSize: responsiveFontSizeOS(15),
    color: 'rgb(11, 11, 11)',
    textTransform: 'uppercase',
  },
  viewInputText: {
    fontSize: responsiveFontSizeOS(16),
    color: 'rgb(11, 11, 11)',
    marginLeft: responsiveSizeOS(8),
    textAlign: 'left',
    width: '85%',
  },
  txtTitle: {
    fontSize: responsiveFontSizeOS(16),
    color: 'black',
  },
  txtDesc: {
    fontSize: responsiveFontSizeOS(14),
    color: '#6E6E6E',
    marginTop: responsiveSizeOS(4),
    lineHeight: responsiveSizeOS(20),
  },
  txtTitleRight: {
    fontSize: responsiveFontSizeOS(16),
    color: 'black',
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.txtGray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: responsiveFontSizeOS(16),
    fontWeight: '400',
    color: '#818C9C',
  },
  viewTextOption: {
    marginTop: responsiveSizeOS(12),
    marginBottom: responsiveSizeOS(4),
  },
  viewContentText: {
    fontSize: responsiveFontSizeOS(16),
    color: 'rgb(99, 109, 125)',
    // fontFamily: Fonts.Regular,
  },
  viewInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: responsiveFontSizeOS(16),
    paddingHorizontal: responsiveSizeOS(15),
    borderColor: 'rgb(203, 203, 203)',
    borderRadius: responsiveSizeOS(12),
    borderWidth: responsiveSizeOS(1),
    height: responsiveSizeOS(40),
  },
  viewInputOneLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: responsiveSizeOS(5),
  },
  viewInputOneLeft_Icon: {
    width: responsiveSizeOS(24),
    height: responsiveSizeOS(24),
    resizeMode: 'contain',
  },
  viewInputItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: screenWidth - responsiveSizeOS(164),
  },
  viewInputOneLeft_Text: {
    fontSize: responsiveFontSizeOS(14),
  },
  viewInputOneRight_Button: {
    backgroundColor: 'rgba(100, 112, 129, 0.2)',
    borderRadius: responsiveSizeOS(8),
    paddingHorizontal: responsiveSizeOS(9),
    height: responsiveSizeOS(26),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  viewInputOneRight_Text: {
    fontSize: responsiveFontSizeOS(12),
    color: '#C81111',
    // fontFamily: Fonts.Bold,
    fontWeight: 'bold',
  },
  txtSubmit: {
    fontSize: responsiveFontSizeOS(16),
    color: 'white',
  },
  viewInputButton: {
    bottom: 0,
    backgroundColor: Colors.btnSubmit,
    borderRadius: responsiveSizeOS(15),
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveSizeOS(45),
    width: screenWidth - responsiveSizeOS(45),
    marginBottom: responsiveSizeOS(20),
    alignSelf: 'center',
    marginTop: responsiveSizeOS(20),
  },
  viewInputButton_Disabled: {
    backgroundColor: Colors.bgGray,
  },
});
