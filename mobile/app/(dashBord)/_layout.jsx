import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../constant/colors';
import { BookProvider } from '../../context/bookContext';

const DashBordLayout = () => {
  const colorScheme=useColorScheme()
  const theme=colors[colorScheme]??colors.light
  return (
    <BookProvider>

    <Tabs screenOptions={{
      headerShown:false,
      tabBarStyle:{backgroundColor:theme.navBackground},
      tabBarActiveTintColor:theme.title,
      tabBarInactiveTintColor:theme.text
    }
    }>
        <Tabs.Screen name='profile' options={{title:"Profile Page",tabBarIcon:({focused})=>(
          <Ionicons
          name={focused?"person":"person-outline"}
          size={20}
          color={theme.iconColor}

          
          
          />
        )}}/>
        <Tabs.Screen name='book' options={{title:"Book Shelve",tabBarIcon:({focused})=>(
          <Ionicons
          name={focused?"book":"book-outline"}
          size={20}
          color={theme.iconColor}
          
          
          
          />
        )}}/>
        <Tabs.Screen name='create' options={{title:"Create Page",tabBarIcon:({focused})=>(
          <Ionicons
          name={focused?"create":"create-outline"}
          size={20}
          color={theme.iconColor}

          
          
          />
        )}}/>
        <Tabs.Screen name='updateBook' options={{href:null}}/>
    </Tabs>
        </BookProvider>
  )
}

export default DashBordLayout

const styles = StyleSheet.create({})