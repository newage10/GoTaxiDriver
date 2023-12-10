import { SET_DRIVER_AVAILABILITY, SET_DRIVER_ID } from './types';

export const setDriverAvailability = (isAvailable) => ({
  type: SET_DRIVER_AVAILABILITY,
  payload: isAvailable,
});

export const setDriverId = (driverId) => ({
  type: SET_DRIVER_ID,
  payload: driverId,
});
