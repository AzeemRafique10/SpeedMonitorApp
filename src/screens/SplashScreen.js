import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ImageBackground, StatusBar, StyleSheet} from 'react-native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('HomeScreen');
    }, 2000);
  });

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/splash.jpg')}>
      <StatusBar backgroundColor="black" barStyle={'dark-content'} />
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
