import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { colors } from '../constant/colors'

const CardTheme = ({style,...prop}) => {
    const colorScheme=useColorScheme()
    const theme=colors[colorScheme]??colors.light
  return (
    <View style={[{backgroundColor:theme.uiBackground, borderWidth: 1, borderColor: theme.borderColor}, styles.card , style]}
    
    {...prop}
    />
      
  )
}

export default CardTheme

const styles = StyleSheet.create({
     card: {
    width: "90%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 26,
    // backgroundColor: "rgba(255,255,255,0.05)",
    // backgroundColor: "",

   
   
  },

})