import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, FlatList, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { HeaderPopup } from '~/components/HeaderPopup';
import FastImage from 'react-native-fast-image';
import { formatMoneyNumber, responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';
import images from '~/themes/images';

const DriverReceiverModal = (props) => {
  const [pointSelect, setpointSelect] = useState(null);
  const { modalVisible, toggleModalVisible, modalTitle, handleBooking } = props ?? {};

  const handleClose = () => {
    toggleModalVisible();
  };

  const handleSelect = (title) => () => {
    setpointSelect(title);
  };

  const hanldeSubmit = () => {
    handleBooking();
    handleClose();
  };

  const viewItem = (image, title, time, txtType, money) => {
    return (
      <>
        <TouchableOpacity style={[styles.viewItem, pointSelect === title ? styles.viewItemEnable : null]} onPress={handleSelect(title)}>
          <View style={styles.viewItemLeft}>
            <FastImage source={image} style={styles.icItem} resizeMode="contain" />
            <View style={styles.viewItemContent}>
              <Text style={styles.txtTitle}>{title}</Text>
              <Text style={styles.txtDesc}>{`${time} - ${txtType}`}</Text>
            </View>
          </View>
          <View style={styles.viewItemRight}>
            <Text style={styles.txtTitle}>{`${formatMoneyNumber(money)} đ`}</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <Modal propagateSwipe animationIn="slideInUp" animationOut="slideOutDown" isVisible={modalVisible} onBackdropPress={handleClose} style={styles.containerModal}>
      <View style={[styles.modalView, { marginTop: responsiveSizeOS(Platform.OS === 'ios' ? 400 : 350) }]}>
        <HeaderPopup onClose={handleClose} title={modalTitle} styleTitle={styles.fontTitle} styleButton={styles.btnClose} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {viewItem(images.icMotorcycle, 'Xe 2 bánh', '5-10 phút', '1 chỗ', 40000)}
          {viewItem(images.icCar, 'Xe 4 bánh', '15-30 phút', '4 chỗ', 100000)}
          {viewItem(images.icCarXL, 'Xe 4 bánh XL', '30-60 phút', '6 chỗ', 200000)}
        </ScrollView>
        <TouchableOpacity style={styles.viewSubmit} onPress={hanldeSubmit}>
          <Text style={styles.txtSubmit}>Đặt xe</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default DriverReceiverModal;

const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: responsiveSizeOS(8),
    paddingBottom: responsiveSizeOS(40),
    backgroundColor: 'rgba(24, 26, 65, 0.6)',
  },
  modalView: {
    paddingTop: responsiveSizeOS(8),
    paddingHorizontal: responsiveSizeOS(16),
    paddingBottom: responsiveSizeOS(16),
    backgroundColor: 'white',
    borderRadius: responsiveSizeOS(20),
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
    maxHeight: Dimensions.get('window').height - 50,
  },
  container: {
    flex: 1,
  },
  fontTitle: {
    fontSize: responsiveFontSizeOS(17),
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    color: 'rgb(11, 11, 11)',
    textTransform: 'uppercase',
  },
  viewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: responsiveSizeOS(8),
    paddingVertical: responsiveSizeOS(8),
    paddingHorizontal: responsiveSizeOS(10),
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
  icItem: {
    width: responsiveSizeOS(24),
    height: responsiveSizeOS(24),
  },
  viewContent: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: responsiveSizeOS(12),
    paddingRight: responsiveSizeOS(40),
  },
  viewSubmit: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#610899',
    borderRadius: responsiveSizeOS(20),
    height: responsiveSizeOS(48),
    width: '100%',
    marginTop: responsiveSizeOS(15),
  },
  txtSubmit: {
    fontSize: responsiveFontSizeOS(17),
    color: 'white',
    textTransform: 'uppercase',
  },
  viewItemLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '70%',
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
  viewItemEnable: {
    backgroundColor: '#d0aaf3',
  },
  btnClose: {
    right: 0,
    marginRight: responsiveSizeOS(12),
  },
});
