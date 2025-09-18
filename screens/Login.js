import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig'; // Asegúrate de que esta ruta sea correcta

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

      <View style={styles.header}>
        <Image source={require('../assets/logo-gym.png.png')} style={styles.logo} />
        <Text style={styles.appName}>ADN-FIT GYM</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>INICIAR SESIÓN</Text>

        <Text style={styles.label}>Correo Electrónico</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={18} color="#888" style={styles.icon} />
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
          <FontAwesome name="lock" size={18} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={18} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>INGRESAR</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signUpLink}>
          <Text style={styles.signUpText}>¿No tienes cuenta? <Text style={styles.signUpTextBold}>Regístrate aquí</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingVertical: 40,
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
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#30e333ff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginTop: 180,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#30e333ff',
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 15,
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 8,
    marginTop: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#4A4A4A',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#FFFFFF',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: '#8BC34A',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 30,
    width: '75%', // Ajuste del ancho del botón a un 85% del contenedor
    alignSelf: 'center', // Para asegurar que el botón esté centrado en su contenedor
    alignItems: 'center',
    shadowColor: '#8BC34A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  signUpLink: {
    marginTop: 30,
  },
  signUpText: {
    color: '#B0B0B0',
    fontSize: 15,
  },
  signUpTextBold: {
    color: '#30e333ff',
    fontWeight: 'bold',
  },
});