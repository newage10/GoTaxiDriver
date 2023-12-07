import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './configs/store.config';
import ScreensContainer from '~/screens';
import BackgroundFetchService from './services/BackgroundFetchService';

const App = () => {
  return (
    <Provider store={store}>
      <BackgroundFetchService />
      <ScreensContainer />
    </Provider>
  );
};

export default App;
