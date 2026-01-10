import { StyleSheet, TouchableOpacity } from 'react-native'
import { useColorScheme } from 'react-native'
import { colors } from '../constant/colors'

const PressableComponent = ({style, ...prop}) => {
     const colorScheme=useColorScheme()
        const theme=colors[colorScheme]??colors.light
  return (
    <TouchableOpacity
    style={[styles.button,style,{backgroundColor:theme.PressableBorderColor}]}
   
    {...prop}

/>
    
    


   
    
  )
}

export default PressableComponent

const styles = StyleSheet.create({
button:{
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    // borderColor: "rgba(65, 62, 62, 0.2)",
    // backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
}
   
})