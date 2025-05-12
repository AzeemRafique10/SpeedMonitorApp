import React, {useState, useEffect, useRef} from 'react';
import {SendDirectSms} from 'react-native-send-direct-sms';
import BackgroundTimer from 'react-native-background-timer';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  PermissionsAndroid,
  Alert,
} from 'react-native';

const HomeScreen = () => {
  const [speedLimit, setSpeedLimit] = useState('40');
  const [zeroSpeedDuration, setZeroSpeedDuration] = useState('2');
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;

  let recordingTimeout = useRef(null);
  let zeroSpeedTimer = useRef(null);
  let accelerometerSubscription = useRef(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ];

    try {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const allGranted = Object.values(granted).every(
        p => p === PermissionsAndroid.RESULTS.GRANTED,
      );
      if (!allGranted)
        // Alert.alert('Permissions not granted. App may not work properly.');
        console.log('Permissions not granted. App may not work properly.');
    } catch (err) {
      console.warn(err);
    }
  };

  const sendSpeedAlertSMS = async () => {
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
        const phoneNumber = '+923338737779';
        const message = 'Alert: Speed limit exceeded!';
        SendDirectSms(phoneNumber, message)
          .then(() => {
            console.log('SMS sent successfully');
            Alert.alert('Success', 'SMS sent successfully');
          })
          .catch(error => {
            console.error('Failed to send SMS', error);
            Alert.alert('Error', 'Failed to send SMS');
          });
      } else {
        console.warn('SMS permission denied');
        Alert.alert('Permission Denied', 'Cannot send SMS without permission');
      }
    } catch (err) {
      console.warn('SMS permission request error', err);
    }
  };

  const startMonitoring = () => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 1000);

    accelerometerSubscription.current = accelerometer.subscribe(({x, y, z}) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z) - 9.8;
      const speed = Math.abs(acceleration * 3.6);
      setCurrentSpeed(speed.toFixed(2));

      const limit = parseFloat(speedLimit);
      const zeroLimit = parseFloat(zeroSpeedDuration) * 60 * 1000;

      if (speed > limit && !isRecording) {
        sendSpeedAlertSMS();
        startRecording();
      }

      if (speed <= 1 && isRecording && !zeroSpeedTimer.current) {
        zeroSpeedTimer.current = BackgroundTimer.setTimeout(() => {
          stopRecording();
        }, zeroLimit);
      }

      if (speed > 1 && zeroSpeedTimer.current) {
        BackgroundTimer.clearTimeout(zeroSpeedTimer.current);
        zeroSpeedTimer.current = null;
      }
    });
  };

  const stopMonitoring = () => {
    if (accelerometerSubscription.current)
      accelerometerSubscription.current.unsubscribe();
    if (zeroSpeedTimer.current)
      BackgroundTimer.clearTimeout(zeroSpeedTimer.current);
    zeroSpeedTimer.current = null;
    setMonitoring(false);
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        const video = await cameraRef.current.startRecording({
          flash: 'off',
          onRecordingFinished: video => console.log(video.path),
          onRecordingError: error => console.error(error),
        });
        setIsRecording(true);

        recordingTimeout.current = BackgroundTimer.setTimeout(() => {
          stopRecording();
        }, 10 * 60 * 1000);
      } catch (err) {
        console.error('Recording failed', err);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      try {
        await cameraRef.current.stopRecording();
      } catch (err) {
        console.warn(err);
      }
    }
    if (recordingTimeout.current)
      BackgroundTimer.clearTimeout(recordingTimeout.current);
    recordingTimeout.current = null;
    setIsRecording(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Speed Monitor App</Text>
      <Text>Current Speed: {currentSpeed} km/h</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Speed Limit (e.g. 40)"
        value={speedLimit}
        onChangeText={setSpeedLimit}
      />

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Zero Speed Stop Time (minutes)"
        value={zeroSpeedDuration}
        onChangeText={setZeroSpeedDuration}
      />

      <Button
        title={monitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        onPress={() => {
          if (!monitoring) {
            startMonitoring();
            setMonitoring(true);
          } else {
            stopMonitoring();
          }
        }}
      />

      {device && (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive={isRecording}
          video={true}
          audio={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  camera: {
    height: 0,
    width: 0,
  },
});

export default HomeScreen;
