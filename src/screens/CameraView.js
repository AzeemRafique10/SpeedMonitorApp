import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

const CameraView = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleOpenCamera = () => {
    if (hasPermission) {
      setShowCamera(true);
      // Delay to ensure the camera device is initialized
      setTimeout(() => {
        setIsCameraReady(true);
      }, 1000); // Adjust the delay as needed
    } else {
      requestPermission();
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to use this feature.
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!showCamera ? (
        <Button title="Open Camera" onPress={handleOpenCamera} />
      ) : device && isCameraReady ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />
      ) : (
        <Text>Loading camera...</Text>
      )}
    </View>
  );
};

export default CameraView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    marginBottom: 10,
    textAlign: 'center',
  },
});
