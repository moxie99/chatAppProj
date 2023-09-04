import React, { useEffect, useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNav from './nav/BottomTabNav';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    // Provide correct font family names instead of file paths
    PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
    PoppinsExtraBold: require('./assets/fonts/Poppins-ExtraBold.ttf'),
    PoppinsLight: require('./assets/fonts/Poppins-Light.ttf'),
    PoppinsMedium: require('./assets/fonts/Poppins-Medium.ttf'),
    PoppinsRegular: require('./assets/fonts/Poppins-Regular.ttf'),
    PoppinsSemiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
  });

  const [isReady, setIsReady] = useState(false); // Added state to track readiness

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');

        if (token) {
          // Handle navigation when token is available (you need to pass navigation prop to App)
        } else {
          setIsReady(true); // Mark the app as ready when fonts are loaded and token check is done
        }
      } catch (error) {
        console.log('error', error);
        setIsReady(true); // Mark the app as ready even in case of an error
      }
    };

    checkLoginStatus();
  }, []); // Provide dependencies or remove if not needed

  // If fonts are not loaded or token check is not completed, show a loading indicator
  if (!fontsLoaded || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        {/* Add your loading indicator here */}
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='BottomNavigation'
          component={BottomTabNav}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='Login'
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='Register'
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
