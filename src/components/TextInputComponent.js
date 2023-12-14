import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import images from '~/themes/images';
import FastImage from 'react-native-fast-image';
import { Text } from 'react-native';
import { responsiveFontSizeOS, responsiveSizeOS } from '~/helper/GeneralMain';

export const TextInputComponent = (props) => {
  const { onFocus, onBlur, setValue, value, containerStyle, onPressFirst, leftComponent, rightComponent, textLabel, textLabelStyle, labelContainerStyle } = props;
  const [fastClear, setFastClear] = useState(false);
  const [isFirst, setFirst] = useState(true);

  useEffect(() => {
    if (value) {
      setFirst(false);
      onPressFirst ? onPressFirst(true) : null;
    }
  }, [value]);

  const inputRef = useRef(null);

  const handleInputFocus = () => {
    setFastClear(true);
    isFirst && setFirst(false);
    onFocus && onFocus();
  };

  const handleInputBlur = () => {
    setFastClear(false);
    onBlur && onBlur();
  };

  const handleClear = () => {
    inputRef.current.setNativeProps({ text: '' });
    setValue('');
  };

  return (
    <>
      {textLabel && (
        <View style={[labelContainerStyle && labelContainerStyle]}>
          <Text style={textLabelStyle && textLabelStyle}>{textLabel}</Text>
        </View>
      )}
      <View style={[styles.viewInputPhone, containerStyle && containerStyle]}>
        {leftComponent && leftComponent}
        <TextInput {...props} ref={inputRef} onFocus={handleInputFocus} onBlur={handleInputBlur} style={styles.viewInputText} />
        {value !== '' && fastClear ? (
          <TouchableOpacity onPress={handleClear} style={styles.viewClose}>
            <FastImage source={images.iconClose} style={styles.imgClose} resizeMode="contain" />
          </TouchableOpacity>
        ) : null}

        {rightComponent && rightComponent}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  viewInputPhone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: responsiveSizeOS(1),
    borderColor: 'rgb(203, 203, 203)',
    backgroundColor: 'rgb(255, 255, 255)',
    paddingHorizontal: responsiveSizeOS(15),
    borderRadius: responsiveSizeOS(12),
    height: responsiveSizeOS(40),
    marginBottom: responsiveSizeOS(5),
  },
  imgClose: {
    width: responsiveSizeOS(16),
    height: responsiveSizeOS(16),

    flexWrap: 'wrap',
  },
  viewClose: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '10%',
  },
  viewInputText: {
    fontSize: responsiveFontSizeOS(16),
    color: 'rgb(11, 11, 11)',
    flex: 1,
    paddingVertical: responsiveSizeOS(1),
  },
  label: {
    position: 'absolute',
    top: -responsiveSizeOS(24),
    left: responsiveSizeOS(8),
  },
});
