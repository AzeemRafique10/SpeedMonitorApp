import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import {SpeedProvider} from './src/utils/SpeedContext';
import MonitorScreen from './src/screens/MonitorScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SpeedProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="MonitorScreen" component={MonitorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SpeedProvider>
  );
}

export default App;
