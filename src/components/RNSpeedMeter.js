import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Speedometer from 'react-native-cool-speedometer/dist/Speedometer';
import {
  Arc,
  Background,
  DangerPath,
  Indicator,
  Marks,
  Needle,
  Progress,
} from 'react-native-cool-speedometer';

const RNSpeedMeter = ({currentSpeed}) => {
  return (
    <View style={styles.container}>
      <Speedometer value={currentSpeed} max={180} fontFamily="squada-one">
        <Background />
        <Arc />
        <Needle style={styles.needle} />
        <DangerPath angle={95} />
        <Progress />
        <Marks />
        <Indicator />
      </Speedometer>
    </View>
  );
};

export default RNSpeedMeter;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
