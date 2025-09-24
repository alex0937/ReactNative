import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, StatusBar, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados para la validación visual de la contraseña
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasLetter, setHasLetter] = useState(false);

  const handlePasswordChange = (text) => {
    setPassword(text);
    // Actualizar los estados de validación en tiempo real
    setHasMinLength(text.length > 6 && text.length > 0); // Maximo 6 caracteres y al menos 1 
    setHasNumber(/[0-9]/.test(text)); // Al menos un número
    setHasLetter(/[a-zA-Z]/.test(text)); // Al menos una letra mayúscula
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error de Registro", "Todos los campos son obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error de Contraseña", "Las contraseñas no coinciden.");
      return;
    }

    // Validar las nuevas condiciones de contraseña
    if (password.length > 6) {
      Alert.alert("Contraseña Inválida", "La contraseña debe tener más de 10 caracteres.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      Alert.alert("Contraseña Inválida", "La contraseña debe contener al menos un número.");
      return;
    }
    if (!/[a-zA-Z]/.test(password)) {
      Alert.alert("Contraseña Inválida", "La contraseña debe contener al menos una letra mayúscula.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("¡Registro Exitoso!", "Tu cuenta ha sido creada. ¡Bienvenido a ADN-FIT GYM!");
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      let errorMessage = "Hubo un problema al registrar el usuario. Por favor, intenta de nuevo.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Este correo electrónico ya está registrado.";
          break;
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/weak-password':
          errorMessage = "La contraseña es demasiado débil.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Problema de conexión a internet. Verifica tu red.";
          break;
        default:
          errorMessage = "Error desconocido. Por favor, contacta a soporte.";
          break;
      }
      Alert.alert("Error al Registrar", errorMessage);
    }
  };

  const renderValidation = (condition, text) => {
    return (
      <View style={styles.validationRow}>
        <FontAwesome
          name={condition ? "check-circle" : "times-circle"}
          size={16}
          color={condition ? "#30e333ff" : "#FF6347"}
        />
        <Text style={[styles.validationText, { color: condition ? '#E0E0E0' : '#888' }]}>
          {text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={require('../assets/logo-gym.png.png')} style={styles.logo} />
          <Text style={styles.appName}>ADN-FIT GYM</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>CREAR CUENTA</Text>

          <Text style={styles.label}>Nombre</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={18} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <Text style={styles.label}>Apellido</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={18} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Tu apellido"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

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
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={18} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Bloque de validación visual */}
          <View style={styles.validationBox}>
            <Text style={styles.validationTitle}>La contraseña debe incluir:</Text>
            {renderValidation(hasMinLength, "Más de 6 caracteres")}
            {renderValidation(hasNumber, "Al menos un número")}
            {renderValidation(hasLetter, "Al menos una letra mayúscula")}
          </View>

          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={18} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirma tu contraseña"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={18} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>REGISTRARSE</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? <Text style={styles.loginTextBold}>Inicia sesión</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollContent: {
    flexGrow: 1,
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
    paddingVertical: 5, // Ajuste del padding vertical
    backgroundColor: '#1C1C1C',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 2,
  },
  appName: {
    fontSize: 22,
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
    marginTop: 200,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#30e333ff',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 15,
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 8,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
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
    fontSize: 14,
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: '#8BC34A',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    width: '85%',
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
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: '#B0B0B0',
    fontSize: 15,
  },
  loginTextBold: {
    color: '#30e333ff',
    fontWeight: 'bold',
  },
  validationBox: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderColor: '#4A4A4A',
    borderWidth: 1,
  },
  validationTitle: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  validationText: {
    marginLeft: 10,
    fontSize: 14,
  },
});