import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();

export default function AppNavigator({token}){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen}/>
        ) : (
          <Stack.Screen name="Profile" component={ProfileScreen}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
