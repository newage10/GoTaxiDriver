import { SET_CURRENT_LOCATION } from './types';

export const setCurrentLocation = (location) => ({
  type: SET_CURRENT_LOCATION,
  payload: location,
});
