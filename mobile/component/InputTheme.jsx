import { StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native'
import React from 'react'
import { colors } from '../constant/colors'
import { ThemeContext,useTheme } from '../context/ThemeContext'

const InputTheme = ({style,...prop}) => {
    // const colorScheme=useColorScheme()
    // const theme=colors[colorScheme]??colors.light
    const {theme}=useTheme();
  return (
    <TextInput style={[{backgroundColor:theme.inputBacground, color:theme.text, padding:10,borderRadius:5},style]}
    placeholderTextColor={theme.text}
    {...prop} />
  )
}

export default InputTheme

const styles = StyleSheet.create({})