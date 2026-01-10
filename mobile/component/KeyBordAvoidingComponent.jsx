import { KeyboardAvoidingView, Platform, } from 'react-native'

const KeyBordAvoidingComponent = ({children}) => {
  return (
    <KeyboardAvoidingView 
    style={{ flex: 1, width: "100%" }}
    behavior={Platform.OS==="ios"?"padding":"height"}
    >
        {children}

    </KeyboardAvoidingView>
  )
}

export default KeyBordAvoidingComponent

