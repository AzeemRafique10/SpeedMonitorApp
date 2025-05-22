import {useNavigation} from '@react-navigation/native';
import React, {useState, useRef, useContext} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

import RNButton from '../components/RNButton';
import {useSendSMS} from '../hooks/useSendSMS';
import {SpeedContext} from '../utils/SpeedContext';
import RNTextInput from '../components/RNTextInput';
import {usePermissions} from '../hooks/usePermissions';
import {useVideoRecorder} from '../hooks/useVideoRecorder';
import {useSpeedMonitoring} from '../hooks/useSpeedMonitoring';
import {useLocationTracking} from '../hooks/useLocationTracking';

const HomeScreen = () => {
  const [speedLimit, setSpeedLimit] = useState('');
  const [zeroSpeedDuration, setZeroSpeedDuration] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [monitoring, setMonitoring] = useState(false);
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const navigation = useNavigation();
  const {currentSpeed, setCurrentSpeed} = useContext(SpeedContext);

  const {requestLocationPermission, requestAppPermissions} = usePermissions();
  const {isRecording, startRecording, stopRecording} =
    useVideoRecorder(cameraRef);
  const {sendSpeedAlertSMS} = useSendSMS(phoneNumber);
  const {startMonitoring, stopMonitoring} = useSpeedMonitoring(
    speedLimit,
    zeroSpeedDuration,
    setCurrentSpeed,
    isRecording,
    () => {
      sendSpeedAlertSMS();
      startRecording();
    },
    stopRecording,
  );
  useLocationTracking(setCurrentSpeed, requestLocationPermission);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'default'} />
      <Text style={styles.heading}>Speed Monitor</Text>
      <RNTextInput
        value={speedLimit}
        onChangeText={setSpeedLimit}
        keyboardType="numeric"
        placeholder="Enter Speed Limit (e.g. 40)"
      />

      <RNTextInput
        keyboardType="numeric"
        placeholder="Zero Speed Stop Time (minutes)"
        value={zeroSpeedDuration}
        onChangeText={setZeroSpeedDuration}
      />
      <RNTextInput
        keyboardType="phone-pad"
        placeholder="Enter Phone Number with country code"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <RNButton
        title={monitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        onPress={() => {
          if (!monitoring) {
            startMonitoring();
            setMonitoring(true);

            navigation.navigate('MonitorScreen', {
              currentSpeed,
              setCurrentSpeed,
            });
          } else {
            stopMonitoring();
            setMonitoring(false);
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E88E5',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  speedText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
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
