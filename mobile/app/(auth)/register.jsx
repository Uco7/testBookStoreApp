import { Keyboard, StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
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

function Register() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { requestRegistrationOTP, verifyAndFinalizeRegister } = useUser();

  const sanitize = (value) => value.replace(/[<>\/\\$;]/g, "").trim();

  const validate = () => {
    if (!username || !fullName || !email || !password) return "All fields are required.";
    if (!USERNAME_REGEX.test(username)) return "Username must be 3–20 characters and can only contain letters, numbers, and underscores..";
    if (!NAME_REGEX.test(fullName)) return "Full name must be 2–50 characters and can only contain letters, spaces, periods, and hyphens.";
    if (!EMAIL_REGEX.test(email)) return "Enter a valid email address (e.g. example@gmail.com)";
    if (!PASSWORD_REGEX.test(password)) return "Password must be 8–64 characters, include at least one letter and one number, and contain no spaces.";
    return null;
  };

  /* ---------- STEP 1 ---------- */
  const handleRegisterStep1 = async () => {
    if (loading) return;
    setError(null);

    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);

    try {
      await requestRegistrationOTP({
        username: sanitize(username),
        fullName: sanitize(fullName),
        email: sanitize(email).toLowerCase(),
        password,
      });

      setStep(2);
      Keyboard.dismiss();
    } catch (err) {
      setError(err.message );
    } finally {
      setLoading(false);
    }
  };

  /* ---------- STEP 2 ---------- */
  const handleVerifyStep2 = async () => {
    if (loading) return;

    if (otp.length !== 6) {
      return setError("Enter a valid 6-digit code.");
    }

    setError(null);
    setLoading(true);

    try {
      await verifyAndFinalizeRegister(email.toLowerCase(), otp);

      setSuccess("Account verified successfully!");

      setTimeout(() => {
        router.replace("/login");
      }, 1500);

    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESEND OTP ---------- */
  const handleResendOTP = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await requestRegistrationOTP({
        username: sanitize(username),
        fullName: sanitize(fullName),
        email: sanitize(email).toLowerCase(),
        password,
      });

      setSuccess("OTP resent successfully");
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyBordAvoidingComponent style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <ThemeView style={styles.container} safe>
          <CardTheme style={styles.card}>
            
            {/* HEADER */}
            <View style={styles.header}>
              <Ionicons
                name="arrow-back"
                size={22}
                color="#fff"
                onPress={() => step === 2 ? setStep(1) : router.back()}
              />
              <ThemeText style={styles.headerTitle}>
                {step === 1 ? "Create Account" : "Verify Email"}
              </ThemeText>
              <View style={{ width: 22 }} />
            </View>

            <Spacer height={20} />

            {/* STEP 1 */}
            {step === 1 ? (
              <>
                <InputTheme placeholder="Username"
                 onChangeText={setUsername}
                 autoCapitalize="none"
                 value={username} />
                <Spacer height={15} />

                <InputTheme placeholder="Full Name" onChangeText={setFullName} value={fullName} />
                <Spacer height={15} />

                <InputTheme
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={setEmail}
                  value={email}
                />
                <Spacer height={15} />

                <View style={styles.passwordContainer}>
                  <InputTheme
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onChangeText={setPassword}
                    value={password}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#aaa" />
                  </TouchableOpacity>
                </View>

                <Spacer height={20} />

                <ThemeButton onPress={handleRegisterStep1} disabled={loading}>
                  <Text style={styles.buttonText}>
                    {loading ? "Sending OTP..." : "Get Verification Code"}
                  </Text>
                </ThemeButton>
              </>
            ) : (
              /* STEP 2 */
              <>
                <ThemeText style={styles.infoText}>
                  Enter the 6-digit code sent to {email}
                </ThemeText>

                <Spacer height={20} />

                <InputTheme
                  placeholder="Enter OTP"
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={setOtp}
                  value={otp}
                />

                <Spacer height={20} />

                <ThemeButton onPress={handleVerifyStep2} disabled={loading}>
                  <Text style={styles.buttonText}>
                    {loading ? "Verifying..." : "Verify & Create Account"}
                  </Text>
                </ThemeButton>

                <Spacer height={10} />

                <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
                  <Text style={styles.loginLink}>Resend Code</Text>
                </TouchableOpacity>

                <Spacer height={10} />

                <TouchableOpacity onPress={() => setStep(1)}>
                  <Text style={styles.loginLink}>Edit Details</Text>
                </TouchableOpacity>
              </>
            )}

            <Spacer />

            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}

            <Spacer height={20} />

            {step === 1 && (
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Link href="/login" style={styles.loginLink}>
                  Log in
                </Link>
              </Text>
            )}

          </CardTheme>
        </ThemeView>
      </Pressable>
    </KeyBordAvoidingComponent>
  );
}

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  footerText: {
    color: "#aaa",
    fontSize: 12,
    textAlign: "center",
  },
  infoText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
  },
  loginLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  error: {
    color: "#ff6b6b",
    textAlign: "center",
  },
  success: {
    color: "#4ade80",
    textAlign: "center",
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
});

// import {
//   Keyboard,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
  
// } from "react-native";
// import { useState } from "react";
// import ThemeView from "../../component/ThemeView";
// import ThemeText from "../../component/ThemeText";
// import ThemeButton from "../../component/ThemeButton";
// import Spacer from "../../component/Spacer";
// import { Link, useRouter } from "expo-router";
// import { colors } from "../../constant/colors";
// import InputTheme from "../../component/InputTheme";
// import { useUser } from "../../hook/useUser";
// import { Ionicons } from "@expo/vector-icons";
// import KeyBordAvoidingComponent from "../../component/KeyBordAvoidingComponent";
// import CardTheme from "../../component/CardTheme";

// /* ---------- VALIDATION ---------- */
// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
// const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,64}$/;
// const NAME_REGEX = /^[a-zA-Z\s.'-]{2,50}$/;

// function Register() {
//   const [username, setUsername] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const router = useRouter();
//   const { register } = useUser();

//   const sanitize = (v) => v.replace(/[<>\/\\$;]/g, "").trim();

//   const validate = () => {
//     if (!username || !fullName || !email || !password)
//       return "All fields are required.";
//     if (!USERNAME_REGEX.test(username))
//       return "Username must be 3–20 characters (letters, numbers, underscores).";
//     if (!NAME_REGEX.test(fullName))
//       return "Enter a valid full name.";
//     if (!EMAIL_REGEX.test(email))
//       return "Enter a valid email address.";
//     if (!PASSWORD_REGEX.test(password))
//       return "Password must be at least 8 characters and contain letters and numbers.";
//     return null;
//   };

//   /* ---------- REGISTER ---------- */
//   const handleRegister = async () => {
//     if (loading) return;

//     setError(null);
//     setSuccess(null);

//     const validationError = validate();
//     if (validationError) return setError(validationError);

//     setLoading(true);
//     try {
//       await register({
//         username: sanitize(username),
//         fullName: sanitize(fullName),
//         email: sanitize(email).toLowerCase(),
//         password,
//       });

//       setSuccess("Account created successfully!");
//       Keyboard.dismiss();

//       setTimeout(() => {
//         router.replace("/login");
//       }, 1200);
//     } catch (err) {
      
//       let errorMessage = "Registration failed.";

//       if (err.message === "Network Error") {
//         errorMessage =
//           "Network error. Check your internet connection .";
//       } else if (err.response) {
//         errorMessage =
//           err.response.data?.message || "Server error occurred.";
//       } else {
//         errorMessage = err.message;
//       }

//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyBordAvoidingComponent>
    
//          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <ThemeView style={styles.container} safe={true}>
//           <CardTheme style={styles.card}>
//             {/* ---------- HEADER ---------- */}
//             <View style={styles.header}>
//               <Ionicons
//                 name="arrow-back"
//                 size={22}
//                 color="#fff"
//                 onPress={() => router.back()}
//               />
//               <ThemeText style={styles.headerTitle}>
//                 Create Account
//               </ThemeText>
//               <View style={{ width: 22 }} />
//             </View>

//             <Spacer height={20} />

//             {/* ---------- FORM ---------- */}
//             <InputTheme
//               placeholder="Username"
//               value={username}
//               onChangeText={setUsername}
//             />
//             <Spacer height={16} />

//             <InputTheme
//               placeholder="Full Name"
//               value={fullName}
//               onChangeText={setFullName}
//             />
//             <Spacer height={16} />

//             <InputTheme
//               placeholder="Email"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               value={email}
//               onChangeText={setEmail}
//             />
//             <Spacer height={16} />

//             <View style={styles.passwordContainer}>
//               <InputTheme
//                 placeholder="Password"
//                 secureTextEntry={!showPassword}
//                 autoCapitalize="none"
//                 value={password}
//                 onChangeText={setPassword}
//               />
//               <TouchableOpacity
//                 style={styles.eyeIcon}
//                 onPress={() => setShowPassword(!showPassword)}
//               >
//                 <Ionicons
//                   name={showPassword ? "eye-off" : "eye"}
//                   size={20}
//                   color="#aaa"
//                 />
//               </TouchableOpacity>
//             </View>

//             <Spacer height={24} />

//             <ThemeButton onPress={handleRegister} disabled={loading}>
//               <Text style={styles.buttonText}>
//                 {loading ? "Creating account..." : "Register"}
//               </Text>
//             </ThemeButton>

//             <Spacer />

//             {error && <Text style={styles.error}>{error}</Text>}
//             {success && <Text style={styles.success}>{success}</Text>}

//             <Spacer height={20} />

//             <Text style={styles.footerText}>
//               Already have an account?{" "}
//               <Link href="/login" style={styles.loginLink}>
//                 Log in
//               </Link>
//             </Text>
//           </CardTheme>
//       </ThemeView>
//             </TouchableWithoutFeedback>
//             </KeyBordAvoidingComponent>
//   );
// }

// export default Register;

// /* ---------- STYLES ---------- */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: { flexDirection: "row", alignItems: "center" },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   buttonText: { color: "#fff", fontSize: 12, fontWeight: "600" },
//   footerText: { color: "#aaa", fontSize: 12, textAlign: "center" },
//   loginLink: {
//     color: colors.primary,
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   error: { color: "#ff6b6b", textAlign: "center" },
//   success: { color: "#4ade80", textAlign: "center" },
//   passwordContainer: {
//     width: "100%",
//     position: "relative",
//     justifyContent: "center",
//   },
//   eyeIcon: {
//     position: "absolute",
//     right: 15,
//     zIndex: 1,
//   },
// });

