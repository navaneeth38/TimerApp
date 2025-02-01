import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  Button,
} from 'react-native';
import {useTheme} from '../utilities/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import RenderComponent from '../components/RenderCategory';
import CongratsModal from '../components/CongratsModal';

const HomeScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [groupedTimers, setGroupedTimers] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [timers, setTimers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');
  const [timerId, setTimerId] = useState(null);

  const fetchTimers = async () => {
    const storedTimers = await AsyncStorage.getItem('timers');
    if (storedTimers) {
      setTimers(JSON.parse(storedTimers));
    }
  };

  const startAllTimers = async category => {
    const storedTimers = await AsyncStorage.getItem('timers');
    if (!storedTimers) return;

    let timers = JSON.parse(storedTimers);
    timers = timers.map(timer => {
      if (timer.category === category) {
        setStatus('running');
        const id = setInterval(() => {
          // setTimeRemaining(prevRemaining => {
          //   if (prevRemaining <= 1) {
          //     clearInterval(id);
          //     setStatus('completed');
          //     setShowModal(true);
          //     return 0;
          //   }
          //   return prevRemaining - 1;
          // });
        }, 1000);
        setTimerId(id);
        return {...timer, status: 'running'};
      }
      return timer;
    });

    await AsyncStorage.setItem('timers', JSON.stringify(timers));
    setTimers(timers);
  };

  const resetAllTimers = async category => {
    const storedTimers = await AsyncStorage.getItem('timers');
    if (!storedTimers) return;

    let timers = JSON.parse(storedTimers);
    timers = timers.map(timer => {
      if (timer.category === category) {
        setStatus('paused');
        clearInterval(timerId)
        return {...timer, status: 'paused', remaining: timer.duration};
      }
      return timer;
    });

    await AsyncStorage.setItem('timers', JSON.stringify(timers));
    setTimers(timers);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTimers();
    }, []),
  );
  useMemo(() => {
    const grouped = timers?.reduce((groups, timer) => {
      if (!groups[timer.category]) {
        groups[timer.category] = [];
      }
      groups[timer.category].push(timer);
      return groups;
    }, {});

    setGroupedTimers(grouped);
  }, [timers]);

  const HomeScreenHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
          backgroundColor: theme.colors.card,
        }}>
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('Add Timer')}>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 16,
            }}>
            + Add Timer
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderItem = ({item}) => {
    const toggleCategory = category => {
      setExpandedCategory(expandedCategory === category ? null : category);
    };

    return (
      <View style={{marginBottom: 16, paddingHorizontal: 16}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}>
          <TouchableOpacity onPress={() => toggleCategory(item)}>
            <Text
              style={{
                fontSize: 18,
                color: theme.colors.text,
                fontWeight: 'bold',
              }}>
              {item} {expandedCategory === item ? '-' : '+'}
            </Text>
          </TouchableOpacity>
          <Pressable
            onPress={() => startAllTimers(item)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 10,
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
            }}>
            <Text>START ALL</Text>
          </Pressable>
          <Pressable
            onPress={() => resetAllTimers(item)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 10,
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
            }}>
            <Text>RESET ALL</Text>
          </Pressable>
        </View>
          <FlatList
            data={groupedTimers[item]}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={{ display: expandedCategory ? 'flex' : 'none'}}>
              <RenderComponent
                status={status}
                setStatus={setStatus}
                showModal={showModal}
                setShowModal={setShowModal}
                fetchTimer={fetchTimers}
                item={item}
                timerId={timerId}
                setTimerId={setTimerId}
              />
              </View>
            )}
          />
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}>
      <HomeScreenHeader />
      <FlatList
        data={Object.keys(groupedTimers)}
        keyExtractor={item => item}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
      />
      <CongratsModal
        setShowModal={setShowModal}
        showModal={showModal}
        updateHistory={() => console.log('update')}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  addButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  contentContainer: {
    padding: 16,
  },
});
