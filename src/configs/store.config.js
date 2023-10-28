import { applyMiddleware, compose, legacy_createStore as createStore } from 'redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '@redux/index';
import sagaPlugin from 'reactotron-redux-saga';
import Reactotron from 'reactotron-react-native';
import rootSagas from '~/saga';

const sagaMiddleware = createSagaMiddleware();

const newKey = 'hpQaB5fXMnNzJ9jMw1sPbG6QdOTx2F50';
const encryptTransform = createTransform(
  (inboundState) => {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(inboundState), newKey);
    return encrypted.toString();
  },
  (outboundState) => {
    const decrypted = CryptoJS.AES.decrypt(outboundState, newKey);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [encryptTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = (initialState) => {
  if (__DEV__) {
    Reactotron.configure().use(sagaPlugin({})).useReactNative().connect();
    const sagaMonitor = Reactotron.createSagaMonitor();
    const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
    const store = createStore(persistedReducer, initialState, composeWithDevTools(applyMiddleware(sagaMiddleware)));
    sagaMiddleware.run(rootSagas);
    return store;
  }

  const store = createStore(persistedReducer, initialState, compose(applyMiddleware(sagaMiddleware)));
  sagaMiddleware.run(rootSagas);

  return store;
};

const store = configureStore();
const persistor = persistStore(store);

export { store, persistor };
