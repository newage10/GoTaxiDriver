import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import { HeaderPopup } from '~/components/HeaderPopup';
import { responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';
import images from '~/themes/images';

const ListDataModal = (props) => {
  const { modalVisible, toggleModalVisible, modalTitle, infoData, handleSelect, valueId } = props ?? {};

  const handleClose = () => {
    toggleModalVisible();
  };

  const viewItem = (item) => {
    return (
      <TouchableOpacity style={styles.viewSelectItem} onPress={handleSelect(item)}>
        <Text style={styles.txtItem}>{item.car_type ?? item?.serviceName}</Text>
        <FastImage source={valueId === item.id ? images.icRadioRed : images.icRadioEmpty} style={styles.imgRadio} resizeMode="contain" />
      </TouchableOpacity>
    );
  };

  return (
    <Modal propagateSwipe animationIn="slideInUp" animationOut="slideOutDown" isVisible={modalVisible} onBackdropPress={handleClose} style={styles.containerModal}>
      <View style={styles.modalView}>
        <HeaderPopup onClose={handleClose} title={modalTitle} styleTitle={styles.fontTitle} />
        <FlatList showsVerticalScrollIndicator={false} data={infoData} renderItem={({ item }) => viewItem(item)} keyExtractor={(item) => item.id.toString()} style={styles.listView} />
      </View>
    </Modal>
  );
};

export default ListDataModal;

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
  fontTitle: {
    fontSize: responsiveFontSizeOS(17),
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    color: 'rgb(11, 11, 11)',
    textTransform: 'uppercase',
  },
  listView: {
    width: '100%',
  },
  imgRadio: {
    width: responsiveSizeOS(20),
    height: responsiveSizeOS(20),
  },
  txtRadio: {
    // fontFamily: Fonts.Regular,
    fontSize: responsiveFontSizeOS(16),
    marginLeft: responsiveSizeOS(10),
  },
  txtItem: {
    // Thêm style cho text item
    fontSize: responsiveFontSizeOS(16),
    marginLeft: responsiveSizeOS(10),
  },
  viewSelectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveSizeOS(8),
    paddingHorizontal: responsiveSizeOS(8),
  },
});
