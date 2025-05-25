import RNFS from 'react-native-fs';
import React, {useEffect, useRef, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Text,
} from 'react-native';

const CameraScreen = ({onRecordingComplete}) => {
  const camera = useRef(null);
  const device = useCameraDevice('front');
  const {hasPermission} = useCameraPermission();

  const [recordingStarted, setRecordingStarted] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const startRecordingProcess = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
      }

      if (hasPermission && device) {
        setTimeout(() => {
          initiateRecording();
        }, 1000);
      }
    };

    startRecordingProcess();
  }, [hasPermission, device]);

  useEffect(() => {
    let timer;

    if (recordingStarted) {
      timer = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [recordingStarted]);

  useEffect(() => {
    if (secondsElapsed === 10) {
      stopRecording();
    }
  }, [secondsElapsed]);

  const initiateRecording = async () => {
    if (!camera.current) return;

    try {
      setRecordingStarted(true);

      await camera.current.startRecording({
        flash: 'off',
        onRecordingFinished: async video => {
          console.log('🎥 Recording finished:', video.path);
          await saveToGallery(video.path);
        },
        onRecordingError: error => {
          console.error('❌ Recording error:', error);
        },
      });
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await camera.current?.stopRecording();
      console.log('🛑 Stopped recording at 10s');
      setRecordingStarted(false);
      onRecordingComplete?.();
    } catch (err) {
      console.error('❌ Error stopping recording:', err);
    }
  };

  const saveToGallery = async filePath => {
    const fileName = `VID_${Date.now()}.mp4`;
    const destPath =
      Platform.OS === 'android'
        ? `${RNFS.DownloadDirectoryPath}/${fileName}`
        : `${RNFS.TemporaryDirectoryPath}${fileName}`;

    try {
      await RNFS.copyFile(filePath, destPath);
      console.log('✅ Video saved to:', destPath);
    } catch (error) {
      console.error('❌ Error saving file:', error);
    }
  };

  if (!hasPermission || !device) {
    return (
      <View style={styles.container}>
        <Text>Waiting for camera permission or device...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={{textAlign: 'center', marginTop: 20, fontSize: 18}}>
        Recording: {recordingStarted ? `${secondsElapsed}s` : 'Not started'}
      </Text> */}
      <Camera
        ref={camera}
        style={styles.hiddenCamera}
        device={device}
        isActive={true}
        video={true}
        audio={true}
      />
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  hiddenCamera: {
    position: 'absolute',
    width: 1,
    height: 1,
    top: -1000,
    left: -1000,
  },
});
