import {useRef} from 'react';
import BackgroundTimer from 'react-native-background-timer';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

export const useSpeedMonitoring = (
  speedLimit,
  zeroSpeedDuration,
  setCurrentSpeed,
  isRecording,
  startRecording,
  stopRecording,
) => {
  const accelerometerSubscription = useRef(null);
  const zeroSpeedTimer = useRef(null);

  const startMonitoring = () => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 1000);

    accelerometerSubscription.current = accelerometer.subscribe(({x, y, z}) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z) - 9.8;
      const speed = Math.abs(acceleration * 3.6);
      setCurrentSpeed(speed.toFixed(2));

      const limit = parseFloat(speedLimit);
      const zeroLimit = parseFloat(zeroSpeedDuration) * 60 * 1000;

      if (speed > limit && !isRecording) {
        startRecording();
      }

      if (speed <= 1 && isRecording && !zeroSpeedTimer.current) {
        zeroSpeedTimer.current = BackgroundTimer.setTimeout(
          stopRecording,
          zeroLimit,
        );
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
  };

  return {startMonitoring, stopMonitoring};
};
