

import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import ThemeView from '../../component/ThemeView';
import ThemeText from '../../component/ThemeText';
import ThemeButton from '../../component/ThemeButton';
import Spacer from '../../component/Spacer';
import { Link, useRouter } from 'expo-router';
import { colors } from '../../constant/colors';
import InputTheme from '../../component/InputTheme';
import { useUser } from '../../hook/useUser';
import KeyBordAvoidingComponent from '../../component/KeyBordAvoidingComponent';
import CardTheme from '../../component/CardTheme';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,64}$/;

const MAX_IDENTIFIER_LENGTH = 120;
const MAX_PASSWORD_LENGTH = 128;

/* ------------------ helpers ------------------ */

// Only normalize identifiers (email / username)
const normalizeIdentifier = (value) => value.trim();

// Pure validation (no mutation)
const validate = (identifier, password) => {
  if (!identifier || !password) return 'All fields are required.';

  if (identifier.length > MAX_IDENTIFIER_LENGTH)
    return 'Identifier is too long.';

  if (password.length > MAX_PASSWORD_LENGTH)
    return 'Password is too long.';

  const isEmail = EMAIL_REGEX.test(identifier);
  const isUsername = USERNAME_REGEX.test(identifier);

  if (!isEmail && !isUsername)
    return 'Enter a valid email or username.';

  if (!PASSWORD_REGEX.test(password))
    return 'Password must be at least 8 characters and include letters and numbers.';

  return null;
};

/* ------------------ component ------------------ */

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { login } = useUser();

  const handleSubmit = async () => {
    if (loading) return;

    if (attempts >= 5) {
      setError('Too many failed attempts. Try again later.');
      return;
    }

    setError(null);
    setLoading(true);

    const cleanIdentifier = normalizeIdentifier(identifier);
    const cleanPassword = password; // ❗ NEVER sanitize passwords

    const validationError = validate(cleanIdentifier, cleanPassword);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      await login(cleanIdentifier, cleanPassword);
      router.replace('/profile');
    } catch (err) {
      setAttempts((prev) => prev + 1);

      let errorMessage = 'An unexpected error occurred.';

      if (err.message === 'Network Error') {
        errorMessage =
          'Connection failed. Please check your internet or network status.';
      } else if (err.response) {
        errorMessage =
          err.response.data?.message ||
          err.response.data?.msg ||
          'Login failed.';
      } else if (err.request) {
        errorMessage =
          'Server is not responding. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyBordAvoidingComponent>

     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemeView style={styles.container} safe={true}>
        <CardTheme style={styles.card}>

        <ThemeText>Login Page</ThemeText>

        <Spacer />

        <InputTheme
          placeholder="Email or Username"
          style={{ width: '100%' }}
          autoCapitalize="none"
          onChangeText={setIdentifier}
          value={identifier}
        />

        <Spacer />
        <View style={ styles.eyeContainer}>


        <InputTheme
          placeholder="Password"
          style={{ width: '100%' }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
          />
          <TouchableOpacity 
          onPress={()=>setShowPassword(!showPassword)}
          style={styles.eyeIcon}
          >
            <Ionicons
            name={showPassword?"eye-off":"eye"}
            size={20}
            color="#aaa"
            
            />
          </TouchableOpacity>
          </View>

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
            Forgot your password{" "}
          </Text>
          <Link
            href="/forgotPassword"
            style={{ color: colors.primary, fontSize: 20, fontWeight: '600' }}
            >
            Click
          </Link>
        </ThemeText>
            </CardTheme>
      </ThemeView>
      </TouchableWithoutFeedback>
      </KeyBordAvoidingComponent>
  );
}

const styles = StyleSheet.create({
    container: { justifyContent: "center", alignItems: "center" },

  error: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: '80%',
  
  },
  card:{
    justifyContent:"center",
    alignItems:"center"
  },
  eyeContainer:{
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
    position:"relative"

  },
  eyeIcon:{
    position:"absolute",
    
     right: 15,
    zIndex: 1,

  }

});