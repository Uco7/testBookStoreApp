import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../constant/colors'

const ThemeButton = ({style,...prop}) => {
  return (
    <Pressable  style={({pressed})=>[styles.btn, pressed&&styles.opacity ,style]}
    
    {...prop}
    /> 

   
  )
}

export default ThemeButton

const styles = StyleSheet.create({
    btn:{
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:colors.primary,
        borderRadius:10,
        padding:10,
        width:"50%",
    },
    opacity:{
        opacity:0.5
    }
})