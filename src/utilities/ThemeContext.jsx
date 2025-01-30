import React, { createContext,  useState } from 'react';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';



const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const theme = isDarkTheme ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

