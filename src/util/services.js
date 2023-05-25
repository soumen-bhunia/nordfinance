import {ToastAndroid} from 'react-native';
import {Dimensions, PixelRatio} from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

export const showAlert = message => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};

export const formatedAmount = amount => {
  return Math.abs(Number(amount)) >= 1.0e12
    ? (Math.abs(Number(amount)) / 1.0e12).toFixed(0) + 'T'
    : Math.abs(Number(amount)) >= 1.0e9
    ? (Math.abs(Number(amount)) / 1.0e9).toFixed(0) + 'B'
    : Math.abs(Number(amount)) >= 1.0e6
    ? (Math.abs(Number(amount)) / 1.0e6).toFixed(0) + 'M'
    : Math.abs(Number(amount)) >= 1.0e3
    ? (Math.abs(Number(amount)) / 1.0e3).toFixed(0) + 'K'
    : Math.abs(Number(amount));
};

const wp = widthPercent => {
  const elemWidth =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

const hp = heightPercent => {
  const elemHeight =
    typeof heightPercent === 'number'
      ? heightPercent
      : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

export {wp, hp};
