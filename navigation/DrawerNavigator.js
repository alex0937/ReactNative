import React from 'react';
import {createDrawerNavigator,DrawerContentScrollView,DrawerItemList 
} from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TabNavigator from './TabNavegator';
import PerfilScreen from '../screens/PerfilScreen';
import AccesoriosScreen from '../screens/AccesoriosScreen';
import SociosScreen from '../screens/SociosScreen';
import TurnosScreen from '../screens/TurnosScreen';
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';
import { auth } from '../src/config/firebaseConfig';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    
  const user = auth.currentUser;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
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
    </DrawerContentScrollView>
    </SafeAreaView>
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
          swipeEnabled: false,
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
          headerShown: false,
          drawerLabel: 'Accesorios',
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="dumbbell" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Turnos"
        component={TurnosScreen}
        options={{
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={20} color={color} />
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
  

});
