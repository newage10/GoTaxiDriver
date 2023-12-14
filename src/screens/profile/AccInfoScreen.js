import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContext, useNavigation } from '@react-navigation/native';
import Header from '~/components/Header';
import Colors from '~/themes/colors';
import { SCREEN_WIDTH, isEmptyObj, responsiveFontSizeOS, responsiveSizeOS, screenWidth } from '~/helper/GeneralMain';
import LayoutView from '~/components/LayoutView';
import { useAppDispatch, useAppSelector } from '~/configs/hooks';
import FastImage from 'react-native-fast-image';
import images from '~/themes/images';
import { getDriverCars, getDriverInfo, updateDriverInfo } from '~/services/apiService';
import { TextInputComponent } from '~/components/TextInputComponent';

const AccInfoScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = React.useContext(NavigationContext);
  const [isSubmit, setCheckSubmit] = useState(true);
  const [nameDriver, setNameDriver] = useState(null);
  const [phoneDriver, setPhoneDriver] = useState(null);
  const [emailDriver, setEmailDriver] = useState(null);
  const driverId = useAppSelector((state) => state?.driver?.driverId ?? 10);

  const handleSetData = (data, key) => {
    switch (key) {
      case accInfoDriver.nameDriver:
        setNameDriver(data);
        break;
      case accInfoDriver.phoneDriver:
        setPhoneDriver(data);
        break;
      case accInfoDriver.emailDriver:
        setEmailDriver(data);
        break;
    }
  };

  const onRefreshLoading = () => {
    fetchDriverData(driverId);
  };

  const fetchDriverData = async (driverId) => {
    try {
      const response = await getDriverInfo(driverId);
      console.log('Test 2 response: ', JSON.stringify(response));
      if (!isEmptyObj(response)) {
        const { fullname, email, phoneNo } = response;
        setNameDriver(fullname);
        setEmailDriver(email);
        setPhoneDriver(phoneNo);
      }
    } catch (error) {
      console.error('Error fetching car types:', error.message);
    }
  };

  const handleIpdateDriverInfo = async (driverId, reqData) => {
    try {
      const response = await updateDriverInfo(driverId, reqData);
      console.log('Test 2 response: ', JSON.stringify(response));
      Alert.alert('Thông báo', 'Cập nhật thông tin tài xế thành công');
    } catch (error) {
      console.error('Error update driver info', error.message);
    }
  };

  const handleSubmit = () => {
    const reqData = {
      phoneNo: phoneDriver,
      fullname: nameDriver,
      email: emailDriver,
    };
    handleIpdateDriverInfo(driverId, reqData);
  };

  useEffect(() => {
    fetchDriverData(driverId);
  }, []);

  useEffect(() => {
    nameDriver && phoneDriver && emailDriver ? setCheckSubmit(true) : setCheckSubmit(false);
  }, [nameDriver, phoneDriver, emailDriver]);

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

  return (
    <LayoutView>
      <Header barStyle="dark-content" title={'Thông tin tài khoản'} onPressLeft={() => navigation.goBack()} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={false} onRefresh={onRefreshLoading} />}>
          <View style={styles.viewContent}>
            <TextInputComponent
              textLabel="Họ tên"
              textLabelStyle={styles.title}
              labelContainerStyle={styles.viewTextOption}
              value={nameDriver}
              onChangeText={(e) => handleSetData(e, accInfoDriver.nameDriver)}
              returnKeyType={'done'}
              autoCorrect={false}
              allowFontScaling={false}
              keyboardType="default"
              placeholder={'Nhập tên tài xế'}
              viewStyle={styles.viewInputText}
              setValue={setNameDriver}
            />
            <TextInputComponent
              textLabel="Số điện thoại"
              textLabelStyle={styles.title}
              labelContainerStyle={styles.viewTextOption}
              value={phoneDriver}
              onChangeText={(e) => handleSetData(e, accInfoDriver.phoneDriver)}
              returnKeyType={'done'}
              autoCorrect={false}
              allowFontScaling={false}
              keyboardType="number-pad"
              placeholder={'Nhập số điện thoại tài xế'}
              viewStyle={styles.viewInputText}
              setValue={setPhoneDriver}
            />
            <TextInputComponent
              textLabel="Email"
              textLabelStyle={styles.title}
              labelContainerStyle={styles.viewTextOption}
              value={emailDriver}
              onChangeText={(e) => handleSetData(e, accInfoDriver.emailDriver)}
              returnKeyType={'done'}
              autoCorrect={false}
              allowFontScaling={false}
              keyboardType="email-address"
              placeholder={'Nhập địa chỉ email tài xế'}
              viewStyle={styles.viewInputText}
              setValue={setEmailDriver}
            />
            <TouchableOpacity style={[styles.viewInputButton, !isSubmit ? styles.viewInputButton_Disabled : null]} disabled={!isSubmit} onPress={handleSubmit}>
              <Text style={styles.txtSubmit}>XÁC NHẬN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LayoutView>
  );
};

export default AccInfoScreen;

const accInfoDriver = {
  nameDriver: 'nameDriver',
  phoneDriver: 'phoneDriver',
  emailDriver: 'emailDriver',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  viewContent: {
    flex: 1,
    backgroundColor: 'white',
    width: SCREEN_WIDTH,
    borderTopLeftRadius: responsiveSizeOS(20),
    borderTopRightRadius: responsiveSizeOS(20),
    paddingTop: responsiveSizeOS(12),
    paddingHorizontal: responsiveSizeOS(15),
  },

  viewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveSizeOS(4),
  },
  txtItem: {
    fontSize: responsiveFontSizeOS(16),
  },
  imgNext: {
    height: responsiveSizeOS(14),
    width: responsiveSizeOS(9),
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
  viewLine: {
    borderColor: 'rgb(203, 203, 203)',
    marginVertical: responsiveSizeOS(6),
    // width: '100%',
    borderWidth: responsiveSizeOS(0.7),
    borderStyle: 'dotted',
    borderRadius: responsiveSizeOS(1),
  },

  viewInputButton: {
    bottom: 0,
    position: 'absolute',
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
  txtSubmit: {
    fontSize: responsiveFontSizeOS(16),
    color: 'white',
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
  viewInputText: {
    fontSize: responsiveFontSizeOS(16),
    color: 'rgb(11, 11, 11)',
    marginLeft: responsiveSizeOS(8),
    textAlign: 'left',
    width: '85%',
  },
});
