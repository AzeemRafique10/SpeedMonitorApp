import {useEffect} from 'react';
import Geolocation from 'react-native-geolocation-service';

export const useLocationTracking = (
  setCurrentSpeed,
  requestLocationPermission,
) => {
  useEffect(() => {
    const startLocationTracking = async () => {
      const permission = await requestLocationPermission();
      if (!permission) return;

      Geolocation.watchPosition(
        position => {
          const speedInMps = position.coords.speed;
          const speedInKmph =
            speedInMps !== null ? (speedInMps * 3.6).toFixed(2) : '0.00';
          setCurrentSpeed(speedInKmph);
        },
        error => console.error('Geolocation error:', error),
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 1000,
          fastestInterval: 1000,
          showsBackgroundLocationIndicator: true,
          forceRequestLocation: true,
          showLocationDialog: true,
        },
      );
    };

    startLocationTracking();

    return () => Geolocation.stopObserving();
  }, []);
};
