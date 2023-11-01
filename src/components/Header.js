import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { SCREEN_WIDTH, responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';
import images from '~/themes/images';

const hitSlop = {
  top: responsiveSizeOS(20),
  left: responsiveSizeOS(20),
  right: responsiveSizeOS(20),
  bottom: responsiveSizeOS(20),
};

const Header = (props) => {
  const { title, onPressRight, onPressLeft, imageLeft, styleLeft, titleStyle, imageRight, styleRight, barStyle, hideBackButton = false } = props ?? {};
  const navigation = useNavigation();

  return (
    <>
      <SafeAreaView />

      <StatusBar barStyle={barStyle || 'light-content'} translucent backgroundColor="rgba(0,0,0,0.251)" />

      <View style={styles.container}>
        <View style={styles.flexBox}>
          {(!hideBackButton || onPressLeft) && (
            <TouchableOpacity onPress={onPressLeft || navigation.goBack} hitSlop={hitSlop}>
              <FastImage source={imageLeft || images.icBackWhite} style={styleLeft || styles.image} resizeMode="contain" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.center}>
          <Text style={[styles.text, titleStyle]}>{title}</Text>
        </View>

        <View style={[styles.flexBox, styles.flexEnd]}>
          {onPressRight && (
            <TouchableOpacity onPress={onPressRight} hitSlop={hitSlop}>
              <FastImage source={imageRight || images.icCloseWhite} style={styleRight || styles.image} resizeMode="contain" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export default React.memo(Header);

Header.defaultProps = {
  onPressRight: null,
  onPressLeft: null,
  imageLeft: null,
  titleStyle: {},
  imageRight: '',
  barStyle: 'light-content',
  styleRight: null,
  styleLeft: null,
  hideBackButton: false,
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  onPressRight: PropTypes.func,
  onPressLeft: PropTypes.func,
  imageLeft: PropTypes.string,
  imageRight: PropTypes.string,
  titleStyle: PropTypes.instanceOf(Object),
  styleRight: PropTypes.instanceOf(Object),
  styleLeft: PropTypes.instanceOf(Object),
  barStyle: PropTypes.string,
  hideBackButton: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: StatusBar.currentHeight,
    flexDirection: 'row',
    paddingHorizontal: responsiveSizeOS(16),
    justifyContent: 'space-between',
    height: responsiveSizeOS(50),
    width: SCREEN_WIDTH,
  },
  flexBox: { flex: 1 },
  center: { flex: 8, alignItems: 'center' },
  flexEnd: { alignItems: 'flex-end' },
  text: {
    fontSize: responsiveFontSizeOS(16),
    color: 'white',
  },
  image: {
    width: responsiveSizeOS(24),
    height: responsiveSizeOS(24),
  },
});
