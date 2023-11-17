import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import Menulist from './Screens/MenuList'; 
import Recipe from './Screens/Recipe'
import GroceryList from './Screens/GroceryList'
import { MaterialIcons } from '@expo/vector-icons';

//Näillä saa keltaiset varoituskset pois puhelimen ruudulta
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(); 

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

//Tällä hetkellä menee Recipe sivulle 
const LogOutIcon = ({ navigation }) => (
  <View>
    <MaterialIcons
      name="logout"
      size={24}
      color="black"
      style={{ marginLeft: 10 }}
      onPress={() => {
        navigation.navigate('Recipe');
        console.log("nappia painettu");
      }}
    />
    <Text style={{ color: 'black' }}>Logout</Text>
  </View>
);

const stackScreenOptions = ({ navigation }) => ({
  headerTitle: 'Keijo',
  headerLeft: () => null,
  headerRight: () => <LogOutIcon navigation={navigation} />,
});

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Menu' component={Menulist} />
      <Tab.Screen name='Recipe' component={Recipe} />
    </Tab.Navigator>
  )
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