import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { colors } from '../constant/colors'

const ThemeText = ({style, ...prop}) => {
    const  colorScheme=useColorScheme()
    const theme=colors[colorScheme]??colors.light
  return (
     <Text style={[{color:theme.text },styles.text ,style]}
    
    {...prop}
    />
    
  )
}

export default ThemeText

const styles = StyleSheet.create({
    text:{
        fontSize:20,
        fontWeight:"400"
    }
})