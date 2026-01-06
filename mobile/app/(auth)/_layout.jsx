import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { colors } from '../../constant/colors'

const AuthLayout = () => {
  const colorScheme=useColorScheme()
    const theme=colors[colorScheme]??colors.light
 
  return (
    <Stack screenOptions={{headerShown:true,
    headerStyle:{backgroundColor:theme.navBackground},
    headerTitleStyle:{color:theme.title}
    
    }}>
      
        <Stack.Screen name='register'options={{title:"Register Page"}} /> 
        <Stack.Screen name='login'options={{title:"Login Page"}} />
    </Stack>
  )
}

export default AuthLayout
