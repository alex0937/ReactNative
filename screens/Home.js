import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Image,StatusBar,ScrollView,ActivityIndicator,FlatList,Dimensions,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {FontAwesome5,MaterialIcons,MaterialCommunityIcons,Ionicons,} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../src/hooks/useAuth';
import { useSocios } from '../src/hooks/useSocios';
import CustomAlertModal from '../components/CostomAlertModal';
import { COLORS, SPACING } from '../src/theme';

export default function Home({ navigation }) {
  const { user, loading } = useAuth();
  const { socios, getSociosStats } = useSocios();

  // Memoizar las estadísticas para evitar recálculos innecesarios
  const sociosStats = React.useMemo(() => getSociosStats(), [getSociosStats]);

  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertType, setAlertType] = React.useState('info');
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const showCustomAlert = (title, message, type = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const closeCustomAlert = () => setAlertVisible(false);

  // Función para manejar el cambio de slide en el carousel
  const handleScrollEnd = (event) => {
    const slideSize = Dimensions.get('window').width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentSlide(index);
  };

  // Componente para los indicadores del carousel
  const CarouselIndicators = () => (
    <View style={styles.indicatorsContainer}>
      {carouselData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            currentSlide === index ? styles.activeIndicator : styles.inactiveIndicator
          ]}
        />
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const userName = user?.displayName ?? user?.email?.split('@')[0] ?? '';

  const carouselData = [
    {
      title: '💪 Bienvenidos a ADN-FIT',
      content: 'Transforma tu cuerpo y mente en el mejor gimnasio de la ciudad.',
      colors: ['#66ea71ff', '#66517aec'],
      icon: 'fitness-outline'
    },
    {
      title: '🎯 Nuestra Misión',
      content: 'Fomentar el bienestar físico y mental de nuestros socios con equipamiento de última generación.',
      colors: ['#1fa541ff', '#181c27ff'],
      icon: 'heart-outline',
    },
    {
      title: '🚀 Nuestra Visión',
      content: 'Ser el gimnasio líder en innovación y experiencia personalizada para cada socio.',
      colors: ['#acc4d8ff', '#0a7176ff'],
      icon: 'trophy-outline'
    },
    {
      title: '🏆 Únete Hoy',
      content: 'Comienza tu transformación con nuestros planes personalizados y entrenadores certificados.',
      colors: ['#43e97b', '#38f9d7'],
      icon: 'star-outline'
    },
  ];

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselContainer}>
      <LinearGradient
        colors={item.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.carouselSlide}
      >
        <View style={styles.carouselContent}>
          <Ionicons name={item.icon} size={48} color="white" style={styles.carouselIcon} />
          <Text style={styles.carouselTitle}>{item.title}</Text>
          <Text style={styles.carouselText}>{item.content}</Text>
        </View>
      </LinearGradient>
    </View>
  );

return (
  <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
 <View style={styles.header}>
        
        
        <Text style={styles.headerText}>
          {userName ? `Bienvenido ${userName}` : 'Bienvenido'}
        </Text>

        <TouchableOpacity activeOpacity={0.8}>
          <Image source={require('../assets/logo-gym.png')} style={styles.avatarCenter} />
        </TouchableOpacity>
      </View>
    {/* --------------  TODO DENTRO DEL SCROLL -------------- */}
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
     

      {/* Carrusel */}
      <View style={styles.carouselWrapper}>
        <FlatList
          data={carouselData}
          renderItem={renderCarouselItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          decelerationRate="fast"
          snapToAlignment="center"
          snapToInterval={Dimensions.get('window').width}
        />
        <CarouselIndicators />
      </View>

      {/* Quick Access */}
      <View style={styles.quickAccessRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.quickCard}
          onPress={() => navigation.navigate('Socios')}
        >
          <FontAwesome5 name="user-plus" size={32} color={COLORS.primary} />
          <Text style={styles.quickTitle}>Socios</Text>
          <Text style={styles.quickDesc}>Gestión de socios</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.85} 
          style={styles.quickCard}
          onPress={() => navigation.navigate('Turnos')}
          >
          <MaterialIcons name="event-available" size={32} color={COLORS.primary} />
          <Text style={styles.quickTitle}>Gestionar Turnos</Text>
          <Text style={styles.quickDesc}>Turnos y horarios</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickAccessRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.quickCard}
          onPress={() => navigation.navigate('Accesorios')}
        >
          <MaterialCommunityIcons name="dumbbell" size={32} color={COLORS.primary} />
          <Text style={styles.quickTitle}>Gestionar Accesorios</Text>
          <Text style={styles.quickDesc}>Inventario de equipos</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Resumen de Socios</Text>
          <TouchableOpacity
            style={styles.statsFilter}
            onPress={() => navigation.navigate('Socios')}
          >
            <Text style={styles.statsFilterText}>Ver detalles</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.sociosStatsContainer}>
          <View style={styles.socioStatItem}>
            <Text style={styles.socioStatNumber}>{sociosStats.total}</Text>
            <Text style={styles.socioStatLabel}>Total</Text>
            <Ionicons name="people-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.socioStatItem}>
            <Text style={[styles.socioStatNumber, { color: '#27AE60' }]}>
              {sociosStats.activos}
            </Text>
            <Text style={styles.socioStatLabel}>Activos</Text>
            <Ionicons name="checkmark-circle-outline" size={24} color="#27AE60" />
          </View>
          <View style={styles.socioStatItem}>
            <Text style={[styles.socioStatNumber, { color: '#E74C3C' }]}>
              {sociosStats.inactivos}
            </Text>
            <Text style={styles.socioStatLabel}>Inactivos</Text>
            <Ionicons name="close-circle-outline" size={24} color="#E74C3C" />
          </View>
        </View>

        <View style={styles.membershipBreakdown}>
          <Text style={styles.membershipTitle}>Por Tipo de Membresía</Text>
          <View style={styles.membershipStats}>
            <View style={styles.membershipItem}>
              <View style={[styles.membershipDot, { backgroundColor: '#95A5A6' }]} />
              <Text style={styles.membershipLabel}>
                Básica: {socios.filter((s) => s.tipoMembresia === 'Básica').length}
              </Text>
            </View>
            <View style={styles.membershipItem}>
              <View style={[styles.membershipDot, { backgroundColor: '#F39C12' }]} />
              <Text style={styles.membershipLabel}>
                Premium: {socios.filter((s) => s.tipoMembresia === 'Premium').length}
              </Text>
            </View>
            <View style={styles.membershipItem}>
              <View style={[styles.membershipDot, { backgroundColor: '#9B59B6' }]} />
              <Text style={styles.membershipLabel}>
                VIP: {socios.filter((s) => s.tipoMembresia === 'VIP').length}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>

    {/* Modal de alerta (siempre por encima) */}
    <CustomAlertModal
      visible={alertVisible}
      title={alertTitle}
      message={alertMessage}
      onClose={closeCustomAlert}
      type={alertType}
    />
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.horizontal,
    paddingVertical: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginLeft: 8,
  },

  avatarCenter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
  },

  scrollContent: {
    paddingVertical: SPACING.vertical,
    paddingBottom: 60, // +20 para evitar solapamiento con elementos inferiores
  },

  quickAccessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20, // +6 para mayor separación entre filas
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
    shadowOpacity: 0.08, // +0.02 para mayor profundidad
    shadowRadius: 8,     // +2 para suavizar el borde
    elevation: 2,        // +1 para mejorar en Android
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
    width: '90%',
    alignSelf: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 18,
    marginTop: 20,       // +10 para separar de los botones
    marginBottom: 30,    // +12 para evitar que quede pegado al final
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12, // +4 para separar del gráfico
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
    paddingVertical: 4,
  },

  statsFilterText: {
    color: COLORS.muted,
    fontSize: 13,
    marginRight: 2,
  },

  statsLegend: {
    flexDirection: 'row',
    marginBottom: 12,
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
    height: 80, // +10 para mejorar proporción visual
    marginBottom: 10,
    marginTop: 4,
    justifyContent: 'center',
  },

  bar: {
    width: 20,
    marginHorizontal: 5,
    borderRadius: 4,
  },

  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    alignSelf: 'center',
    marginTop: 4,
  },

  barLabel: {
    fontSize: 13,
    color: COLORS.muted,
    width: 40,
    textAlign: 'center',
  },

  carouselWrapper: {
    marginBottom: 20,
  },

  carouselContainer: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  activeIndicator: {
    backgroundColor: '#4A90E2',
    width: 24,
  },

  inactiveIndicator: {
    backgroundColor: '#BDC3C7',
  },

  carouselSlide: {
    borderRadius: 20,
    marginHorizontal: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  carouselContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },

  carouselIcon: {
    marginBottom: 16,
    opacity: 0.9,
  },

  carouselTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  carouselText: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 8,
    lineHeight: 22,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },

  // Nuevos estilos para estadísticas de socios
  sociosStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },

  socioStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  socioStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },

  socioStatLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 8,
  },

  membershipBreakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  membershipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },

  membershipStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  membershipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  membershipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  membershipLabel: {
    fontSize: 11,
    color: COLORS.muted,
  },
});


