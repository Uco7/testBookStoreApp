// import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
// import React from 'react'
// import ThemeView from '../../component/ThemeView'
// import ThemeText from '../../component/ThemeText'
// import ThemeButton from '../../component/ThemeButton'
// import Spacer from '../../component/Spacer'
// import { Link } from 'expo-router'
// import { colors } from '../../constant/colors'
// import { useState } from 'react'
// import InputTheme from '../../component/InputTheme'


// const login = () => {
//     const [email,setEmail]=useState("")
//       const [password,setPassword]=useState("")
//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

//     <ThemeView>
//       <ThemeText>Login Page</ThemeText>
//       <Spacer/>
//          <InputTheme placeholder="user Email"
//       style={{width:"80%"}}
//       keyboardType="email"
//       autoCapitalize="none"
//       onChangeText={setEmail}
//       value={email}
      
//       />
//       <Spacer/>
//       <InputTheme placeholder="user password"
//       style={{width:"80%"}}
//       keyboardType="password"
//       autoCapitalize="none"
//       secureTextEntry={true}
//       onChangeText={setPassword}
//       value={password}
      
//       />
//       <Spacer/>
//       <ThemeButton>
//         <Text style={{color:"#fff",fontSize:20,fontWeight:"600"}}> Login</Text>

//       </ThemeButton>
//       <Spacer/>
//       <Text>Dont have an account? register <Link href="/register" style={{color:colors.primary,
//       fontSize:20,
//       fontWeight:"600"
//       }}
      
      
//       >Here</Link></Text>

//     </ThemeView>
//       </TouchableWithoutFeedback>
//   )
// }

// export default login

// const styles = StyleSheet.create({})





import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import ThemeView from '../../component/ThemeView';
import ThemeText from '../../component/ThemeText';
import ThemeButton from '../../component/ThemeButton';
import Spacer from '../../component/Spacer';
import { Link, useRouter } from 'expo-router';
import { colors } from '../../constant/colors';
import InputTheme from '../../component/InputTheme';
import { useUser } from '../../hook/useUser';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router=useRouter()
  const {login}=useUser()

  

  const handleSubmit = async () => {
    setError(null);
    try {
      
      await login(email, password);
      router.replace("/profile")
    } catch (error) {
      
      setError("Login failed. Please check your credentials and try again.");
    }
   
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemeView>
        <ThemeText>Login Page</ThemeText>

        <Spacer />

        <InputTheme
          placeholder="User Email"
          style={{ width: '80%' }}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <Spacer />

        <InputTheme
          placeholder="User Password"
          style={{ width: '80%' }}
          secureTextEntry
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
        />

        <Spacer />

        <ThemeButton onPress={handleSubmit}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>
            Login
          </Text>
        </ThemeButton>

        <Spacer />

        {error && <Text style={styles.error}>{error}</Text>}

        <Spacer />

        <Text>
          Don't have an account? Register{' '}
          <Link
            href="/register"
            style={{ color: colors.primary, fontSize: 20, fontWeight: '600' }}
          >
            Here
          </Link>
        </Text>
      </ThemeView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  error: {
    padding: 10,
    color: colors.warning,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 5,
    backgroundColor: '#e7c0c0ff',
    width: '80%',
    textAlign: 'center',
  },
});
