import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../src/config/firebaseConfig';
import { updateProfile } from 'firebase/auth';
import { pickImageAsync, takePhotoAsync } from '../src/config/imagePicker';
import { uploadToCloudinary } from '../src/config/uploadToCloudinary';

export default function PerfilScreen() {
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ----------  subir imagen  ---------- */
  const handlePickImage = async (fromCamera = false) => {
  try {
    // 1️⃣ Obtener imagen desde cámara o galería
    const result = fromCamera ? await takePhotoAsync() : await pickImageAsync();

    // 2️⃣ Validar si canceló
    if (!result) return;

    // 3️⃣ Obtener la URI correcta según versión de ImagePicker
    const imageUri = result.uri || result.assets?.[0]?.uri;
    if (!imageUri) return;

    // 4️⃣ Mostrar loading
    setLoading(true);

    // 5️⃣ Subir a Cloudinary usando la URI correcta
    const uploadedUrl = await uploadToCloudinary(imageUri);
    setPhotoURL(uploadedUrl);
    await updateProfile(user, { photoURL: uploadedUrl });

    Alert.alert('Éxito', 'Foto actualizada');

  } catch (error) {
    console.log('Error general handlePickImage:', error);
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
};



  /* ----------  guardar perfil  ---------- */
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      setEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  /* ----------  render  ---------- */
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Mi Perfil</Text>

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
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            editable={editing}
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
          />

          {/* Botón principal */}
          <View style={styles.actions}>
            {editing ? (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
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
    </SafeAreaView>
  );
}

/* ---------- ESTILOS ---------- */
const styles = StyleSheet.create({
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
  actions: { flexDirection: 'row', marginTop: 18 },
  editButton: { backgroundColor: '#1afa56', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  editText: { fontWeight: 'bold', color: '#000' },
  saveButton: { backgroundColor: '#19d44c', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  saveText: { fontWeight: 'bold', color: '#000' },
});
