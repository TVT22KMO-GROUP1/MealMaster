import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import LoginScreen from './Screens/LoginScreen';
import MenuList from './Screens/MenuList';
import HomeScreen from './Screens/HomeScreen';
import Favorites from './Screens/Favorites';
import Recipe from './Screens/Recipe';
import GroceryList from './Screens/GroceryList';
import { auth } from './firebase';
import LogOut from './Components/LogOut';
import TabNavigatorIcons from './Components/TabNavigatorIcons';

// Näillä saa keltaiset varoituskset pois puhelimen ruudulta
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const stackScreenOptions = () => {
  const userEmail = auth.currentUser?.email || 'Guest';

  return {
    headerTitle: userEmail,
    headerLeft: () => null,
    headerRight: () => <LogOut />,
  };
};

const tabScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => (
    <TabNavigatorIcons route={route} focused={focused} color={color} size={24} />
  ),
});

function TabNavigatorComponent({ selectedRecipes }) {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={tabScreenOptions}>
      <Tab.Screen name="Home">
        {() => <HomeScreen selectedRecipes={selectedRecipes} />}
      </Tab.Screen>
      <Tab.Screen name="Menu" component={MenuList} />
      <Tab.Screen name="Recipe" component={Recipe} />
      <Tab.Screen name="GroceryList" component={GroceryList} />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        initialParams={{ selectedRecipes }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={stackScreenOptions}>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen name="Home">
          {() => <TabNavigatorComponent selectedRecipes={selectedRecipes} />}
        </Stack.Screen>
        <Stack.Screen name="Menu" component={MenuList} />
        <Stack.Screen name="Favorites">
          {() => <Favorites selectedRecipes={selectedRecipes} />}
        </Stack.Screen>
      </Stack.Navigator>
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