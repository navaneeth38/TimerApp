import {useEffect, useState} from 'react';
import {Button, Text, View} from 'react-native';
import * as Progress from 'react-native-progress';
import {useTheme} from '../utilities/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RenderComponent = ({
  item,
  fetchTimer,
  status,
  setStatus,
  showModal,
  setShowModal,
  timerId, setTimerId
}) => {
  const {theme} = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(item.duration);


  useEffect(() => {
    setStatus(item.status);
  }, []);

  useEffect(() => {
    const updateStorage = async () => {
      try {
        const existingTimers = await AsyncStorage.getItem('timers');
        const timers = existingTimers ? JSON.parse(existingTimers) : [];
        const timerIndex = timers.findIndex(
          t => t.name === item.name && t.category === item.category,
        );
        if (timerIndex >= 0) {
          timers[timerIndex].status = status;
          timers[timerIndex].remaining = timeRemaining;
          await AsyncStorage.setItem('timers', JSON.stringify(timers));
        }
      } catch (error) {
      }
    };

    if (item.name && item.category) {
      updateStorage();
      fetchTimer();
    } else {
    }
  }, [status, timeRemaining]);

  const startTimer = () => {
    if (status === 'completed') return;
    setStatus('running');
    const id = setInterval(() => {
      setTimeRemaining(prevRemaining => {
        if (prevRemaining <= 1) {
          clearInterval(id);
          setStatus('completed');
          setShowModal(true);
          return 0;
        }
        return prevRemaining - 1;
      });
    }, 1000);
    setTimerId(id);
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
    clearInterval(intervalId);
    setTimeRemaining(item.duration);
    setIsRunning(false);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setStatus('paused');
  };

  return (
    <View
      style={{
        marginBottom: 8,
        backgroundColor: theme.colors.card,
        paddingVertical: 20,
        flexDirection: 'row',
        paddingLeft: 10,
        borderRadius: 5,
      }}>
      <View style={{flex: 1}}>
        <Text style={{fontSize: 14, color: theme.colors.text}}>
          Name: {item.name}
        </Text>
        <Text style={{fontSize: 14, color: theme.colors.text}}>
          Duration: {item.duration} sec
        </Text>
        <Text style={{fontSize: 14, color: theme.colors.text}}>
          Remaining: {item.remaining} sec
        </Text>
        <Text style={{fontSize: 14, color: theme.colors.text}}>
          Category: {item.category}
        </Text>
        <Text style={{fontSize: 14, color: theme.colors.text}}>
          Status: {status}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <Progress.Bar
          progress={timeRemaining / item.duration}
          width={170}
          height={20}
          color="blue"
          unfilledColor="lightgray"
        />
        <Text>{`(${timeRemaining}/${item.duration})   ${Math.round(
          ((item.duration - timeRemaining) / item.duration) * 100,
        )}%`}</Text>

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
