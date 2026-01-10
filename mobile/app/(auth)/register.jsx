

import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useState } from 'react';
import ThemeView from '../../component/ThemeView';
import ThemeText from '../../component/ThemeText';
import ThemeButton from '../../component/ThemeButton';
import Spacer from '../../component/Spacer';
import { Link, useRouter } from 'expo-router';
import { colors } from '../../constant/colors';
import InputTheme from '../../component/InputTheme';
import { useUser } from '../../hook/useUser';
import { Ionicons } from '@expo/vector-icons';
import KeyBordAvoidingComponent from '../../component/KeyBordAvoidingComponent';
import CardTheme from '../../component/CardTheme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,64}$/;
const NAME_REGEX = /^[a-zA-Z\s.'-]{2,50}$/;

const MAX_EMAIL_LENGTH = 120;
const MAX_PASSWORD_LENGTH = 128;

 function Register() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { register } = useUser();

  const sanitize = (value) =>
    value.replace(/[<>\/\\$;]/g, "").trim();

  const validate = () => {
    if (!username || !fullName || !email || !password)
      return "All fields are required.";

    if (!USERNAME_REGEX.test(username))
      return "Username must be 3–20 characters and contain only letters, numbers or _.";

    if (!NAME_REGEX.test(fullName))
      return "Enter a valid full name.";

    if (!EMAIL_REGEX.test(email))
      return "Enter a valid email address.";

    if (!PASSWORD_REGEX.test(password))
      return "Password must be at least 8 characters with letters and numbers.";

    if (email.length > MAX_EMAIL_LENGTH)
      return "Email is too long.";

    if (password.length > MAX_PASSWORD_LENGTH)
      return "Password is too long.";

    return null;
  };

  const handleRegister = async () => {
    if (loading) return;

    setError(null);
    setSuccess(false);
    setLoading(true);

    const cleanUsername = sanitize(username);
    const cleanFullName = sanitize(fullName);
    const cleanEmail = sanitize(email);
    const cleanPassword = sanitize(password);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      await register({
        username: cleanUsername,
        fullName: cleanFullName,
        email: cleanEmail,
        password: cleanPassword,
      });

      setSuccess("Registration successful. Redirecting...");
      setTimeout(() => router.replace("/login"), 1500);
    } catch (err) {
      console.warn("Registration error:", err?.message || err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
        <KeyBordAvoidingComponent>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemeView style={styles.container} safe={true}>

        <CardTheme style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="arrow-back" size={22} color="#fff" onPress={() => router.back()} />
            <ThemeText style={styles.headerTitle}>Create Account</ThemeText>
            <View style={{ width: 22 }} />
          </View>

          <Spacer height={20} />

          <InputTheme placeholder="Username" style={styles.input} onChangeText={setUsername} value={username} />
          <Spacer height={20} />

          <InputTheme placeholder="Full Name" style={styles.input} onChangeText={setFullName} value={fullName} />
          <Spacer height={20} />

          <InputTheme
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />
          <Spacer height={20} />

          <InputTheme
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />

          <Spacer height={24} />

          <ThemeButton onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Creating..." : "Sign Up"}</Text>
          </ThemeButton>

          <Spacer />

          {error && <Text style={styles.error}>{error}</Text>}
          {success && <Text style={styles.success}>{success}</Text>}

          <Spacer height={20} />

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Link href="/login" style={styles.loginLink}>Log in</Link>
          </Text>
        </CardTheme>
      </ThemeView>
    </TouchableWithoutFeedback>
            </KeyBordAvoidingComponent>
  );
}


export default Register;

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center" },
  card: {
    // width: "90%",
    // paddingVertical: 30,
    // paddingHorizontal: 20,
    // borderRadius: 26,
    // backgroundColor: "rgba(14, 12, 12, 1)",
    // // backgroundColor: ,

    // borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.15)",
  },
  header: { flexDirection: "row", alignItems: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "600" },
  input: { width: "100%" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footerText: { color: "#aaa", fontSize: 12, textAlign: "center" },
  loginLink: { color: colors.primary, fontSize: 13, fontWeight: "600" },
  error: { color: "#ff6b6b", textAlign: "center" },
  success: { color: "#4ade80", textAlign: "center" },
});

