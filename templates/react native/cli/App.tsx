import React from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Project created from the CLI</Text>
      <Text style={styles.codeStyle}>npx @eugustavo/progen</Text>
      <StatusBar barStyle="light-content" translucent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeStyle: {
    padding: 10,
    fontStyle: 'italic',
    backgroundColor: '#fff9e8',
  },
});
