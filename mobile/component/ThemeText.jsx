import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { colors } from '../constant/colors'
import { ThemeContext,useTheme } from '../context/ThemeContext'

const ThemeText = ({style, ...prop}) => {
    const {theme}=useTheme();
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