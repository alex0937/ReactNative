import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, ScrollView, Platform, ImageBackground} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';
import CustomAlertModal from '../components/CostomAlertModal';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  const showCustomAlert = (title, message, type = "info") => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };
  const closeCustomAlert = () => setAlertVisible(false);

  const handleResetPassword = async () => {
    if (!email) {
      showCustomAlert('⚠️Error', 'Por favor ingresa su correo electrónico.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showCustomAlert('Éxito✅', 'Se ha enviado un correo para restablecer la contraseña. Por favor, revise su bandeja de spam.');
      navigation.goBack();
    } catch (error) {
      let errorMessage = 'Ocurrió un error. Intenta de nuevo.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con ese correo.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido.';
      }
     showCustomAlert('⚠️Error', errorMessage);
    }
  };

  return (   
    <SafeAreaView style={{ flex: 1 }}>
     <ImageBackground
            source={require('../assets/fondo-gymdos.png')} // 👈 usa el fondo que me pasaste
            style={styles.background}
            imageStyle={styles.backgroundImage}
            resizeMode= "cover" // se adapta a toda la pantalla
          >
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f2f2ff" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>RECUPERAR CONTRASEÑA</Text>
          <Text style={styles.info}>
            Ingresa su correo electrónico y le enviaremos un enlace para restablecer la contraseña.
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
            <Text style={styles.backText}>¿Recordaste tu contraseña? Inicia sesión</Text>
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
    </View>
    </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    opacity: 0.9, // menos transparente → más fuerte
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)', // capa clara semitransparente sobre el fondo
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
    color: '#090909ff',
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
  },
});