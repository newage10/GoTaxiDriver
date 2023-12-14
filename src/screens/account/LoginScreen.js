import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Layout } from '~/components/Layout';
import Colors from '~/themes/colors';
import FastImage from 'react-native-fast-image';
import images from '~/themes/images';
import { formatAccountNumber, responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';
import SCREENS from '~/constant/screens';
import { SERVER_URL } from '~/configs/api.config';
import { NavigationContext } from '@react-navigation/native';
import axios from 'axios';
import { storeToken } from '~/configs/storageUtils';
import { useAppDispatch } from '~/configs/hooks';
import { setDriverId } from '~/redux/driver/actions';
import { loginApp } from '~/services/apiService';

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = React.useContext(NavigationContext);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSubmit, setCheckSubmit] = useState(false);

  const handleLogin = async () => {
    const resData = {
      phoneNo: phoneNumber,
      password: password,
    };
    try {
      const response = await loginApp(resData);
      console.log('Test 2 response: ', JSON.stringify(response));
      const token = response?.token;
      const driverId = response?.data?.id ?? 10;
      console.log('Test driverId: ', driverId);
      if (token && driverId) {
        // Lưu token vào AsyncStorage
        await storeToken(token);

        // Cập nhật Redux store với driverId
        dispatch(setDriverId(driverId));

        // Chuyển hướng sau khi đăng nhập thành công
        navigation.navigate(SCREENS.HOME);
      }
    } catch (error) {
      console.log('Test 2 error: ', error);
      return Alert.alert('Thông báo', 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    }
  };

  const handleSetData = (data, key) => {
    switch (key) {
      case paramLogin.phoneNumber:
        const iPhoneNumber = formatAccountNumber(data);
        setPhoneNumber(iPhoneNumber);
        break;
      case paramLogin.password:
        setPassword(data);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);

  useEffect(() => {
    phoneNumber && password ? setCheckSubmit(true) : setCheckSubmit(false);
  }, [phoneNumber, password]);

  return (
    <Layout style={styles.viewContainer}>
      <SafeAreaView style={styles.mainContainer}>
        <FastImage style={styles.icLogoApp} source={images.icLogo} resizeMode="contain" />
        <Text style={styles.txtTitle}>{'Login'}</Text>
        <View style={styles.viewContent}>
          <View style={styles.viewInput}>
            <TextInput value={phoneNumber} onChangeText={(e) => handleSetData(e, paramLogin.phoneNumber)} style={styles.viewInputText} placeholder="Nhập số điện thoại" autoCorrect={false} maxLength={10} allowFontScaling={false} keyboardType="number-pad" />
          </View>
          <View style={styles.viewInput}>
            <TextInput value={password} onChangeText={(e) => handleSetData(e, paramLogin.password)} secureTextEntry={true} style={styles.viewInputText} placeholder="Nhập mật khẩu" autoCorrect={false} maxLength={20} allowFontScaling={false} keyboardType="default" />
          </View>
          <View style={styles.viewText}>
            <TouchableOpacity>
              <Text style={styles.txtForgotPass}>Quên mật khẩu ?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={[[styles.btnSubmit, !isSubmit ? styles.viewInputButton_Disabled : null]]} disabled={isSubmit ? false : true} onPress={handleLogin}>
          <Text style={styles.txtSubmit}>Đăng nhập</Text>
        </TouchableOpacity>
        <View style={styles.viewLoginOption}>
          <Text style={styles.txtOption}>Or Login with</Text>
          <View style={styles.viewSocialNetwork}>
            <FastImage style={styles.imgSocial} source={images.icFacebook} resizeMode="contain" />
            <FastImage style={styles.imgSocial} source={images.icGoogle} resizeMode="contain" />
            <FastImage style={styles.imgSocial} source={images.icX} resizeMode="contain" />
          </View>
        </View>
        <View style={styles.viewQuestion}>
          <Text style={styles.txtQuestion}>Bạn chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.REGISTER)}>
            <Text style={styles.txtRegister}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

export default LoginScreen;

const paramLogin = {
  phoneNumber: 'phoneNumber',
  password: 'password',
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
    height: responsiveSizeOS(144),
    marginTop: responsiveSizeOS(10),
  },
  txtTitle: {
    fontSize: responsiveFontSizeOS(32),
    color: Colors.txtBlack,
    fontWeight: 'bold',
    marginTop: responsiveSizeOS(20),
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
  viewContent: {
    width: '100%',
    marginTop: responsiveSizeOS(24),
  },
  viewText: {
    width: '100%',
    height: responsiveSizeOS(20),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  txtForgotPass: {
    fontSize: responsiveFontSizeOS(14),
    color: Colors.txtBlack,
  },
  btnSubmit: {
    backgroundColor: Colors.btnSubmit,
    height: responsiveSizeOS(50),
    width: '100%',
    borderRadius: responsiveSizeOS(20),
    marginTop: responsiveSizeOS(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtSubmit: {
    color: Colors.txtWhite,
    fontSize: responsiveFontSizeOS(20),
    fontWeight: 'bold',
  },
  viewLoginOption: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveSizeOS(16),
  },
  txtOption: {
    fontSize: responsiveFontSizeOS(14),
    color: Colors.txtBlack,
  },
  viewSocialNetwork: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveSizeOS(16),
  },
  imgSocial: {
    width: responsiveSizeOS(40),
    height: responsiveSizeOS(40),
    marginHorizontal: responsiveSizeOS(16),
  },
  viewQuestion: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: responsiveSizeOS(40),
  },
  txtQuestion: {
    fontSize: responsiveFontSizeOS(16),
    color: Colors.txtBlack,
  },
  txtRegister: {
    fontSize: responsiveFontSizeOS(16),
    color: Colors.txtGreen,
    fontWeight: 'bold',
  },
  viewInputButton_Disabled: {
    backgroundColor: Colors.bgGray,
  },
});
