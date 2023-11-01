import { Dimensions, Platform } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import numeral from 'numeral';

export const screenWidth = Dimensions.get('window').width;

export const defaultGateGradient = ['#0052D4', '#6FB1FC'];

/**
 * Tiêu chuẩn Google Pixel 3 XL
 */
const widthPX = 1440;
const DPI = 560;
export const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Hàm responsive kích thước theo tiêu chuẩn Google Pixel 3 XL
 * @param {*} data
 */
const responsiveSizeAd = (data) => {
  const widthDP = widthPX / (DPI / 160);
  const result = (data * 100) / widthDP;
  return result;
};

/**
 * Hàm responsive fontSize theo tiêu chuẩn Google Pixel 3 XL
 * @param {*} fontSize
 */
const responsiveFontSizeAd = (fontSize) => {
  const SCALE = widthPX / (DPI / 160);
  const ratio = fontSize / SCALE;
  const newSize = Math.round(ratio * SCREEN_WIDTH);
  return newSize;
};

/**
 * Hàm responsive line-height theo tỉ lệ phần trăm
 * @param {*} fontSize
 * @param {*} percent
 */
export const convertLineHeight = (fontSize, percent) => {
  const newsize = (percent * fontSize) / 100;
  return newsize;
};

/**
 * Tiêu chuẩn iphone 7
 */
const widthPX_IP = 750;
const DPI_IP = 325.61;

/**
 * Hàm responsive kích thước theo tiêu chuẩn iphone 7
 * @param {*} data
 */
const responsiveSizeIP = (data) => {
  const widthDP = widthPX_IP / (DPI_IP / 160);
  const result = (data * 100) / widthDP;
  return result;
};

/**
 * Hàm responsive fontSize theo tiêu chuẩn iphone 7
 * @param {*} fontSize
 */
const responsiveFontSizeIP = (fontSize) => {
  const SCALE = widthPX_IP / (DPI_IP / 160);
  const ratio = fontSize / SCALE;
  const newSize = Math.round(ratio * SCREEN_WIDTH);
  return newSize;
};

/**
 * Hàm responsive kích thước trên (iOS, Android)
 */
export const responsiveSizeOS = (data = 0) => {
  return Platform.OS === 'ios' ? wp(responsiveSizeIP(data)) : wp(responsiveSizeAd(data));
};

/**
 * Hàm responsive fontSize trên (iOS, Android)
 */
export const responsiveFontSizeOS = (fontSize = 0) => {
  return Platform.OS === 'ios' ? responsiveFontSizeIP(fontSize) : responsiveFontSizeAd(fontSize);
};

export const formatMoneyNumber = (num) => (num || num === 0 ? numeral(num).format('0,0').toString() : ``);

export const formatMoney = (num) => (num ? new Intl.NumberFormat('en-US').format(num) : ``);

export const formatAccountNumber = (accNumber) => (accNumber ? accNumber.replace(/[^0-9]/g, '') : '');

export const formatPureNumber = (inputNumber) => (inputNumber ? inputNumber.replace(/[^0-9]/g, '') : '');

export const formatString = (inputData) => (inputData ? inputData.replace(/[^a-zA-Z_ ]/g, '') : '');

export const isEmptyObj = (obj) => obj === null || obj === undefined || Object.keys(obj).length === 0;

export const isEmptyArr = (arr) => arr === null || arr === undefined || arr.length === 0;

export const isEmptyParam = (param) => param === null || param === undefined || param === '';

export const removeAccents = (str) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
