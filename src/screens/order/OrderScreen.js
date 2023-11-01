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

const OrderScreen = () => {
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

  const handleSelectOrder = (type) => () => {
    setBookType(type);
  };

  const preventGoBack = () => {
    navigation.goBack();
    return true;
  };

  const viewFlowExpand = (locationType) => {
    switch (locationType) {
      case orderType.NEW:
        return viewNewBook();
      case orderType.HISTORY:
        return viewHistoryBook();
      default:
        return null;
    }
  };

  const viewNewBook = () => {
    return (
      <>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          data={newBookList}
          removeClippedSubviews={true}
          renderItem={({ item, index }) => viewItemBook(item, orderType.NEW)}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          numColumns={1}
          style={styles.bookList}
        />
      </>
    );
  };

  const viewHistoryBook = () => {
    return (
      <>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          data={historyBookLisk}
          removeClippedSubviews={true}
          renderItem={({ item, index }) => viewItemBook(item, orderType.HISTORY)}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          numColumns={1}
          style={styles.bookList}
        />
      </>
    );
  };

  const handleSubmit = (item) => () => {
    console.log('Test item: ', JSON.stringify(item));
    navigation.navigate(SCREENS.BOOKING_SCREEN, {
      searchLocation: {
        bookType: bookType,
        locationType: searchType.INPUT,
        inputSource: { desc: item?.fromDesc, location: item?.fromLocation },
        inputDestination: { desc: item?.toDesc, location: item?.toLocation },
      },
    });
  };

  const handleSelect = (item) => () => {
    setpointSelect(item);
  };

  const viewItemBook = (item, type) => {
    return (
      <>
        <TouchableOpacity style={[styles.viewItem, pointSelect?.id === item?.id ? styles.viewItemEnable : null]} onPress={handleSelect(item)}>
          <View style={styles.viewItemLeft}>
            <FastImage source={item?.goType === 1 ? images.icMotorcycle : item?.goType === 2 ? images.icCar : images.icCarXL} style={styles.icItem} resizeMode="contain" />
            <View style={styles.viewItemContent}>
              <Text style={styles.txtTitle} numberOfLines={2} ellipsizeMode="tail">{`Từ: ${item?.from}`}</Text>
              <Text style={styles.txtDesc} numberOfLines={2} ellipsizeMode="tail">{`Đến: ${item?.to}`}</Text>
            </View>
          </View>
          <View style={styles.viewItemRight}>
            <Text style={styles.txtTitleRight}>{'Thời gian'}</Text>
            <Text style={styles.txtDesc}>{item?.time}</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <LayoutView>
      <Header barStyle="dark-content" title={'Thông tin chuyến'} onPressLeft={preventGoBack} />
      <SafeAreaView style={styles.container}>
        <View style={styles.viewContent}>
          <View style={styles.viewSelectLocation}>
            <TouchableOpacity style={[styles.btnSelectLocation, bookType === orderType.NEW ? styles.btnSelectLocationEnable : null]} onPress={handleSelectOrder(orderType.NEW)}>
              <Text style={[styles.txtSelectService, bookType === orderType.NEW ? styles.txtSelectServiceEnable : null]}>Chuyến mới</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSelectLocation, bookType === orderType.HISTORY ? styles.btnSelectLocationEnable : null]} onPress={handleSelectOrder(orderType.HISTORY)}>
              <Text style={[styles.txtSelectService, bookType === orderType.HISTORY ? styles.txtSelectServiceEnable : null]}>Chuyến đã chạy</Text>
            </TouchableOpacity>
          </View>
          {viewFlowExpand(bookType)}
        </View>
        <Footer disableShadown backgroundColor="white">
          <TouchableOpacity style={[[styles.viewInputButton, !isSubmit ? styles.viewInputButton_Disabled : null]]} disabled={isSubmit ? false : true} onPress={handleSubmit(pointSelect)}>
            <Text style={styles.txtSubmit}>BẮT ĐẦU</Text>
          </TouchableOpacity>
        </Footer>
      </SafeAreaView>
    </LayoutView>
  );
};

export default OrderScreen;

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
    backgroundColor: 'rgb(138,43,226)',
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
    backgroundColor: '#610899',
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
    backgroundColor: '#7A0BC0',
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
    backgroundColor: '#d0aaf3',
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
