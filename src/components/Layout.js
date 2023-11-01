import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Colors from '~/themes/colors';

const { width, height } = Dimensions.get('window');

export const Layout = ({ children, style }) => (
  <View style={[styles.container, style]}>
    {Platform.OS === 'ios' && <View style={styles.viewHolder} />}
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBlueGrey,
    position: 'relative',
  },
  viewHolder: {
    position: 'absolute',
    width,
    height: height / 2,
    bottom: 0,
    backgroundColor: Colors.veryLightPinkThree,
  },
});
