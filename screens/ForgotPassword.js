import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, ScrollView } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';


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
      <StatusBar barStyle="dark-content" backgroundColor="#f4f2f2ff" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>RECUPERAR CONTRASEÑA</Text>
          <Text style={styles.info}>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </Text>
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
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>ENVIAR</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
            <Text style={styles.backText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  info: {
    color: '#222',
    fontSize: 15,
    marginBottom: 18,
    textAlign: 'center',
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
  button: {
    backgroundColor: '#19d44c',
    borderRadius: 8,
    width: '100%',
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  backLink: {
    marginTop: 8,
  },
  backText: {
    color: '#19d44c',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});