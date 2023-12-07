import { combineReducers } from 'redux';
import mapReducer from './map/reducers';

const rootReducer = combineReducers({
  map: mapReducer,
});

export default rootReducer;
