import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';  
import { auth } from '../src/config/firebaseConfig';  
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import ForgotPassword from '../screens/ForgotPassword';

const Stack = createStackNavigator();

function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setIsAuthenticated(true); 
      } else {
        setIsAuthenticated(false); 
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffffff' }, //Cambia el color del header
          headerTintColor: '#30e33ff', // Cambia el color del texto del header
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}  />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}  />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }}  />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;