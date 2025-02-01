import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native"

const TimerScreen = ({navigation}) =>{
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  const saveTimer = async () => {
    if (!name || !duration || !category) {
      Alert.alert('Please fill all fields');
      return;
    }

    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: parseInt(duration, 10), 
      remaining: parseInt(duration, 10),
      category,
      status: 'paused',
    };

    try {
      const existingTimers = await AsyncStorage.getItem('timers');
      const timers = existingTimers ? JSON.parse(existingTimers) : [];

      timers.push(newTimer);

      await AsyncStorage.setItem('timers', JSON.stringify(timers));

      setName('');
      setDuration('');
      setCategory('');
      navigation.goBack();
    } catch (error) {
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.label}>Timer Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter timer name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Duration (in seconds)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter duration"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter category"
        value={category}
        onChangeText={setCategory}
      />

      <Pressable style={styles.button} onPress={saveTimer}>
        <Text style={styles.buttonText}>Save Timer</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  button: {
    padding: 12,
    backgroundColor: '#3498db',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimerScreen

