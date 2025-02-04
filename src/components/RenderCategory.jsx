import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '../utilities/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RenderComponent = ({ 
  item, 
  fetchTimer, 
  showModal, 
  setShowModal, 
  timerId, setTimerId,
  timers, 
  setTimers 
}) => {
  const { theme } = useTheme();
  const [timeRemaining, setTimeRemaining] = useState(item.remaining || item.duration);
  const [status, setStatus] = useState(item.status);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const syncWithStorage = async () => {
      try {
        const existingTimers = await AsyncStorage.getItem('timers');
        if (existingTimers) {
          const timersData = JSON.parse(existingTimers);
          const timerData = timersData.find(t => t.id === item.id);
          if (timerData) {
            setStatus(timerData.status);
            setTimeRemaining(timerData.remaining);
          }
        }
      } catch (error) {
        console.error('Error syncing with storage:', error);
      }
    };

    syncWithStorage();
  }, [timers]); // 

  useEffect(() => {
    const updateStorage = async () => {
      try {
        const existingTimers = await AsyncStorage.getItem('timers');
        let timersData = existingTimers ? JSON.parse(existingTimers) : [];
        const timerIndex = timersData.findIndex(t => t.id === item.id);

        if (timerIndex >= 0) {
          timersData[timerIndex].status = status;
          timersData[timerIndex].remaining = timeRemaining;
          await AsyncStorage.setItem('timers', JSON.stringify(timersData));
        }
      } catch (error) {
        console.error('Error updating storage:', error);
      }
    };

    updateStorage();
    fetchTimer(); 
  }, [status, timeRemaining]);

  const startTimer = () => {
    if (status === 'completed') return;
    setIsRunning(true);
    setStatus('running');
    const id = setInterval(() => {
      setTimeRemaining(prevRemaining => {
        if (prevRemaining <= 1) {
          clearInterval(id);
          setStatus('completed');
          setTimeout(() => {
            resetTimer();
          }, 1000);
          setShowModal(true);
          return 0;
        }
        return prevRemaining - 1;
      });
    }, 1000);

    setIntervalId(id);
  };
  const pauseTimer = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setStatus('paused');
  };
  const resetTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setTimeRemaining(item.duration);
    setIsRunning(false);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setStatus('paused');
  };

  return (
    <View style={{ marginBottom: 8, backgroundColor: theme.colors.card, padding: 20, borderRadius: 5 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, color: theme.colors.text }}>Name: {item.name}</Text>
        <Text style={{ fontSize: 14, color: theme.colors.text }}>Duration: {item.duration} sec</Text>
        <Text style={{ fontSize: 14, color: theme.colors.text }}>Remaining: {timeRemaining} sec</Text>
        <Text style={{ fontSize: 14, color: theme.colors.text }}>Status: {status}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Progress.Bar progress={timeRemaining / item.duration} width={170} height={20} color="blue" />
        <Text>{`(${timeRemaining}/${item.duration})`}</Text>
        <Button
          title={isRunning ? 'Pause' : 'Start'}
          onPress={isRunning ? pauseTimer : startTimer}
        />
        <Button title="Reset" onPress={resetTimer} style={{marginTop: 10}} />
      </View>
    </View>
  );
};

export default RenderComponent;
