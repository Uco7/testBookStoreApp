import {
  createContext,
  useContext,
  useState,
} from "react";

import { useColorScheme } from "react-native";
import { colors } from "../constant/colors";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();

  const [scheme, setScheme] = useState(
    deviceTheme || "light"
  );

  const toggleTheme = () => {
    setScheme((prev) =>
      prev === "light" ? "dark" : "light"
    );
  };

  const theme = colors[scheme];

  return (
    <ThemeContext.Provider
      value={{ scheme, theme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    console.log(
      "❌ ThemeContext is NULL — Provider NOT mounted"
    );

    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
};