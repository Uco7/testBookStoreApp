import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { colors } from '../constant/colors'

const RowItemsTheme = ({style,...prop}) => {
    const colorScheme=useColorScheme()
    const theme=colors[colorScheme]??colors.light
  return (
    <View
    style={[{backgroundColor:theme.uiBackground, borderColor:theme.rowBorder},styles.row,style]}

    {...prop}
   />
     
  )
}

export default RowItemsTheme

const styles = StyleSheet.create({
     row: {
    flexDirection: "row",
    // borderWidth:1,
    gap: 12,
    width: "100%",
  },
})