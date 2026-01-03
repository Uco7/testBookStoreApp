import { useColorScheme } from "react-native"
import { colors } from "../constant/colors"
import { Stack } from "expo-router"
import { UserProvider } from "../context/userContext"


const RootLayout = () => {
    const colorScheme=useColorScheme()
    const theme=colors[colorScheme]??colors.light
  return (
    <UserProvider>
    <Stack screenOptions={{headerStyle:{
      backgroundColor:theme.navBackground
    },
    headerTitleStyle:{
      color:theme.title
    }}}>
        <Stack.Screen name="index" options={{title:"Home",headerShown:true}}/>
        <Stack.Screen name="(auth)" options={{headerShown:false}}/>
        <Stack.Screen name="(dashBord)" options={{headerShown:false}}/>
    </Stack>
    
      </UserProvider>
    
    
    
  )
}

export default RootLayout

