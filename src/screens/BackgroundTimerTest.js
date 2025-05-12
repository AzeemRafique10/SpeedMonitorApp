import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

const BackgroundTimerTest = () => {
  const [count, setCount] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const startTimer = () => {
    if (intervalId) return; // Prevent multiple timers

    const id = BackgroundTimer.setInterval(() => {
      setCount(prevCount => prevCount + 1);
      console.log('Timer count:', count + 1);
    }, 1000); // Runs every 1 second

    setIntervalId(id);
  };

  const stopTimer = () => {
    if (intervalId) {
      BackgroundTimer.clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Background Timer Example</Text>
      <Text style={styles.counter}>Count: {count}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Start Timer" onPress={startTimer} />
        <Button title="Stop Timer" onPress={stopTimer} />
      </View>
    </View>
  );
};

export default BackgroundTimerTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  counter: {
    fontSize: 24,
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});
