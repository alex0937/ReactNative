import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from '../screens/Home';
import PerfilScreen from '../screens/PerfilScreen'; // dummy
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
      
    </Tab.Navigator>
  );
}