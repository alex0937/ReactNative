import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, StatusBar, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import CustomAlertModal from '../components/CostomAlertModal';

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validaciones visuales
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);

  const handlePasswordChange = (text) => {
    setPassword(text);
    //Valida en tiempo real
    setHasMinLength(text.length > 6);
    setHasNumber(/[0-9]/.test(text));
    setHasUppercase(/[A-Z]/.test(text));
  };

  const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
  window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

// Estados para alertas
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
  const closeCustomAlert = () => {
    setAlertVisible(false);
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showCustomAlert("Error de Registro", "Todos los campos son obligatorios.");
      return;
    }
    if (password !== confirmPassword) {
      showCustomAlert("Error de Contraseña", "Las contraseñas no coinciden.");
      return;
    }
    if (password.length <= 6) {
     showCustomAlert("Contraseña Inválida", "La contraseña debe tener más de 6 caracteres.");
      return;
    }
    if (!/[0-9]/.test(password)) {
     showCustomAlert("Contraseña Inválida", "La contraseña debe contener al menos un número.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
     showCustomAlert("Contraseña Inválida", "La contraseña debe contener al menos una letra mayúscula.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      //Guarda el nombre como displayName
      await updateProfile (userCredential.user,{
        displayName: firstName
      });
      showCustomAlert("¡Registro Exitoso!", "Tu cuenta ha sido creada. ¡Bienvenido a ADN-FIT GYM!");
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
      showCustomAlert("Error al Registrar", errorMessage);
    }
  };

  const renderValidation = (condition, text) => (
    <View style={styles.validationRow}>
      <FontAwesome
        name={condition ? "check-circle" : "times-circle"}
        size={16}
        color={condition ? "#19d44c" : "#FF6347"}
      />
      <Text style={[styles.validationText, { color: condition ? '#222' : '#888' }]}>
        {text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>CREAR CUENTA</Text>

          <Text style={styles.label}>Nombre</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={18} color="#19d44c" style={styles.icon} />
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
            <FontAwesome name="user" size={18} color="#19d44c" style={styles.icon} />
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
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={18} color="#888" />
            </TouchableOpacity>
          </View>

          <View style={styles.validationBox}>
            <Text style={styles.validationTitle}>La contraseña debe incluir:</Text>
            {renderValidation(hasMinLength, "Más de 6 caracteres")}
            {renderValidation(hasNumber, "Al menos un número")}
            {renderValidation(hasUppercase, "Al menos una letra mayúscula")}
          </View>

          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={18} color="#19d44c" style={styles.icon} />
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
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta? <Text style={styles.loginTextBold}>Inicia sesión</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f2f2ff',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  card: {
    width: 340,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#19d44c',
    marginBottom: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#19d44c',
    paddingHorizontal: 12,
    marginBottom: 8,
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    color: '#222',
    fontSize: 15,
    backgroundColor: '#fff',
  },
  eyeIcon: {
    padding: 8,
  },
  validationBox: {
    width: '100%',
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderColor: '#bbb',
    borderWidth: 1,
  },
  validationTitle: {
    color: '#222',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  validationText: {
    marginLeft: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#1afa56ff',
    borderRadius: 8,
    width: '70%',
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#19d44c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#000000ff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  loginLink: {
    marginTop: 8,
  },
  loginText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  loginTextBold: {
    color: '#19d44c',
    fontWeight: 'bold',
  },
});