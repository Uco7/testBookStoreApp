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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,64}$/;

const MAX_IDENTIFIER_LENGTH = 120;
const MAX_PASSWORD_LENGTH = 128;

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // email OR username
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const router = useRouter();
  const { login } = useUser();

  const sanitize = (value) =>
    value.replace(/[<>\/\\$;]/g, "").trim();

  const validate = () => {
    if (!identifier || !password) return "All fields are required.";

    if (identifier.length > MAX_IDENTIFIER_LENGTH)
      return "Identifier is too long.";

    if (password.length > MAX_PASSWORD_LENGTH)
      return "Password is too long.";

    const isEmail = EMAIL_REGEX.test(identifier);
    const isUsername = USERNAME_REGEX.test(identifier);

    if (!isEmail && !isUsername)
      return "Enter a valid email or username.";

    if (!PASSWORD_REGEX.test(password))
      return "Password must be at least 8 characters with letters and numbers.";

    return null;
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (attempts >= 5) {
      setError("Too many failed attempts. Try again later.");
      return;
    }

    setError(null);
    setLoading(true);

    const cleanIdentifier = sanitize(identifier);
    const cleanPassword = sanitize(password);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      await login(cleanIdentifier, cleanPassword);
      router.replace("/profile");
    } catch (err) {
      console.warn("Login error:", err?.message || err);
      setAttempts((prev) => prev + 1);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemeView>
        <ThemeText>Login Page</ThemeText>

        <Spacer />

        <InputTheme
          placeholder="Email or Username"
          style={{ width: '80%' }}
          autoCapitalize="none"
          onChangeText={setIdentifier}
          value={identifier}
        />

        <Spacer />

        <InputTheme
          placeholder="Password"
          style={{ width: '80%' }}
          secureTextEntry
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
        />

        <Spacer />

        <ThemeButton onPress={handleSubmit} disabled={loading}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </ThemeButton>

        <Spacer />

        {error && <Text style={styles.error}>{error}</Text>}

        <Spacer />

        <ThemeText>
          <Text style={{ fontSize: 14 }}>
            Don't have an account? Register{" "}
          </Text>
          <Link
            href="/register"
            style={{ color: colors.primary, fontSize: 20, fontWeight: '600' }}
          >
            Here
          </Link>
        </ThemeText>
      </ThemeView>
    </TouchableWithoutFeedback>
  );
}
