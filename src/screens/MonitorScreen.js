import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {SpeedContext} from '../utils/SpeedContext';
import RNSpeedMeter from '../components/RNSpeedMeter';

const MonitorScreen = () => {
  const {currentSpeed} = useContext(SpeedContext);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Speed Meter</Text>
      {/* <Text style={styles.speed}>{currentSpeed}</Text> */}
      <RNSpeedMeter currentSpeed={currentSpeed} />
    </View>
  );
};

export default MonitorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  speed: {
    fontSize: 64,
    fontFamily: 'monospace',
    color: '#39FF14',
    backgroundColor: '#121212',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
    letterSpacing: 5,
    textAlign: 'center',
    textShadowColor: '#0f0',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 12,
    marginBottom: 20,
  },
});
