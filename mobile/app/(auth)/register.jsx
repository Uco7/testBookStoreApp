// import { Keyboard, StyleSheet, Text, View, TouchableOpacity, Pressable,Alert } from 'react-native';
// import { useState } from 'react';
// import ThemeView from '../../component/ThemeView';
// import ThemeText from '../../component/ThemeText';
// import ThemeButton from '../../component/ThemeButton';
// import Spacer from '../../component/Spacer';
// import { Link, useRouter } from 'expo-router';
// import { colors } from '../../constant/colors';
// import InputTheme from '../../component/InputTheme';
// import { useUser } from '../../hook/useUser';
// import { Ionicons } from '@expo/vector-icons';
// import KeyBordAvoidingComponent from '../../component/KeyBordAvoidingComponent';
// import CardTheme from '../../component/CardTheme';

// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
// const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,64}$/;
// const NAME_REGEX = /^[a-zA-Z\s.'-]{2,50}$/;

// function Register() {
//   const [username, setUsername] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");

//   const [step, setStep] = useState(1);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const router = useRouter();
//   const { requestRegistrationOTP, verifyAndFinalizeRegister } = useUser();

//   const sanitize = (value) => value.replace(/[<>\/\\$;]/g, "").trim();

//   const validate = () => {
//     if (!username || !fullName || !email || !password) return "All fields are required.";
//     if (!USERNAME_REGEX.test(username)) return "Username must be 3–20 characters and can only contain letters, numbers, and underscores..";
//     if (!NAME_REGEX.test(fullName)) return "Full name must be 2–50 characters and can only contain letters, spaces, periods, and hyphens.";
//     if (!EMAIL_REGEX.test(email)) return "Enter a valid email address (e.g. example@gmail.com)";
//     if (!PASSWORD_REGEX.test(password)) return "Password must be 8–64 characters, include at least one letter and one number, and contain no spaces.";
//     return null;
//   };

//   /* ---------- STEP 1 ---------- */
//   // const handleRegisterStep1 = async () => {
//   //   if (loading) return;
//   //   setError(null);

//   //   const validationError = validate();
//   //   if (validationError) return setError(validationError);

//   //   setLoading(true);

//   //   try {
//   //     await requestRegistrationOTP({
//   //       username: sanitize(username),
//   //       fullName: sanitize(fullName),
//   //       email: sanitize(email).toLowerCase(),
//   //       password,
//   //     });

//   //     setStep(2);
//   //     Keyboard.dismiss();
//   //   } catch (err) {
//   //     setError(err.message );
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };



// const handleRegisterStep1 = async () => {
//   if (loading) return;
//   setError(null);

//   const validationError = validate();
//   if (validationError) return setError(validationError);

//   setLoading(true);

//   try {
//     await requestRegistrationOTP({
//       username: sanitize(username),
//       fullName: sanitize(fullName),
//       email: sanitize(email).toLowerCase(),
//       password,
//     });

//     setStep(2);
//     Keyboard.dismiss();

//     Alert.alert(
//       '📬 Check your inbox!',
//       `We've sent a verification code to ${sanitize(email).toLowerCase()}.\n\nDon't see it? Check your spam  messages or junk folder — sometimes it likes to hide there 👀`,
//       [{ text: 'Got it', style: 'default' }],
//       { cancelable: true }
//     );
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   /* ---------- STEP 2 ---------- */
//   const handleVerifyStep2 = async () => {
//     if (loading) return;

//     if (otp.length !== 6) {
//       return setError("Enter a valid 6-digit code.");
//     }

//     setError(null);
//     setLoading(true);

//     try {
//       await verifyAndFinalizeRegister(email.toLowerCase(), otp);

//       setSuccess("Account verified successfully!");

//       setTimeout(() => {
//         router.replace("/login");
//       }, 1500);

//     } catch (err) {
//       setError(err.message || "Verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- RESEND OTP ---------- */
//   const handleResendOTP = async () => {
//     if (loading) return;

//     setLoading(true);
//     setError(null);

//     try {
//       await requestRegistrationOTP({
//         username: sanitize(username),
//         fullName: sanitize(fullName),
//         email: sanitize(email).toLowerCase(),
//         password,
//       });

//       setSuccess("OTP resent successfully");
//     } catch (err) {
//       setError(err.message || "Failed to resend OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyBordAvoidingComponent style={{ flex: 1 }}>
//       <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
//         <ThemeView style={styles.container} safe>
//           <CardTheme style={styles.card}>
            
//             {/* HEADER */}
//             <View style={styles.header}>
//               <Ionicons
//                 name="arrow-back"
//                 size={22}
//                 color="#fff"
//                 onPress={() => step === 2 ? setStep(1) : router.back()}
//               />
//               <ThemeText style={styles.headerTitle}>
//                 {step === 1 ? "Create Account" : "Verify Email"}
//               </ThemeText>
//               <View style={{ width: 22 }} />
//             </View>

//             <Spacer height={20} />

//             {/* STEP 1 */}
//             {step === 1 ? (
//               <>
//                 <InputTheme placeholder="Username"
//                  onChangeText={setUsername}
//                  autoCapitalize="none"
//                  value={username} />
//                 <Spacer height={15} />

//                 <InputTheme placeholder="Full Name" onChangeText={setFullName} value={fullName} />
//                 <Spacer height={15} />

//                 <InputTheme
//                   placeholder="Email"
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   onChangeText={setEmail}
//                   value={email}
//                 />
//                 <Spacer height={15} />

//                 <View style={styles.passwordContainer}>
//                   <InputTheme
//                     placeholder="Password"
//                     secureTextEntry={!showPassword}
//                     autoCapitalize="none"
//                     onChangeText={setPassword}
//                     value={password}
//                   />
//                   <TouchableOpacity
//                     style={styles.eyeIcon}
//                     onPress={() => setShowPassword(!showPassword)}
//                   >
//                     <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#aaa" />
//                   </TouchableOpacity>
//                 </View>

//                 <Spacer height={20} />

//                 <ThemeButton onPress={handleRegisterStep1} disabled={loading}>
//                   <Text style={styles.buttonText}>
//                     {loading ? "Sending OTP..." : "Get Verification Code"}
//                   </Text>
//                 </ThemeButton>
//               </>
//             ) : (
//               /* STEP 2 */
//               <>
//               <ThemeText style={styles.infoText}>
//   Enter the 6-digit code sent to {email}
// </ThemeText>

// <ThemeText style={styles.spamNotice}>
//   📩 Can't find it? check in your{' '}
//   <ThemeText style={styles.spamHighlight}>spam messages</ThemeText> or{' '}
//   <ThemeText style={styles.spamHighlight}>junk</ThemeText> folder
// </ThemeText>

//                 <Spacer height={20} />

//                 <InputTheme
//                   placeholder="Enter OTP"
//                   keyboardType="number-pad"
//                   maxLength={6}
//                   onChangeText={setOtp}
//                   value={otp}
//                 />

//                 <Spacer height={20} />

//                 <ThemeButton onPress={handleVerifyStep2} disabled={loading}>
//                   <Text style={styles.buttonText}>
//                     {loading ? "Verifying..." : "Verify & Create Account"}
//                   </Text>
//                 </ThemeButton>

//                 <Spacer height={10} />

//                 <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
//                   <Text style={styles.loginLink}>Resend Code</Text>
//                 </TouchableOpacity>

//                 <Spacer height={10} />

//                 <TouchableOpacity onPress={() => setStep(1)}>
//                   <Text style={styles.loginLink}>Edit Details</Text>
//                 </TouchableOpacity>
//               </>
//             )}

//             <Spacer />

//             {error && <Text style={styles.error}>{error}</Text>}
//             {success && <Text style={styles.success}>{success}</Text>}

//             <Spacer height={20} />

//             {step === 1 && (
//               <Text style={styles.footerText}>
//                 Already have an account?{" "}
//                 <Link href="/login" style={styles.loginLink}>
//                   Log in
//                 </Link>
//               </Text>
//             )}

//           </CardTheme>
//         </ThemeView>
//       </Pressable>
//     </KeyBordAvoidingComponent>
//   );
// }

// export default Register;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   footerText: {
//     color: "#aaa",
//     fontSize: 12,
//     textAlign: "center",
//   },
 
//   infoText: {
//     fontSize: 15,
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   spamNotice: {
//     fontSize: 13,
//     textAlign: 'center',
//     opacity: 0.7,
//     marginBottom: 20,
//     lineHeight: 18,
//   },
//   spamHighlight: {
//     fontSize: 13,
//     fontWeight: '700',
//     opacity: 1,
//     // optional: give it a subtle accent color to make it pop
//     // color: '#FF9500',
//   },

//   loginLink: {
//     color: colors.primary,
//     fontSize: 13,
//     fontWeight: "600",
//     textAlign: "center",
//   },
//   error: {
//     color: "#ff6b6b",
//     textAlign: "center",
//   },
//   success: {
//     color: "#4ade80",
//     textAlign: "center",
//   },
//   passwordContainer: {
//     width: "100%",
//     position: "relative",
//   },
//   eyeIcon: {
//     position: "absolute",
//     right: 15,
//     top: 15,
//   },
// });





import { Keyboard, StyleSheet, Text, View, TouchableOpacity, Pressable, Alert } from 'react-native';
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

  // 🔒 TERMS & CONDITIONS — must be checked before registering
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const router = useRouter();
  const { requestRegistrationOTP, verifyAndFinalizeRegister } = useUser();

  const sanitize = (value) => value.replace(/[<>\/\\$;]/g, "").trim();

  const validate = () => {
    if (!username || !fullName || !email || !password) return "All fields are required.";
    if (!USERNAME_REGEX.test(username)) return "Username must be 3–20 characters and can only contain letters, numbers, and underscores..";
    if (!NAME_REGEX.test(fullName)) return "Full name must be 2–50 characters and can only contain letters, spaces, periods, and hyphens.";
    if (!EMAIL_REGEX.test(email)) return "Enter a valid email address (e.g. example@gmail.com)";
    if (!PASSWORD_REGEX.test(password)) return "Password must be 8–64 characters, include at least one letter and one number, and contain no spaces.";
    // 🔒 Terms & Conditions must be accepted before continuing
    if (!agreedToTerms) return "You must agree to the Terms & Conditions to continue.";
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

      Alert.alert(
        '📬 Check your inbox!',
        `We've sent a verification code to ${sanitize(email).toLowerCase()}.\n\nDon't see it? Check your spam  messages or junk folder — sometimes it likes to hide there 👀`,
        [{ text: 'Got it', style: 'default' }],
        { cancelable: true }
      );
    } catch (err) {
      setError(err.message);
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

                {/* 🔒 TERMS & CONDITIONS CHECKBOX */}
                <Pressable
                  style={styles.termsRow}
                  onPress={() => setAgreedToTerms((prev) => !prev)}
                  hitSlop={8}
                >
                  <View
                    style={[
                      styles.checkbox,
                      agreedToTerms && styles.checkboxChecked,
                    ]}
                  >
                    {agreedToTerms && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>

                  <ThemeText style={styles.termsText}>
                    I agree to the{" "}
                    <Text
                      style={styles.termsLink}
                      onPress={() => router.push("/Termsandconditionsscreen")}
                    >
                      Terms & Conditions
                    </Text>
                  </ThemeText>
                </Pressable>

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

<ThemeText style={styles.spamNotice}>
  📩 Can't find it? check in your{' '}
  <ThemeText style={styles.spamHighlight}>spam messages</ThemeText> or{' '}
  <ThemeText style={styles.spamHighlight}>junk</ThemeText> folder
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
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 8,
  },
  spamNotice: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 18,
  },
  spamHighlight: {
    fontSize: 13,
    fontWeight: '700',
    opacity: 1,
    // optional: give it a subtle accent color to make it pop
    // color: '#FF9500',
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

  // 🔒 TERMS & CONDITIONS
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    fontSize: 13,
    flexShrink: 1,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: "700",
  },
});