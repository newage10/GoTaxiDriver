import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, TextInput, Platform, RefreshControl } from 'react-native';
import FastImage from 'react-native-fast-image';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Modal from 'react-native-modal';
import { HeaderPopup } from '~/components/HeaderPopup';
import images from '~/themes/images';
import { responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';
import Colors from '~/themes/colors';

const HomeModal = (props) => {
  const { modalVisible, toggleModalVisible, modalTitle, listDataModal } = props ?? {};

  const handleClose = () => {
    toggleModalVisible();
  };

  const handleSelect = (item) => {
    return null;
  };

  const viewItemHistory = (item) => {
    console.log('Test now item: ', JSON.stringify(item));
    return (
      <>
        <TouchableOpacity style={[styles.viewItem]} onPress={handleSelect(item)}>
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
    <Modal propagateSwipe animationIn="slideInUp" animationOut="slideOutDown" isVisible={modalVisible} onBackdropPress={handleClose} swipeDirection="down" style={styles.containerModal}>
      <View style={[styles.modalView, { marginTop: responsiveSizeOS(400) }]}>
        <HeaderPopup onClose={handleClose} title={modalTitle} styleTitle={styles.fontTitle} />
        <View style={styles.viewLine} />
        <FlatList showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always" data={listDataModal} removeClippedSubviews={true} renderItem={({ item }) => viewItemHistory(item)} keyExtractor={(item, index) => index.toString()} onEndReachedThreshold={0.5} style={styles.flatList} />
        {Platform.OS === 'ios' ? <KeyboardSpacer /> : null}
      </View>
    </Modal>
  );
};

export default HomeModal;

const styles = StyleSheet.create({
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
  btnSearch: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgSearch: {
    width: responsiveSizeOS(16),
    height: responsiveSizeOS(16),
    resizeMode: 'contain',
  },
  imgClose: {
    width: responsiveSizeOS(24),
    height: responsiveSizeOS(24),
    resizeMode: 'contain',
  },
  viewClose: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewInputText: {
    fontSize: responsiveFontSizeOS(16),
    color: 'rgb(11, 11, 11)',
    marginLeft: responsiveSizeOS(8),
    textAlign: 'left',
    width: '85%',
  },
  flatList: {
    width: '98%',
    paddingHorizontal: responsiveSizeOS(5),
  },
  icCheck: {
    width: responsiveSizeOS(15),
    height: responsiveSizeOS(15),
    resizeMode: 'contain',
  },
  viewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSizeOS(25),
  },
  txtItemTitle: {
    fontSize: responsiveFontSizeOS(17),
    color: 'rgb(11, 11, 11)',
    marginLeft: responsiveSizeOS(10),
  },
  imgIcon: {
    width: responsiveSizeOS(28),
    height: responsiveSizeOS(28),
  },
  viewLeftItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  viewLine: {
    height: responsiveSizeOS(2),
    width: responsiveSizeOS(240),
    backgroundColor: Colors.txtGray,
    alignSelf: 'center',
    marginTop: responsiveSizeOS(-10),
    marginBottom: responsiveSizeOS(12),
  },
});
