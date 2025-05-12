import React, {useState} from 'react';
import {SendDirectSms} from 'react-native-send-direct-sms';
import {
  View,
  TextInput,
  Button,
  PermissionsAndroid,
  Alert,
  StyleSheet,
} from 'react-native';

const SendingSMS = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [bodySMS, setBodySMS] = useState('');

  const requestSmsPermission = async () => {
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
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const sendSms = async () => {
    const hasPermission = await requestSmsPermission();
    if (hasPermission) {
      SendDirectSms(mobileNumber, bodySMS)
        .then(res => {
          console.log('SMS sent successfully:', res);
          Alert.alert('Success', 'SMS sent successfully');
        })
        .catch(err => {
          console.log('Failed to send SMS:', err);
          Alert.alert('Error', 'Failed to send SMS');
        });
    } else {
      Alert.alert('Permission Denied', 'Cannot send SMS without permission');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Enter SMS Body"
        value={bodySMS}
        onChangeText={setBodySMS}
        multiline
        style={styles.input}
      />
      <Button title="Send SMS" onPress={sendSms} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default SendingSMS;
