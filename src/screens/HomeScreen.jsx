import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTheme} from '../utilities/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import RenderComponent from '../components/RenderCategory';
import CongratsModal from '../components/CongratsModal';

const HomeScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [timers, setTimers] = useState([]);
  const [status, setStatus] = useState('');
  const [timerId, setTimerId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTimers = async () => {
    const storedTimers = await AsyncStorage.getItem('timers');
    if (storedTimers) {
      setTimers(JSON.parse(storedTimers));
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTimers();
    }, []),
  );

  const groupedTimers = useMemo(() => {
    return timers.reduce((groups, timer) => {
      (groups[timer.category] = groups[timer.category] || []).push(timer);
      return groups;
    }, {});
  }, [timers]);

  const handleToggleCategory = category => {
    setExpandedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const startAllTimers = async category => {
    const updatedTimers = timers.map(timer => {
      if (timer.category === category) {
        return {...timer, status: 'running', remaining: timer.duration};
      }
      return timer;
    });

    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
    setTimers(updatedTimers);
  };

  const resetAllTimers = async category => {
    const updatedTimers = timers.map(timer => {
      if (timer.category === category) {
        return {...timer, status: 'paused', remaining: timer.duration};
      }
      return timer;
    });

    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
    setTimers(updatedTimers);
  };

  const removeCategory = category => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category and all its timers?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: async () => {
            const updatedTimers = timers.filter(
              timer => timer.category !== category,
            );
            await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
            setTimers(updatedTimers);
          },
        },
      ],
    );
  };

  const renderCategory = ({item: category}) => (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryHeader}>
        <TouchableOpacity onPress={() => handleToggleCategory(category)}>
          <Text style={[styles.categoryTitle, {color: theme.colors.text}]}>
            {category} {expandedCategories[category] ? '-' : '+'}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <Pressable
            style={[
              styles.actionButton,
              {backgroundColor: theme.colors.primary},
            ]}
            onPress={() => startAllTimers(category)}>
            <Text style={styles.actionText}>START ALL</Text>
          </Pressable>

          <Pressable
            style={[
              styles.actionButton,
              {backgroundColor: theme.colors.primary},
            ]}
            onPress={() => resetAllTimers(category)}>
            <Text style={styles.actionText}>RESET ALL</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, {backgroundColor: 'red'}]}
            onPress={() => removeCategory(category)}>
            <Text style={styles.actionText}>DELETE</Text>
          </Pressable>
        </View>
      </View>

      {expandedCategories[category] && (
        <FlatList
          data={groupedTimers[category]}
          keyExtractor={timer => timer.id}
          renderItem={({item}) => (
            <View style={styles.timerRow}>
              <RenderComponent
                setTimerId={setTimerId}
                timerId={timerId}
                showModal={showModal}
                setShowModal={setShowModal}
                item={item}
                fetchTimer={fetchTimers}
              />
            </View>
          )}
        />
      )}
    </View>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlatList
        data={Object.keys(groupedTimers)}
        keyExtractor={item => item}
        renderItem={renderCategory}
        contentContainerStyle={styles.contentContainer}
      />

      <View style={[styles.header, {backgroundColor: theme.colors.card}]}>
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('Add Timer')}>
          <Text style={{color: theme.colors.text, fontSize: 16}}>
            + Add Timer
          </Text>
        </Pressable>
      </View>
      {/* Congrats Modal */}
      <CongratsModal setShowModal={setShowModal} showModal={showModal} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  addButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  categoryContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionText: {
    color: 'white',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 5,
  },
  deleteText: {
    color: 'white',
  },
});
