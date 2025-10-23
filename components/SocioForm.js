import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView,StyleSheet,Alert,KeyboardAvoidingView,Platform,Dimensions,Modal,Image,ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { pickImageAsync, takePhotoAsync } from '../src/config/imagePicker';
import { uploadToCloudinary } from '../src/config/uploadToCloudinary';

const { height: screenHeight } = Dimensions.get('window');

export default function SocioForm({ 
  socio = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    genero: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    tipoMembresia: 'Básica',
    estado: 'Activo',
    photoURL: ''
  });

  const [errors, setErrors] = useState({});
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const genderOptions = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];

  useEffect(() => {
    if (socio) {
      // Si el socio tiene "nombre", lo dividimos en nombres y apellidos
      const nombreCompleto = socio.nombre || '';
      const partesNombre = nombreCompleto.split(' ');
      const nombres = partesNombre.slice(0, Math.ceil(partesNombre.length / 2)).join(' ');
      const apellidos = partesNombre.slice(Math.ceil(partesNombre.length / 2)).join(' ');
      
      setFormData({
        nombres: socio.nombres || nombres || '',
        apellidos: socio.apellidos || apellidos || '',
        genero: socio.genero || '',
        email: socio.email || '',
        telefono: socio.telefono || '',
        direccion: socio.direccion || '',
        fechaNacimiento: socio.fechaNacimiento || '',
        tipoMembresia: socio.tipoMembresia || 'Básica',
        estado: socio.estado || 'Activo',
        photoURL: socio.photoURL || ''
      });
    }
  }, [socio]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son requeridos';
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Combinar nombres y apellidos para compatibilidad
      const dataToSend = {
        ...formData,
        nombre: `${formData.nombres} ${formData.apellidos}`.trim()
      };
      onSubmit(dataToSend);
    } else {
      Alert.alert('Error', 'Por favor corrige los errores del formulario');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al empezar a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handlePickImage = async (fromCamera = false) => {
    try {
      setPhotoLoading(true);
      const result = fromCamera ? await takePhotoAsync() : await pickImageAsync();

      if (!result) return;

      const imageUri = result.uri || result.assets?.[0]?.uri;
      if (!imageUri) return;

      const uploadedUrl = await uploadToCloudinary(imageUri);
      updateField('photoURL', uploadedUrl);

    } catch (error) {
      console.error('Error al procesar imagen:', error);
      Alert.alert('Error', 'No se pudo procesar la imagen');
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>
        {socio ? 'Editar Socio' : 'Registrar Nuevo Socio'}
      </Text>
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
      
      {/* Sección de Foto - Solo en modo edición */}
      {socio && (
        <View style={styles.photoSection}>
          <Text style={styles.photoLabel}>Foto del Socio</Text>
          <View style={styles.avatarContainer}>
            {formData.photoURL ? (
              <Image source={{ uri: formData.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <FontAwesome name="user" size={40} color="#ccc" />
              </View>
            )}
          </View>
          
          <View style={styles.photoButtonsContainer}>
            <TouchableOpacity 
              style={styles.photoButton} 
              onPress={() => handlePickImage(false)}
              disabled={loading || photoLoading}
            >
              {photoLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.photoButtonText}>Galería</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.photoButton} 
              onPress={() => handlePickImage(true)}
              disabled={loading || photoLoading}
            >
              <Text style={styles.photoButtonText}>Cámara</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nombres *</Text>
        <TextInput
          style={[styles.input, errors.nombres && styles.inputError]}
          value={formData.nombres}
          onChangeText={(text) => updateField('nombres', text)}
          placeholder="Ingresa los nombres"
          editable={!loading}
        />
        {errors.nombres && <Text style={styles.errorText}>{errors.nombres}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Apellidos *</Text>
        <TextInput
          style={[styles.input, errors.apellidos && styles.inputError]}
          value={formData.apellidos}
          onChangeText={(text) => updateField('apellidos', text)}
          placeholder="Ingresa los apellidos"
          editable={!loading}
        />
        {errors.apellidos && <Text style={styles.errorText}>{errors.apellidos}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Género</Text>
        <TouchableOpacity
          style={[styles.input, styles.selectInput]}
          onPress={() => setShowGenderModal(true)}
          disabled={loading}
        >
          <Text style={[styles.selectText, !formData.genero && styles.placeholderText]}>
            {formData.genero || 'Seleccionar género'}
          </Text>
          <Text style={styles.selectIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Teléfono *</Text>
        <TextInput
          style={[styles.input, errors.telefono && styles.inputError]}
          value={formData.telefono}
          onChangeText={(text) => updateField('telefono', text)}
          placeholder="Número de teléfono"
          keyboardType="phone-pad"
          editable={!loading}
        />
        {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={formData.direccion}
          onChangeText={(text) => updateField('direccion', text)}
          placeholder="Dirección completa"
          multiline={true}
          numberOfLines={2}
          editable={!loading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Fecha de Nacimiento</Text>
        <TextInput
          style={styles.input}
          value={formData.fechaNacimiento}
          onChangeText={(text) => updateField('fechaNacimiento', text)}
          placeholder="DD/MM/AAAA"
          editable={!loading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tipo de Membresía</Text>
        <View style={styles.membershipOptions}>
          {['Básica', 'Premium', 'VIP'].map((tipo) => (
            <TouchableOpacity
              key={tipo}
              style={[
                styles.membershipOption,
                formData.tipoMembresia === tipo && styles.selectedMembershipOption
              ]}
              onPress={() => updateField('tipoMembresia', tipo)}
              disabled={loading}
            >
              <Text style={[
                styles.membershipOptionText,
                formData.tipoMembresia === tipo && styles.selectedMembershipOptionText
              ]}>
                {tipo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Solo mostrar el campo Estado cuando se está editando un socio */}
      {socio && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Estado</Text>
          <View style={styles.statusOptions}>
            {['Activo', 'Inactivo'].map((estado) => (
              <TouchableOpacity
                key={estado}
                style={[
                  styles.statusOption,
                  formData.estado === estado && (estado === 'Activo' ? styles.selectedActiveOption : styles.selectedInactiveOption)
                ]}
                onPress={() => updateField('estado', estado)}
                disabled={loading}
              >
                <Text style={[
                  styles.statusOptionText,
                  formData.estado === estado && styles.selectedStatusOptionText
                ]}>
                  {estado}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.cancelButton, loading && styles.disabledButton]}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Guardando...' : (socio ? 'Actualizar' : 'Registrar')}
          </Text>
        </TouchableOpacity>
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
          <View style={styles.genderModalContent}>
            <Text style={styles.genderModalTitle}>Seleccionar Género</Text>
            
            {genderOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.genderModalOption,
                  formData.genero === option && styles.selectedGenderOption
                ]}
                onPress={() => {
                  updateField('genero', option);
                  setShowGenderModal(false);
                }}
              >
                <Text style={[
                  styles.genderModalOptionText,
                  formData.genero === option && styles.selectedGenderOptionText
                ]}>
                  {option}
                </Text>
                {formData.genero === option && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.genderModalCancelButton}
              onPress={() => setShowGenderModal(false)}
            >
              <Text style={styles.genderModalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: screenHeight * 0.85,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#2C3E50',
    minHeight: 48,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
  },
  membershipOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  membershipOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
  },
  selectedMembershipOption: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  membershipOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedMembershipOptionText: {
    color: '#fff',
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
  },
  selectedActiveOption: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  selectedInactiveOption: {
    backgroundColor: '#E74C3C',
    borderColor: '#E74C3C',
  },
  statusOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedStatusOptionText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  // Estilos para el selector de género
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  placeholderText: {
    color: '#999',
  },
  selectIcon: {
    fontSize: 12,
    color: '#666',
  },
  // Estilos para el modal de género
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  genderModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: '50%',
  },
  genderModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  genderModalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
  },
  selectedGenderOption: {
    backgroundColor: '#4A90E2',
  },
  genderModalOptionText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  selectedGenderOptionText: {
    color: '#fff',
  },
  checkIcon: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  genderModalCancelButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    marginTop: 8,
  },
  genderModalCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  // Estilos para la sección de foto
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#E8F4FD',
  },
  avatarPlaceholder: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  photoButton: {
    backgroundColor: '#19d44c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#ffffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});