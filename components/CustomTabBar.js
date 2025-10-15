import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme';

const ICONS = {
  Inicio: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
  Perfil: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
};

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const color = isFocused ? COLORS.primary : '#888';
        const onPress = () => navigation.navigate(route.name);

        return (
          <TouchableOpacity key={route.key} style={styles.tab} onPress={onPress}>
            {ICONS[route.name]({ color })}
            <Text style={[styles.label, { color }]}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: { 
    flexDirection: 'row', 
    height: 58, 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderColor: '#ededed',
    position: 'relative',
    bottom: 0,
  },
  tab: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: { 
    fontSize: 11, 
    marginTop: 2,
    fontWeight: '500',
  },
});