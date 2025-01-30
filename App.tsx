import * as React from 'react';
import Navigation from './src/navigation/MainNavigation';
import { ThemeProvider } from './src/utilities/ThemeContext';

interface componentNameProps {}

const App = () => {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
};

export default App;