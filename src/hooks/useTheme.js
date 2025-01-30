import { ThemeContext } from "@react-navigation/native";
import { useContext } from "react";

// Custom hook to access the ThemeContext
export const useTheme = () => {
    const context = useContext(ThemeContext);
   
    return context;
  };
  