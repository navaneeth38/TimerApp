import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { HomeScreen, TimerScreen } from '../screens';
import { useTheme } from '../hooks/useTheme';



const Navigation = () => { 
    const { theme } = useTheme();
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Timer" component={TimerScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
 }


 export default Navigation