import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { auth } from './firebase';
import LoginScreen from './Screens/LoginScreen';
import MenuList from './Screens/MenuList';
import HomeScreen from './Screens/HomeScreen';
import Favorites from './Screens/Favorites';
import Registration from './Screens/Registration';
import Recipe from './Screens/Recipe';
import GroceryList from './Screens/GroceryList';
import PlanMeal from './Screens/PlanMeal';
import LogOut from './Components/LogOut';
import TabNavigatorIcons from './Components/TabNavigatorIcons';
import { GroceryListProvider } from './Components/GroceryListContext';
LogBox.ignoreAllLogs();

// Tällä saa keltaiset varoituskset pois puhelimen ruudulta
import { LogBox } from 'react-native';

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

function AuthenticatedNavigator({ selectedRecipes }) {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Koti">
        {() => <AuthenticatedStackNavigator selectedRecipes={selectedRecipes} />}
      </Tab.Screen>
      <Tab.Screen name="Ostoslista" component={GroceryList} />
      <Tab.Screen name="Suosikit" component={Favorites} />
      <Tab.Screen name="Ateria- Suunnitelma" component={PlanMeal} />
    </Tab.Navigator>
  );
}

function AuthenticatedStackNavigator({ selectedRecipes }) {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Menu" component={MenuList} />
      <Stack.Screen name="Recipe" component={Recipe} />
      <Stack.Screen name="Favorites" component={Favorites} />
    </Stack.Navigator>
  );
}


function UnauthenticatedStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={stackScreenOptions}>
      <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Registration" component={Registration} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  return (
    <GroceryListProvider value={{ selectedRecipes, setSelectedRecipes }}>
      <NavigationContainer>
        {userLoggedIn ? (
          <AuthenticatedNavigator selectedRecipes={selectedRecipes} />
        ) : (
          <UnauthenticatedStackNavigator />
        )}
      </NavigationContainer>
    </GroceryListProvider>
  );
}
