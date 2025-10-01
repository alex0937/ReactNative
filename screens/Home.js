import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { Alert } from 'react-native';
import { auth } from '../src/config/firebaseConfig';
import CustomAlertModal from '../components/CostomAlertModal';

export default function Home({ navigation }) {
  const [userName, setUserName] = useState ('');
  
  // Estados para alerta personalizada
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

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };

 const handleLogOut = async () => {
    try {
      await signOut(auth);
      showCustomAlert("Sesión cerrada correctamente.", "", "success");
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      showCustomAlert("No se pudo cerrar la sesión. Intenta de nuevo.", "", "error");
      console.log("No se pudo cerrar la sesión:", error);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f2f2ff" />

      {/* Barra superior de bienvenida */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {userName ? `Bienvenido ${userName}` : 'Bienvenido'}
        </Text>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={22} color="#222" style={{marginRight: 10}} />
          <Image source={require('../assets/logo-gym.png.png')} style={styles.avatar} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Accesos rápidos */}
        <View style={styles.quickAccessRow}>
          <TouchableOpacity style={styles.quickCard}>
            <FontAwesome5 name="user-plus" size={32} color="#19d44c" />
            <Text style={styles.quickTitle}>Socios</Text>
            <Text style={styles.quickDesc}>Gestión de socios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard}>
            <MaterialIcons name="event-available" size={32} color="#19d44c" />
            <Text style={styles.quickTitle}>Agregar un Turno</Text>
            <Text style={styles.quickDesc}>Asignación de clases</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.quickAccessRow}>
          <TouchableOpacity style={styles.quickCard}>
            <MaterialCommunityIcons name="emoticon-happy-outline" size={32} color="#19d44c" />
            <Text style={styles.quickTitle}>Nuestra Filosofía</Text>
            <Text style={styles.quickDesc}>Misión y visión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard}>
            <MaterialCommunityIcons name="dumbbell" size={32} color="#19d44c" />
            <Text style={styles.quickTitle}>Gestionar Accesorios</Text>
            <Text style={styles.quickDesc}>Inventario de equipos.</Text>
          </TouchableOpacity>
        </View>
        {/* Estadística */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Estadística</Text>
            <TouchableOpacity style={styles.statsFilter}>
              <Text style={styles.statsFilterText}>Últimos 3 meses</Text>
              <Ionicons name="chevron-down" size={16} color="#888" />
            </TouchableOpacity>
          </View>
          <View style={styles.statsLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: '#19d44c'}]} />
              <Text style={styles.legendText}>Membresías</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: '#8be19c'}]} />
              <Text style={styles.legendText}>Socios</Text>
            </View>
          </View>
          {/* Gráfico de barras simulado */}
          <View style={styles.barChart}>
            <View style={[styles.bar, {height: 40, backgroundColor: '#19d44c'}]} />
            <View style={[styles.bar, {height: 20, backgroundColor: '#8be19c'}]} />
            <View style={[styles.bar, {height: 25, backgroundColor: '#19d44c'}]} />
            <View style={[styles.bar, {height: 12, backgroundColor: '#8be19c'}]} />
            <View style={[styles.bar, {height: 60, backgroundColor: '#19d44c'}]} />
            <View style={[styles.bar, {height: 35, backgroundColor: '#8be19c'}]} />
          </View>
          <View style={styles.barLabels}>
            <Text style={styles.barLabel}>Jun</Text>
            <Text style={styles.barLabel}>Jul</Text>
            <Text style={styles.barLabel}>Ago</Text>
          </View>
        </View>
        {/* Botón cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
          <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
        </TouchableOpacity>
      </ScrollView>
      <CustomAlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={closeCustomAlert}
        type={alertType}
      />
    </View>
  );
}

const CARD_BG = '#fff';
const BG = '#f4f2f2ff';
const GREEN = '#19d44c';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 10,
    backgroundColor: CARD_BG,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 2,
    borderWidth: 1,
    borderColor: '#19d44c',
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingVertical: 18,
    alignItems: 'center',
    paddingBottom: 40,
  },
  quickAccessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 340,
    marginBottom: 14,
  },
  quickCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#ededed',
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 10,
    textAlign: 'center',
  },
  quickDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
    textAlign: 'center',
  },
  statsCard: {
    width: 340,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 18,
    marginTop: 10,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#ededed',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  statsFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f2f2ff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statsFilterText: {
    color: '#888',
    fontSize: 13,
    marginRight: 2,
  },
  statsLegend: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 13,
    color: '#888',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 70,
    marginBottom: 6,
    marginTop: 1,
    justifyContent: 'center'
  },
  bar: {
    width: 19,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    alignSelf: 'center',
    marginTop: 2,
  },
  barLabel: {
    fontSize: 13,
    color: '#888',
    width: 40,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: GREEN,
    borderRadius: 8,
    width: 270,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: '#080808ff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});