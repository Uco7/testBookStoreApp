import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, View, TouchableWithoutFeedback, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // IMPORTANT
import ThemeView from '../../../component/ThemeView';
import ThemeText from '../../../component/ThemeText';
import ThemeButton from '../../../component/ThemeButton';
import Spacer from '../../../component/Spacer';
import InputTheme from '../../../component/InputTheme';
import { useUser } from '../../../hook/useUser';
import KeyBordAvoidingComponent from '../../../component/KeyBordAvoidingComponent';
import CardTheme from '../../../component/CardTheme';

export default function ResetPassword() {
  // This 'token' matches the [token].jsx filename
  const { token } = useLocalSearchParams(); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { resetPassword } = useUser();
  const router = useRouter();

  const handleReset = async () => {
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Sending both the token from the URL and the new password to your backend
      await resetPassword(token, password);
      
      Alert.alert(
        "Success", 
        "Your password has been updated. Please login.",
        [{ text: "Login", onPress: () => router.replace("/login") }]
      );
    } catch (err) {
      setError(err.message || "Something went wrong. Link might be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyBordAvoidingComponent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemeView style={styles.container} safe={true}>
          <CardTheme style={styles.card}>
            
            <ThemeText style={styles.title}>New Password</ThemeText>
            
            <Spacer height={10} />
            
            <ThemeText style={styles.subtitle}>
              Please enter your new password below.
            </ThemeText>

            <Spacer height={25} />

            <InputTheme
              placeholder="Minimum 8 characters"
              style={{ width: '100%' }}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={setPassword}
              value={password}
            />

            <Spacer height={25} />

            <ThemeButton onPress={handleReset} disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? "Updating..." : "Update Password"}
              </Text>
            </ThemeButton>

            {error && (
              <View style={{ height: 40, justifyContent: 'center' }}>
                <Text style={styles.error}>{error}</Text>
              </View>
            )}

          </CardTheme>
        </ThemeView>
      </TouchableWithoutFeedback>
    </KeyBordAvoidingComponent>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { width: '90%', padding: 25, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#aaa', textAlign: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  error: { color: '#ff6b6b', fontSize: 13, textAlign: 'center', marginTop: 10 },
});