import React from 'react';
import {StyleSheet, TextInput} from 'react-native';

const RNTextInput = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      placeholderTextColor="#999"
    />
  );
};

export default RNTextInput;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
});
