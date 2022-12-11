import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Project created from the CLI</Text>
      <Text style={styles.codeStyle}>npm init @eugustavo/progen</Text>
      <StatusBar style="auto" />
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
  }
});
