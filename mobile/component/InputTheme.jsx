import { StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native'
import React from 'react'
import { colors } from '../constant/colors'

const InputTheme = ({style,...prop}) => {
    const colorScheme=useColorScheme()
    const theme=colors[colorScheme]??colors.light
  return (
    <TextInput style={[{backgroundColor:theme.uiBackground, color:theme.text, padding:10,borderRadius:5},style]}
    placeholderTextColor={theme.text}
    {...prop} />
  )
}

export default InputTheme

const styles = StyleSheet.create({})