import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  // if i want to show the header of my page i do it this way
//by put stack.screen name prop& option and  overal header set to true
  return (
    <Stack screenOptions={{headerShown:true}}>
      
        <Stack.Screen name='register'options={{title:"Register Page"}} /> 
        <Stack.Screen name='login'options={{title:"Login Page"}} />
    </Stack>
  )
}

export default AuthLayout
