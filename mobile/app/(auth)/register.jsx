

// import { Keyboard, StyleSheet, Text,  View } from 'react-native';
// import { useState } from 'react';
// import { TouchableOpacity } from 'react-native'; // Add this
// import ThemeView from '../../component/ThemeView';
// import ThemeText from '../../component/ThemeText';
// import ThemeButton from '../../component/ThemeButton';
// import Spacer from '../../component/Spacer';
// import { Link, useRouter } from 'expo-router';
// import { colors } from '../../constant/colors';
// import InputTheme from '../../component/InputTheme';
// import { useUser } from '../../hook/useUser';
// import { Ionicons } from '@expo/vector-icons';
// import { Pressable } from 'react-native';
// import KeyBordAvoidingComponent from '../../component/KeyBordAvoidingComponent';
// import CardTheme from '../../component/CardTheme';

// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
// const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,64}$/;
// const NAME_REGEX = /^[a-zA-Z\s.'-]{2,50}$/;

// const MAX_EMAIL_LENGTH = 120;
// const MAX_PASSWORD_LENGTH = 128;

//  function Register() {
//   const [username, setUsername] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false); // 1. New State

//   const router = useRouter();
//   const { register } = useUser();

//   const sanitize = (value) =>
//     value.replace(/[<>\/\\$;]/g, "").trim();

//   const validate = () => {
//     if (!username || !fullName || !email || !password)
//       return "All fields are required.";

//     if (!USERNAME_REGEX.test(username))
//       return "Username must be 3–20 characters and contain only letters, numbers or _.";

//     if (!NAME_REGEX.test(fullName))
//       return "Enter a valid full name.";

//     if (!EMAIL_REGEX.test(email))
//       return "Enter a valid email address.";

//     if (!PASSWORD_REGEX.test(password))
//       return "Password must be at least 8 characters with letters and numbers.";

//     if (email.length > MAX_EMAIL_LENGTH)
//       return "Email is too long.";

//     if (password.length > MAX_PASSWORD_LENGTH)
//       return "Password is too long.";

//     return null;
//   };

//   const handleRegister = async () => {
//     if (loading) return;

//     setError(null);
//     setSuccess(false);
//     setLoading(true);

//     const cleanUsername = sanitize(username);
//     const cleanFullName = sanitize(fullName);
//     const cleanEmail = sanitize(email);
//     const cleanPassword = sanitize(password);

//     const validationError = validate();
//     if (validationError) {
//       setError(validationError);
//       setLoading(false);
//       return;
//     }

//     try {
//       await register({
//         username: cleanUsername,
//         fullName: cleanFullName,
//         email: cleanEmail,
//         password: cleanPassword,
//       });

//      setSuccess("Registration successful. Redirecting...");
    
//     // 1. Dismiss keyboard immediately to prevent layout jumping
//     Keyboard.dismiss(); 

//     setTimeout(() => {
//       // 2. Clear error/success states just before leaving
//       setError(null);
//       setSuccess(false);
//       router.replace("/login");
//     }, 1500);
//     } catch (err) {
//   let errorMessage = "An unexpected error occurred.";
//   console.log("error data:", err)
//     if (err.response) {
//       // Server responded with a status code (400, 409, 500)
//       errorMessage = err.response.data.message || err.response.data.msg || "Server Error";
//     } else if (err.request) {
//       // Request was made but no response was received (Network Error)
//       errorMessage = "Network Error: Please check your internet connection.";
//       console.log("Network Details:", err.request);
//     } else {
//       // Something happened in setting up the request
//       errorMessage = err.message;
//     }

//     setError(errorMessage);
//     console.warn("Registration error:", errorMessage);

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//         <KeyBordAvoidingComponent style={{ flex: 1 }}>
//          <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
//       <ThemeView style={styles.container} safe={true}>

//         <CardTheme style={styles.card}>
//           <View style={styles.header}>
//             <Ionicons name="arrow-back" size={22} color="#fff" onPress={() => router.back()} />
//             <ThemeText style={styles.headerTitle}>Create Account</ThemeText>
//             <View style={{ width: 22 }} />
//           </View>

//           <Spacer height={20} />

//           <InputTheme placeholder="Username" style={styles.input} onChangeText={setUsername} value={username} />
//           <Spacer height={20} />

//           <InputTheme placeholder="Full Name" style={styles.input} onChangeText={setFullName} value={fullName} />
//           <Spacer height={20} />

//           <InputTheme
//             placeholder="Email"
//             style={styles.input}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             onChangeText={setEmail}
//             value={email}
//           />
//           <Spacer height={20} />

//           {/* <InputTheme
//             placeholder="Password"
//             style={styles.input}
//             secureTextEntry
//             onChangeText={setPassword}
//             value={password}
//           /> */}
//           <View style={styles.passwordContainer}>
//               <InputTheme
//                 placeholder="Password"
//                 style={styles.input}
//                 autoCapitalize="none"
//                 secureTextEntry={!showPassword} // 2. Toggle visibility
//                 onChangeText={setPassword}
//                 value={password}
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

//           <Spacer height={24} />

//           <ThemeButton onPress={handleRegister} disabled={loading}>
//             <Text style={styles.buttonText}>{loading ? "Creating..." : "Sign Up"}</Text>
//           </ThemeButton>

//           <Spacer />

//           {error && <Text style={styles.error}>{error}</Text>}
//           {success && <Text style={styles.success}>{success}</Text>}

//           <Spacer height={20} />

//           <Text style={styles.footerText}>
//             Already have an account?{" "}
//             <Link href="/login" style={styles.loginLink}>Log in</Link>
//           </Text>
//         </CardTheme>
//       </ThemeView>
//             </Pressable>
      
//             </KeyBordAvoidingComponent>
//   );
// }


// export default Register;

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, // <--- Add this to ensure it fills the screen
//     width: '100%',
//     justifyContent: "center",
//      alignItems: "center" },
//   card: {
    
//   },
//   header: { flexDirection: "row", alignItems: "center" },
//   headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "600" },
//   input: { width: "100%" },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
//   footerText: { color: "#aaa", fontSize: 12, textAlign: "center" },
//   loginLink: { color: colors.primary, fontSize: 13, fontWeight: "600" },
//   error: { color: "#ff6b6b", textAlign: "center" },
//   success: { color: "#4ade80", textAlign: "center" },
//   passwordContainer: {
//     width: '100%',
//     position: 'relative', // Allows absolute positioning of the eye
//     justifyContent: 'center',
//   },
//   eyeIcon: {
//     position: 'absolute',
//     right: 15,
//     zIndex: 1,
//   },
//   input: { width: "100%" },
// });



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

const MAX_EMAIL_LENGTH = 120;
const MAX_PASSWORD_LENGTH = 128;

function Register() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // New state for verification code
  const [step, setStep] = useState(1); // 1: Details, 2: OTP Verification
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { requestRegistrationOTP, verifyAndFinalizeRegister } = useUser();

  const sanitize = (value) => value.replace(/[<>\/\\$;]/g, "").trim();

  const validate = () => {
    if (!username || !fullName || !email || !password) return "All fields are required.";
    if (!USERNAME_REGEX.test(username)) return "Username must be 3–20 characters (letters, numbers, & no space_).";
    if (!NAME_REGEX.test(fullName)) return "Enter a valid full name.";
    if (!EMAIL_REGEX.test(email)) return "Enter a valid email address.";
    if (!PASSWORD_REGEX.test(password)) return "Password must be at least 8 characters with letters and numbers.";
    return null;
  };

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
        password: password, // Password hashed on backend
      });
      setStep(2); // Move to OTP input
      Keyboard.dismiss();
    } catch (err) {
      // setError(err.response?.data?.message || "Failed to send verification code.");
    let errorMessage = "An unexpected error occurred:sending otp failed";

  if (err.message === "Network Error") {
    // This catches the specific Axios "Network Error" (DNS, Offline, No Server)
    errorMessage = "Network Error: Please check your internet connection or network status.";
  } else if (err.response) {
    // This catches errors returned by your backend (400, 401, 409, 500)
    errorMessage = err.response.data.message || " Error 500";
  } else if (err.request) {
    // The request was made but no response was received
    errorMessage = "No response from server. Is your backend running?";
  }

  setError(errorMessage);
    
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyStep2 = async () => {
    if (loading) return;
    if (otp.length < 6) return setError("Please enter the full 6-digit code.");

    setError(null);
    setLoading(true);

    try {
      await verifyAndFinalizeRegister(sanitize(email).toLowerCase(), otp);
      setSuccess("Account verified successfully!");
      Keyboard.dismiss();

      setTimeout(() => {
        setSuccess(false);
        router.replace("/login");
      }, 1500);
    } catch (err) {
      // setError(err.response?.data?.message || "Invalid or expired code.");
    let errorMessage = "An unexpected error occurred.";

    if (err.message === "Network Error") {
      errorMessage = "Network Error: Please check your internet connection or server status.";
    } else if (err.response) {
      // Server reached, but returned an error (e.g., 400 Bad Request)
      errorMessage = err.response.data.message || "Invalid or expired code.";
    } else if (err.request) {
      // Request made, but no response (Server might be down)
      errorMessage = "No response from server. Check if your backend is running.";
    } else {
      errorMessage = err.message;
    }

    setError(errorMessage);
    console.log("Verify Error:", err.message);
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyBordAvoidingComponent style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <ThemeView style={styles.container} safe={true}>
          <CardTheme style={styles.card}>
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

            {step === 1 ? (
              /* --- STEP 1: REGISTRATION DETAILS --- */
              <View>
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
                <View style={styles.passwordContainer}>
                  <InputTheme
                    placeholder="Password"
                    style={styles.input}
                    autoCapitalize="none"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    value={password}
                  />
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#aaa" />
                  </TouchableOpacity>
                </View>
                <Spacer height={24} />
                <ThemeButton onPress={handleRegisterStep1} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "Sending Code..." : "Get Verification Code"}</Text>
                </ThemeButton>
              </View>
            ) : (
              /* --- STEP 2: OTP VERIFICATION --- */
              <View>
                <ThemeText style={styles.infoText}>
                  We sent a 6-digit code to {email}. Please enter it below to verify your account.
                </ThemeText>
                <Spacer height={20} />
                <InputTheme
                  placeholder="Enter 6-digit code"
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={setOtp}
                  value={otp}
                />
                <Spacer height={24} />
                <ThemeButton onPress={handleVerifyStep2} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify & Create Account"}</Text>
                </ThemeButton>
                <TouchableOpacity onPress={() => setStep(1)} disabled={loading}>
                  <Spacer height={15} />
                  <Text style={styles.loginLink}>Edit details / Resend code</Text>
                </TouchableOpacity>
              </View>
            )}

            <Spacer />
            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}
            <Spacer height={20} />

            {step === 1 && (
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Link href="/login" style={styles.loginLink}>Log in</Link>
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
    width: '100%',
    justifyContent: "center",
    alignItems: "center" 
  },
  header: { flexDirection: "row", alignItems: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "600" },
  input: { width: "100%" },
  buttonText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  footerText: { color: "#aaa", fontSize: 12, textAlign: "center" },
  infoText: { color: "#ccc", fontSize: 14, textAlign: "center", lineHeight: 20 },
  loginLink: { color: colors.primary, fontSize: 13, fontWeight: "600", textAlign: 'center' },
  error: { color: "#ff6b6b", textAlign: "center" },
  success: { color: "#4ade80", textAlign: "center" },
  passwordContainer: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    zIndex: 1,
  },
});
