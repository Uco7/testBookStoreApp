


// import { StyleSheet, useColorScheme, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { colors } from "../constant/colors";
// import { use } from "react";
// import { useTheme } from "../context/ThemeContex";

// const ThemeView = ({ style, safe = false, ...props }) => {
//   // const value=useMemo(() => ({ scheme, toggleTheme }), [scheme]);
// const {scheme}=useTheme(); 
//   const theme = colors[scheme] ?? colors.light;
//   const insets = useSafeAreaInsets(); // ✅ always called

//   const paddingStyle = safe
//     ? { paddingTop: insets.top, paddingBottom: insets.bottom }
//     : null;

//   return (
//     <View
//       style={[
//         styles.container,
//         { backgroundColor: theme.background },
//         paddingStyle,
//         style,
//       ]}
//       {...props}
//     />
//   );
// };

// export default ThemeView;

// const styles = StyleSheet.create({
//   container: { flex: 1,
//     height:"100%"
//    },
// });



import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const ThemeView = ({ style, safe = false, ...props }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
        safe && {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});