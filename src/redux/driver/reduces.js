// driverReducer.js

import { SET_DRIVER_AVAILABILITY, SET_DRIVER_ID } from './types';

const initialState = {
  isAvailable: false,
  driverId: null,
};

const driverReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DRIVER_AVAILABILITY:
      return {
        ...state,
        isAvailable: action.payload,
      };
    case SET_DRIVER_ID:
      return {
        ...state,
        driverId: action.payload,
      };
    default:
      return state;
  }
};

export default driverReducer;
