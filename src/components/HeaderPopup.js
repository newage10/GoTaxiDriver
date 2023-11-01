import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { responsiveFontSizeOS } from '~/helper/GeneralMain';
import Colors from '~/themes/colors';

import images from '~/themes/images';
export class HeaderPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, onClose, styleTitle, styleButton, containerStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.left} />
        <Text style={[styles.textTitle, styleTitle]}>{title}</Text>
        <TouchableOpacity
          hitSlop={{
            top: 20,
            bottom: 20,
            left: 35,
            right: 35,
          }}
          onPress={onClose}
          style={[styles.containerClose, styleButton]}
        >
          <Image source={images.iconPopupClose} />
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 16,
  },
  left: {
    flex: 1,
  },
  textTitle: {
    flex: 8,
    fontSize: responsiveFontSizeOS(17),
    color: Colors.txtBlack,
    textAlign: 'center',
  },
  containerClose: {
    flex: 1,
    alignItems: 'flex-end',
    right: 25,
  },
});
