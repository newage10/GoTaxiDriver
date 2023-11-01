import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { defaultGateGradient } from '~/helper/GeneralMain';

const LayoutView = ({ children }) => (
  <LinearGradient colors={defaultGateGradient} style={styles.viewContainer}>
    {children}
  </LinearGradient>
);

export default LayoutView;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width: windowWidth,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
