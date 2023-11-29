import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContext, useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { historyBookData, newBookData } from '~/data';
import { Footer } from '~/components/Footer';
import { Layout } from '~/components/Layout';
import Header from '~/components/Header';
import images from '~/themes/images';
import Colors from '~/themes/colors';
import { SCREEN_WIDTH, isEmptyObj, responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';
import SCREENS from '~/constant/screens';
import { searchType } from '~/constant/content';
import LayoutView from '~/components/LayoutView';

const ReceiveBookScreen = () => {
  const [isSubmit, setCheckSubmit] = useState(false);
  const navigation = React.useContext(NavigationContext);
  const [bookType, setBookType] = useState(orderType.NEW);
  const [pointSelect, setpointSelect] = useState(null);
  const [newBookList, setNewBookList] = useState(newBookData ?? []);
  const [historyBookLisk, setHistoryBookList] = useState(historyBookData ?? []);
  console.log('Test pointSelect: ', JSON.stringify(pointSelect));

  useEffect(() => {
    if (!isEmptyObj(pointSelect)) {
      pointSelect ? setCheckSubmit(true) : setCheckSubmit(false);
    }
  }, [pointSelect]);

  const preventGoBack = () => {
    navigation.goBack();
    return true;
  };

  return (
    <LayoutView>
      <Header barStyle="dark-content" title={'Thông tin chuyến'} onPressLeft={preventGoBack} />
      <SafeAreaView style={styles.container}>
        <View style={styles.viewContent}></View>
        <Footer disableShadown backgroundColor="white">
          <TouchableOpacity style={[[styles.viewInputButton, !isSubmit ? styles.viewInputButton_Disabled : null]]} disabled={isSubmit ? false : true}>
            <Text style={styles.txtSubmit}>BẮT ĐẦU</Text>
          </TouchableOpacity>
        </Footer>
      </SafeAreaView>
    </LayoutView>
  );
};

export default ReceiveBookScreen;

export const orderType = {
  NEW: 1,
  HISTORY: 2,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    backgroundColor: Colors.bgWhite2,
  },
  contentScrollView: {
    paddingBottom: responsiveSizeOS(50),
    paddingHorizontal: responsiveSizeOS(15),
  },
  viewContent: {
    flex: 1,
    backgroundColor: 'white',
    width: SCREEN_WIDTH,
    borderTopLeftRadius: responsiveSizeOS(20),
    borderTopRightRadius: responsiveSizeOS(20),
    paddingTop: responsiveSizeOS(4),
    paddingHorizontal: responsiveSizeOS(15),
  },
  viewSearch: {
    height: responsiveSizeOS(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
    borderWidth: responsiveSizeOS(0.5),
    borderColor: 'rgb(203, 203, 203)',
    borderRadius: responsiveSizeOS(10),
    paddingHorizontal: responsiveSizeOS(10),
    marginBottom: responsiveSizeOS(16),
    width: '98%',
  },
  viewSelectLocation: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: responsiveSizeOS(10),
    marginBottom: responsiveSizeOS(15),
  },
  btnSelectLocation: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveSizeOS(16),
    height: responsiveSizeOS(32),
    paddingHorizontal: responsiveSizeOS(16),
  },
  btnSelectLocationEnable: {
    backgroundColor: Colors.txtGreen,
  },
  txtSelectService: {
    fontSize: responsiveFontSizeOS(16),
    color: 'rgb(11, 11, 11)',
  },
  txtSelectServiceEnable: {
    color: 'white',
  },
  viewInputButton: {
    bottom: 0,
    backgroundColor: Colors.btnSubmit,
    borderRadius: responsiveSizeOS(15),
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveSizeOS(45),
    width: SCREEN_WIDTH - responsiveSizeOS(30),
    marginBottom: responsiveSizeOS(12),
    alignSelf: 'center',
    marginTop: responsiveSizeOS(10),
  },
  viewInputButton_Disabled: {
    backgroundColor: Colors.bgGray,
  },
  txtSubmit: {
    fontSize: responsiveFontSizeOS(16),
    color: 'white',
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
    backgroundColor: Colors.txtGreen,
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
  txtTitle: {
    fontSize: responsiveFontSizeOS(16),
    color: 'black',
  },
  txtTitleEnable: {
    color: Colors.txtWhite,
  },
  txtTitleRight: {
    fontSize: responsiveFontSizeOS(16),
    color: 'black',
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
  txtDesc: {
    fontSize: responsiveFontSizeOS(14),
    color: '#6E6E6E',
    marginTop: responsiveSizeOS(4),
    lineHeight: responsiveSizeOS(20),
  },
  bookList: {
    flex: 1,
    width: '100%',
  },
});
