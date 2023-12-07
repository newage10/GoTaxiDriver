import { SET_CURRENT_LOCATION } from './types';

export const getCurrentLocation = (location) => ({
  type: SET_CURRENT_LOCATION,
  payload: location,
});
