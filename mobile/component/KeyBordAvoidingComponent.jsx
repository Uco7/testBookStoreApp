// import { KeyboardAvoidingView, Platform, } from 'react-native'

// const KeyBordAvoidingComponent = ({children}) => {
//   return (
//     <KeyboardAvoidingView 
//     style={{ flex: 1, width: "100%" }}
//     behavior={Platform.OS==="ios"?"padding":"height"}
//     >
//         {children}

//     </KeyboardAvoidingView>
//   )
// }

// export default KeyBordAvoidingComponent


import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

const KeyBordAvoidingComponent = ({ children }) => {
  return (
    <KeyboardAvoidingView 
      style={styles.wrapper}
      // On Android, "height" often causes the 'empty space' bug. 
      // Using null/undefined lets the OS handle it.
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} 
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: { 
    flex: 1, 
    width: "100%" 
  },
});

export default KeyBordAvoidingComponent;

