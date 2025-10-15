import React from 'react';
import {createDrawerNavigator,DrawerContentScrollView,DrawerItemList 
} from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TabNavigator from './TabNavegator';
import PerfilScreen from '../screens/PerfilScreen';
import AccesoriosScreen from '../screens/AccesoriosScreen';
import SociosScreen from '../screens/SociosScreen';
import { View, Text, ImageBackground, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import CustomAlertModal from '../components/CostomAlertModal';
import { auth } from '../src/config/firebaseConfig';
import { signOut } from 'firebase/auth';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    
  const user = auth.currentUser;

  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [infoModal, setInfoModal] = React.useState({ visible: false, title: '', message: '' });

  const handleSignOut = () => {
    // abrir modal de confirmación
    setConfirmVisible(true);
  };
  
  const confirmSignOut = async () => {
    setConfirmVisible(false);
    try {
      await signOut(auth);
      setInfoModal({ visible: true, title: 'Sesión cerrada', message: 'Has cerrado sesión correctamente ✅' });
      // redirigir al Login (mantengo comportamiento previo)
      props.navigation.replace('Login');
    } catch (e) {
      console.warn('Error al cerrar sesión', e);
      setInfoModal({ visible: true, title: 'Error', message: 'No se pudo cerrar sesión. Intenta nuevamente.' });
    }
  };

  const closeInfoModal = () => setInfoModal({ ...infoModal, visible: false });

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      <ImageBackground
        source={require('../assets/fondo-gym.png')}
        style={styles.headerBackground}
        imageStyle={{ opacity: 0.85 }}
      >
        <View style={styles.headerContent}>
          {user && user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={36} color="#fff" />
            </View>
          )}
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>{user?.displayName || 'Bienvenido'}</Text>
            <Text style={styles.email}>{user?.email || ''}</Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.listContainer}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="exit-outline" size={20} color="#fff" />
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmación con modal personalizado */}
      <Modal transparent visible={confirmVisible} animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Cerrar sesión</Text>
            <Text style={styles.confirmMessage}>¿Estás seguro de que deseas cerrar sesión?</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setConfirmVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn} onPress={confirmSignOut}>
                <Text style={styles.acceptText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Mensajes de info/éxito/error usando CustomAlertModal */}
      <CustomAlertModal visible={infoModal.visible} title={infoModal.title} message={infoModal.message} onClose={closeInfoModal} />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#25d451ff',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#0e0b0bff',
        drawerLabelStyle: { marginLeft: -10, fontSize: 15 },
      }}
    >
      <Drawer.Screen
        name="Inicio"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Socios"
        component={SociosScreen}
        options={{
          headerShown: false, // Mantenemos el header personalizado de la pantalla
          drawerIcon: ({ color }) => (
            <Ionicons name="people-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Accesorios"
        component={AccesoriosScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="dumbbell" size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  email: {
    color: '#e6f7ea',
    fontSize: 12,
    marginTop: 2,
  },
  listContainer: {
    flex: 1,
    paddingTop: 8,
  },
  footer: {
    padding: 16,
    borderTopColor: '#f0f0f0',
    borderTopWidth: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6042aff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  confirmMessage: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 14,
  },
  confirmButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  cancelText: { color: '#333', fontWeight: '600' },
  acceptBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#e6042aff',
  },
  acceptText: { color: '#fff', fontWeight: '700' },
  

});
