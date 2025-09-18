import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, StatusBar } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig'; // Asegúrate de que esta ruta sea correcta

export default function Home({ navigation }) {

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Sesión Cerrada", "Has cerrado sesión correctamente.");
      navigation.replace('Login');
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión. Intenta de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      <View style={styles.header}>
        <Image source={require('../assets/logo-gym.png.png')} style={styles.logo} />
        <Text style={styles.appName}>ADN-FIT GYM</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
        <Text style={styles.subtitle}>Tu camino hacia el bienestar comienza aquí.</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogOut}>
          <Text style={styles.buttonText}>CERRAR SESIÓN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Negro principal para el fondo
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#1C1C1C', // Gris oscuro para el encabezado
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
    color: '#30e333ff', // Verde lima vibrante para el nombre
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#30e333ff', // Verde lima para el texto de bienvenida
    marginBottom: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#B0B0B0', // Gris para el subtítulo
    textAlign: 'center',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#8BC34A', // Un verde más sólido para el botón
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#8BC34A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: '#0A0A0A', // Texto negro en el botón para contraste
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});