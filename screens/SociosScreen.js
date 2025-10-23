import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,FlatList,TextInput,Alert,Modal,ActivityIndicator,Image,Dimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSocios } from '../src/hooks/useSocios';
import SocioForm from '../components/SocioForm';
import { showWelcomeNotification, showSuccessNotification, showErrorNotification } from '../src/utils/notifications';
import CustomAlertModal from '../components/CostomAlertModal';

export default function SociosScreen({ navigation }) {
  const { 
    socios, 
    loading, 
    error, 
    addSocio, 
    editSocio, 
    removeSocio, 
    searchSocios 
  } = useSocios();

  const [filteredSocios, setFilteredSocios] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [socioToDelete, setSocioToDelete] = useState(null);
  const [formDataToUpdate, setFormDataToUpdate] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingSocio, setEditingSocio] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const filtered = searchSocios(searchText, selectedFilter);
    setFilteredSocios(filtered);
  }, [socios, searchText, selectedFilter]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleSubmitSocio = async (formData) => {
    if (editingSocio) {
      // Guardar datos del formulario y mostrar modal de confirmación
      setFormDataToUpdate(formData);
      setShowUpdateModal(true);
    } else {
      // Para registrar nuevo socio (sin confirmación)
      setFormLoading(true);
      const result = await addSocio(formData);
      setFormLoading(false);

      if (result.success) {
        showSuccess(`¡Bienvenido ${formData.nombre}!`);
        setShowRegisterModal(false);
        setEditingSocio(null);
      } else {
        showError(result.error || 'Ocurrió un error');
      }
    }
  };

  const handleDeleteSocio = (socio) => {
    setSocioToDelete(socio);
    setShowDeleteModal(true);
  };

  const handleEditSocio = (socio) => {
    setEditingSocio(socio);
    setShowRegisterModal(true);
  };

  const handleCancelForm = () => {
    setShowRegisterModal(false);
    setEditingSocio(null);
  };

  const renderSocioItem = ({ item }) => (
    <View style={styles.socioCard}>
      <View style={styles.socioInfo}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ 
              uri: item.photoURL || `https://ui-avatars.com/api/?name=${item.nombre}&background=4A90E2&color=fff` 
            }}
            style={styles.avatar}
          />
          <View style={[
            styles.statusIndicator,
            item.estado === 'Activo' ? styles.activeStatus : styles.inactiveStatus
          ]} />
        </View>
        <View style={styles.socioDetails}>
          <View style={styles.socioHeader}>
            <Text style={styles.socioName}>{item.nombre}</Text>
            <View style={[
              styles.membershipBadge,
              item.tipoMembresia === 'VIP' ? styles.vipBadge :
              item.tipoMembresia === 'Premium' ? styles.premiumBadge : styles.basicBadge
            ]}>
              <Text style={styles.membershipText}>{item.tipoMembresia}</Text>
            </View>
          </View>
          <View style={styles.contactInfo}>
            <Ionicons name="mail-outline" size={14} color="#666" />
            <Text style={styles.socioEmail}>{item.email}</Text>
          </View>
          <View style={styles.contactInfo}>
            <Ionicons name="call-outline" size={14} color="#666" />
            <Text style={styles.socioPhone}>{item.telefono || 'No disponible'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.socioActions}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => handleEditSocio(item)}
        >
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDeleteSocio(item)}
        >
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const UpdateModal = () => (
    <Modal visible={showUpdateModal} transparent={true} animationType="fade">
      <View style={styles.alertOverlay}>
        <View style={styles.alertContent}>
          <Text style={styles.alertMessage}>¿Estas seguro de actualizar los datos del socio?</Text>
          <View style={styles.alertButtons}>
            <TouchableOpacity style={styles.alertCancelButton} onPress={() => setShowUpdateModal(false)}>
              <Text style={styles.alertCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.alertConfirmButton} onPress={async () => {
              setShowUpdateModal(false);
              setFormLoading(true);
              const result = await editSocio(editingSocio.id, formDataToUpdate);
              setFormLoading(false);
              if (result.success) {
                showSuccess('Socio actualizado correctamente');
                setShowRegisterModal(false);
                setEditingSocio(null);
                setFormDataToUpdate(null);
              } else {
                showError(result.error || 'Ocurrió un error');
              }
            }}>
              <Text style={styles.alertConfirmText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const DeleteModal = () => (
    <Modal visible={showDeleteModal} transparent={true} animationType="fade">
      <View style={styles.alertOverlay}>
        <View style={styles.alertContent}>
          <Text style={styles.alertMessage}>¿Deseas eliminar a {socioToDelete?.nombre}?</Text>
          <View style={styles.alertButtons}>
            <TouchableOpacity style={styles.alertCancelButton} onPress={() => {
              setShowDeleteModal(false);
              setSocioToDelete(null);
            }}>
              <Text style={styles.alertCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.alertConfirmButton} onPress={async () => {
              setShowDeleteModal(false);
              const result = await removeSocio(socioToDelete.id);
              setSocioToDelete(null);
              if (result.success) {
                showSuccess('Socio eliminado correctamente');
              } else {
                showError(result.error || 'Error al eliminar el socio');
              }
            }}>
              <Text style={styles.alertConfirmText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const SuccessModal = () => (
    <Modal visible={showSuccessModal} transparent={true} animationType="fade">
      <View style={styles.alertOverlay}>
        <View style={styles.successContent}>
          <Text style={styles.successMessage}>{successMessage}</Text>
          <TouchableOpacity style={styles.successButton} onPress={() => setShowSuccessModal(false)}>
            <Text style={styles.successButtonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const ErrorModal = () => (
    <Modal visible={showErrorModal} transparent={true} animationType="fade">
      <View style={styles.alertOverlay}>
        <View style={styles.errorContent}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => setShowErrorModal(false)}>
            <Text style={styles.errorButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          onPress={() => setShowFilterModal(false)}
          activeOpacity={1}
        />
        <View style={styles.filterModalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Filtrar por Estado</Text>
          {['Todos', 'Activo', 'Inactivo'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterOption,
                selectedFilter === filter && styles.selectedFilterOption
              ]}
              onPress={() => {
                setSelectedFilter(filter);
                setShowFilterModal(false);
              }}
            >
              <Text style={[
                styles.filterOptionText,
                selectedFilter === filter && styles.selectedFilterOptionText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowFilterModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const RegisterModal = () => (
    <Modal
      visible={showRegisterModal}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          onPress={handleCancelForm}
          activeOpacity={1}
        />
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <SocioForm
            socio={editingSocio}
            onSubmit={handleSubmitSocio}
            onCancel={handleCancelForm}
            loading={formLoading}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation?.openDrawer?.()}
          >
            <Ionicons name="menu-outline" size={24} color="#19d44c" />
          </TouchableOpacity>
          <Text style={styles.title}>Gestión de Socios</Text>
          <View style={styles.placeholder} />
        </View>
        {!loading && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{socios.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.activeNumber]}>
                {socios.filter(s => s.estado === 'Activo').length}
              </Text>
              <Text style={styles.statLabel}>Activos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.inactiveNumber]}>
                {socios.filter(s => s.estado === 'Inactivo').length}
              </Text>
              <Text style={styles.statLabel}>Inactivos</Text>
            </View>
          </View>
        )}
      </View>

      {/* Registro de Nuevo Socio */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => setShowRegisterModal(true)}
      >
        <Ionicons name="add-circle-outline" size={20} color="#19d44c" />
        <Text style={styles.registerButtonText}>Registrar Nuevo Socio</Text>
        <Ionicons name="chevron-down-outline" size={20} color="#19d44c" />
      </TouchableOpacity>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar por nombre o email..."
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filtrar por Estado</Text>
          <View style={styles.filterButtons}>
            {['Todos', 'Activo', 'Inactivo'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.selectedFilter
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.selectedFilterText
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Lista de Socios */}
      <View style={styles.sociosContainer}>
        <Text style={styles.sectionTitle}>Socios</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredSocios}
            keyExtractor={(item) => item.id}
            renderItem={renderSocioItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No se encontraron socios</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Modales */}
      <RegisterModal />
      <FilterModal />
      <UpdateModal />
      <DeleteModal />
      <SuccessModal />
      <ErrorModal />
    </SafeAreaView>
  );
}

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19d44c',
    flex: 1,
    textAlign: 'center'
    ,
  },
  placeholder: {
    width: 40, // Para mantener el título centrado
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  activeNumber: {
    color: '#27AE60',
  },
  inactiveNumber: {
    color: '#E74C3C',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#19d44c',
    fontWeight: '500',
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#2C3E50',
  },
  filterContainer: {
    marginTop: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  selectedFilter: {
    backgroundColor: '#19d44c',
    borderColor: '#19d44c',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedFilterText: {
    color: '#fff',
  },
  sociosContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  socioCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socioInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff',
  },
  activeStatus: {
    backgroundColor: '#27AE60',
  },
  inactiveStatus: {
    backgroundColor: '#E74C3C',
  },
  socioDetails: {
    flex: 1,
  },
  socioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  socioName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  membershipBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  basicBadge: {
    backgroundColor: '#95A5A6',
  },
  premiumBadge: {
    backgroundColor: '#F39C12',
  },
  vipBadge: {
    backgroundColor: '#9B59B6',
  },
  membershipText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  socioEmail: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  socioPhone: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  socioActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  editText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#19d44c',
    fontWeight: '500',
  },
  deleteText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  loader: {
    marginTop: 50,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '70%',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  filterModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
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
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelModalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
  },
  cancelModalButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  filterOption: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
    alignItems: 'center',
  },
  selectedFilterOption: {
    backgroundColor: '#4A90E2',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  selectedFilterOptionText: {
    color: '#fff',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  // Estilos para modales de alerta
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: 280,
  },
  alertMessage: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  alertButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  alertCancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  alertCancelText: {
    fontSize: 16,
    color: '#666',
  },
  alertConfirmButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#19d44c',
    alignItems: 'center',
  },
  alertConfirmText: {
    fontSize: 16,
    color: '#fff',
  },
  // Estilos para modales de éxito y error
  successContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: 280,
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#121413ff',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  successButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#27AE60',
  },
  successButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  errorContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: 280,
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#E74C3C',
  },
  errorButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});