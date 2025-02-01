import {Image, Pressable, Text, View} from 'react-native';
import {useTheme} from '../utilities/ThemeContext';

const Header = ({navigation, title = 'Timer'}) => {
  const {isDarkTheme, toggleTheme, theme} = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.card,
        paddingHorizontal: 20,
        paddingVertical: 15,
      }}>
      <Pressable
        style={{padding: 10}}
        onPress={() => navigation.goBack()}>
            
      </Pressable>
      <Text style={{fontSize: 20, color: theme.colors.text, fontWeight: '800'}}>{title}</Text>

      <Pressable
        style={{padding: 10, backgroundColor: theme.colors.primary, borderRadius: 5}}
        onPress={toggleTheme}>
        <Image source={require('../assets/images/daynight.png')}  style={{ width: 18, height: 18}}/>
      </Pressable>
    </View>
  );
};

export default Header;
