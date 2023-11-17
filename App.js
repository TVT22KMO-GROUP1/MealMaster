import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import Menulist from './Screens/MenuList'; 
import Recipe from './Screens/Recipe';
import GroceryList from './Screens/GroceryList';
import { auth } from './firebase';
import LogOut from './Components/LogOut';
import TabNavigatorIcons from './Components/TabNavigatorIcons';


//Näillä saa keltaiset varoituskset pois puhelimen ruudulta
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(); 

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

//Asetetaan käyttäjän sähköposti ja LogoOut näkyville
const stackScreenOptions = () => {
  const userEmail = auth.currentUser?.email || 'Guest';
  return {
  headerTitle: auth.currentUser?.email,
  headerLeft: () => null,
  headerRight: () => <LogOut />
  }
};

const tabScreenOptions = {
  tabBarIcon: ({ route, focused, color, size }) => {
    return (
      <TabNavigatorIcons
        route={route}
        focused={focused}
        color={color}
        size={24}
      />
    );
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={tabScreenOptions} 
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Menu' component={Menulist} />
      <Tab.Screen name='Recipe' component={Recipe} />
      <Tab.Screen name='GroceryList' component={GroceryList} />
    </Tab.Navigator>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
      <Stack.Screen name='Home' component={TabNavigator} />
      <Stack.Screen name='Menu' component={Menulist} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
        <StackNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});