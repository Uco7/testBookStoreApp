import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { colors } from '../../constant/colors'

const RefereceLayout = () => {
  const colorScheme=useColorScheme()
    const theme=colors[colorScheme]??colors.light
 
  return (
    <Stack screenOptions={{headerShown:false,
    headerStyle:{backgroundColor:theme.navBackground},
    headerTitleStyle:{color:theme.title}
    
    }}>
      
        <Stack.Screen name='appUsage'options={{title:"Register Page"}} /> 
        <Stack.Screen name='questionScreen'options={{title:"Login Page"}} />
    </Stack>
  )
}

export default RefereceLayout
