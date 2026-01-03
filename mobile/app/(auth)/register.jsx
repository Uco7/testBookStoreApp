import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, Alert } from 'react-native'
import  { useState } from 'react'
import ThemeView from '../../component/ThemeView'
import ThemeText from '../../component/ThemeText'
import ThemeButton from '../../component/ThemeButton'
import Spacer from '../../component/Spacer'
import { Link, useRouter,  } from 'expo-router'
import { colors } from '../../constant/colors'
import InputTheme from '../../component/InputTheme'
import { useUser } from '../../hook/useUser'
 

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const  [success,setSuccess]=useState(false)
  const router=useRouter();
  const {register}=useUser()
 

  const handleRegister = async () => {
    setSuccess(false)
    setError(null);
    try {
      await register(email, password);
      setSuccess("Registration successful!"); 
      setTimeout(() => {
        router.replace("/login");
      }, 3000);
      
    } catch (error) {
      setError("Registration failed. Please try again.");
      
    }

   
    
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemeView>
        <ThemeText>Register Page</ThemeText>

        <InputTheme
          placeholder="user Email"
          style={{ width: "80%" }}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <Spacer />

        <InputTheme
          placeholder="user password"
          style={{ width: "80%" }}
          secureTextEntry
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
        />

        <Spacer />

        <ThemeButton onPress={handleRegister}>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>
            Register
          </Text>
        </ThemeButton>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        {success && <Text style={{ color: "green" }}>{success}</Text>}

        <Spacer />
        <Spacer />

        <Text>
          Already have an account? Login{" "}
          <Link href="/login" style={{ color: colors.primary, fontSize: 20, fontWeight: "600" }}>
            Here
          </Link>
        </Text>
      </ThemeView>
    </TouchableWithoutFeedback>
  )
}

export default Register

const styles = StyleSheet.create({})
