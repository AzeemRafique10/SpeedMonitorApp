import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

import RNButton from '../components/RNButton';
import {useSendSMS} from '../hooks/useSendSMS';
import RNTextInput from '../components/RNTextInput';
import RNSpeedMeter from '../components/RNSpeedMeter';
import {usePermissions} from '../hooks/usePermissions';
import {useVideoRecorder} from '../hooks/useVideoRecorder';
import {useSpeedMonitoring} from '../hooks/useSpeedMonitoring';
import {useLocationTracking} from '../hooks/useLocationTracking';

const HomeScreen = () => {
  const [speedLimit, setSpeedLimit] = useState('');
  const [zeroSpeedDuration, setZeroSpeedDuration] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [monitoring, setMonitoring] = useState(false);
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;

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
      <Text style={styles.heading}>Speed Monitor App</Text>
      <RNSpeedMeter currentSpeed={currentSpeed} />
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
  speedometer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    marginBottom: 40,
  },
  background: {
    backgroundColor: '#e0e0e0',
  },
  arc: {
    borderWidth: 6,
    borderColor: '#009688',
    backgroundColor: 'transparent',
    borderRadius: 100,
  },
  needle: {
    width: 4,
    height: 80,
    backgroundColor: '#ff5733',
    borderRadius: 2,
  },
  progress: {
    backgroundColor: '#4caf50',
    height: 10,
    borderRadius: 5,
  },
  marks: {
    width: '100%',
    position: 'absolute',
    top: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  indicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -10}, {translateY: -10}],
    width: 20,
    height: 20,
    backgroundColor: '#ff5733',
    borderRadius: 10,
  },
});

export default HomeScreen;
