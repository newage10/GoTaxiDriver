import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Layout } from '~/components/Layout';
import FastImage from 'react-native-fast-image';
import Colors from '~/themes/colors';
import { formatAccountNumber, responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';
import images from '~/themes/images';
import { NavigationContext } from '@react-navigation/native';
import SCREENS from '~/constant/screens';
import { storeToken } from '~/configs/storageUtils';
import axios from 'axios';
import { SERVER_URL } from '~/configs/api.config';
import { useAppDispatch } from '~/configs/hooks';
import { setDriverId } from '~/redux/driver/actions';
import { registerApp } from '~/services/apiService';

const RegisterScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = React.useContext(NavigationContext);
  const [fullName, setFullName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [rePassword, setRePassword] = useState(null);
  const [privacyPolicyOption, setPrivacyPolicyOption] = useState(false);
  const [isSubmit, setCheckSubmit] = useState(false);

  const handleSetData = (data, key) => {
    switch (key) {
      case paramRegister.fullName:
        setFullName(data);
        break;
      case paramRegister.phoneNumber:
        const iPhoneNumber = formatAccountNumber(data);
        setPhoneNumber(iPhoneNumber);
        break;
      case paramRegister.email:
        setEmail(data);
        break;
      case paramRegister.password:
        setPassword(data);
        break;
      case paramRegister.rePassword:
        setRePassword(data);
        break;
      default:
        break;
    }
  };

  const handleRegister = async () => {
    const resData = {
      phoneNo: phoneNumber,
      password: password,
      fullname: fullName,
      email: email,
    };
    try {
      const response = await registerApp(resData);
      const token = response?.token;
      const driverId = response?.data?.id ?? 10;
      console.log('Test 2 res register: ', JSON.stringify(response));
      if (token && driverId) {
        // Lưu token vào AsyncStorage
        await storeToken(token);

        // Cập nhật Redux store với driverId
        dispatch(setDriverId(driverId));

        // Chuyển hướng sau khi đăng nhập thành công
        navigation.navigate(SCREENS.HOME);
      } else {
        Alert.alert('Thông báo', 'Đăng ký thất bại. Vui lòng kiểm tra lại.');
      }
    } catch (error) {
      console.log('Error during registration: ', error);
      Alert.alert('Thông báo', 'Lỗi kết nối mạng hoặc máy chủ.');
    }
  };

  const handleSelectOption = () => {
    setPrivacyPolicyOption(!privacyPolicyOption);
  };

  useEffect(() => {
    fullName && phoneNumber && email && password && password === rePassword && privacyPolicyOption ? setCheckSubmit(true) : setCheckSubmit(false);
  }, [fullName, phoneNumber, email, password, rePassword, privacyPolicyOption]);

  return (
    <Layout style={styles.viewContainer}>
      <SafeAreaView style={styles.mainContainer}>
        <FastImage style={styles.icLogoApp} source={images.icLogo} resizeMode="contain" />
        <Text style={styles.txtTitle}>{'Sign Up'}</Text>
        <View style={styles.viewContent}>
          <View style={styles.viewInput}>
            <TextInput value={fullName} onChangeText={(e) => handleSetData(e, paramRegister.fullName)} style={styles.viewInputText} placeholder="Họ tên" autoCorrect={false} maxLength={100} allowFontScaling={false} keyboardType="default" />
          </View>
          <View style={styles.viewInput}>
            <TextInput value={phoneNumber} onChangeText={(e) => handleSetData(e, paramRegister.phoneNumber)} style={styles.viewInputText} placeholder="Số điện thoại" autoCorrect={false} maxLength={10} allowFontScaling={false} keyboardType="number-pad" />
          </View>
          <View style={styles.viewInput}>
            <TextInput value={email} onChangeText={(e) => handleSetData(e, paramRegister.email)} style={styles.viewInputText} placeholder="Email" autoCorrect={false} maxLength={30} allowFontScaling={false} keyboardType="email-address" />
          </View>
          <View style={styles.viewInput}>
            <TextInput value={password} onChangeText={(e) => handleSetData(e, paramRegister.password)} secureTextEntry={true} style={styles.viewInputText} placeholder="Mật khẩu" autoCorrect={false} maxLength={20} allowFontScaling={false} keyboardType="number-pad" />
          </View>
          <View style={styles.viewInput}>
            <TextInput value={rePassword} onChangeText={(e) => handleSetData(e, paramRegister.rePassword)} secureTextEntry={true} style={styles.viewInputText} placeholder="Xác nhận mật khẩu" autoCorrect={false} maxLength={20} allowFontScaling={false} keyboardType="number-pad" />
          </View>
          <View style={styles.viewSelectOption}>
            <TouchableOpacity style={styles.btnSelectOption} onPress={handleSelectOption}>
              <FastImage source={privacyPolicyOption ? images.icCheckbox : images.icUnCheckbox} style={styles.imgSelectOption} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={styles.txtSelectOption}>{`Bằng việc bạn chọn tạo cửa hàng, bạn đồng ý với Điều khoản sử dụng của App.`}</Text>
          </View>
          <TouchableOpacity style={[[styles.btnSubmit, !isSubmit ? styles.viewInputButton_Disabled : null]]} disabled={!isSubmit} onPress={handleRegister}>
            <Text style={styles.txtSubmit}>Đăng ký</Text>
          </TouchableOpacity>
          <View style={styles.viewQuestion}>
            <Text style={styles.txtQuestion}>Bạn đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate(SCREENS.LOGIN)}>
              <Text style={styles.txtLogin}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

export default RegisterScreen;

const paramRegister = {
  fullName: 'fullName',
  phoneNumber: 'phoneNumber',
  email: 'email',
  password: 'password',
  rePassword: 'rePassword',
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: Colors.bgWhite2,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: responsiveSizeOS(32),
  },
  icLogoApp: {
    width: responsiveSizeOS(260),
    height: responsiveSizeOS(100),
    marginTop: responsiveSizeOS(0),
  },
  txtTitle: {
    fontSize: responsiveFontSizeOS(24),
    color: Colors.txtBlack,
    fontWeight: 'bold',
    marginTop: responsiveSizeOS(5),
  },
  viewContent: {
    width: '100%',
    marginTop: responsiveSizeOS(4),
  },
  viewText: {
    width: '100%',
    height: responsiveSizeOS(16),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  txtForgotPass: {
    fontSize: responsiveFontSizeOS(14),
    color: Colors.txtBlack,
  },
  viewInput: {
    width: '100%',
    height: responsiveSizeOS(50),
    borderWidth: responsiveSizeOS(1),
    borderColor: Colors.borderInput,
    borderRadius: responsiveSizeOS(20),
    marginBottom: responsiveSizeOS(20),
    backgroundColor: Colors.bgWhite,
    paddingHorizontal: responsiveSizeOS(16),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  viewInputText: {
    width: '100%',
    fontSize: responsiveFontSizeOS(20),
    color: Colors.txtBlack,
  },
  viewSelectOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: responsiveSizeOS(8),
  },
  btnSelectOption: {
    width: responsiveSizeOS(20),
    height: responsiveSizeOS(20),
  },
  imgSelectOption: {
    width: responsiveSizeOS(20),
    height: responsiveSizeOS(20),
  },
  txtSelectOption: {
    fontSize: responsiveFontSizeOS(13),
    color: 'rgb(28, 28, 28)',
    marginLeft: responsiveSizeOS(10),
    textAlign: 'left',
  },
  btnSubmit: {
    backgroundColor: Colors.btnSubmit,
    height: responsiveSizeOS(50),
    width: '100%',
    borderRadius: responsiveSizeOS(20),
    marginTop: responsiveSizeOS(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtSubmit: {
    color: Colors.txtWhite,
    fontSize: responsiveFontSizeOS(20),
    fontWeight: 'bold',
  },
  viewQuestion: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: responsiveSizeOS(20),
  },
  txtQuestion: {
    fontSize: responsiveFontSizeOS(16),
    color: Colors.txtBlack,
  },
  txtLogin: {
    fontSize: responsiveFontSizeOS(16),
    color: Colors.txtGreen,
    fontWeight: 'bold',
  },
  viewInputButton_Disabled: {
    backgroundColor: Colors.bgGray,
  },
});
