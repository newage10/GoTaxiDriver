import { combineReducers } from 'redux';
import mapReducer from './map/reducers';
import driverReducer from './driver/reduces';

const rootReducer = combineReducers({
  map: mapReducer,
  driver: driverReducer,
});

export default rootReducer;
