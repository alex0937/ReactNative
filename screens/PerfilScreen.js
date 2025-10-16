import React, { useEffect, useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ActivityIndicator,Alert,ScrollView,Image,Modal} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../src/config/firebaseConfig';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { pickImageAsync, takePhotoAsync } from '../src/config/imagePicker';
import { uploadToCloudinary } from '../src/config/uploadToCloudinary';
import { updateUserData } from '../src/config/userService';
import { CommonActions } from '@react-navigation/native';

export default function PerfilScreen({ navigation }) {
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [dni, setDni] = useState('');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoutSuccessModal, setShowLogoutSuccessModal] = useState(false);

  const genderOptions = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.uid) return;
      
      try {
        setLoadingProfile(true);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDisplayName(userData.displayName || user.displayName || '');
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setPhone(userData.phone || '');
          setAddress(userData.address || '');
          setBirthDate(userData.birthDate || '');
          setGender(userData.gender || '');
          setDni(userData.dni || '');
          setPhotoURL(userData.photoURL || user.photoURL || null);
        } else {
          const initialData = {
            displayName: user.displayName || '',
            firstName: '',
            lastName: '',
            email: user.email || '',
            phone: '',
            address: '',
            birthDate: '',
            gender: '',
            dni: '',
            photoURL: user.photoURL || null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };
          
          await setDoc(userDocRef, initialData);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el perfil del usuario');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user]);

  // Auto-cerrar modal de éxito después de 3 segundos
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const handlePickImage = async (fromCamera = false) => {
  try {
    const result = fromCamera ? await takePhotoAsync() : await pickImageAsync();

    if (!result) return;

    const imageUri = result.uri || result.assets?.[0]?.uri;
    if (!imageUri) return;

    setLoading(true);

    const uploadedUrl = await uploadToCloudinary(imageUri);
    setPhotoURL(uploadedUrl);
    
    await updateProfile(user, { photoURL: uploadedUrl });
    
    const userData = {
      photoURL: uploadedUrl,
      updatedAt: serverTimestamp()
    };
    
    await updateUserData(user.uid, userData);

    Alert.alert('Éxito', 'Foto actualizada en Firebase y Firestore');

  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
};



  const validateForm = () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'El nombre completo es requerido');
      return false;
    }
    
    if (dni && dni.length < 7) {
      Alert.alert('Error', 'El DNI debe tener al menos 7 dígitos');
      return false;
    }
    
    if (phone && !/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      Alert.alert('Error', 'El teléfono debe tener 10 dígitos');
      return false;
    }
    
    if (birthDate && !/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      Alert.alert('Error', 'La fecha debe tener formato DD/MM/YYYY');
      return false;
    }
    
    return true;
  };

  const handleSaveClick = () => {
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      await updateProfile(user, { 
        displayName: displayName,
        photoURL: photoURL 
      });
      
      const userData = {
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        phone: phone,
        address: address,
        birthDate: birthDate,
        gender: gender,
        dni: dni,
        photoURL: photoURL,
        updatedAt: serverTimestamp()
      };
      
      const success = await updateUserData(user.uid, userData);
      
      if (success) {
        setEditing(false);
        console.log('✅ Perfil guardado exitosamente, mostrando modal...');
        // Pequeño delay para asegurar que el modal se muestre correctamente
        setTimeout(() => {
          setShowSuccessModal(true);
          console.log('✅ Modal de éxito activado');
        }, 150);
      } else {
        throw new Error('Error al guardar en Firestore');
      }
      
    } catch (err) {
      Alert.alert('Error', `No se pudo actualizar el perfil: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Iniciando cierre de sesión...');
      console.log('Usuario antes del logout:', auth.currentUser?.email);
      
      // Cerrar sesión en Firebase
      await signOut(auth);
      console.log('signOut ejecutado');
      
      // Verificar que se cerró la sesión
      const checkLogout = () => {
        console.log('Usuario después del logout:', auth.currentUser);
        if (!auth.currentUser) {
          console.log('✅ Logout confirmado');
          setShowLogoutSuccessModal(true);
          
          // Navegar después de un breve delay
          setTimeout(() => {
            setShowLogoutSuccessModal(false);
            // El onAuthStateChanged debería manejar la navegación automáticamente
            // pero por si acaso, forzamos la navegación
            if (navigation) {
              try {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                );
              } catch (navError) {
                console.log('Error de navegación (puede ser normal):', navError.message);
              }
            }
          }, 1500);
        } else {
          console.log('❌ Logout no completado, reintentando...');
          // Reintentar después de un momento
          setTimeout(checkLogout, 500);
        }
      };
      
      // Verificar logout después de un breve delay
      setTimeout(checkLogout, 100);
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', `No se pudo cerrar la sesión: ${error.code || error.message}`);
    }
  };

  if (loadingProfile) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#19d44c" />
        <Text style={{ marginTop: 10, color: '#666' }}>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header Container */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
        >
          <FontAwesome name="sign-out" size={20} color="#ff4444" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
  {photoURL ? (
    <Image source={{ uri: photoURL }} style={styles.avatar} />
  ) : (
    <View style={[styles.avatar, styles.avatarPlaceholder]}>
      <FontAwesome name="user" size={56} color="#fff" />
    </View>
  )}

  <TouchableOpacity style={styles.editPhotoButton} onPress={() => handlePickImage(false)}>
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.editPhotoText}>Galería</Text>}
  </TouchableOpacity>

  <TouchableOpacity style={[styles.editPhotoButton, { marginTop: 4 }]} onPress={() => handlePickImage(true)}>
    <Text style={styles.editPhotoText}>Cámara</Text>
  </TouchableOpacity>
</View>

          {/* Campos */}
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            editable={editing}
            placeholder="Nombre completo"
          />

          <Text style={styles.label}>Nombres</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            editable={editing}
            placeholder="Nombres"
          />

          <Text style={styles.label}>Apellidos</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            editable={editing}
            placeholder="Apellidos"
          />

          <Text style={styles.label}>DNI</Text>
          <TextInput
            style={styles.input}
            value={dni}
            onChangeText={setDni}
            editable={editing}
            placeholder="Documento de identidad"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#f0f0f0' }]}
            value={user?.email || ''}
            editable={false}
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            editable={editing}
            keyboardType="phone-pad"
            placeholder="Número de teléfono"
          />

          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            editable={editing}
            placeholder="Dirección completa"
          />

          <Text style={styles.label}>Fecha de Nacimiento</Text>
          <TextInput
            style={styles.input}
            value={birthDate}
            onChangeText={setBirthDate}
            editable={editing}
            placeholder="DD/MM/YYYY"
          />

          <Text style={styles.label}>Género</Text>
          <TouchableOpacity
            style={[styles.input, styles.selectInput, !editing && styles.disabledInput]}
            onPress={editing ? () => setShowGenderModal(true) : null}
            disabled={!editing}
          >
            <Text style={[styles.selectText, !gender && styles.placeholderText]}>
              {gender || 'Seleccionar género'}
            </Text>
            <FontAwesome name="chevron-down" size={12} color="#666" />
          </TouchableOpacity>

          {/* Botón principal */}
          <View style={styles.actions}>
            {editing ? (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveClick}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.saveText}>Guardar</Text>}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditing(true)}
              >
                <Text style={styles.editText}>Editar Perfil</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal de selección de género */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Género</Text>
            
            {genderOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalOption,
                  gender === option && styles.selectedOption
                ]}
                onPress={() => {
                  setGender(option);
                  setShowGenderModal(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  gender === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
                {gender === option && (
                  <FontAwesome name="check" size={16} color="#19d44c" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowGenderModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmación para guardar */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            
            <Text style={styles.confirmTitle}>¿Deseas actualizar tus datos?</Text>
            
            
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmSave}
              >
                <Text style={styles.confirmButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de éxito */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <FontAwesome name="check-circle" size={60} color="#19d44c" style={styles.successIcon} />
            
            <Text style={styles.successTitle}>¡Perfil Actualizado!</Text>
            <Text style={styles.successMessage}>
              Tus datos han sido guardados correctamente en Firebase y Firestore.
            </Text>
            
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.successButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmación para cerrar sesión */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModalContent}>
            <FontAwesome name="exclamation-triangle" size={50} color="#ff4444" style={styles.warningIcon} />
            
            <Text style={styles.logoutTitle}>¿Cerrar Sesión?</Text>
            <Text style={styles.logoutMessage}>
              ¿Estás seguro que deseas cerrar tu sesión? Tendrás que iniciar sesión nuevamente.
            </Text>
            
            <View style={styles.logoutButtons}>
              <TouchableOpacity
                style={styles.cancelLogoutButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelLogoutButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmLogoutButton}
                onPress={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              >
                <Text style={styles.confirmLogoutButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de éxito para logout */}
      <Modal
        visible={showLogoutSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutSuccessModalContent}>
            <FontAwesome name="check-circle" size={60} color="#19d44c" style={styles.successIcon} />
            
            <Text style={styles.logoutSuccessTitle}>¡Sesión Cerrada!</Text>
            <Text style={styles.logoutSuccessMessage}>
              Has cerrado sesión correctamente. Serás redirigido al login.
            </Text>
            
            <ActivityIndicator size="large" color="#19d44c" style={{ marginTop: 20 }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19d44c',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffdddd',
  },
  logoutText: {
    fontSize: 14,
    color: '#ff4444',
    fontWeight: '600',
    marginLeft: 6,
  },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 },
  card: { width: 340, backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#19d44c', marginBottom: 12 },
  avatarContainer: { alignItems: 'center', marginBottom: 12 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: { backgroundColor: '#19d44c', justifyContent: 'center', alignItems: 'center' },
  editPhotoButton: { marginTop: 8, backgroundColor: '#19d44c', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  editPhotoText: { color: '#fff', fontWeight: 'bold' },
  label: { alignSelf: 'flex-start', fontSize: 14, fontWeight: '600', color: '#222', marginTop: 10 },
  input: { width: '100%', height: 44, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 10, marginTop: 6, backgroundColor: '#fff' },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
  selectText: {
    fontSize: 16,
    color: '#222',
  },
  placeholderText: {
    color: '#999',
  },
  actions: { flexDirection: 'row', marginTop: 18 },
  editButton: { backgroundColor: '#1afa56', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  editText: { fontWeight: 'bold', color: '#000' },
  saveButton: { backgroundColor: '#19d44c', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  saveText: { fontWeight: 'bold', color: '#000' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  selectedOption: {
    backgroundColor: '#e8f5e8',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#222',
  },
  selectedOptionText: {
    color: '#19d44c',
    fontWeight: '600',
  },
  modalCancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  confirmModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '90%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
  },
  confirmIcon: {
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 20,

  },

  confirmButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#19d44c',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  successModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 15,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19d44c',
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  successButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#19d44c',
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 140,
    shadowColor: '#19d44c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 320,
    alignItems: 'center',
  },
  warningIcon: {
    marginBottom: 16,
  },
  logoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  logoutMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  logoutButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelLogoutButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmLogoutButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelLogoutButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  confirmLogoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutSuccessModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    width: '85%',
    maxWidth: 320,
    alignItems: 'center',
  },
  logoutSuccessTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#19d44c',
    textAlign: 'center',
    marginBottom: 12,
  },
  logoutSuccessMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
