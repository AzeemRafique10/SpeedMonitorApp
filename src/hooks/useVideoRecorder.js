import {useRef, useState} from 'react';
import BackgroundTimer from 'react-native-background-timer';

export const useVideoRecorder = cameraRef => {
  const [isRecording, setIsRecording] = useState(false);
  const recordingTimeout = useRef(null);

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        await cameraRef.current.startRecording({
          flash: 'off',
          onRecordingFinished: video => console.log(video.path),
          onRecordingError: error => console.error(error),
        });

        setIsRecording(true);

        recordingTimeout.current = BackgroundTimer.setTimeout(
          stopRecording,
          10 * 60 * 1000,
        );
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

  return {isRecording, startRecording, stopRecording};
};
