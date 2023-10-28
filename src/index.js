import React from 'react';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {store} from './configs/store.config';
import ScreensContainer from '~/screens';

const App = () => {
  return (
    <Provider store={store}>
      <ScreensContainer />
    </Provider>
  );
};

export default App;
