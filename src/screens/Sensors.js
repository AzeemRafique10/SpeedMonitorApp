import {map} from 'rxjs/operators';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

const Sensors = () => {
  const [orientation, setOrientation] = useState('Neutral');

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);

    const subscription = accelerometer
      .pipe(map(({x, y}) => ({x, y})))
      .subscribe(
        ({x, y}) => {
          const threshold = 1.0;

          if (y < -threshold) {
            setOrientation('Up');
          } else if (y > threshold) {
            setOrientation('Down');
          } else if (x < -threshold) {
            setOrientation('Left');
          } else if (x > threshold) {
            setOrientation('Right');
          } else {
            setOrientation('Neutral');
          }
        },
        error => {
          console.log('The sensor is not available:', error);
        },
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Orientation:</Text>
      <Text style={styles.orientation}>{orientation}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  orientation: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default Sensors;
