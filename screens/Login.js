import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, StatusBar, Dimensions, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig'; // Asegúrate de que esta ruta sea correcta

// Obtener las dimensiones de la pantalla una vez al inicio
const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375; // Define una condición para pantallas pequeñas

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error de Inicio de Sesión", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("¡Bienvenido a ADN-FIT GYM!", "Has iniciado sesión exitosamente.");
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      let errorMessage = "Hubo un problema al iniciar sesión. Intenta de nuevo.";
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/wrong-password':
          errorMessage = "La contraseña es incorrecta.";
          break;
        case 'auth/user-not-found':
          errorMessage = "No se encontró un usuario con este correo electrónico.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Problema de conexión a internet. Verifica tu red.";
          break;
        default:
          errorMessage = "Error desconocido. Por favor, contacta a soporte.";
          break;
      }
      Alert.alert("Error al Iniciar Sesión", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.header}>
            <Image source={require('../assets/logo-gym.png.png')} style={styles.logo} />
            <Text style={styles.appName}>ADN-FIT GYM</Text>
          </View>
          <View style={styles.card}>
          <Text style={styles.title}>INICIAR SESIÓN</Text>

          <Text style={styles.label}>Correo Electrónico</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="envelope" size={isSmallScreen ? 16 : 18} color="#888" style={styles.icon} />
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
            <FontAwesome name="lock" size={isSmallScreen ? 16 : 18} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={isSmallScreen ? 16 : 18} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>INGRESAR</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signUpLink}>
            <Text style={styles.signUpText}>¿No tienes cuenta? <Text style={styles.signUpTextBold}>Regístrate aquí</Text></Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ marginTop: 15 }}>
            <Text style={{ color: '#30e333ff', fontWeight: 'bold', textAlign: 'center' }}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
          
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallScreen ? 30 : 40, // Ajuste para pantallas pequeñas
    backgroundColor: '#1C1C1C',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: isSmallScreen ? 50 : 60, // Ajuste del tamaño del logo
    height: isSmallScreen ? 50 : 60,
    resizeMode: 'contain',
    marginRight: 10,
  },
  appName: {
    fontSize: isSmallScreen ? 24 : 28, // Ajuste del tamaño de la fuente del título
    fontWeight: 'bold',
    color: '#30e333ff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: isSmallScreen ? 20 : 30, // Ajuste del padding de la tarjeta
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginTop: isSmallScreen ? 140 : 180, // Ajuste para que la tarjeta no quede debajo del header
  },
  title: {
    fontSize: isSmallScreen ? 22 : 26, // Ajuste del tamaño de la fuente
    fontWeight: 'bold',
    color: '#30e333ff',
    marginBottom: isSmallScreen ? 20 : 30,
    textTransform: 'uppercase',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: isSmallScreen ? 14 : 15, // Ajuste del tamaño de la fuente
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 8,
    marginTop: isSmallScreen ? 10 : 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    paddingHorizontal: 18,
    marginBottom: 22,
    width: '100%',
    borderWidth: 1,
    borderColor: '#4A4A4A',
    minHeight: 54,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 54,
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 15 : 17, // Ajuste del tamaño de la fuente del input
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: '#30e333ff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 32,
    width: '80%',
    maxWidth: 260,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#8BC34A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: '#0A0A0A',
    fontSize: isSmallScreen ? 16 : 18, // Ajuste del tamaño de la fuente
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  signUpLink: {
    marginTop: 30,
  },
  signUpText: {
    color: '#B0B0B0',
    fontSize: isSmallScreen ? 14 : 15, // Ajuste del tamaño de la fuente
  },
  signUpTextBold: {
    color: '#30e333ff',
    fontWeight: 'bold',
  },
});