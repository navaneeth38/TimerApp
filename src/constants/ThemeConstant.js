import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    text: '#000000',
    primary: '#3498db',
    border: '#e0e0e0',
    card: '#f8f8f8',
  },
};

export const NightTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
    text: '#ffffff',
    primary: '#9b59b6',
    border: '#333333',
    card: '#1e1e1e',
  },
};
