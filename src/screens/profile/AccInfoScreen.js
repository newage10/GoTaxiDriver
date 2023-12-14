import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { NavigationContext, useNavigation } from '@react-navigation/native';
import Header from '~/components/Header';
import Colors from '~/themes/colors';
import { SCREEN_WIDTH, isEmptyObj, responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';
import LayoutView from '~/components/LayoutView';
import { useAppDispatch, useAppSelector } from '~/configs/hooks';
import FastImage from 'react-native-fast-image';
import images from '~/themes/images';

const AccInfoScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = React.useContext(NavigationContext);

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
        <View style={styles.viewContent}>
          {viewItem('Họ tên ', 'Nguyễn Văn A', true)}
          {viewItem('Số điện thoại', '0902123451', true)}
          {viewItem('Email', 'nguyenvana@gmail.com', true)}
        </View>
      </SafeAreaView>
    </LayoutView>
  );
};

export default AccInfoScreen;

export const orderType = {
  NEW: 1,
  HISTORY: 2,
};

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
});
