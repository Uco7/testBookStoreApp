import React, { forwardRef } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

const PressableComponent = forwardRef(({ style, ...props }, ref) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.button,
        style,
        { backgroundColor: theme.PressableBorderColor },
      ]}
      {...props}
    />
  );
});

export default PressableComponent;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    
}
   
})