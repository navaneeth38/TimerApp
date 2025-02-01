import {NavigationContainer} from '@react-navigation/native';
import {HomeScreen, TimerScreen} from '../screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from '../utilities/ThemeContext';
import Header from '../components/ToggleTheme';

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  const {isDarkTheme, theme} = useTheme();
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Home"
        
        screenOptions={{
          header: ({navigation}) => {
            return(
              <Header navigation={navigation} title={"Timer"} />
            )
          }
            }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add Timer" component={TimerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
