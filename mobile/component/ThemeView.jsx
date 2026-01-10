// import {  StyleSheet, useColorScheme, View } from 'react-native'
// import React from 'react'
// import { colors } from '../constant/colors'
// import { useSafeAreaInsets } from 'react-native-safe-area-context'
// // import styles from "../constant/style"

// const ThemeView = ({style,safe=false, ...prop}) => {
//     const  colorScheme=useColorScheme()
//     const theme=colors[colorScheme]??colors.light
//     if(!safe){
//       return (
//          <View style={[{backgroundColor:theme.background},styles.container ,style]}
    
//     {...prop}  
//     />

//       )
//     }
//     const inset=useSafeAreaInsets()
//   return (
//      <View style={[{backgroundColor:theme.background,paddingTop:inset.top, paddingBottom:inset.bottom},styles.container,
      
//       ,style]}
    
//     {...prop}
//     />
    
//   )
// }

// export default ThemeView

// const styles=StyleSheet.create({
//     container:{
//     flex:1
       
       
//     }
// })





import { StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../constant/colors";

const ThemeView = ({ style, safe = false, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme] ?? colors.light;
  const insets = useSafeAreaInsets(); // ✅ always called

  const paddingStyle = safe
    ? { paddingTop: insets.top, paddingBottom: insets.bottom }
    : null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
        paddingStyle,
        style,
      ]}
      {...props}
    />
  );
};

export default ThemeView;

const styles = StyleSheet.create({
  container: { flex: 1 },
});

