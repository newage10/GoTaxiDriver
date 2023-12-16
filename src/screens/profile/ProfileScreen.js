import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { CommonActions, NavigationContext, useNavigation } from '@react-navigation/native';
import Header from '~/components/Header';
import Colors from '~/themes/colors';
import { SCREEN_WIDTH, isEmptyObj, responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';
import LayoutView from '~/components/LayoutView';
import { useAppDispatch, useAppSelector } from '~/configs/hooks';
import FastImage from 'react-native-fast-image';
import images from '~/themes/images';
import SCREENS from '~/constant/screens';
import { logoutApp } from '~/services/apiService';

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = React.useContext(NavigationContext);

  const handleLogout = async () => {
    try {
      const response = await logoutApp();
      console.log('Test response: ', JSON.stringify(response));
      if (response?.success) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: SCREENS.LOGIN }],
          })
        );
      }
    } catch (error) {
      console.log('Test 2 error: ', error);
      return Alert.alert('Thông báo', 'Đăng xuất thất bại. Vui lòng kiểm tra lại.');
    }
  };

  return (
    <LayoutView>
      <Header barStyle="dark-content" title={'Tài khoản'} onPressLeft={() => navigation.goBack()} />
      <SafeAreaView style={styles.container}>
        <View style={styles.viewContent}>
          <TouchableOpacity style={styles.viewItem} onPress={() => navigation.navigate(SCREENS.ACC_INFO_SCREEN)}>
            <Text style={styles.txtItem}>Thông tin tài khoản</Text>
            <FastImage source={images.iconNextTransparent} style={styles.imgNext} />
          </TouchableOpacity>
          <View style={styles.viewLine} />
          <TouchableOpacity style={styles.viewItem} onPress={handleLogout}>
            <Text style={styles.txtItem}>Đăng xuất</Text>
            <FastImage source={images.iconNextTransparent} style={styles.imgNext} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LayoutView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
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
  viewLine: {
    height: responsiveSizeOS(1),
    width: '110%',
    backgroundColor: Colors.bgGrayT,
    marginVertical: responsiveSizeOS(12),
    marginHorizontal: responsiveSizeOS(-16),
  },
});
