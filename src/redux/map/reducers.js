import { SET_CURRENT_LOCATION } from './types';

const initialState = {
  currentLocation: null,
};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: action.payload,
      };
    default:
      return state;
  }
};

export default mapReducer;
