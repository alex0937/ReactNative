import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function SocioForm({ 
  socio = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    tipoMembresia: 'Básica',
    estado: 'Activo'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (socio) {
      setFormData({
        nombre: socio.nombre || '',
        email: socio.email || '',
        telefono: socio.telefono || '',
        direccion: socio.direccion || '',
        fechaNacimiento: socio.fechaNacimiento || '',
        tipoMembresia: socio.tipoMembresia || 'Básica',
        estado: socio.estado || 'Activo'
      });
    }
  }, [socio]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (formData.telefono && !/^\d{10}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
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
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nombre completo *</Text>
        <TextInput
          style={[styles.input, errors.nombre && styles.inputError]}
          value={formData.nombre}
          onChangeText={(text) => updateField('nombre', text)}
          placeholder="Ingresa el nombre completo"
          editable={!loading}
        />
        {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
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
        <Text style={styles.inputLabel}>Teléfono</Text>
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
});