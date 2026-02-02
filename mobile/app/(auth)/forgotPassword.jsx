import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, View, TouchableWithoutFeedback, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ThemeView from '../../component/ThemeView';
import ThemeText from '../../component/ThemeText';
import ThemeButton from '../../component/ThemeButton';
import Spacer from '../../component/Spacer';
import InputTheme from '../../component/InputTheme';
import { useUser } from '../../hook/useUser';
import KeyBordAvoidingComponent from '../../component/KeyBordAvoidingComponent';
import CardTheme from '../../component/CardTheme';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Request Code, 2 = Verify & Reset
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword,setShowPassword]=useState(false)


  const { forgotPassword, resetPassword } = useUser();
  const router = useRouter();
  const PASSWORD_REGEX =  /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,128}$/;

  // Step 1: Request the 6-digit code
  const handleRequestCode = async () => {
    if (!identifier.trim()) {
      setError("Please enter your email or username");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(identifier.trim());
      setStep(2); // Move to the next screen UI
      Alert.alert("Code Sent", "Please check your email for the 6-digit reset code.");
    } catch (err) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code and update password
  const handleResetSubmit = async () => {
    if (!otp || !password) {
      setError("Please fill in all fields");
      return;
    }

    // 2. Password Strength Validation
    if (!PASSWORD_REGEX.test(password)) {
      setError("Password must be at least 8 characters and include both letters and numbers.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await resetPassword(identifier.trim(), otp.trim(), password.trim());
      Alert.alert("Success", "Your password has been reset!", [
        { text: "Login", onPress: () => router.replace("/login") }
      ]);
    } catch (err) {
      // Robust error handling for network/server
      let msg = err.message || "Reset failed";
      if (err.message === "Network Error") msg = "Network Error: Check your connection";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyBordAvoidingComponent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemeView style={styles.container} safe={true}>
          <CardTheme style={styles.card}>
            <ThemeText style={styles.title}>
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </ThemeText>

            <Spacer height={10} />
            <ThemeText style={styles.subtitle}>
              {step === 1 
                ? "Enter your details to receive a 6-digit recovery code." 
                : "Enter the code sent to your email and your new password."}
            </ThemeText>

            <Spacer height={25} />

            {step === 1 ? (
              /* --- UI for Step 1 --- */
              <>
                <InputTheme
                  placeholder="Email or Username"
                  style={{ width: '100%' }}
                  autoCapitalize="none"
                  onChangeText={setIdentifier}
                  value={identifier}
                />
                <Spacer height={25} />
                <ThemeButton onPress={handleRequestCode} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "Sending..." : "Send Code"}</Text>
                </ThemeButton>
              </>
            ) : (
              /* --- UI for Step 2 --- */
              <>
                <InputTheme
                  placeholder="6-Digit Code"
                  style={{ width: '100%' }}
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={setOtp}
                  value={otp}
                />
                <Spacer height={15} />
                <View style={styles.eyeContainer}>

                <InputTheme
                  placeholder="New Password"
                  style={{ width: '100%' }}
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  value={password}
                />
                <TouchableOpacity style={styles.eyeIcon}
                onPress={()=>setShowPassword(!showPassword)}
                >
                  <Ionicons
                  name={showPassword?"eye-off":"eye"}
                  size={20}
                  color="#aaa"
                  />
                </TouchableOpacity>
                  </View>
                <Spacer height={25} />
                <ThemeButton onPress={handleResetSubmit} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "Updating..." : "Update Password"}</Text>
                </ThemeButton>
                <Spacer height={15} />
                <ThemeText style={styles.backLink} onPress={() => setStep(1)}>
                  Resend Code?
                </ThemeText>
              </>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <Spacer height={20} />
            <ThemeText style={styles.backLink} onPress={() => router.back()}>
              Back to Login
            </ThemeText>

          </CardTheme>
        </ThemeView>
      </TouchableWithoutFeedback>
    </KeyBordAvoidingComponent>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { width: '90%', padding: 25, alignItems: "center" },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#aaa', textAlign: 'center', paddingHorizontal: 10 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  errorText: { color: 'red', marginTop: 15, textAlign: 'center' },
  backLink: { color: '#aaa', fontSize: 14, textDecorationLine: 'underline' }
  ,
  eyeContainer:{
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
    position:"relative"
  },
  eyeIcon:{
    position:"absolute",
    right:15
  }
});