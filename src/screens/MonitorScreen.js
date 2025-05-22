import React from 'react';
import {useRoute} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';

import RNSpeedMeter from '../components/RNSpeedMeter';

const MonitorScreen = () => {
  const route = useRoute();
  const {currentSpeed} = route.params || {};
  return (
    <>
      <RNSpeedMeter currentSpeed={currentSpeed} />
    </>
  );
};

export default MonitorScreen;

const styles = StyleSheet.create({});
