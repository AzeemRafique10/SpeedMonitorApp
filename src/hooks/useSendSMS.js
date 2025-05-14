import {PermissionsAndroid, Alert} from 'react-native';
import {SendDirectSms} from 'react-native-send-direct-sms';

export const useSendSMS = phoneNumber => {
  const sendSpeedAlertSMS = async () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      Alert.alert('Error', 'Please enter a phone number first.');
      return;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: 'SMS Permission',
          message: 'This app needs access to send SMS messages.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const message = 'Alert: Speed limit exceeded!';
        SendDirectSms(phoneNumber, message)
          .then(() => Alert.alert('Success', 'SMS sent successfully'))
          .catch(error => Alert.alert('Error', 'Failed to send SMS'));
      } else {
        Alert.alert('Permission Denied', 'Cannot send SMS without permission');
      }
    } catch (err) {
      console.warn('SMS permission request error', err);
    }
  };

  return {sendSpeedAlertSMS};
};
