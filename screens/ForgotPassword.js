import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Éxito', 'Se ha enviado un correo para restablecer tu contraseña.');
      navigation.goBack();
    } catch (error) {
      let errorMessage = 'Ocurrió un error. Intenta de nuevo.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con ese correo.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido.';
      }
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <View style={styles.card}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.info}>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>ENVIAR</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.backText}>Volver al inicio de sesión</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#30e333ff',
    marginBottom: 18,
    textAlign: 'center',
  },
  info: {
    color: '#B0B0B0',
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A4A4A',
  },
  button: {
    backgroundColor: '#30e333ff',
    paddingVertical: 15,
    borderRadius: 10,
    width: '75%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  backLink: {
    marginTop: 10,
  },
  backText: {
    color: '#30e333ff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});