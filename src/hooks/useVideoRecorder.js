import {useRef, useState} from 'react';
import BackgroundTimer from 'react-native-background-timer';

export const useVideoRecorder = cameraRef => {
  const [isRecording, setIsRecording] = useState(false);
  const recordingTimeout = useRef(null);

  const recordingFinishedPromiseRef = useRef(null);
  const resolveRecordingFinishedRef = useRef(null);

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return false;
    console.warn('Already recording, skipping startRecording');

    recordingFinishedPromiseRef.current = new Promise(resolve => {
      resolveRecordingFinishedRef.current = resolve;
    });

    try {
      await cameraRef.current.startRecording({
        flash: 'off',
        onRecordingFinished: video => {
          if (resolveRecordingFinishedRef.current) {
            resolveRecordingFinishedRef.current(video);
          }
          cleanup();
        },
        onRecordingError: error => {
          console.error('Recording error:', error);
          if (resolveRecordingFinishedRef.current) {
            resolveRecordingFinishedRef.current(null);
          }
          cleanup();
        },
      });

      setIsRecording(true);

      if (recordingTimeout.current) {
        BackgroundTimer.clearTimeout(recordingTimeout.current);
      }

      recordingTimeout.current = BackgroundTimer.setTimeout(() => {
        console.log('Auto-stopping after 5 seconds');
        stopRecording();
      }, 5000);

      return true;
    } catch (err) {
      console.error('Failed to start recording:', err);
      cleanup();
      return false;
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return null;

    try {
      await cameraRef.current.stopRecording();
    } catch (err) {
      console.warn('Stop recording error:', err);
    }

    // Ensure cleanup even if `onRecordingFinished` fails
    cleanup();

    if (recordingFinishedPromiseRef.current) {
      const video = await recordingFinishedPromiseRef.current;

      recordingFinishedPromiseRef.current = null;
      resolveRecordingFinishedRef.current = null;

      return video;
    }

    return null;
  };

  const cleanup = () => {
    setIsRecording(false);

    if (recordingTimeout.current) {
      BackgroundTimer.clearTimeout(recordingTimeout.current);
      recordingTimeout.current = null;
    }
  };

  return {isRecording, startRecording, stopRecording};
};
