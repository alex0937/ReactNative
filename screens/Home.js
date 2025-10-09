import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { useAuth } from '../src/hooks/useAuth';
import CustomAlertModal from '../components/CostomAlertModal';
import { COLORS, SPACING } from '../src/theme';

export default function Home({ navigation }) {
  const { user, loading } = useAuth();

  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertType, setAlertType] = React.useState('info');

  const showCustomAlert = (title, message, type = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const closeCustomAlert = () => setAlertVisible(false);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      showCustomAlert('Sesión cerrada correctamente.', '', 'success');
      setTimeout(
        () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
        600
      );
    } catch (error) {
      showCustomAlert('No se pudo cerrar la sesión. Intenta de nuevo.', '', 'error');
      console.log(error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const userName = user?.displayName ?? user?.email?.split('@')[0] ?? '';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Header con Bienvenido + logo centrado + Cerrar a la derecha */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{userName ? `Bienvenido ${userName}` : 'Bienvenido'}</Text>

        {/* Logo centrado */}
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={require('../assets/logo-gym.png')} style={styles.avatarCenter} />
        </TouchableOpacity>

        {/* Cerrar sesión pegado a la derecha */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogOut}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
          <Text style={styles.logoutTxt}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Quick access */}
        <View style={styles.quickAccessRow}>
          <TouchableOpacity activeOpacity={0.85} style={styles.quickCard}>
            <FontAwesome5 name="user-plus" size={32} color={COLORS.primary} />
            <Text style={styles.quickTitle}>Socios</Text>
            <Text style={styles.quickDesc}>Gestión de socios</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} style={styles.quickCard}>
            <MaterialIcons name="event-available" size={32} color={COLORS.primary} />
            <Text style={styles.quickTitle}>Agregar un Turno</Text>
            <Text style={styles.quickDesc}>Asignación de clases</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickAccessRow}>
          <TouchableOpacity activeOpacity={0.85} style={styles.quickCard}>
            <MaterialCommunityIcons name="emoticon-happy-outline" size={32} color={COLORS.primary} />
            <Text style={styles.quickTitle}>Nuestra Filosofía</Text>
            <Text style={styles.quickDesc}>Misión y visión</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} style={styles.quickCard}>
            <MaterialCommunityIcons name="dumbbell" size={32} color={COLORS.primary} />
            <Text style={styles.quickTitle}>Gestionar Accesorios</Text>
            <Text style={styles.quickDesc}>Inventario de equipos</Text>
          </TouchableOpacity>
        </View>

        {/* Gráfico */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Estadística</Text>
            <TouchableOpacity style={styles.statsFilter}>
              <Text style={styles.statsFilterText}>Últimos 3 meses</Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText}>Membresías</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#8be19c' }]} />
              <Text style={styles.legendText}>Socios</Text>
            </View>
          </View>

          <View style={styles.barChart}>
            <View style={[styles.bar, { height: 50, backgroundColor: COLORS.primary }]} />
            <View style={[styles.bar, { height: 28, backgroundColor: '#8be19c' }]} />
            <View style={[styles.bar, { height: 35, backgroundColor: COLORS.primary }]} />
            <View style={[styles.bar, { height: 18, backgroundColor: '#8be19c' }]} />
            <View style={[styles.bar, { height: 65, backgroundColor: COLORS.primary }]} />
            <View style={[styles.bar, { height: 40, backgroundColor: '#8be19c' }]} />
          </View>

          <View style={styles.barLabels}>
            <Text style={styles.barLabel}>Jun</Text>
            <Text style={styles.barLabel}>Jul</Text>
            <Text style={styles.barLabel}>Aug</Text>
          </View>
        </View>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.horizontal,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1, // empuja el resto a la derecha
  },
  avatarCenter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  logoutTxt: {
    fontSize: 12,
    marginLeft: 4,
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  scrollContent: {
    paddingVertical: SPACING.vertical,
    paddingBottom: 40,
  },
  quickAccessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 340,
    marginBottom: 14,
    alignSelf: 'center',
  },
  quickCard: {
    flex: 1,
    backgroundColor: COLORS.card,
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
    borderColor: COLORS.border,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 10,
    textAlign: 'center',
  },
  quickDesc: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
    textAlign: 'center',
  },
  statsCard: {
    width: 340,
    alignSelf: 'center',
    backgroundColor: COLORS.card,
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
    borderColor: COLORS.border,
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
    color: COLORS.text,
  },
  statsFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statsFilterText: {
    color: COLORS.muted,
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
    color: COLORS.muted,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 70,
    marginBottom: 6,
    marginTop: 1,
    justifyContent: 'center',
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
    color: COLORS.muted,
    width: 40,
    textAlign: 'center',
  },
});