import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, StatusBar, ScrollView, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import CustomAlertModal from '../components/CostomAlertModal';

// Componente Login
export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  const showCustomAlert = (title, message, type = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };
  const closeCustomAlert = () => setAlertVisible(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showCustomAlert('⚠️Error', 'Por favor ingresa tu correo y contraseña.');
      return;
    }
    if (!validateEmail(email)) {
      showCustomAlert('⚠️Correo Inválido', 'Por favor ingresa un correo electrónico válido.', 'error');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showCustomAlert('¡Bienvenido a ADN-FIT GYM!', 'Has iniciado sesión exitosamente.');
      /* ⬇⬇⬇⬇⬇  CAMBIO CLAVE  ⬇⬇⬇⬇⬇ */
      navigation.replace('Main'); // ← va al TabNavigator (Home + barra)
    } catch (error) {
      let errorMessage = 'Hubo un problema al iniciar sesión. Intenta de nuevo.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'El formato del correo electrónico no es válido.';
          break;
        default:
          errorMessage = 'Correo o contraseña incorrectos. Intente de nuevo.';
          break;
      }
      showCustomAlert('⚠️Error', errorMessage, 'error');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/fondo-gymdos.png')}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <StatusBar barStyle="dark-content" backgroundColor="#f4f2f2ff" />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Image source={require('../assets/logo-gym.png')} style={styles.logo} />
              <Text style={styles.title}>INICIAR SESIÓN</Text>

              <Text style={styles.label}>Correo Electrónico</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={18} color="#19d44c" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@email.com"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={18} color="#19d44c" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={18} color="#888" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>INGRESAR</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signUpLink}>
                <Text style={styles.signUpText}>
                  ¿No tenés cuenta? <Text style={styles.signUpTextBold}>Regístrate</Text>
                </Text>
              </TouchableOpacity>

              <CustomAlertModal
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={closeCustomAlert}
                type={alertType}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' },
  backgroundImage: { opacity: 0.9 },
  overlay: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 },
  card: { width: 340, backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  logo: { width: 180, height: 150, resizeMode: 'contain', marginBottom: 18, marginTop: 4 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#19d44c', marginBottom: 18, textAlign: 'center', textTransform: 'uppercase' },
  label: { alignSelf: 'flex-start', fontSize: 15, fontWeight: '600', color: '#222', marginBottom: 6, marginTop: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, borderWidth: 2, borderColor: '#19d44c', paddingHorizontal: 12, marginBottom: 8, width: '100%' },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 44, color: '#3e3737ff', fontSize: 15, backgroundColor: '#fff' },
  eyeIcon: { padding: 8 },
  button: { backgroundColor: '#1afa56ff', borderRadius: 8, width: '70%', paddingVertical: 13, alignItems: 'center', marginTop: 10, marginBottom: 10, shadowColor: '#19d44c', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 },
  buttonText: { color: '#090909ff', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' },
  forgotText: { color: '#11c9d0ff', fontSize: 14, marginTop: -4, marginLeft: 120, marginBottom: 10, textAlign: 'center' },
  signUpLink: { marginTop: 4 },
  signUpText: { color: '#888888ff', fontSize: 14, textAlign: 'center' },
  signUpTextBold: { color: '#19d44c', fontWeight: 'bold' },
});